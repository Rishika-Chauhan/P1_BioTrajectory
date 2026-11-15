
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './firebase';

// --------------------------------------------------
// Create patient profile if it does not exist
// --------------------------------------------------

export const createPatientProfile = async (firebaseUser) => {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  if (!firebaseUser?.uid) {
    throw new Error('Authenticated Firebase UID is missing.');
  }

  const uid = firebaseUser.uid;

  const userRef = doc(db, 'users', uid);
  const patientRef = doc(db, 'patients', uid);

  const profile = {
    uid,
    fullName: firebaseUser.displayName || '',
    email: firebaseUser.email || ''
  };

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    const patientSnapshot = await transaction.get(patientRef);

    if (!userSnapshot.exists()) {
      transaction.set(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    if (!patientSnapshot.exists()) {
      transaction.set(patientRef, {
        ...profile,
        profileStatus: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  });

  return getPatientProfile(uid);
};

// --------------------------------------------------
// Retrieve patient profile
// --------------------------------------------------

export const getPatientProfile = async (uid) => {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  if (!uid) {
    throw new Error('Patient UID is required.');
  }

  const patientRef = doc(db, 'patients', uid);
  const snapshot = await getDoc(patientRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};
