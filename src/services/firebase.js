
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

class FirebaseServiceAdapter {
  async initialize() {
    return true;
  }

  async signUp(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
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

  async signInWithEmail(email, password, rememberMe = true) {
    await setPersistence(
      auth,
      rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    return credential.user;
  }

  async getIdToken(user, forceRefresh = false) {
    if (!user) throw new Error('No authenticated user.');
    return getIdToken(user, forceRefresh);
  }

  async getIdTokenResult(user, forceRefresh = false) {
    if (!user) throw new Error('No authenticated user.');
    return getIdTokenResult(user, forceRefresh);
  }

  async sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email.trim());
  }

  async signOut() {
    return signOut(auth);
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

export const FirebaseService = new FirebaseServiceAdapter();
export const firebaseService = FirebaseService;

export default FirebaseService;
