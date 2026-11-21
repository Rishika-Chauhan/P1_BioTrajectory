
import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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
      data.detail ||
        data.message ||
        `Request failed: ${response.status}`
    );
  }

  return data;
}

export const doctorApi = {
  async submitApplication(applicationData) {
    if (!applicationData) {
      throw new Error("Doctor application details are required.");
    }

    return authenticatedRequest("/api/doctor/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  async getMyApplication() {
    return authenticatedRequest("/api/doctor/application");
  },

  async getApplications(status = "PENDING") {
    const query = status
      ? `?status_filter=${encodeURIComponent(status)}`
      : "";

    return authenticatedRequest(
      `/api/admin/doctor-applications${query}`
    );
  },

  async approveApplication(uid, note = "Approved after administrator review.") {
    if (!uid) {
      throw new Error("Doctor application ID is required.");
    }

    return authenticatedRequest(
      `/api/admin/doctor-applications/${encodeURIComponent(uid)}/approve`,
      {
        method: "POST",
        body: JSON.stringify({ note }),
      }
    );
  },

  async rejectApplication(uid, reason = "") {
    if (!uid) {
      throw new Error("Doctor application ID is required.");
    }

    return authenticatedRequest(
      `/api/admin/doctor-applications/${encodeURIComponent(uid)}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ note: reason }),
      }
    );
  },
};
