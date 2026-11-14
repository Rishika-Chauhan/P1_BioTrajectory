/**
 * BioTrajectory AI Assistant Client Service
 * 
 * Securely proxies user questions and health queries to the FastAPI backend.
 * API keys and clinical intelligence reside strictly on the server.
 */

const BACKEND_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  'http://localhost:8000'
).replace(/\/$/, '');

let activeConversationId = null;

export const resetConversation = () => {
  activeConversationId = null;
};

export class GeminiAssistantService {
  /**
   * Resets active conversation session ID on client
   */
  static resetConversation() {
    activeConversationId = null;
  }

  /**
   * Retrieves active conversation ID
   */
  static getConversationId() {
    return activeConversationId;
  }

  /**
   * Dispatches chat request to FastAPI backend (POST /api/chat)
   * 
   * @param {Object} params
   * @param {string} params.query - User message text
   * @param {Array} params.attachments - Optional file attachments
   * @param {boolean} params.userConsentGiven - Consent for document explanation
   * @param {Object} params.recentVitals - Optional vitals context
   * @returns {Promise<{text: string, warningCard: Object|null, isEmergency: boolean, conversationId: string}>}
   */
  static async queryAssistant({ query, attachments = [], userConsentGiven = true, recentVitals = {}, conversationHistory = [] }) {
    if (!query || !query.trim()) {
      return {
        text: 'Please type a health question or topic you would like me to explain.',
        warningCard: null,
        isEmergency: false
      };
    }

    // Retrieve auth token if user is signed in
    let authToken = null;
    try {
      const savedUserStr = localStorage.getItem('biotrajectory-auth-user') || sessionStorage.getItem('biotrajectory-auth-user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        authToken = parsed?.token || parsed?.tokenResult?.token || null;
      }
    } catch (e) {
      // In development or guest session, proceed without token
    }

    const headers = {
      'Content-Type': 'application/json'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const payload = {
      message: query.trim(),
      conversation_id: activeConversationId,
      conversation_history: (conversationHistory || []).slice(-8).map(msg => ({
        id: msg.id || `history_${Date.now()}`,
        sender: msg.sender || 'user',
        text: msg.text || '',
        timestamp: msg.timestamp || null,
        attachments: (msg.attachments || []).map(file => ({
          name: file.name || 'document.pdf',
          size: file.size || null,
          type: file.type || 'application/pdf'
        })),
        warningCard: msg.warningCard || null
      })),
      user_consent_given: Boolean(userConsentGiven),
      attachments: (attachments || []).map(file => ({
        name: file.name || 'document.pdf',
        size: file.size || null,
        type: file.type || 'application/pdf'
      }))
    };

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorDetail = 'Failed to generate response.';
        try {
          const errJson = await response.json();
          errorDetail = errJson.detail || errorDetail;
        } catch (_) {}

        if (response.status === 429) {
          return {
            text: '⚠️ **Too Many Requests**:\n\nPlease pause for a moment before sending another message. Our health assistant is rate-limited to ensure system stability.',
            warningCard: null,
            isEmergency: false
          };
        }

        return {
          text: `⚠️ **Service Notice** (${response.status}):\n\n${errorDetail}\n\nIf you have an urgent medical question, please contact your doctor or local health clinic.`,
          warningCard: null,
          isEmergency: false
        };
      }

      const data = await response.json();

      // Update active conversation identifier
      if (data.conversation_id) {
        activeConversationId = data.conversation_id;
      }

      return {
        text: data.text || data.response || 'No response generated.',
        warningCard: data.warningCard || null,
        isEmergency: Boolean(data.is_emergency),
        conversationId: data.conversation_id
      };
    } catch (networkError) {
      console.error('BioTrajectory backend connection error:', networkError);
      return {
        text: `⚠️ **Backend Connection Unavailable**:\n\nCould not reach the BioTrajectory API server at \`${BACKEND_BASE_URL}\`.\n\nPlease ensure the FastAPI backend is running:\n\`\`\`bash\ncd backend\nsource venv/bin/activate\nuvicorn app.main:app --port 8000\n\`\`\`\n\n*If you are in an emergency, please call 911 or 112 immediately.*`,
        warningCard: {
          level: 'warning',
          title: 'Backend Connection Offline',
          measurement: 'FastAPI Server: Offline',
          recommendation: 'Start the Python FastAPI backend server on port 8000 to enable live AI assistance.',
          actionText: 'Check Server Status'
        },
        isEmergency: false
      };
    }
  }

  /**
   * Retrieves conversation history from backend
   */
  static async fetchHistory(conversationId) {
    if (!conversationId) return [];
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/history?conversation_id=${encodeURIComponent(conversationId)}`);
      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      }
    } catch (e) {
      console.warn('Failed to fetch conversation history:', e);
    }
    return [];
  }

  /**
   * Retrieves backend health summary
   */
  static async fetchHealthSummary() {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/health/summary`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Failed to fetch health summary:', e);
    }
    return null;
  }
}

export default GeminiAssistantService;
