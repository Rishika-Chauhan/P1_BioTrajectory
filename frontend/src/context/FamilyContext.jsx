
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useAuth } from './AuthContext';
import { familyService } from '../services/familyService';

const FamilyContext = createContext(null);

const DEFAULT_PERMISSIONS = {
  viewReadings: false,
  viewAnalytics: false,
  viewMedicalHistory: false,
  viewReports: false,
};

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();

  // Family state
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  // Invitations received by the signed-in user
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [pendingInvitationsLoading, setPendingInvitationsLoading] =
    useState(false);
  const [pendingInvitationsError, setPendingInvitationsError] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active member health overview
  const [activeMemberUid, setActiveMemberUid] = useState(null);
  const [activeMemberReadings, setActiveMemberReadings] = useState([]);
  const [activeMemberPermissions, setActiveMemberPermissions] =
    useState(null);
  const [activeMemberLoading, setActiveMemberLoading] = useState(false);
  const [activeMemberError, setActiveMemberError] = useState(null);

  // --------------------------------------------------
  // CLEAR ACTIVE MEMBER
  // --------------------------------------------------

  const clearActiveMember = useCallback(() => {
    setActiveMemberUid(null);
    setActiveMemberReadings([]);
    setActiveMemberPermissions(null);
    setActiveMemberError(null);
    setActiveMemberLoading(false);
  }, []);

  // --------------------------------------------------
  // FETCH FAMILY
  // --------------------------------------------------

  const fetchFamily = useCallback(async () => {
    if (!currentUser?.uid) {
      setFamily(null);
      setMembers([]);
      setInvitations([]);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await familyService.getMyFamily();

      setFamily(data?.family || null);
      setMembers(data?.members || []);
      setInvitations(data?.invitations || []);

      return data;
    } catch (err) {
      console.error('[FamilyContext] Family fetch failed:', err);

      if (err.status === 404 || err.status === 403) {
        setFamily(null);
        setMembers([]);
        setInvitations([]);
      } else {
        setError(err.message || 'Failed to load family data.');
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  // --------------------------------------------------
  // FETCH INVITATIONS RECEIVED BY CURRENT USER
  // --------------------------------------------------

  const fetchPendingInvitations = useCallback(async () => {
    if (!currentUser?.uid) {
      setPendingInvitations([]);
      setPendingInvitationsLoading(false);
      return [];
    }

    setPendingInvitationsLoading(true);
    setPendingInvitationsError(null);

    try {
      const data = await familyService.getPendingInvitations();

      setPendingInvitations(data || []);

      return data || [];
    } catch (err) {
      console.error(
        '[FamilyContext] Pending invitation fetch failed:',
        err
      );

      setPendingInvitationsError(
        err.message || 'Unable to load pending invitations.'
      );

      return [];
    } finally {
      setPendingInvitationsLoading(false);
    }
  }, [currentUser?.uid]);

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    if (!currentUser?.uid) {
      setFamily(null);
      setMembers([]);
      setInvitations([]);
      setPendingInvitations([]);
      setLoading(false);
      return;
    }

    fetchFamily();
    fetchPendingInvitations();
  }, [currentUser?.uid, fetchFamily, fetchPendingInvitations]);

  // --------------------------------------------------
  // DERIVED FAMILY DATA
  // --------------------------------------------------

  const isOwner = Boolean(
    family &&
    currentUser?.uid &&
    family.ownerUid === currentUser.uid
  );

  const myMemberRecord = members.find(
    (member) => member.uid === currentUser?.uid
  );

  const myPermissions = {
    ...DEFAULT_PERMISSIONS,
    ...(myMemberRecord?.permissions || {}),
  };

  const activeMember =
    members.find((member) => member.uid === activeMemberUid) || null;

  // --------------------------------------------------
  // CREATE FAMILY
  // --------------------------------------------------

  const createFamily = async (name) => {
    setLoading(true);
    setError(null);

    try {
      const res = await familyService.createFamily(name);

      setFamily(res?.family || null);
      setMembers(res?.members || []);
      setInvitations(res?.invitations || []);

      return res;
    } catch (err) {
      setError(err.message || 'Unable to create family.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INVITE REGISTERED USER
  // --------------------------------------------------

  const inviteMember = async (email) => {
    if (!family?.id) {
      throw new Error('No active family found.');
    }

    try {
      const res = await familyService.inviteMember(
        family.id,
        email
      );

      await fetchFamily();

      return res;
    } catch (err) {
      throw err;
    }
  };

  // --------------------------------------------------
  // ACCEPT INVITATION USING INVITATION ID
  // --------------------------------------------------

  const acceptInvitation = async (invitationId) => {
    if (!invitationId) {
      throw new Error('Invitation ID is required.');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await familyService.acceptInvitation(
        invitationId
      );

      setFamily(res?.family || null);
      setMembers(res?.members || []);
      setInvitations(res?.invitations || []);

      // Remove accepted invitation from received list.
      setPendingInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );

      await fetchFamily();
      await fetchPendingInvitations();

      return res;
    } catch (err) {
      setError(err.message || 'Unable to accept invitation.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // REJECT INVITATION
  // --------------------------------------------------

  const rejectInvitation = async (invitationId) => {
    if (!invitationId) {
      throw new Error('Invitation ID is required.');
    }

    try {
      const res = await familyService.rejectInvitation(
        invitationId
      );

      setPendingInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );

      await fetchPendingInvitations();

      return res;
    } catch (err) {
      throw err;
    }
  };

  // --------------------------------------------------
  // REVOKE INVITATION
  // --------------------------------------------------

  const revokeInvitation = async (invitationId) => {
    if (!family?.id) {
      throw new Error('No active family found.');
    }

    const res = await familyService.revokeInvitation(
      family.id,
      invitationId
    );

    setInvitations((prev) =>
      prev.filter((invitation) => invitation.id !== invitationId)
    );

    return res;
  };

  // --------------------------------------------------
  // REMOVE MEMBER
  // --------------------------------------------------

  const removeMember = async (memberUid) => {
    if (!family?.id) {
      throw new Error('No active family found.');
    }

    const res = await familyService.removeMember(
      family.id,
      memberUid
    );

    setMembers((prev) =>
      prev.filter((member) => member.uid !== memberUid)
    );

    if (activeMemberUid === memberUid) {
      clearActiveMember();
    }

    return res;
  };

  // --------------------------------------------------
  // LEAVE FAMILY
  // --------------------------------------------------

  const leaveFamily = async () => {
    if (!family?.id) {
      throw new Error('No active family found.');
    }

    const res = await familyService.leaveFamily(family.id);

    setFamily(null);
    setMembers([]);
    setInvitations([]);
    clearActiveMember();

    return res;
  };

  // --------------------------------------------------
  // DISBAND FAMILY
  // --------------------------------------------------

  const disbandFamily = async () => {
    if (!family?.id) {
      throw new Error('No active family found.');
    }

    const res = await familyService.disbandFamily(family.id);

    setFamily(null);
    setMembers([]);
    setInvitations([]);
    clearActiveMember();

    return res;
  };

  // --------------------------------------------------
  // UPDATE OWN PERMISSIONS
  // --------------------------------------------------

  const updateMyPermissions = async (newPermissions) => {
    if (!family?.id || !currentUser?.uid) {
      throw new Error('No active family found.');
    }

    const updated = await familyService.updateMyPermissions(
      family.id,
      currentUser.uid,
      newPermissions
    );

    setMembers((prev) =>
      prev.map((member) =>
        member.uid === currentUser.uid
          ? { ...member, permissions: updated }
          : member
      )
    );

    return updated;
  };

  // --------------------------------------------------
  // SELECT FAMILY MEMBER HEALTH PROFILE
  // --------------------------------------------------

  const selectMemberProfile = async (memberUid) => {
    if (!memberUid || memberUid === currentUser?.uid) {
      clearActiveMember();
      return;
    }

    setActiveMemberUid(memberUid);
    setActiveMemberLoading(true);
    setActiveMemberError(null);
    setActiveMemberReadings([]);
    setActiveMemberPermissions(null);

    try {
      const res = await familyService.getMemberReadings(memberUid);

      setActiveMemberReadings(res?.readings || []);
      setActiveMemberPermissions(res?.permissions || null);
    } catch (err) {
      console.warn(
        `[FamilyContext] Could not fetch readings for ${memberUid}:`,
        err.message
      );

      setActiveMemberError(
        err.message || 'Permission not granted to view health readings.'
      );

      setActiveMemberReadings([]);
    } finally {
      setActiveMemberLoading(false);
    }
  };

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    family,
    members,
    invitations,

    // Invitations received by current user
    pendingInvitations,
    pendingInvitationsLoading,
    pendingInvitationsError,
    fetchPendingInvitations,
    acceptInvitation,
    rejectInvitation,

    isOwner,
    myPermissions,
    loading,
    error,

    activeMemberUid,
    activeMember,
    activeMemberReadings,
    activeMemberPermissions,
    activeMemberLoading,
    activeMemberError,

    fetchFamily,
    createFamily,
    inviteMember,
    revokeInvitation,
    removeMember,
    leaveFamily,
    disbandFamily,
    updateMyPermissions,
    selectMemberProfile,
    clearActiveMember,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);

  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }

  return context;
}
