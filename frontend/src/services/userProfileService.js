
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

function isValidName(value) {
  if (typeof value !== 'string') return false;

  const cleaned = value.trim();

  if (!cleaned) return false;

  const placeholders = [
    'user',
    'unknown',
    'undefined',
    'null',
    'patient'
  ];

  return !placeholders.includes(cleaned.toLowerCase());
}

function resolveName(...values) {
  return values.find(isValidName)?.trim() || '';
}

export const userProfileService = {
  async get(uid) {
    if (!uid) {
      throw new Error('A Firebase UID is required.');
    }

    if (String(uid).startsWith('demo-')) {
      return {
        uid,
        name: 'Alex Johnson',
        email: 'patient@biotrajectory.health',
        createdAt: '2024-02-01T00:00:00.000Z',
        onboardingCompleted: true
      };
    }

    const snapshot = await getDoc(
      doc(requireDb(), 'users', uid)
    );

    return snapshot.exists()
      ? { uid, ...snapshot.data() }
      : null;
  },

  async createIfMissing(firebaseUser) {
    if (!firebaseUser?.uid) {
      throw new Error('A valid authenticated user is required.');
    }

    if (
      firebaseUser.isDemo ||
      String(firebaseUser.uid).startsWith('demo-')
    ) {
      const demoName = resolveName(
        firebaseUser.name,
        firebaseUser.displayName
      ) || 'Alex Johnson';

      return {
        uid: firebaseUser.uid,
        name: demoName,
        displayName: demoName,
        email: firebaseUser.email || '',
        photoURL: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingCompleted: true
      };
    }

    const reference = doc(
      requireDb(),
      'users',
      firebaseUser.uid
    );

    const snapshot = await getDoc(reference);

    const authName = resolveName(
      firebaseUser.displayName
    );

    const emailName = resolveName(
      firebaseUser.email?.split('@')[0]
    );

    if (snapshot.exists()) {
      const existing = snapshot.data();

      const existingName = resolveName(
        existing.name,
        existing.fullName,
        existing.displayName
      );

      const resolvedName =
        existingName || authName || emailName || 'User';

      const updates = {};

      if (!existingName && resolvedName !== 'User') {
        updates.name = resolvedName;
        updates.displayName = resolvedName;
      }

      if (!existing.email && firebaseUser.email) {
        updates.email = firebaseUser.email;
      }

      if (
        !existing.photoURL &&
        firebaseUser.photoURL
      ) {
        updates.photoURL = firebaseUser.photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await setDoc(
          reference,
          {
            ...updates,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }

      return {
        uid: firebaseUser.uid,
        ...existing,
        ...updates,
        name: resolvedName
      };
    }

    const resolvedName =
      authName || emailName || 'User';

    const profile = {
      uid: firebaseUser.uid,
      name: resolvedName,
      displayName: resolvedName,
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
