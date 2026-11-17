
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
    if (String(uid).startsWith('demo-')) {
      const stored = localStorage.getItem(`bt_profile_${uid}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return {
        name: 'Alex Johnson',
        age: 34,
        gender: 'male',
        bloodGroup: 'O+',
        height: 178,
        weight: 72,
        allergies: ['Penicillin'],
        conditions: ['Mild Hypertension (Monitored)'],
        emergencyContact: {
          name: 'Emily Johnson',
          relationship: 'Spouse',
          phone: '+1 (555) 987-6543'
        },
        consent: {
          storeAndProcessHealthData: true,
          nonDiagnosticScopeAcknowledged: true
        },
        onboardingCompleted: true,
        uid
      };
    }

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

    if (String(uid).startsWith('demo-')) {
      const saved = { ...healthProfile, uid, updatedAt: new Date().toISOString() };
      localStorage.setItem(`bt_profile_${uid}`, JSON.stringify(saved));
      return saved;
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
