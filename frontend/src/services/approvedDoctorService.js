
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION_NAME = "approved_doctors";

function normalizeDoctor(snapshot) {
  const data = snapshot.data();

  if (
    data.status !== "APPROVED" ||
    typeof data.full_name !== "string" ||
    typeof data.specialization !== "string"
  ) {
    return null;
  }

  const fullName = data.full_name.trim();
  const displayName = /^dr\.?\s*/i.test(fullName)
    ? fullName
    : `Dr. ${fullName}`;

  return {
    uid: snapshot.id,
    id: snapshot.id,
    name: displayName,
    fullName,
    specialty: data.specialization,
    specialization: data.specialization,
    qualification: data.qualification || "",
    title: data.qualification || "",
    clinic: data.clinic_name || "",
    clinicName: data.clinic_name || "",
    status: data.status,
    approvedAt: data.approved_at || null,
  };
}

export const approvedDoctorService = {
  async getAll() {
    if (!db) {
      throw new Error("Firebase Firestore is not initialized.");
    }

    const doctorsQuery = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "APPROVED")
    );

    const snapshot = await getDocs(doctorsQuery);

    return snapshot.docs
      .map(normalizeDoctor)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getById(uid) {
    if (!uid) {
      throw new Error("Doctor ID is required.");
    }

    const snapshot = await getDoc(doc(db, COLLECTION_NAME, uid));

    if (!snapshot.exists()) {
      return null;
    }

    return normalizeDoctor(snapshot);
  },
};
