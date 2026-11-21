
import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ============================================================
// COMMON ADMIN API REQUEST
// ============================================================

async function adminRequest(endpoint) {
  const user = auth?.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Session expired. Please log in again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Administrator access is required."
      );
    }

    throw new Error(
      data.detail || `Request failed (${response.status}).`
    );
  }

  if (!data.success) {
    throw new Error(
      data.detail ||
      "The server returned an unsuccessful response."
    );
  }

  return data;
}

// ============================================================
// ADMIN DASHBOARD SERVICE
// ============================================================

const adminDashboardService = {

  // ----------------------------------------------------------
  // Dashboard statistics
  // ----------------------------------------------------------

  async getStats() {
    return adminRequest(
      "/api/admin/dashboard/stats"
    );
  },

  // ----------------------------------------------------------
  // All registered users and doctors
  // ----------------------------------------------------------

  async getUsers() {
    const response = await adminRequest(
      "/api/admin/users"
    );

    if (!Array.isArray(response.users)) {
      throw new Error(
        "Invalid user directory response from server."
      );
    }

    return response;
  },

  // ----------------------------------------------------------
  // Population medical aggregates
  // ----------------------------------------------------------

  async getMedicalAggregates(period = "30d") {

    const allowedPeriods = [
      "7d",
      "30d",
      "6m",
      "1y",
    ];

    if (!allowedPeriods.includes(period)) {
      throw new Error(
        "Invalid medical records period."
      );
    }

    return adminRequest(
      `/api/admin/medical-records/aggregate?period=${encodeURIComponent(period)}`
    );
  },
};

export default adminDashboardService;
