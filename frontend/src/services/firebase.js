
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

const getEnv = (key, fallback = '') => {
  return (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key])
    ? import.meta.env[key]
    : fallback;
};

export const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', 'AIzaSyMockKeyBioTrajectoryDev_2026'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'biotrajectory-prod.firebaseapp.com'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'biotrajectory-prod'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'biotrajectory-prod.appspot.com'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '987654321098'),
  appId: getEnv('VITE_FIREBASE_APP_ID', '1:987654321098:web:7739c81bb6c12345')
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
