
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from firebase_admin import auth, firestore

from app.core.security import initialize_firebase_admin


logger = logging.getLogger("biotrajectory.family")


DEFAULT_PERMISSIONS = {
    "viewReadings": False,
    "viewAnalytics": False,
    "viewMedicalHistory": False,
    "viewReports": False,
}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def serialize(value: Any) -> Any:
    if hasattr(value, "to_datetime"):
        return value.to_datetime().isoformat()

    if isinstance(value, datetime):
        return value.isoformat()

    return value


def serialize_profile(data: Dict[str, Any], uid: str) -> Dict[str, Any]:
    return {
        "uid": uid,
        "name": data.get("name") or data.get("fullName") or "Family member",
        "email": data.get("email"),
        "familyRole": data.get("familyRole", "MEMBER"),
        "status": data.get("status", "ACTIVE"),
        "permissions": {
            **DEFAULT_PERMISSIONS,
            **(data.get("permissions") or {}),
        },
        "joinedAt": serialize(data.get("joinedAt")),
    }


class FamilyService:

    def __init__(self):
        self._db = None

    # --------------------------------------------------
    # FIREBASE DATABASE
    # --------------------------------------------------

    def db(self):
        if not initialize_firebase_admin():
            raise HTTPException(
                status_code=503,
                detail="Firebase Admin is not configured.",
            )

        if self._db is None:
            self._db = firestore.client()

        return self._db

    # --------------------------------------------------
    # FIND ACTIVE FAMILY
    # --------------------------------------------------

    def find_family_for_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        db = self.db()

        memberships = (
            db.collection("users")
            .document(uid)
            .collection("familyMemberships")
            .stream()
        )

        for membership in memberships:
            membership_data = membership.to_dict() or {}

            if membership_data.get("status") != "ACTIVE":
                continue

            family = (
                db.collection("families")
                .document(membership.id)
                .get()
            )

            if not family.exists:
                continue

            family_data = family.to_dict() or {}

            if family_data.get("status") != "ACTIVE":
                continue

            member = (
                family.reference
                .collection("members")
                .document(uid)
                .get()
            )

            if not member.exists:
                continue

            member_data = member.to_dict() or {}

            if member_data.get("status") != "ACTIVE":
                continue

            family_data["id"] = family.id
            family_data["createdAt"] = serialize(
                family_data.get("createdAt")
            )
            family_data["updatedAt"] = serialize(
                family_data.get("updatedAt")
            )

            return family_data

        return None

    # --------------------------------------------------
    # GET USER PROFILE
    # --------------------------------------------------

    def get_profile(self, uid: str) -> Dict[str, Any]:
        db = self.db()

        profile = db.collection("users").document(uid).get()
        data = profile.to_dict() or {}

        email = data.get("email")
        name = data.get("name") or data.get("fullName")

        try:
            firebase_user = auth.get_user(uid)
            email = firebase_user.email or email
            name = name or firebase_user.display_name

        except Exception:
            logger.exception(
                "Could not retrieve Firebase profile for UID %s",
                uid,
            )

        return {
            "uid": uid,
            "name": name or "Unnamed member",
            "email": email,
        }

    # --------------------------------------------------
    # CREATE FAMILY
    # --------------------------------------------------

    def create_family(self, uid: str, name: str) -> Dict[str, Any]:
        db = self.db()

        if self.find_family_for_uid(uid):
            raise HTTPException(
                status_code=409,
                detail="You already belong to a family.",
            )

        profile = self.get_profile(uid)
        now = utc_now()

        family_ref = db.collection("families").document()

        transaction = db.transaction()

        @firestore.transactional
        def create(transaction):
            transaction.set(
                family_ref,
                {
                    "name": name,
                    "ownerUid": uid,
                    "status": "ACTIVE",
                    "createdAt": now,
                    "updatedAt": now,
                },
            )

            member_ref = (
                family_ref.collection("members").document(uid)
            )

            transaction.set(
                member_ref,
                {
                    "uid": uid,
                    "name": profile["name"],
                    "email": profile["email"],
                    "familyRole": "OWNER",
                    "status": "ACTIVE",
                    "permissions": DEFAULT_PERMISSIONS.copy(),
                    "joinedAt": now,
                },
            )

            membership_ref = (
                db.collection("users")
                .document(uid)
                .collection("familyMemberships")
                .document(family_ref.id)
            )

            transaction.set(
                membership_ref,
                {
                    "familyId": family_ref.id,
                    "familyRole": "OWNER",
                    "status": "ACTIVE",
                    "joinedAt": now,
                },
            )

        create(transaction)

        return self.get_family(uid, family_ref.id)

    # --------------------------------------------------
    # VERIFY ACTIVE MEMBERSHIP
    # --------------------------------------------------

    def require_active_membership(
        self,
        uid: str,
        family_id: str,
    ) -> Dict[str, Any]:

        db = self.db()

        family = (
            db.collection("families")
            .document(family_id)
            .get()
        )

        if not family.exists:
            raise HTTPException(
                status_code=404,
                detail="Family not found.",
            )

        family_data = family.to_dict() or {}

        if family_data.get("status") != "ACTIVE":
            raise HTTPException(
                status_code=403,
                detail="The family group is inactive or disbanded.",
            )

        member = (
            family.reference
            .collection("members")
            .document(uid)
            .get()
        )

        if not member.exists:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this family.",
            )

        data = member.to_dict() or {}

        if data.get("status") != "ACTIVE":
            raise HTTPException(
                status_code=403,
                detail="Your family membership is not active.",
            )

        return {
            **data,
            "uid": uid,
            "familyId": family_id,
        }

    # --------------------------------------------------
    # VERIFY FAMILY OWNER
    # --------------------------------------------------

    def require_owner(
        self,
        uid: str,
        family_id: str,
    ) -> Dict[str, Any]:

        member = self.require_active_membership(uid, family_id)

        if member.get("familyRole") != "OWNER":
            raise HTTPException(
                status_code=403,
                detail="Only the family owner can perform this action.",
            )

        return member

    # --------------------------------------------------
    # GET FAMILY DETAILS
    # --------------------------------------------------

    def get_family(
        self,
        uid: str,
        family_id: Optional[str] = None,
    ) -> Dict[str, Any]:

        db = self.db()

        if not family_id:
            active_family = self.find_family_for_uid(uid)
            family_id = (active_family or {}).get("id")

        if not family_id:
            return {
                "family": None,
                "members": [],
                "invitations": [],
            }

        self.require_active_membership(uid, family_id)

        family_ref = db.collection("families").document(family_id)
        family = family_ref.get()

        if not family.exists:
            return {
                "family": None,
                "members": [],
                "invitations": [],
            }

        family_data = family.to_dict() or {}

        member_docs = (
            family_ref.collection("members")
            .where("status", "==", "ACTIVE")
            .stream()
        )

        members = [
            serialize_profile(doc.to_dict() or {}, doc.id)
            for doc in member_docs
        ]

        owner = next(
            (member for member in members
             if member["familyRole"] == "OWNER"),
            None,
        )

        is_owner = bool(owner and owner["uid"] == uid)
        invitations = []

        if is_owner:
            invitation_docs = (
                db.collection("family_invitations")
                .where("familyId", "==", family_id)
                .where("status", "==", "PENDING")
                .stream()
            )

            for doc in invitation_docs:
                data = doc.to_dict() or {}

                invitations.append({
                    "id": doc.id,
                    "invitedUid": data.get("invitedUid"),
                    "email": data.get("invitedEmail"),
                    "status": data.get("status"),
                    "expiresAt": serialize(data.get("expiresAt")),
                    "createdAt": serialize(data.get("createdAt")),
                })

        return {
            "family": {
                "id": family_id,
                "name": family_data.get("name"),
                "ownerUid": family_data.get("ownerUid"),
                "owner": owner,
                "memberCount": len(members),
                "status": family_data.get("status", "ACTIVE"),
                "createdAt": serialize(family_data.get("createdAt")),
                "updatedAt": serialize(family_data.get("updatedAt")),
            },
            "members": members,
            "invitations": invitations,
        }

    # --------------------------------------------------
    # LIST FAMILY MEMBERS
    # --------------------------------------------------

    def list_members(
        self,
        uid: str,
        family_id: str,
    ) -> Dict[str, Any]:

        return self.get_family(uid, family_id)

    # --------------------------------------------------
    # CREATE IN-APP INVITATION
    # --------------------------------------------------

    def invite_member(
        self,
        uid: str,
        family_id: str,
        email: str,
    ) -> Dict[str, Any]:

        self.require_owner(uid, family_id)

        db = self.db()
        clean_email = email.strip().lower()

        if not clean_email:
            raise HTTPException(
                status_code=400,
                detail="Email address is required.",
            )

        # Find an existing Firebase Authentication account.
        try:
            invited_user = auth.get_user_by_email(clean_email)

        except auth.UserNotFoundError:
            raise HTTPException(
                status_code=404,
                detail="No BioTrajectory account exists with this email.",
            )

        except Exception:
            logger.exception("Could not look up invited Firebase user.")

            raise HTTPException(
                status_code=500,
                detail="Unable to find the invited user.",
            )

        invited_uid = invited_user.uid

        if invited_uid == uid:
            raise HTTPException(
                status_code=400,
                detail="You cannot invite yourself.",
            )

        family_ref = db.collection("families").document(family_id)

        # Prevent inviting someone who is already in this family.
        existing_member = (
            family_ref.collection("members")
            .document(invited_uid)
            .get()
        )

        if existing_member.exists:
            existing_data = existing_member.to_dict() or {}

            if existing_data.get("status") == "ACTIVE":
                raise HTTPException(
                    status_code=409,
                    detail="This user is already a member of your family.",
                )

        # A user can belong to only one active family.
        if self.find_family_for_uid(invited_uid):
            raise HTTPException(
                status_code=409,
                detail="This user already belongs to another family.",
            )

        # Prevent duplicate pending invitations.
        existing_pending = (
            db.collection("family_invitations")
            .where("familyId", "==", family_id)
            .where("invitedUid", "==", invited_uid)
            .where("status", "==", "PENDING")
            .limit(1)
            .stream()
        )

        if next(existing_pending, None):
            raise HTTPException(
                status_code=409,
                detail="A pending invitation already exists for this user.",
            )

        now = utc_now()
        expires = now + timedelta(days=7)

        invitation_ref = db.collection("family_invitations").document()

        invitation_ref.set({
            "familyId": family_id,
            "invitedBy": uid,
            "invitedUid": invited_uid,
            "invitedEmail": clean_email,
            "status": "PENDING",
            "createdAt": now,
            "expiresAt": expires,
            "acceptedAt": None,
            "rejectedAt": None,
        })

        return {
            "success": True,
            "invitation": {
                "id": invitation_ref.id,
                "invitedUid": invited_uid,
                "email": clean_email,
                "status": "PENDING",
                "expiresAt": expires.isoformat(),
                "createdAt": now.isoformat(),
            },
            "message": "In-app family invitation created successfully.",
        }

    # --------------------------------------------------
    # GET INVITATIONS FOR SIGNED-IN USER
    # --------------------------------------------------

    def get_pending_invitations(
        self,
        uid: str,
    ) -> Dict[str, Any]:

        db = self.db()
        now = utc_now()

        invitations_query = (
            db.collection("family_invitations")
            .where("invitedUid", "==", uid)
            .where("status", "==", "PENDING")
            .stream()
        )

        invitations = []

        for doc in invitations_query:
            data = doc.to_dict() or {}
            expires = data.get("expiresAt")

            if hasattr(expires, "to_datetime"):
                expires = expires.to_datetime()

            if not expires or expires <= now:
                doc.reference.update({
                    "status": "EXPIRED",
                    "updatedAt": now,
                })
                continue

            family_ref = (
                db.collection("families")
                .document(data.get("familyId", ""))
            )

            family = family_ref.get()

            if not family.exists:
                doc.reference.update({
                    "status": "EXPIRED",
                    "updatedAt": now,
                })
                continue

            family_data = family.to_dict() or {}

            if family_data.get("status") != "ACTIVE":
                continue

            inviter = self.get_profile(data.get("invitedBy", ""))

            invitations.append({
                "id": doc.id,
                "familyId": data.get("familyId"),
                "familyName": family_data.get("name"),
                "invitedBy": data.get("invitedBy"),
                "inviterName": inviter.get("name"),
                "invitedEmail": data.get("invitedEmail"),
                "status": data.get("status"),
                "createdAt": serialize(data.get("createdAt")),
                "expiresAt": serialize(expires),
            })

        return {
            "success": True,
            "invitations": invitations,
        }

    # --------------------------------------------------
    # ACCEPT IN-APP INVITATION
    # --------------------------------------------------

    def accept_invitation(
        self,
        uid: str,
        invitation_id: str,
    ) -> Dict[str, Any]:

        db = self.db()

        invitation_ref = (
            db.collection("family_invitations")
            .document(invitation_id)
        )

        invitation_snap = invitation_ref.get()

        if not invitation_snap.exists:
            raise HTTPException(
                status_code=404,
                detail="Invitation not found.",
            )

        invitation_data = invitation_snap.to_dict() or {}

        if invitation_data.get("invitedUid") != uid:
            raise HTTPException(
                status_code=403,
                detail="This invitation belongs to another account.",
            )

        if invitation_data.get("status") != "PENDING":
            raise HTTPException(
                status_code=409,
                detail="This invitation is no longer pending.",
            )

        # A user cannot join multiple active families.
        existing_family = self.find_family_for_uid(uid)

        if existing_family:
            raise HTTPException(
                status_code=409,
                detail="You already belong to another family.",
            )

        profile = self.get_profile(uid)
        family_id = invitation_data.get("familyId")

        if not family_id:
            raise HTTPException(
                status_code=400,
                detail="Invitation does not contain a family ID.",
            )

        family_ref = db.collection("families").document(family_id)
        member_ref = family_ref.collection("members").document(uid)

        membership_ref = (
            db.collection("users")
            .document(uid)
            .collection("familyMemberships")
            .document(family_id)
        )

        transaction = db.transaction()

        @firestore.transactional
        def accept(transaction):

            # All transaction reads happen before writes.
            invitation = invitation_ref.get(transaction=transaction)

            if not invitation.exists:
                raise HTTPException(
                    status_code=404,
                    detail="Invitation not found.",
                )

            data = invitation.to_dict() or {}

            if data.get("invitedUid") != uid:
                raise HTTPException(
                    status_code=403,
                    detail="This invitation belongs to another account.",
                )

            if data.get("status") != "PENDING":
                raise HTTPException(
                    status_code=409,
                    detail="This invitation is no longer pending.",
                )

            expires = data.get("expiresAt")

            if hasattr(expires, "to_datetime"):
                expires = expires.to_datetime()

            if not expires or expires <= utc_now():
                raise HTTPException(
                    status_code=410,
                    detail="This invitation has expired.",
                )

            family = family_ref.get(transaction=transaction)

            if not family.exists:
                raise HTTPException(
                    status_code=404,
                    detail="Family no longer exists.",
                )

            family_data = family.to_dict() or {}

            if family_data.get("status") != "ACTIVE":
                raise HTTPException(
                    status_code=403,
                    detail="This family is no longer active.",
                )

            existing_member = member_ref.get(transaction=transaction)

            if existing_member.exists:
                member_data = existing_member.to_dict() or {}

                if member_data.get("status") == "ACTIVE":
                    raise HTTPException(
                        status_code=409,
                        detail="You are already a family member.",
                    )

            now = utc_now()

            transaction.update(
                invitation_ref,
                {
                    "status": "ACCEPTED",
                    "acceptedAt": now,
                    "acceptedUid": uid,
                    "updatedAt": now,
                },
            )

            transaction.set(
                member_ref,
                {
                    "uid": uid,
                    "name": profile["name"],
                    "email": profile["email"],
                    "familyRole": "MEMBER",
                    "status": "ACTIVE",
                    "permissions": DEFAULT_PERMISSIONS.copy(),
                    "joinedAt": now,
                },
            )

            transaction.set(
                membership_ref,
                {
                    "familyId": family_id,
                    "familyRole": "MEMBER",
                    "status": "ACTIVE",
                    "joinedAt": now,
                },
            )

            transaction.update(
                family_ref,
                {"updatedAt": now},
            )

        accept(transaction)

        return self.get_family(uid, family_id)

    # --------------------------------------------------
    # REJECT IN-APP INVITATION
    # --------------------------------------------------

    def reject_invitation(
        self,
        uid: str,
        invitation_id: str,
    ) -> Dict[str, Any]:

        db = self.db()

        invitation_ref = (
            db.collection("family_invitations")
            .document(invitation_id)
        )

        transaction = db.transaction()

        @firestore.transactional
        def reject(transaction):

            invitation = invitation_ref.get(transaction=transaction)

            if not invitation.exists:
                raise HTTPException(
                    status_code=404,
                    detail="Invitation not found.",
                )

            data = invitation.to_dict() or {}

            if data.get("invitedUid") != uid:
                raise HTTPException(
                    status_code=403,
                    detail="This invitation belongs to another account.",
                )

            if data.get("status") != "PENDING":
                raise HTTPException(
                    status_code=409,
                    detail="This invitation is no longer pending.",
                )

            transaction.update(
                invitation_ref,
                {
                    "status": "REJECTED",
                    "rejectedAt": utc_now(),
                    "updatedAt": utc_now(),
                },
            )

        reject(transaction)

        return {
            "success": True,
            "invitationId": invitation_id,
            "status": "REJECTED",
        }

    # --------------------------------------------------
    # REVOKE INVITATION BY FAMILY OWNER
    # --------------------------------------------------

    def revoke_invitation(
        self,
        uid: str,
        family_id: str,
        invitation_id: str,
    ) -> Dict[str, Any]:

        self.require_owner(uid, family_id)

        db = self.db()

        ref = (
            db.collection("family_invitations")
            .document(invitation_id)
        )

        snap = ref.get()

        if not snap.exists:
            raise HTTPException(
                status_code=404,
                detail="Invitation not found.",
            )

        data = snap.to_dict() or {}

        if data.get("familyId") != family_id:
            raise HTTPException(
                status_code=403,
                detail="Invitation belongs to a different family.",
            )

        if data.get("status") != "PENDING":
            raise HTTPException(
                status_code=409,
                detail="Only pending invitations can be revoked.",
            )

        now = utc_now()

        ref.update({
            "status": "REVOKED",
            "revokedAt": now,
            "updatedAt": now,
        })

        return {
            "success": True,
            "invitationId": invitation_id,
            "status": "REVOKED",
        }

    # --------------------------------------------------
    # REMOVE FAMILY MEMBER
    # --------------------------------------------------

    def remove_member(
        self,
        owner_uid: str,
        family_id: str,
        member_uid: str,
    ) -> Dict[str, Any]:

        self.require_owner(owner_uid, family_id)

        if member_uid == owner_uid:
            raise HTTPException(
                status_code=400,
                detail="The owner cannot remove themselves.",
            )

        db = self.db()

        family_ref = db.collection("families").document(family_id)
        member_ref = family_ref.collection("members").document(member_uid)

        snap = member_ref.get()

        if not snap.exists:
            raise HTTPException(
                status_code=404,
                detail="Family member not found.",
            )

        member_data = snap.to_dict() or {}

        if member_data.get("status") != "ACTIVE":
            raise HTTPException(
                status_code=409,
                detail="Family member is already inactive.",
            )

        membership_ref = (
            db.collection("users")
            .document(member_uid)
            .collection("familyMemberships")
            .document(family_id)
        )

        transaction = db.transaction()

        @firestore.transactional
        def remove(transaction):
            now = utc_now()

            transaction.update(
                member_ref,
                {
                    "status": "INACTIVE",
                    "removedAt": now,
                    "updatedAt": now,
                },
            )

            transaction.update(
                membership_ref,
                {
                    "status": "INACTIVE",
                    "leftAt": now,
                },
            )

            transaction.update(
                family_ref,
                {"updatedAt": now},
            )

        remove(transaction)

        return {
            "success": True,
            "removedUid": member_uid,
        }

    # --------------------------------------------------
    # LEAVE FAMILY
    # --------------------------------------------------

    def leave_family(
        self,
        uid: str,
        family_id: str,
    ) -> Dict[str, Any]:

        member = self.require_active_membership(uid, family_id)

        if member.get("familyRole") == "OWNER":
            raise HTTPException(
                status_code=400,
                detail=(
                    "Owner cannot leave before transferring "
                    "ownership or removing the family."
                ),
            )

        db = self.db()

        family_ref = db.collection("families").document(family_id)

        member_ref = family_ref.collection("members").document(uid)

        membership_ref = (
            db.collection("users")
            .document(uid)
            .collection("familyMemberships")
            .document(family_id)
        )

        transaction = db.transaction()

        @firestore.transactional
        def leave(transaction):
            now = utc_now()

            transaction.update(
                member_ref,
                {
                    "status": "INACTIVE",
                    "leftAt": now,
                    "updatedAt": now,
                },
            )

            transaction.update(
                membership_ref,
                {
                    "status": "INACTIVE",
                    "leftAt": now,
                },
            )

            transaction.update(
                family_ref,
                {"updatedAt": now},
            )

        leave(transaction)

        return {
            "success": True,
            "familyId": family_id,
        }

    # --------------------------------------------------
    # DISBAND FAMILY
    # --------------------------------------------------

    def disband_family(
        self,
        uid: str,
        family_id: str,
    ) -> Dict[str, Any]:

        self.require_owner(uid, family_id)

        db = self.db()

        family_ref = db.collection("families").document(family_id)
        now = utc_now()

        members = list(
            family_ref.collection("members")
            .where("status", "==", "ACTIVE")
            .stream()
        )

        for member in members:
            member.reference.update({
                "status": "INACTIVE",
                "leftAt": now,
                "updatedAt": now,
            })

            membership_ref = (
                db.collection("users")
                .document(member.id)
                .collection("familyMemberships")
                .document(family_id)
            )

            membership_ref.update({
                "status": "INACTIVE",
                "leftAt": now,
            })

        invitations = (
            db.collection("family_invitations")
            .where("familyId", "==", family_id)
            .where("status", "==", "PENDING")
            .stream()
        )

        for invitation in invitations:
            invitation.reference.update({
                "status": "REVOKED",
                "revokedAt": now,
                "updatedAt": now,
            })

        family_ref.update({
            "status": "DISBANDED",
            "updatedAt": now,
        })

        return {
            "success": True,
            "familyId": family_id,
            "status": "DISBANDED",
        }

    # --------------------------------------------------
    # UPDATE HEALTH SHARING PERMISSIONS
    # --------------------------------------------------

    def update_permissions(
        self,
        uid: str,
        family_id: str,
        member_uid: str,
        permissions: Dict[str, Optional[bool]],
    ) -> Dict[str, Any]:

        if uid != member_uid:
            raise HTTPException(
                status_code=403,
                detail="Members can change only their own sharing permissions.",
            )

        self.require_active_membership(uid, family_id)

        db = self.db()

        ref = (
            db.collection("families")
            .document(family_id)
            .collection("members")
            .document(member_uid)
        )

        snap = ref.get()

        if not snap.exists:
            raise HTTPException(
                status_code=404,
                detail="Family member not found.",
            )

        current = (snap.to_dict() or {}).get("permissions") or {}

        updated = {
            **DEFAULT_PERMISSIONS,
            **current,
        }

        for key, value in permissions.items():
            if key not in DEFAULT_PERMISSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unknown permission: {key}",
                )

            if value is not None:
                if not isinstance(value, bool):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Permission {key} must be true or false.",
                    )

                updated[key] = value

        ref.update({
            "permissions": updated,
            "updatedAt": utc_now(),
        })

        return {
            "success": True,
            "permissions": updated,
        }

    # --------------------------------------------------
    # GET AUTHORIZED HEALTH READINGS
    # --------------------------------------------------

    def get_authorized_readings(
        self,
        viewer_uid: str,
        member_uid: str,
        limit_count: int = 100,
    ) -> Dict[str, Any]:

        db = self.db()

        if (
            not isinstance(limit_count, int)
            or isinstance(limit_count, bool)
            or limit_count < 1
            or limit_count > 100
        ):
            raise HTTPException(
                status_code=400,
                detail="Reading limit must be between 1 and 100.",
            )

        viewer_family = self.find_family_for_uid(viewer_uid)

        if not viewer_family:
            raise HTTPException(
                status_code=403,
                detail="No active family membership.",
            )

        family_id = viewer_family["id"]

        self.require_active_membership(viewer_uid, family_id)

        target_ref = (
            db.collection("families")
            .document(family_id)
            .collection("members")
            .document(member_uid)
        )

        target_snap = target_ref.get()

        if not target_snap.exists:
            raise HTTPException(
                status_code=403,
                detail="The requested member does not belong to your family.",
            )

        target = target_snap.to_dict() or {}

        if target.get("status") != "ACTIVE":
            raise HTTPException(
                status_code=403,
                detail="The requested family member is inactive.",
            )

        permissions = {
            **DEFAULT_PERMISSIONS,
            **(target.get("permissions") or {}),
        }

        if viewer_uid != member_uid:
            if not permissions.get("viewReadings", False):
                raise HTTPException(
                    status_code=403,
                    detail="This member has not granted reading access.",
                )

        readings_ref = (
            db.collection("patient_records")
            .document(member_uid)
            .collection("readings")
        )

        try:
            query = (
                readings_ref
                .order_by(
                    "measuredAt",
                    direction=firestore.Query.DESCENDING,
                )
                .limit(limit_count)
            )

            docs = list(query.stream())

        except Exception:
            logger.exception(
                "Could not query readings for patient UID %s",
                member_uid,
            )

            raise HTTPException(
                status_code=500,
                detail="Unable to retrieve health readings.",
            )

        readings = []

        for doc in docs:
            reading = {
                "id": doc.id,
                **(doc.to_dict() or {}),
            }

            for key in ("measuredAt", "createdAt", "updatedAt"):
                if key in reading:
                    reading[key] = serialize(reading[key])

            readings.append(reading)

        return {
            "success": True,
            "uid": member_uid,
            "readings": readings,
            "permissions": permissions,
        }


# --------------------------------------------------
# SINGLE SERVICE INSTANCE
# --------------------------------------------------

family_service = FamilyService()
