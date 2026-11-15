
/**
 * BioTrajectory AI Assistant Client Service
 *
 * Uses the active Firebase Authentication session to obtain
 * a Firebase ID token for protected FastAPI endpoints.
 *
 * Groq credentials remain exclusively on the backend.
 */

import { FirebaseService } from "./firebase";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
).replace(/\/$/, "");

let activeConversationId = null;

export const resetConversation = () => {
  activeConversationId = null;
};

async function getFirebaseToken(forceRefresh = false) {
  const user = FirebaseService.getCurrentUser();

  if (!user) {
    throw new Error("Please sign in to use the AI assistant.");
  }

  return FirebaseService.getIdToken(user, forceRefresh);
}

function buildHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function authorizedFetch(url, options = {}) {
  // First attempt: use the current Firebase ID token.
  let token = await getFirebaseToken(false);

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...buildHeaders(token),
    },
  });

  // If the backend rejects the token, refresh it once.
  if (response.status === 401) {
    token = await getFirebaseToken(true);

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...buildHeaders(token),
      },
    });
  }

  return response;
}

async function readError(response) {
  try {
    const data = await response.json();
    return data.detail || `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
}

export class GeminiAssistantService {
  static resetConversation() {
    activeConversationId = null;
  }

  static getConversationId() {
    return activeConversationId;
  }

  /**
   * Send an authenticated AI chat request.
   */
  static async queryAssistant({
    query,
    attachments = [],
    userConsentGiven = false,
    recentVitals = {},
    conversationHistory = [],
  }) {
    if (!query || !query.trim()) {
      return {
        text: "Please type a health question or topic you would like me to explain.",
        warningCard: null,
        isEmergency: false,
      };
    }

    const payload = {
      message: query.trim(),
      conversation_id: activeConversationId,
      conversation_history: (conversationHistory || [])
        .slice(-8)
        .map((msg) => ({
          id: msg.id || `history_${Date.now()}`,
          sender: msg.sender || "user",
          text: msg.text || "",
          timestamp: msg.timestamp || null,
          attachments: (msg.attachments || []).map((file) => ({
            name: file.name || "document.pdf",
            size: file.size || null,
            type: file.type || "application/pdf",
          })),
          warningCard: msg.warningCard || null,
        })),
      user_consent_given: Boolean(userConsentGiven),
      attachments: (attachments || []).map((file) => ({
        name: file.name || "document.pdf",
        size: file.size || null,
        type: file.type || "application/pdf",
      })),
    };

    try {
      const response = await authorizedFetch(
        `${BACKEND_BASE_URL}/api/chat`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorDetail = await readError(response);

        if (response.status === 401) {
          return {
            text: "Your authentication session could not be verified. Please sign out, sign in again, and retry.",
            warningCard: null,
            isEmergency: false,
          };
        }

        if (response.status === 429) {
          return {
            text: "Too many requests. Please wait briefly before sending another message.",
            warningCard: null,
            isEmergency: false,
          };
        }

        return {
          text:
            `Service Notice (${response.status}):\n\n` +
            `${errorDetail}\n\n` +
            "For urgent medical concerns, contact your doctor or local health service.",
          warningCard: null,
          isEmergency: false,
        };
      }

      const data = await response.json();

      if (data.conversation_id) {
        activeConversationId = data.conversation_id;
      }

      return {
        text: data.text || data.response || "No response generated.",
        warningCard: data.warningCard || null,
        isEmergency: Boolean(data.is_emergency),
        conversationId: data.conversation_id,
      };
    } catch (error) {
      console.error("BioTrajectory AI request failed:", error);

      if (
        error.message?.includes("sign in") ||
        error.message?.includes("authentication")
      ) {
        return {
          text: "Please sign in to your BioTrajectory account before using the AI assistant.",
          warningCard: null,
          isEmergency: false,
        };
      }

      return {
        text:
          `Backend connection unavailable.\n\n` +
          `Could not reach ${BACKEND_BASE_URL}.\n\n` +
          "Please check whether the FastAPI backend is running and the backend URL is configured correctly.",
        warningCard: {
          level: "warning",
          title: "Backend Connection Offline",
          measurement: "FastAPI Server: Unavailable",
          recommendation: "Check the backend server and network connection.",
          actionText: "Check Server Status",
        },
        isEmergency: false,
      };
    }
  }

  /**
   * Retrieve authenticated conversation history.
   */
  static async fetchHistory(conversationId) {
    if (!conversationId) return [];

    try {
      const url =
        `${BACKEND_BASE_URL}/api/history?conversation_id=` +
        encodeURIComponent(conversationId);

      const response = await authorizedFetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        console.warn(
          "Conversation history request failed:",
          response.status
        );
        return [];
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.warn("Failed to fetch conversation history:", error);
      return [];
    }
  }

  /**
   * Retrieve health summary.
   * This endpoint is requested without an auth header here;
   * its backend access policy must be checked separately.
   */
  static async fetchHealthSummary() {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/health/summary`
      );

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.warn("Failed to fetch health summary:", error);
      return null;
    }
  }
}

export default GeminiAssistantService;
