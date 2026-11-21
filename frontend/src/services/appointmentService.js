
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "./firebase";

const APPOINTMENTS_COLLECTION = "appointments";

const ALLOWED_APPOINTMENT_TYPES = ["video", "in-person"];

const ALLOWED_APPOINTMENT_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
];

function sortAppointments(appointments = []) {
  return [...appointments].sort((a, b) => {
    const dateA = `${a.appointmentDate || ""}T${a.appointmentTime || "00:00"}`;
    const dateB = `${b.appointmentDate || ""}T${b.appointmentTime || "00:00"}`;

    return dateB.localeCompare(dateA);
  });
}

function mapAppointment(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

function getCurrentUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in to continue.");
  }

  return user;
}

function validateAppointmentDateTime(data) {
  if (!data?.appointmentDate || !data?.appointmentTime) {
    throw new Error("Appointment date and time are required.");
  }

  if (
    typeof data.appointmentDate !== "string" ||
    typeof data.appointmentTime !== "string"
  ) {
    throw new Error("Invalid appointment date or time.");
  }
}

export const appointmentService = {
  // Patient books an appointment with a doctor.
  async createAppointment(doctor, appointmentData = {}) {
    const user = getCurrentUser();

    if (!doctor?.uid) {
      throw new Error("The selected doctor ID is missing.");
    }

    if (!doctor?.name && !doctor?.fullName) {
      throw new Error("The selected doctor profile is incomplete.");
    }

    validateAppointmentDateTime(appointmentData);

    const { appointmentDate, appointmentTime, type, reason } =
      appointmentData;

    if (!ALLOWED_APPOINTMENT_TYPES.includes(type)) {
      throw new Error("Invalid appointment type.");
    }

    const patientName =
      user.displayName?.trim() ||
      user.email?.split("@")[0] ||
      "Patient";

    const doctorName = doctor.name || `Dr. ${doctor.fullName}`;

    const appointment = {
      patientId: user.uid,
      patientName,
      doctorId: doctor.uid,
      doctorName,
      appointmentDate,
      appointmentTime,
      type,
      reason: String(reason || "").trim(),
      status: "PENDING",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const result = await addDoc(
      collection(db, APPOINTMENTS_COLLECTION),
      appointment
    );

    return {
      id: result.id,
      ...appointment,
    };
  },

  // Fetch appointments assigned to a doctor.
  async getDoctorAppointments(doctorUid) {
    if (!doctorUid) {
      throw new Error("Doctor ID is missing.");
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorUid)
    );

    const snapshot = await getDocs(appointmentsQuery);

    return sortAppointments(snapshot.docs.map(mapAppointment));
  },

  // Kept for compatibility with older imports.
  // This now reads Firestore; it does not read browser storage.
  async getStoredDoctorAppointments(doctorUid) {
    return this.getDoctorAppointments(doctorUid);
  },

  // Doctor creates an appointment for an existing patient.
  async addDoctorAppointment(doctor, data = {}) {
    const user = getCurrentUser();

    if (!doctor?.uid || doctor.uid !== user.uid) {
      throw new Error("You can only create appointments using your own doctor account.");
    }

    if (!data.patientId) {
      throw new Error("Patient ID is required.");
    }

    validateAppointmentDateTime(data);

    if (!ALLOWED_APPOINTMENT_TYPES.includes(data.type)) {
      throw new Error("Invalid appointment type.");
    }

    const doctorName =
      doctor.name ||
      (doctor.fullName ? `Dr. ${doctor.fullName}` : "");

    if (!doctorName) {
      throw new Error("Doctor name is missing.");
    }

    const appointment = {
      patientId: data.patientId,
      patientName: String(data.patientName || "").trim(),
      doctorId: doctor.uid,
      doctorName,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      type: data.type,
      reason: String(data.reason || "").trim(),
      status: "PENDING",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const result = await addDoc(
      collection(db, APPOINTMENTS_COLLECTION),
      appointment
    );

    return {
      id: result.id,
      ...appointment,
    };
  },

  // Real-time appointments assigned to a doctor.
  subscribeToDoctorAppointments(doctorUid, onData, onError) {
    if (!doctorUid) {
      onError?.(new Error("Doctor ID is missing."));
      return () => {};
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorUid)
    );

    return onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const appointments = snapshot.docs.map(mapAppointment);
        onData?.(sortAppointments(appointments));
      },
      (error) => {
        console.error("Doctor appointments listener error:", error);
        onError?.(error);
      }
    );
  },

  // Real-time appointments belonging to the logged-in patient.
  subscribeToPatientAppointments(onData, onError) {
    let user;

    try {
      user = getCurrentUser();
    } catch (error) {
      onError?.(error);
      return () => {};
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("patientId", "==", user.uid)
    );

    return onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const appointments = snapshot.docs.map(mapAppointment);
        onData?.(sortAppointments(appointments));
      },
      (error) => {
        console.error("Patient appointments listener error:", error);
        onError?.(error);
      }
    );
  },

  // Update appointment status.
  // The Firestore rules remain responsible for deciding whether
  // the current user is allowed to make this update.
  async updateStatus(appointmentId, status) {
    getCurrentUser();

    if (!appointmentId) {
      throw new Error("Appointment ID is missing.");
    }

    if (!ALLOWED_APPOINTMENT_STATUSES.includes(status)) {
      throw new Error("Invalid appointment status.");
    }

    await updateDoc(
      doc(db, APPOINTMENTS_COLLECTION, appointmentId),
      {
        status,
        updatedAt: serverTimestamp(),
      }
    );

    return true;
  },
};

// Compatibility export for existing imports.
// It now fetches appointments from Firestore.
export async function getStoredDoctorAppointments(doctorUid) {
  return appointmentService.getDoctorAppointments(doctorUid);
}

// Local appointment persistence has intentionally been removed.
export function saveStoredDoctorAppointments() {
  throw new Error(
    "Local appointment storage has been removed. Use Firestore appointment methods instead."
  );
}
