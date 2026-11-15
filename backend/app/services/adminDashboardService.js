
import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const adminDashboardService = {
  async getStats() {
    const user = auth?.currentUser;

    if (!user) {
      throw new Error("You must be logged in to access admin statistics.");
    }

    // Obtain the current Firebase ID token.
    const token = await user.getIdToken();

    const response = await fetch(
      `${API_BASE_URL}/api/admin/dashboard/stats`,
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
        throw new Error("Your session has expired. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error("Administrator access is required.");
      }

      throw new Error(
        data.detail ||
          `Unable to load dashboard statistics (${response.status}).`
      );
    }

    if (!data.success) {
      throw new Error("The server returned an unsuccessful response.");
    }

    return data;
  },
};

export default adminDashboardService;
