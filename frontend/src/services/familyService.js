
/**
 * BioTrajectory Family Service
 *
 * Connects the frontend to FastAPI Family Management endpoints.
 * All requests use authenticated Firebase ID tokens.
 * Family invitations are handled inside the application.
 */

import { FirebaseService, auth } from './firebase';

const BACKEND_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

// --------------------------------------------------
// AUTHENTICATED API REQUEST
// --------------------------------------------------

async function authenticatedRequest(endpoint, options = {}) {
  const user = auth?.currentUser || FirebaseService.getCurrentUser();

  if (!user) {
    throw new Error('Please sign in to access family health features.');
  }

  let token = await FirebaseService.getIdToken(user, false);

  const makeRequest = (idToken) =>
    fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        ...options.headers,
      },
    });

  let response = await makeRequest(token);

  // Refresh expired Firebase ID token once.
  if (response.status === 401) {
    token = await FirebaseService.getIdToken(user, true);
    response = await makeRequest(token);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.detail ||
      data.message ||
      `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.detail = data.detail;

    throw error;
  }

  return data;
}

// --------------------------------------------------
// FAMILY SERVICE
// --------------------------------------------------

export const familyService = {

  // CREATE FAMILY
  async createFamily(name) {
    const res = await authenticatedRequest('/api/families', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
      }),
    });

    return res.data;
  },

  // GET CURRENT USER FAMILY
  async getMyFamily() {
    const res = await authenticatedRequest('/api/families/me', {
      method: 'GET',
    });

    return res.data;
  },

  // LIST FAMILY MEMBERS
  async listMembers(familyId) {
    const res = await authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/members`,
      { method: 'GET' }
    );

    return res.data;
  },

  // INVITE REGISTERED USER BY EMAIL
  async inviteMember(familyId, email) {
    return authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/invitations`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      }
    );
  },

  // GET INVITATIONS FOR SIGNED-IN USER
  async getPendingInvitations() {
    const res = await authenticatedRequest(
      '/api/family-invitations/pending',
      {
        method: 'GET',
      }
    );

    return res.invitations || [];
  },

  // ACCEPT INVITATION USING INVITATION ID
  async acceptInvitation(invitationId) {
    const res = await authenticatedRequest(
      `/api/family-invitations/${encodeURIComponent(invitationId)}/accept`,
      {
        method: 'POST',
      }
    );

    return res.data;
  },

  // REJECT INVITATION USING INVITATION ID
  async rejectInvitation(invitationId) {
    return authenticatedRequest(
      `/api/family-invitations/${encodeURIComponent(invitationId)}/reject`,
      {
        method: 'POST',
      }
    );
  },

  // LIST FAMILY OWNER'S PENDING INVITATIONS
  async listInvitations(familyId) {
    const res = await authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/invitations`,
      {
        method: 'GET',
      }
    );

    return res.invitations || [];
  },

  // REVOKE INVITATION
  async revokeInvitation(familyId, invitationId) {
    return authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/invitations/${encodeURIComponent(invitationId)}`,
      {
        method: 'DELETE',
      }
    );
  },

  // REMOVE FAMILY MEMBER
  async removeMember(familyId, memberUid) {
    return authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberUid)}`,
      {
        method: 'DELETE',
      }
    );
  },

  // LEAVE FAMILY
  async leaveFamily(familyId) {
    return authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/leave`,
      {
        method: 'POST',
      }
    );
  },

  // DISBAND FAMILY
  async disbandFamily(familyId) {
    return authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}`,
      {
        method: 'DELETE',
      }
    );
  },

  // UPDATE CURRENT USER'S OWN HEALTH SHARING PERMISSIONS
  async updateMyPermissions(familyId, memberUid, permissions) {
    const res = await authenticatedRequest(
      `/api/families/${encodeURIComponent(familyId)}/members/${encodeURIComponent(memberUid)}/permissions`,
      {
        method: 'PATCH',
        body: JSON.stringify(permissions),
      }
    );

    return res.permissions;
  },

  // GET AUTHORIZED FAMILY MEMBER READINGS
  async getMemberReadings(memberUid, limit = 100) {
    const safeLimit = Math.min(
      Math.max(Number(limit) || 100, 1),
      100
    );

    return authenticatedRequest(
      `/api/family-members/${encodeURIComponent(memberUid)}/readings?limit=${safeLimit}`,
      {
        method: 'GET',
      }
    );
  },
};

export default familyService;
