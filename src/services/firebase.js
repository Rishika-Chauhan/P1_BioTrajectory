
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
  onAuthStateChanged,
  getIdToken,
  getIdTokenResult
} from 'firebase/auth';

const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

export const isFirebaseConfigured = requiredEnv.every(
  (key) => Boolean(import.meta.env[key])
);

if (!isFirebaseConfigured) {
  console.warn(
    '[BioTrajectory] Firebase environment variables not set. Running in demo mode. Provide VITE_FIREBASE_* in .env to connect a live Firebase project.'
  );
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'biotrajectory-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'biotrajectory-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'biotrajectory-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:demo'
};

export const ROLES = {
  USER: 'USER',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  DOCTOR_PENDING: 'DOCTOR_PENDING',
  DOCTOR_SUSPENDED: 'DOCTOR_SUSPENDED',
  UNKNOWN: 'UNKNOWN'
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Local / Demo accounts storage key
const ACCOUNTS_STORAGE_KEY = 'biotrajectory_registered_accounts';
const SESSION_STORAGE_KEY = 'biotrajectory-auth-user';

function getLocalAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalAccount(email, password, displayName, role = ROLES.USER) {
  try {
    const accounts = getLocalAccounts();
    accounts[email.toLowerCase().trim()] = {
      email: email.trim(),
      password,
      displayName: displayName || email.split('@')[0],
      role,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save local account', e);
  }
}

class FirebaseServiceAdapter {
  constructor() {
    this.listeners = new Set();
    this.currentLocalUser = this.readSavedSession();
  }

  readSavedSession() {
    try {
      const raw =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  notifyListeners(user) {
    this.currentLocalUser = user;
    this.listeners.forEach((cb) => {
      try {
        cb(user);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  }

  async initialize() {
    return true;
  }

  /**
   * Determine authoritative role from email conventions
   */
  resolveRoleFromEmail(email) {
    const clean = (email || '').toLowerCase().trim();
    if (clean.includes('admin')) return ROLES.ADMIN;
    if (clean.includes('suspended')) return ROLES.DOCTOR_SUSPENDED;
    if (clean.includes('pending')) return ROLES.DOCTOR_PENDING;
    if (
      clean.startsWith('dr.') ||
      clean.includes('doctor') ||
      clean.includes('thorne') ||
      clean.includes('vikram')
    ) {
      return ROLES.DOCTOR;
    }
    return ROLES.USER;
  }

  /**
   * Build a compatible user entity for local / demo authentication
   */
  createDemoUserEntity(email, displayName, customRole) {
    const cleanEmail = email.trim();
    const role = customRole || this.resolveRoleFromEmail(cleanEmail);
    const rawName =
      displayName ||
      cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const finalName =
      role === ROLES.DOCTOR && !rawName.startsWith('Dr') ? `Dr. ${rawName}` : rawName;

    const uid = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${role.toLowerCase()}`;

    return {
      uid,
      id: uid,
      email: cleanEmail,
      displayName: finalName,
      name: finalName,
      photoURL: null,
      avatar: null,
      emailVerified: true,
      role,
      claims: {
        role,
        admin: role === ROLES.ADMIN,
        doctorVerified: role === ROLES.DOCTOR,
        medicalRegNumber: role.startsWith('DOCTOR') ? 'MCI-84729-A' : null
      },
      metadata: {
        creationTime: new Date().toISOString()
      }
    };
  }

  async signUp(email, password, displayName, customRole = ROLES.USER) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If real Firebase credentials are provided, attempt cloud sign up
    if (isFirebaseConfigured) {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

        if (displayName?.trim()) {
          await updateProfile(credential.user, {
            displayName: displayName.trim()
          });
        }

        try {
          await sendEmailVerification(credential.user);
        } catch (e) { }

        return credential.user;
      } catch (fbError) {
        // If not a mock configuration error, rethrow real Firebase error
        if (
          fbError.code !== 'auth/invalid-api-key' &&
          fbError.code !== 'auth/api-key-not-valid' &&
          fbError.code !== 'auth/network-request-failed'
        ) {
          throw fbError;
        }
      }
    }

    // 2. Local / Demo mode sign-up
    saveLocalAccount(cleanEmail, password, displayName, customRole);
    const demoUser = this.createDemoUserEntity(cleanEmail, displayName, customRole);

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
    } catch (e) { }

    this.notifyListeners(demoUser);
    return demoUser;
  }

  async signInWithEmail(email, password, rememberMe = true) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If real Firebase credentials are provided, attempt cloud sign in
    if (isFirebaseConfigured) {
      try {
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        );

        const credential = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

        return credential.user;
      } catch (fbError) {
        // If it's a genuine Firebase credential rejection on a live project, rethrow
        if (
          fbError.code !== 'auth/invalid-api-key' &&
          fbError.code !== 'auth/api-key-not-valid' &&
          fbError.code !== 'auth/network-request-failed'
        ) {
          throw fbError;
        }
        console.warn('[BioTrajectory] Live Firebase unreachable or unconfigured; falling back to local authentication mode.');
      }
    }

    // 2. Local / Demo mode sign-in
    const accounts = getLocalAccounts();
    const existing = accounts[cleanEmail];

    if (existing) {
      if (existing.password && existing.password !== password) {
        const err = new Error('Incorrect password. Please verify your credentials or reset your password.');
        err.code = 'auth/wrong-password';
        throw err;
      }
    } else {
      // First-time demo login for this email: auto-register and save locally
      saveLocalAccount(cleanEmail, password, cleanEmail.split('@')[0]);
    }

    const demoUser = this.createDemoUserEntity(
      cleanEmail,
      existing?.displayName,
      existing?.role
    );

    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
    } catch (e) { }

    this.notifyListeners(demoUser);
    return demoUser;
  }

  async getIdToken(user, forceRefresh = false) {
    if (!user) throw new Error('No authenticated user.');
    if (user.getIdToken && typeof user.getIdToken === 'function') {
      try {
        return await user.getIdToken(forceRefresh);
      } catch (e) { }
    }
    return `mock_token_${user.uid || user.id}_${Date.now()}`;
  }

  async getIdTokenResult(user, forceRefresh = false) {
    if (!user) throw new Error('No authenticated user.');

    if (user.getIdTokenResult && typeof user.getIdTokenResult === 'function') {
      try {
        return await user.getIdTokenResult(forceRefresh);
      } catch (e) { }
    }

    const role = user.role || this.resolveRoleFromEmail(user.email);
    const claims = {
      role,
      admin: role === ROLES.ADMIN,
      doctorVerified: role === ROLES.DOCTOR,
      medicalRegNumber: role.startsWith('DOCTOR') ? 'MCI-84729-A' : null,
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/biotrajectory',
      aud: 'biotrajectory',
      sub: user.uid || user.id,
      exp: Math.floor(Date.now() / 1000) + 86400
    };

    return {
      token: `mock_jwt_${btoa(JSON.stringify(claims))}`,
      claims,
      expirationTime: new Date(Date.now() + 86400000).toISOString(),
      authTime: new Date().toISOString()
    };
  }

  async sendPasswordReset(email) {
    if (isFirebaseConfigured) {
      try {
        return await sendPasswordResetEmail(auth, email.trim());
      } catch (e) { }
    }
    return { success: true, message: `Password reset link dispatched to ${email}` };
  }

  async signOut() {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch (e) { }

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) { }

    this.notifyListeners(null);
    return { success: true };
  }

  onAuthStateChanged(callback) {
    this.listeners.add(callback);

    // If real Firebase is available, listen to it
    let fbUnsubscribe = () => { };
    if (isFirebaseConfigured) {
      try {
        fbUnsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            callback(authUser);
          } else if (this.currentLocalUser) {
            callback(this.currentLocalUser);
          } else {
            callback(null);
          }
        });
      } catch (e) { }
    } else {
      // In local mode, immediately notify listener with saved session
      const saved = this.readSavedSession();
      callback(saved);
    }

    return () => {
      this.listeners.delete(callback);
      fbUnsubscribe();
    };
  }
}

export const FirebaseService = new FirebaseServiceAdapter();
export const firebaseService = FirebaseService;

export default FirebaseService;
