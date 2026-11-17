import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const STORAGE_KEY = 'bt_demo_doctor_applications';

export const DEFAULT_DEMO_APPLICATIONS = [
  {
    uid: 'demo-doctor-pending-004',
    user_id: 'demo-doctor-pending-004',
    full_name: 'Dr. Robert Chen, MD',
    email: 'doctor.pending@biotrajectory.health',
    phone: '+1 (555) 345-6789',
    specialization: 'Neurology & Cognitive Health',
    qualification: 'MD, DM Neurology (Johns Hopkins)',
    registration_number: 'MCI-99214-B',
    issuing_council: 'Medical Council of India / ABMS',
    clinic_name: 'Metro Neurology Center',
    status: 'PENDING',
    created_at: '2024-03-01T14:20:00.000Z',
    review_note: 'Submitted license and credentials documentation.'
  },
  {
    uid: 'demo-doc-app-002',
    user_id: 'demo-doc-app-002',
    full_name: 'Dr. Elena Vasquez, MD',
    email: 'elena.vasquez@cityhealth.org',
    phone: '+1 (555) 882-3901',
    specialization: 'Endocrinology & Diabetology',
    qualification: 'MD, Fellowship (Stanford Medicine)',
    registration_number: 'CA-MED-77123',
    issuing_council: 'Medical Board of California',
    clinic_name: 'Pacific Endocrine Clinic',
    status: 'PENDING',
    created_at: '2024-03-05T09:15:00.000Z',
    review_note: 'Awaiting board certification confirmation.'
  },
  {
    uid: 'demo-doctor-uid-002',
    user_id: 'demo-doctor-uid-002',
    full_name: 'Dr. Sarah Mitchell, MD',
    email: 'doctor@biotrajectory.health',
    phone: '+1 (555) 234-5678',
    specialization: 'Cardiology & Internal Medicine',
    qualification: 'MD, FACP (Harvard Medical School)',
    registration_number: 'MD-89241-US',
    issuing_council: 'American Board of Internal Medicine (ABIM)',
    clinic_name: 'BioTrajectory Clinical Research Center',
    status: 'APPROVED',
    created_at: '2024-01-15T10:30:00.000Z',
    review_note: 'Verified credentials and license in good standing.'
  }
];

function getStoredApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_APPLICATIONS;
  } catch {
    return DEFAULT_DEMO_APPLICATIONS;
  }
}

function saveStoredApplications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

async function authenticatedRequest(endpoint, options = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to perform this action.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

export const doctorApi = {
  async submitApplication(applicationData) {
    try {
      if (auth.currentUser) {
        return await authenticatedRequest("/api/doctor/applications", {
          method: "POST",
          body: JSON.stringify(applicationData),
        });
      }
    } catch (err) {
      console.warn("Backend application submit unavailable:", err.message);
    }
    const current = getStoredApplications();
    const newRecord = {
      uid: 'demo-doc-app-' + Date.now(),
      status: 'PENDING',
      created_at: new Date().toISOString(),
      ...applicationData
    };
    saveStoredApplications([newRecord, ...current]);
    return { success: true, application: newRecord };
  },

  async getMyApplication() {
    try {
      if (auth.currentUser) {
        return await authenticatedRequest("/api/doctor/application");
      }
    } catch {
      // ignore
    }
    const list = getStoredApplications();
    const demoUserRaw = localStorage.getItem('biotrajectory_demo_user');
    const demoUid = demoUserRaw ? JSON.parse(demoUserRaw).uid : 'demo-doctor-uid-002';
    const found = list.find((a) => a.uid === demoUid || a.user_id === demoUid);
    return { application: found || list[2] };
  },

  async getApplications(status = "PENDING") {
    try {
      if (auth.currentUser) {
        const query = status ? `?status_filter=${encodeURIComponent(status)}` : "";
        return await authenticatedRequest(`/api/admin/doctor-applications${query}`);
      }
    } catch (err) {
      console.warn("Backend doctor applications unavailable, using local demo data:", err.message);
    }
    const list = getStoredApplications();
    if (!status || status === 'ALL') {
      return { success: true, applications: list };
    }
    return {
      success: true,
      applications: list.filter((item) => String(item.status).toUpperCase() === status.toUpperCase())
    };
  },

  async approveApplication(uid, note = "Approved after administrator review.") {
    try {
      if (auth.currentUser) {
        return await authenticatedRequest(
          `/api/admin/doctor-applications/${encodeURIComponent(uid)}/approve`,
          {
            method: "POST",
            body: JSON.stringify({ note }),
          }
        );
      }
    } catch (err) {
      console.warn("Backend approve unavailable, applying locally:", err.message);
    }
    const list = getStoredApplications();
    const updated = list.map((item) =>
      item.uid === uid || item.user_id === uid
        ? { ...item, status: 'APPROVED', review_note: note }
        : item
    );
    saveStoredApplications(updated);
    return { success: true, message: 'Application approved.' };
  },

  async rejectApplication(uid, reason = "") {
    try {
      if (auth.currentUser) {
        return await authenticatedRequest(
          `/api/admin/doctor-applications/${encodeURIComponent(uid)}/reject`,
          {
            method: "POST",
            body: JSON.stringify({ note: reason }),
          }
        );
      }
    } catch (err) {
      console.warn("Backend reject unavailable, applying locally:", err.message);
    }
    const list = getStoredApplications();
    const updated = list.map((item) =>
      item.uid === uid || item.user_id === uid
        ? { ...item, status: 'REJECTED', review_note: reason }
        : item
    );
    saveStoredApplications(updated);
    return { success: true, message: 'Application rejected.' };
  },
};
