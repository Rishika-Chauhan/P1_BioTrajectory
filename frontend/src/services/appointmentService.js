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
const APPT_STORAGE_PREFIX = "bt_doctor_appointments_";
const APPT_EVENT_NAME = "bt_doctor_appointments_updated";

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

function getStoredDoctorAppointments(doctorUid) {
  try {
    const key = `${APPT_STORAGE_PREFIX}${doctorUid || 'default'}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read stored appointments:', e);
  }
  const defaults = getDemoAppointments(doctorUid);
  saveStoredDoctorAppointments(doctorUid, defaults);
  return defaults;
}

function saveStoredDoctorAppointments(doctorUid, list) {
  try {
    const key = `${APPT_STORAGE_PREFIX}${doctorUid || 'default'}`;
    localStorage.setItem(key, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(APPT_EVENT_NAME, { detail: { doctorUid, list } }));
    }
  } catch (e) {
    console.error('Failed to save stored appointments:', e);
  }
}

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

  // Get stored doctor appointments
  getDoctorAppointments(doctorUid = 'demo-doctor-uid-002') {
    return sortAppointments(getStoredDoctorAppointments(doctorUid));
  },

  getStoredDoctorAppointments(doctorUid = 'demo-doctor-uid-002') {
    return sortAppointments(getStoredDoctorAppointments(doctorUid));
  },

  // Doctor schedules a new appointment for a patient
  async addDoctorAppointment(doctor, data) {
    const docUid = doctor?.uid || 'demo-doctor-uid-002';
    const doctorName = doctor?.name || doctor?.fullName || 'Dr. Sarah Mitchell, MD';

    const newAppt = {
      id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientId: data.patientId || `pat-${Date.now()}`,
      patientName: data.patientName?.trim() || 'Patient',
      doctorId: docUid,
      doctorName,
      appointmentDate: data.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: data.appointmentTime || '10:00',
      type: data.type || 'video',
      reason: (data.reason || 'Consultation Review').trim(),
      status: data.status || 'ACCEPTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = getStoredDoctorAppointments(docUid);
    const updated = [newAppt, ...current];
    saveStoredDoctorAppointments(docUid, updated);

    // Also persist to Firestore if online
    try {
      await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
        ...newAppt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // offline/demo fallback succeeds
    }

    return newAppt;
  },

  subscribeToDoctorAppointments(doctorUid, onData, onError) {
    if (!doctorUid) {
      onError?.(new Error("Doctor ID is missing."));
      return () => {};
    }

    // Always provide immediate stored appointments
    const initialList = getStoredDoctorAppointments(doctorUid);
    onData(sortAppointments(initialList));

    // Listen for local updates across tabs / components
    const handleStorageUpdate = (e) => {
      if (e.detail?.doctorUid === doctorUid || !e.detail?.doctorUid) {
        onData(sortAppointments(e.detail?.list || getStoredDoctorAppointments(doctorUid)));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(APPT_EVENT_NAME, handleStorageUpdate);
    }

    // If demo doctor, storage is our single source of truth
    if (String(doctorUid).startsWith('demo-') || String(doctorUid).includes('doctor') || String(doctorUid).includes('doc_')) {
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener(APPT_EVENT_NAME, handleStorageUpdate);
        }
      };
    }

    const appointmentsQuery = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("doctorId", "==", doctorUid)
    );

    const unsubFirestore = onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const firestoreAppointments = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        const localList = getStoredDoctorAppointments(doctorUid);
        // Merge without duplicating IDs
        const existingIds = new Set(firestoreAppointments.map((a) => a.id));
        const merged = [
          ...firestoreAppointments,
          ...localList.filter((a) => !existingIds.has(a.id)),
        ];

        onData(sortAppointments(merged));
      },
      (error) => {
        console.warn("Doctor appointments firestore listener:", error);
      }
    );

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(APPT_EVENT_NAME, handleStorageUpdate);
      }
      unsubFirestore();
    };
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

  async updateStatus(appointmentId, status, doctorUid = 'demo-doctor-uid-002') {
    const allowedStatuses = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid appointment status.");
    }

    if (!appointmentId) {
      throw new Error("Appointment ID is missing.");
    }

    // Update in local store
    try {
      const stored = getStoredDoctorAppointments(doctorUid);
      const updated = stored.map((item) => {
        if (item.id === appointmentId) {
          return { ...item, status, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      saveStoredDoctorAppointments(doctorUid, updated);
    } catch (e) {
      console.error("Local appointment status update failed:", e);
    }

    // Update in Firestore if connected
    try {
      await updateDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // offline/demo mode succeeds
    }
  },
};

export { getStoredDoctorAppointments, saveStoredDoctorAppointments };