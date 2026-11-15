
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './firebase';

function requireDb() {
  if (!db) {
    throw new Error(
      'Firestore is not initialized. Check Firebase configuration.'
    );
  }

  return db;
}

export const userProfileService = {
  // Get a user's Firestore profile
  async get(uid) {
    if (!uid) {
      throw new Error('A Firebase UID is required.');
    }

    const snapshot = await getDoc(
      doc(requireDb(), 'users', uid)
    );

    return snapshot.exists()
      ? { uid, ...snapshot.data() }
      : null;
  },

  // Create profile only if it does not already exist
  async createIfMissing(firebaseUser) {
    if (!firebaseUser?.uid) {
      throw new Error('A valid authenticated user is required.');
    }

    const reference = doc(
      requireDb(),
      'users',
      firebaseUser.uid
    );

    const snapshot = await getDoc(reference);

    if (snapshot.exists()) {
      return {
        uid: firebaseUser.uid,
        ...snapshot.data()
      };
    }

    const profile = {
      uid: firebaseUser.uid,
      name:
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      onboardingCompleted: false
    };

    await setDoc(reference, profile);

    return {
      ...profile,
      uid: firebaseUser.uid
    };
  },

  // Update profile without allowing role or identity changes
  async update(uid, updates = {}) {
    if (!uid) {
      throw new Error('A Firebase UID is required.');
    }

    const {
      uid: ignoredUid,
      id,
      role,
      claims,
      email,
      createdAt,
      ...safeUpdates
    } = updates;

    const reference = doc(
      requireDb(),
      'users',
      uid
    );

    await setDoc(
      reference,
      {
        ...safeUpdates,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    return this.get(uid);
  }
};

export default userProfileService;
