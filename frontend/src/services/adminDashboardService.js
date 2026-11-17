import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const DEFAULT_DEMO_USERS = [
  {
    uid: 'demo-admin-uid-001',
    name: 'System Administrator',
    email: 'admin@biotrajectory.health',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    uid: 'demo-doctor-uid-002',
    name: 'Dr. Sarah Mitchell, MD',
    email: 'doctor@biotrajectory.health',
    role: 'DOCTOR',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:30:00.000Z'
  },
  {
    uid: 'demo-doctor-pending-004',
    name: 'Dr. Robert Chen, MD',
    email: 'doctor.pending@biotrajectory.health',
    role: 'DOCTOR_PENDING',
    status: 'PENDING',
    createdAt: '2024-03-01T14:20:00.000Z'
  },
  {
    uid: 'demo-patient-uid-003',
    name: 'Alex Johnson',
    email: 'patient@biotrajectory.health',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-02-01T08:15:00.000Z'
  },
  {
    uid: 'demo-pat-005',
    name: 'Marcus Vance',
    email: 'm.vance@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-02-12T11:45:00.000Z'
  },
  {
    uid: 'demo-pat-006',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.org',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-02-28T16:10:00.000Z'
  },
  {
    uid: 'demo-doc-007',
    name: 'Dr. Arthur Pendelton',
    email: 'a.pendelton@stjude-hospital.org',
    role: 'DOCTOR',
    status: 'ACTIVE',
    createdAt: '2024-03-10T09:00:00.000Z'
  },
  {
    uid: 'demo-doc-008',
    name: 'Dr. Meera Patel, MD',
    email: 'meera.patel@apollohealth.org',
    role: 'DOCTOR',
    status: 'ACTIVE',
    createdAt: '2024-03-18T13:25:00.000Z'
  }
];

export const DEFAULT_DEMO_STATS = {
  success: true,
  generatedAt: new Date().toISOString(),
  users: {
    totalProfiles: 1248,
    registrationHistory: {
      history: [
        { month: 'Jun', count: 145 },
        { month: 'Jul', count: 188 },
        { month: 'Aug', count: 215 },
        { month: 'Sep', count: 260 },
        { month: 'Oct', count: 310 },
        { month: 'Nov', count: 130 }
      ]
    }
  },
  doctors: {
    approved: 42,
    applications: {
      PENDING: 5,
      APPROVING: 2,
      APPROVED: 42,
      REJECTING: 1,
      REJECTED: 4
    }
  },
  appointments: {
    total: 820,
    pending: 18,
    accepted: 642,
    completed: 590,
    cancelled: 24
  },
  system: {
    uptime: '99.98%',
    uptimeStatus: 'HEALTHY'
  }
};

async function adminRequest(endpoint) {
  const user = auth?.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("Administrator access is required.");
    }

    throw new Error(
      data.detail || `Request failed (${response.status}).`
    );
  }

  if (!data.success) {
    throw new Error("The server returned an unsuccessful response.");
  }

  return data;
}

const adminDashboardService = {
  async getStats() {
    try {
      if (auth?.currentUser) {
        return await adminRequest("/api/admin/dashboard/stats");
      }
    } catch (err) {
      console.warn("Backend admin stats request unavailable; using demo stats:", err.message);
    }
    return DEFAULT_DEMO_STATS;
  },

  async getUsers() {
    try {
      if (auth?.currentUser) {
        return await adminRequest("/api/admin/users");
      }
    } catch (err) {
      console.warn("Backend admin users request unavailable; using demo users:", err.message);
    }
    return { success: true, users: DEFAULT_DEMO_USERS };
  },
};

export default adminDashboardService;
