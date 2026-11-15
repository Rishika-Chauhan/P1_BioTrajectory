
import { initializeApp, getApps } from 'firebase/app';

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  reload as reloadFirebaseUser
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// ==================================================
// 1. FIREBASE CONFIGURATION
// ==================================================

const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

export const isFirebaseConfigured = requiredEnv.every(
  (key) => {
    const value = import.meta.env[key];

    return Boolean(
      value?.trim() && !value.includes('MockKey')
    );
  }
);

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// ==================================================
// 2. APPLICATION ROLES
// ==================================================

export const ROLES = {
  USER: 'USER',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  DOCTOR_PENDING: 'DOCTOR_PENDING',
  DOCTOR_SUSPENDED: 'DOCTOR_SUSPENDED',
  UNKNOWN: 'UNKNOWN'
};

const ALLOWED_ROLES = new Set([
  ROLES.USER,
  ROLES.DOCTOR,
  ROLES.ADMIN,
  ROLES.DOCTOR_PENDING,
  ROLES.DOCTOR_SUSPENDED
]);

// ==================================================
// 3. FIREBASE INITIALIZATION
// ==================================================

export let app = null;
export let auth = null;
export let db = null;

if (isFirebaseConfigured) {
  try {
    app =
      getApps().find(
        (existingApp) =>
          existingApp.options.projectId ===
          firebaseConfig.projectId
      ) || initializeApp(firebaseConfig);

    auth = getAuth(app);
    db = getFirestore(app);

    console.info(
      '[BioTrajectory] Firebase Authentication and Firestore initialized.'
    );
  } catch (error) {
    console.error(
      '[BioTrajectory] Firebase initialization failed:',
      error
    );

    app = null;
    auth = null;
    db = null;
  }
} else {
  console.error(
    '[BioTrajectory] Firebase configuration is missing. ' +
    'Configure VITE_FIREBASE_* variables in frontend/.env.'
  );
}

// ==================================================
// 4. FIREBASE SERVICE ADAPTER
// ==================================================

class FirebaseServiceAdapter {

  // -----------------------------------------------
  // Require Firebase Authentication
  // -----------------------------------------------

  requireFirebase() {
    if (!auth) {
      throw new Error(
        'Firebase Authentication is not initialized. ' +
        'Check your frontend .env configuration.'
      );
    }

    return auth;
  }

  // -----------------------------------------------
  // Require Firestore
  // -----------------------------------------------

  requireFirestore() {
    if (!db) {
      throw new Error(
        'Firestore is not initialized. ' +
        'Check your Firebase configuration.'
      );
    }

    return db;
  }

  // -----------------------------------------------
  // Initialize Firebase services
  // -----------------------------------------------

  async initialize() {
    this.requireFirebase();
    this.requireFirestore();

    return true;
  }

  // -----------------------------------------------
  // Register a new user
  // -----------------------------------------------

  async signUp(email, password, displayName) {
    const firebaseAuth = this.requireFirebase();

    const cleanEmail = email.trim().toLowerCase();

    try {
      const credential =
        await createUserWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

      if (displayName?.trim()) {
        await updateFirebaseProfile(
          credential.user,
          {
            displayName: displayName.trim()
          }
        );
      }

      try {
        await sendEmailVerification(credential.user);
      } catch (error) {
        console.warn(
          '[BioTrajectory] Verification email notice:',
          error
        );
      }

      return credential.user;

    } catch (error) {
      console.error(
        '[BioTrajectory] Registration failed:',
        error
      );

      throw error;
    }
  }

  // -----------------------------------------------
  // Login
  // -----------------------------------------------

  async signInWithEmail(
    email,
    password,
    rememberMe = true
  ) {
    const firebaseAuth = this.requireFirebase();

    const cleanEmail = email.trim().toLowerCase();

    await setPersistence(
      firebaseAuth,
      rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    try {
      const credential =
        await signInWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

      return credential.user;

    } catch (error) {
      console.error(
        '[BioTrajectory] Login failed:',
        error
      );

      throw error;
    }
  }

  // -----------------------------------------------
  // Get current authenticated user
  // -----------------------------------------------

  getCurrentUser() {
    const firebaseAuth = this.requireFirebase();

    return firebaseAuth.currentUser;
  }

  // -----------------------------------------------
  // Get Firebase ID token
  // -----------------------------------------------

  async getIdToken(
    user,
    forceRefresh = false
  ) {
    if (!user) {
      throw new Error(
        'Invalid authentication session. Please sign in again.'
      );
    }

    return user.getIdToken(forceRefresh);
  }

  // -----------------------------------------------
  // Get Firebase token claims
  // -----------------------------------------------

  async getIdTokenResult(
    user,
    forceRefresh = false
  ) {
    if (!user) {
      throw new Error(
        'Invalid authentication session. Please sign in again.'
      );
    }

    return user.getIdTokenResult(forceRefresh);
  }

  // -----------------------------------------------
  // Get trusted application role
  // -----------------------------------------------

  async getUserRole(
    user,
    forceRefresh = false
  ) {
    if (!user) {
      return ROLES.USER;
    }

    try {
      const tokenResult =
        await this.getIdTokenResult(
          user,
          forceRefresh
        );

      const role = tokenResult?.claims?.role;

      return ALLOWED_ROLES.has(role)
        ? role
        : ROLES.USER;

    } catch (error) {
      console.error(
        '[BioTrajectory] Role retrieval failed:',
        error
      );

      return ROLES.USER;
    }
  }

  // -----------------------------------------------
  // Send verification email
  // -----------------------------------------------

  async sendVerificationEmail(user = null) {
    const currentUser =
      user || this.getCurrentUser();

    if (!currentUser) {
      throw new Error('Please sign in first.');
    }

    if (currentUser.emailVerified) {
      return {
        success: true,
        message: 'Email is already verified.'
      };
    }

    await sendEmailVerification(currentUser);

    return {
      success: true,
      message: 'Verification email sent successfully.'
    };
  }

  // -----------------------------------------------
  // Reload authenticated user
  // -----------------------------------------------

  async reloadCurrentUser() {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error(
        'No authenticated user found.'
      );
    }

    await reloadFirebaseUser(currentUser);

    return {
      user: currentUser,
      emailVerified: currentUser.emailVerified
    };
  }

  // -----------------------------------------------
  // Password reset
  // -----------------------------------------------

  async sendPasswordReset(email) {
    const firebaseAuth = this.requireFirebase();

    const cleanEmail = email.trim().toLowerCase();

    return sendPasswordResetEmail(
      firebaseAuth,
      cleanEmail
    );
  }

  // -----------------------------------------------
  // Logout
  // -----------------------------------------------

  async signOut() {
    const firebaseAuth = this.requireFirebase();

    await firebaseSignOut(firebaseAuth);

    return {
      success: true
    };
  }

  // -----------------------------------------------
  // Authentication state listener
  // -----------------------------------------------

  onAuthStateChanged(callback) {
    const firebaseAuth = this.requireFirebase();

    return firebaseOnAuthStateChanged(
      firebaseAuth,
      callback,
      (error) => {
        console.error(
          '[BioTrajectory] Authentication listener error:',
          error
        );
      }
    );
  }
}

// ==================================================
// 5. EXPORT FIREBASE SERVICES
// ==================================================

export const FirebaseService =
  new FirebaseServiceAdapter();

export const firebaseService = FirebaseService;

export default FirebaseService;
