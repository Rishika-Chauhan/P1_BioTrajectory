
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './firebase';

const getRecordRef = (uid) => {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  if (!uid) {
    throw new Error('Patient UID is required.');
  }

  return doc(db, 'patient_records', uid);
};

export const patientHealthService = {
  async get(uid) {
    const reference = getRecordRef(uid);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      ...snapshot.data(),
      uid
    };
  },

  async save(uid, healthProfile) {
    if (!healthProfile || typeof healthProfile !== 'object') {
      throw new Error('Invalid health profile.');
    }

    if (healthProfile.consent?.storeAndProcessHealthData !== true) {
      throw new Error('Consent is required to save health information.');
    }

    if (healthProfile.consent?.nonDiagnosticScopeAcknowledged !== true) {
      throw new Error('Please acknowledge the non-diagnostic scope.');
    }

    const reference = getRecordRef(uid);
    const existing = await getDoc(reference);

    const {
      uid: ignoredUid,
      role,
      claims,
      email,
      ...safeProfile
    } = healthProfile;

    await setDoc(
      reference,
      {
        ...safeProfile,
        uid,
        updatedAt: serverTimestamp(),
        ...(!existing.exists()
          ? { createdAt: serverTimestamp() }
          : {})
      },
      { merge: true }
    );

    return this.get(uid);
  }
};

export default patientHealthService;
