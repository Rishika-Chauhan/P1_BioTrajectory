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

const getDemoAppointments = (docUid = 'demo-doctor-uid-002') => [
  {
    id: 'demo-appt-1',
    patientId: 'demo-patient-uid-003',
    patientName: 'Alex Johnson',
    doctorId: docUid,
    doctorName: 'Dr. Sarah Mitchell, MD',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:30',
    type: 'video',
    reason: 'Follow-up on cardiovascular blood pressure metrics and sodium levels',
    status: 'ACCEPTED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-appt-2',
    patientId: 'demo-pat-005',
    patientName: 'Marcus Vance',
    doctorId: docUid,
    doctorName: 'Dr. Sarah Mitchell, MD',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '14:00',
    type: 'in-person',
    reason: 'Annual preventive health trajectory review',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-appt-3',
    patientId: 'demo-pat-006',
    patientName: 'Elena Rostova',
    doctorId: docUid,
    doctorName: 'Dr. Sarah Mitchell, MD',
    appointmentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    appointmentTime: '11:15',
    type: 'video',
    reason: 'Lipid panel consultation and dietary guidance',
    status: 'COMPLETED',
    createdAt: new Date().toISOString()
  }
];

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

    if (String(doctorUid).startsWith('demo-') || String(doctorUid).includes('doctor')) {
      const demoList = getDemoAppointments(doctorUid);
      onData(sortAppointments(demoList));
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
      const demoUserRaw = localStorage.getItem('biotrajectory_demo_user');
      if (demoUserRaw) {
        try {
          const demoUser = JSON.parse(demoUserRaw);
          if (demoUser.role === 'USER') {
            const demoAppts = getDemoAppointments().filter(a => a.patientId === demoUser.uid);
            onData(sortAppointments(demoAppts.length ? demoAppts : getDemoAppointments()));
            return () => {};
          }
        } catch {
          // ignore
        }
      }

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