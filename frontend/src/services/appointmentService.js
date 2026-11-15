import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "./firebase";

const APPOINTMENTS_COLLECTION = "appointments";

function sortAppointments(appointments) {
  return appointments.sort((a, b) => {
    const dateA = `${a.appointmentDate || ""}T${a.appointmentTime || "00:00"}`;
    const dateB = `${b.appointmentDate || ""}T${b.appointmentTime || "00:00"}`;
    return dateB.localeCompare(dateA);
  });
}

export const appointmentService = {
  async createAppointment(doctor, appointmentData) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in before booking an appointment.");
    }

    if (!doctor?.uid || !doctor?.name) {
      throw new Error("The selected doctor profile is incomplete.");
    }

    const { appointmentDate, appointmentTime, type, reason } =
      appointmentData;

    if (!appointmentDate || !appointmentTime) {
      throw new Error("Please select an appointment date and time.");
    }

    if (!["video", "in-person"].includes(type)) {
      throw new Error("Invalid appointment type.");
    }

    const patientName =
      user.displayName?.trim() ||
      user.email?.split("@")[0] ||
      "Patient";

    const appointment = {
      patientId: user.uid,
      patientName,
      doctorId: doctor.uid,
      doctorName: doctor.name,
      appointmentDate,
      appointmentTime,
      type,
      reason: (reason || "").trim(),
      status: "PENDING",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const result = await addDoc(
      collection(db, APPOINTMENTS_COLLECTION),
      appointment
    );

    return { id: result.id, ...appointment };
  },

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
        const appointments = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        onData(sortAppointments(appointments));
      },
      (error) => {
        console.error("Doctor appointments listener error:", error);
        onError?.(error);
      }
    );
  },

  // Real-time appointment history for the logged-in patient
  subscribeToPatientAppointments(onData, onError) {
    const user = auth.currentUser;

    if (!user) {
      onError?.(new Error("Please log in to view your appointments."));
      return () => {};
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("patientId", "==", user.uid)
    );

    return onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const appointments = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        onData(sortAppointments(appointments));
      },
      (error) => {
        console.error("Patient appointments listener error:", error);
        onError?.(error);
      }
    );
  },

  async updateStatus(appointmentId, status) {
    const allowedStatuses = ["ACCEPTED", "REJECTED", "COMPLETED"];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid appointment status.");
    }

    if (!appointmentId) {
      throw new Error("Appointment ID is missing.");
    }

    await updateDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },
};