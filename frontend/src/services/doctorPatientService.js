
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const APPOINTMENTS_COLLECTION = "appointments";

const ROSTER_STATUSES = new Set([
  "ACCEPTED",
  "COMPLETED",
]);

function formatDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildPatientRoster(appointmentDocs) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const patients = new Map();

  for (const snapshot of appointmentDocs) {
    const appointment = snapshot.data();

    if (!ROSTER_STATUSES.has(appointment.status)) {
      continue;
    }

    if (!appointment.patientId) {
      continue;
    }

    const patientId = appointment.patientId;

    const current = patients.get(patientId) || {
      id: patientId,
      patientId,
      name: appointment.patientName || "Patient",
      patientName: appointment.patientName || "Patient",
      appointments: [],
    };

    current.appointments.push({
      id: snapshot.id,
      status: appointment.status,
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || "",
      type: appointment.type || "",
    });

    if (appointment.patientName) {
      current.name = appointment.patientName;
      current.patientName = appointment.patientName;
    }

    patients.set(patientId, current);
  }

  return [...patients.values()]
    .map((patient) => {
      const sorted = [...patient.appointments].sort((a, b) =>
        `${b.appointmentDate}T${b.appointmentTime}`.localeCompare(
          `${a.appointmentDate}T${a.appointmentTime}`
        )
      );

      const upcoming = sorted
        .filter((item) => {
          if (
            item.status !== "ACCEPTED" ||
            !item.appointmentDate
          ) {
            return false;
          }

          const date = new Date(
            `${item.appointmentDate}T00:00:00`
          );

          return (
            !Number.isNaN(date.getTime()) &&
            date >= today
          );
        })
        .sort((a, b) =>
          `${a.appointmentDate}T${a.appointmentTime}`.localeCompare(
            `${b.appointmentDate}T${b.appointmentTime}`
          )
        )[0];

      const latest = sorted[0];

      const latestCompleted = sorted.find(
        (item) => item.status === "COMPLETED"
      );

      const latestDate = latestCompleted?.appointmentDate
        ? new Date(
            `${latestCompleted.appointmentDate}T00:00:00`
          )
        : null;

      const recentCutoff = new Date(today);

      recentCutoff.setDate(
        recentCutoff.getDate() - 7
      );

      return {
        ...patient,

        status: upcoming
          ? "Upcoming Appointment"
          : latest?.status === "COMPLETED"
            ? "Consultation Completed"
            : "Appointment History",

        appointmentCount: sorted.length,

        lastVisit: latestCompleted
          ? formatDate(latestCompleted.appointmentDate)
          : "No completed visit",

        nextFollowUp: upcoming
          ? `${formatDate(upcoming.appointmentDate)}${
              upcoming.appointmentTime
                ? ` · ${upcoming.appointmentTime}`
                : ""
            }`
          : "Not scheduled",

        latestAppointmentDate:
          latest?.appointmentDate || "",

        hasUpcomingAppointment: Boolean(upcoming),

        hasActiveAppointment: sorted.some(
          (item) => item.status === "ACCEPTED"
        ),

        hasRecentVisit: Boolean(
          latestDate &&
          !Number.isNaN(latestDate.getTime()) &&
          latestDate >= recentCutoff &&
          latestDate <= today
        ),

        avatar: "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const doctorPatientService = {
  subscribeToDoctorPatients(
    doctorUid,
    onData,
    onError
  ) {
    if (!db) {
      onError?.(
        new Error("Firestore is not initialized.")
      );

      return () => {};
    }

    if (!doctorUid) {
      onError?.(
        new Error("Doctor ID is missing.")
      );

      return () => {};
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorUid)
    );

    return onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const patients = buildPatientRoster(
          snapshot.docs
        );

        onData?.(patients);
      },
      (error) => {
        console.error(
          "Doctor patient roster listener failed:",
          error
        );

        onError?.(error);
      }
    );
  },

  async getDoctorPatients(doctorUid) {
    if (!db) {
      throw new Error(
        "Firestore is not initialized."
      );
    }

    if (!doctorUid) {
      throw new Error(
        "Doctor ID is missing."
      );
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorUid)
    );

    const snapshot = await getDocs(
      appointmentsQuery
    );

    return buildPatientRoster(snapshot.docs);
  },
};
