
import { initializeApp, getApps } from 'firebase/app';

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

// --------------------------------------------------
// 1. Firebase configuration
// --------------------------------------------------

const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

export const isFirebaseConfigured = requiredEnv.every(
  (key) => Boolean(import.meta.env[key]?.trim())
);

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --------------------------------------------------
// 2. Application roles
// --------------------------------------------------

export const ROLES = {
  USER: 'USER',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  DOCTOR_PENDING: 'DOCTOR_PENDING',
  DOCTOR_SUSPENDED: 'DOCTOR_SUSPENDED',
  UNKNOWN: 'UNKNOWN'
};

// Only these roles are accepted from trusted Firebase
// custom claims. UNKNOWN is never an authenticated role.
const ALLOWED_ROLES = new Set([
  'USER',
  'DOCTOR_PENDING',
  'DOCTOR',
  'DOCTOR_SUSPENDED',
  'ADMIN'
]);

// --------------------------------------------------
// 3. Initialize Firebase
// --------------------------------------------------

let app = null;
export let auth = null;

if (isFirebaseConfigured) {
  app =
    getApps().find(
      (existingApp) =>
        existingApp.options.projectId === firebaseConfig.projectId
    ) || initializeApp(firebaseConfig);

  auth = getAuth(app);
} else {
  console.error(
    '[BioTrajectory] Firebase configuration is missing. ' +
    'Authentication is disabled. Configure VITE_FIREBASE_* ' +
    'variables in your frontend .env file.'
  );
}

// --------------------------------------------------
// 4. Firebase service adapter
// --------------------------------------------------

class FirebaseServiceAdapter {
  constructor() {
    this.listeners = new Set();
  }

  // Check Firebase availability
  requireFirebase() {
    if (!isFirebaseConfigured || !auth) {
      const error = new Error(
        'Firebase is not configured. Please check your frontend environment variables.'
      );

      error.code = 'auth/configuration-not-found';
      throw error;
    }

    return auth;
  }

  // ------------------------------------------------
  // Initialize
  // ------------------------------------------------

  async initialize() {
    this.requireFirebase();
    return true;
  }

  // ------------------------------------------------
  // Register a normal user
  // Roles must never be accepted from the frontend.
  // ------------------------------------------------

  async signUp(email, password, displayName) {
    const firebaseAuth = this.requireFirebase();

    const cleanEmail = email.trim().toLowerCase();

    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      cleanEmail,
      password
    );

    if (displayName?.trim()) {
      await updateProfile(credential.user, {
        displayName: displayName.trim()
      });
    }

    await sendEmailVerification(credential.user);

    return credential.user;
  }

  // ------------------------------------------------
  // Login
  // ------------------------------------------------

  async signInWithEmail(email, password, rememberMe = true) {
    const firebaseAuth = this.requireFirebase();

    await setPersistence(
      firebaseAuth,
      rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email.trim().toLowerCase(),
      password
    );

    return credential.user;
  }

  // ------------------------------------------------
  // Get Firebase ID token
  // ------------------------------------------------

  async getIdToken(user, forceRefresh = false) {
    this.requireFirebase();

    if (!user || typeof user.getIdToken !== 'function') {
      throw new Error(
        'Invalid Firebase user. Please sign in again.'
      );
    }

    return user.getIdToken(forceRefresh);
  }

  // ------------------------------------------------
  // Get Firebase token claims
  // ------------------------------------------------

  async getIdTokenResult(user, forceRefresh = false) {
    this.requireFirebase();

    if (!user || typeof user.getIdTokenResult !== 'function') {
      throw new Error(
        'Invalid Firebase user. Please sign in again.'
      );
    }

    return user.getIdTokenResult(forceRefresh);
  }

  // ------------------------------------------------
  // Get authoritative application role
  // ------------------------------------------------

  async getUserRole(user, forceRefresh = false) {
    const tokenResult = await this.getIdTokenResult(
      user,
      forceRefresh
    );

    const role = tokenResult.claims?.role;

    return ALLOWED_ROLES.has(role) ? role : ROLES.USER;
  }

  // ------------------------------------------------
  // Send email verification
  // ------------------------------------------------

  async sendVerificationEmail(user = null) {
    const firebaseAuth = this.requireFirebase();
    const currentUser = user || firebaseAuth.currentUser;

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

  // ------------------------------------------------
  // Reload current user and refresh verification status
  // ------------------------------------------------

  async reloadCurrentUser() {
    const firebaseAuth = this.requireFirebase();
    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      throw new Error('No authenticated user found.');
    }

    await currentUser.reload();

    const refreshedUser = firebaseAuth.currentUser;

    return {
      user: refreshedUser,
      emailVerified: refreshedUser?.emailVerified ?? false
    };
  }

  // ------------------------------------------------
  // Password reset
  // ------------------------------------------------

  async sendPasswordReset(email) {
    const firebaseAuth = this.requireFirebase();

    return sendPasswordResetEmail(
      firebaseAuth,
      email.trim().toLowerCase()
    );
  }

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  async signOut() {
    const firebaseAuth = this.requireFirebase();

    await signOut(firebaseAuth);

    return {
      success: true
    };
  }

  // ------------------------------------------------
  // Authentication state listener
  // ------------------------------------------------

  onAuthStateChanged(callback) {
    const firebaseAuth = this.requireFirebase();

    this.listeners.add(callback);

    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        callback(user);
      },
      (error) => {
        console.error(
          '[BioTrajectory] Firebase authentication listener error:',
          error
        );
      }
    );

    return () => {
      this.listeners.delete(callback);
      unsubscribe();
    };
  }

  // ------------------------------------------------
  // Current authenticated user
  // ------------------------------------------------

  getCurrentUser() {
    const firebaseAuth = this.requireFirebase();
    return firebaseAuth.currentUser;
  }
}

// --------------------------------------------------
// 5. Export service
// --------------------------------------------------

export const FirebaseService = new FirebaseServiceAdapter();

export const firebaseService = FirebaseService;

export default FirebaseService;
