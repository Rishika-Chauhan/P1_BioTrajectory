
"""
BioTrajectory Doctor Applications and Admin Review API

Roles and verification are controlled by the trusted backend.

Collections:
- users/{uid}: general account profile
- doctor_applications/{uid}: private verification/application data
- approved_doctors/{uid}: limited public doctor profile

The approval/rejection workflow uses recoverable intermediate states
because Firebase Auth custom claims and Firestore cannot share one
atomic transaction.
"""

import logging

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from firebase_admin import auth, firestore

from app.core.config import settings

from app.core.security import (
    get_current_user,
    require_user_role,
    initialize_firebase_admin,
)


logger = logging.getLogger("biotrajectory.doctor_auth")

router = APIRouter(tags=["Doctor verification"])


# ============================================================
# REQUEST MODELS
# ============================================================

class DoctorApplicationIn(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    full_name: str = Field(min_length=3, max_length=120)
    phone: str = Field(min_length=7, max_length=25)
    registration_number: str = Field(min_length=3, max_length=80)
    issuing_council: str = Field(min_length=2, max_length=160)
    qualification: str = Field(min_length=2, max_length=160)
    specialization: str = Field(min_length=2, max_length=120)

    clinic_name: Optional[str] = Field(
        default=None,
        max_length=160,
    )


class ReviewIn(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    note: Optional[str] = Field(
        default=None,
        max_length=1000,
    )


# ============================================================
# FIREBASE HELPERS
# ============================================================

def get_firestore():
    if not initialize_firebase_admin():
        raise HTTPException(
            status_code=503,
            detail="Firebase Admin is not configured.",
        )

    return firestore.client()


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def set_user_role(uid: str, role: str):
    """
    Update Firebase custom claims without deleting other claims.
    """

    user = auth.get_user(uid)

    claims = dict(user.custom_claims or {})
    claims["role"] = role

    auth.set_custom_user_claims(uid, claims)


def sync_user_profile(
    db,
    uid: str,
    role: str,
    email: Optional[str] = None,
    name: Optional[str] = None,
):
    """
    Synchronize the general Firestore user profile.

    This function:
    - Uses the Firebase UID as the document ID.
    - Preserves existing profile fields.
    - Updates the account role.
    - Does not copy private doctor verification information.
    """

    user_ref = db.collection("users").document(uid)

    snapshot = user_ref.get()
    existing = snapshot.to_dict() or {}

    profile = {
        "uid": uid,
        "role": role,
        "updatedAt": utc_now(),
    }

    if email:
        profile["email"] = email
    elif existing.get("email"):
        profile["email"] = existing["email"]

    if name:
        profile["name"] = name
    elif existing.get("name"):
        profile["name"] = existing["name"]
    else:
        profile["name"] = "Unnamed user"

    if not existing.get("createdAt"):
        profile["createdAt"] = utc_now()

    user_ref.set(profile, merge=True)


def is_email_verification_bypass_enabled() -> bool:
    return (
        settings.ENVIRONMENT == "development"
        and settings.SKIP_DOCTOR_EMAIL_VERIFICATION
    )


def get_application_refs(db, uid):
    application_ref = (
        db.collection("doctor_applications")
        .document(uid)
    )

    public_profile_ref = (
        db.collection("approved_doctors")
        .document(uid)
    )

    return application_ref, public_profile_ref


# ============================================================
# REVIEW STATE MANAGEMENT
# ============================================================

def begin_review(
    application_ref,
    intermediate_status,
    final_status,
    admin_uid,
    note,
):
    """
    Atomically claim a pending application for review.

    APPROVING and REJECTING are recoverable states.
    A retry can continue the same operation if Firebase Auth
    or Firestore fails.
    """

    transaction = application_ref._client.transaction()

    @firestore.transactional
    def update_review_state(transaction):
        snapshot = application_ref.get(
            transaction=transaction
        )

        if not snapshot.exists:
            return "NOT_FOUND"

        data = snapshot.to_dict() or {}
        current_status = data.get("status")

        if current_status == final_status:
            return "ALREADY_FINAL"

        if current_status == intermediate_status:
            return "RESUME"

        if current_status != "PENDING":
            return "CONFLICT"

        transaction.update(
            application_ref,
            {
                "status": intermediate_status,
                "reviewed_by": admin_uid,
                "review_note": note,
                "review_started_at": utc_now(),
            },
        )

        return "STARTED"

    return update_review_state(transaction)


# ============================================================
# APPROVAL FINALIZATION
# ============================================================

def finalize_approval(
    application_ref,
    public_profile_ref,
):
    """
    Publish the limited public doctor profile and finalize approval
    atomically within Firestore.
    """

    transaction = application_ref._client.transaction()

    @firestore.transactional
    def finalize(transaction):
        snapshot = application_ref.get(
            transaction=transaction
        )

        if not snapshot.exists:
            raise RuntimeError(
                "Doctor application disappeared during approval."
            )

        application = snapshot.to_dict() or {}

        if application.get("status") not in {
            "APPROVING",
            "APPROVED",
        }:
            raise RuntimeError(
                "Application is not in an approvable state."
            )

        approved_at = (
            application.get("reviewed_at")
            or utc_now()
        )

        # Only limited public fields are published.
        # Never expose phone, email, registration number,
        # issuing council or private verification information.
        public_profile = {
            "uid": application_ref.id,
            "full_name": application.get("full_name", ""),
            "specialization": application.get(
                "specialization",
                "",
            ),
            "qualification": application.get(
                "qualification",
                "",
            ),
            "clinic_name": application.get("clinic_name"),
            "status": "APPROVED",
            "approved_at": approved_at,
        }

        transaction.set(
            public_profile_ref,
            public_profile,
        )

        transaction.update(
            application_ref,
            {
                "status": "APPROVED",
                "reviewed_at": approved_at,
            },
        )

        return public_profile

    return finalize(transaction)


# ============================================================
# REJECTION FINALIZATION
# ============================================================

def finalize_rejection(
    application_ref,
    public_profile_ref,
):
    """
    Finalize rejection and ensure no public doctor profile remains.
    """

    transaction = application_ref._client.transaction()

    @firestore.transactional
    def finalize(transaction):
        snapshot = application_ref.get(
            transaction=transaction
        )

        if not snapshot.exists:
            raise RuntimeError(
                "Doctor application disappeared during rejection."
            )

        application = snapshot.to_dict() or {}

        if application.get("status") not in {
            "REJECTING",
            "REJECTED",
        }:
            raise RuntimeError(
                "Application is not in a rejectable state."
            )

        reviewed_at = (
            application.get("reviewed_at")
            or utc_now()
        )

        transaction.delete(public_profile_ref)

        transaction.update(
            application_ref,
            {
                "status": "REJECTED",
                "reviewed_at": reviewed_at,
            },
        )

    finalize(transaction)


# ============================================================
# DOCTOR APPLICATION SUBMISSION
# ============================================================

@router.post(
    "/api/doctor/applications",
    status_code=status.HTTP_201_CREATED,
)
async def submit_doctor_application(
    payload: DoctorApplicationIn,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Submit a doctor application.

    Creates:
    - doctor_applications/{uid}
    - users/{uid}

    Updates Firebase role to DOCTOR_PENDING.
    """

    email_verified = current_user.get(
        "email_verified",
        False,
    )

    if (
        not email_verified
        and not is_email_verification_bypass_enabled()
    ):
        raise HTTPException(
            status_code=403,
            detail="Verify your email before submitting an application.",
        )

    uid = current_user["uid"]
    role = current_user.get("role", "USER")

    if role not in {"USER", "DOCTOR_PENDING"}:
        raise HTTPException(
            status_code=409,
            detail="This account cannot submit a doctor application.",
        )

    db = get_firestore()

    application_ref, _ = get_application_refs(
        db,
        uid,
    )

    existing = application_ref.get()

    if existing.exists:
        existing_data = existing.to_dict() or {}

        if existing_data.get("status") in {
            "PENDING",
            "APPROVING",
            "APPROVED",
            "REJECTING",
        }:
            raise HTTPException(
                status_code=409,
                detail="An active doctor application already exists.",
            )

    application = payload.model_dump()

    application.update({
        "uid": uid,
        "email": current_user.get("email"),
        "status": "PENDING",
        "submitted_at": utc_now(),
        "reviewed_at": None,
        "reviewed_by": None,
        "review_note": None,
    })

    application_ref.set(application)

    try:
        # Update Firebase Authentication role.
        set_user_role(uid, "DOCTOR_PENDING")

        # Synchronize the general user profile.
        sync_user_profile(
            db=db,
            uid=uid,
            role="DOCTOR_PENDING",
            email=current_user.get("email"),
            name=payload.full_name,
        )

    except Exception:
        logger.exception(
            "Doctor application account synchronization failed for %s",
            uid,
        )

        # Attempt to restore the original USER role.
        try:
            set_user_role(uid, "USER")

            sync_user_profile(
                db=db,
                uid=uid,
                role="USER",
                email=current_user.get("email"),
            )

        except Exception:
            logger.exception(
                "Could not restore account role for %s",
                uid,
            )

        # Remove the application because submission did not
        # complete successfully.
        application_ref.delete()

        raise HTTPException(
            status_code=503,
            detail=(
                "Could not synchronize account status. "
                "Please retry."
            ),
        )

    return {
        "success": True,
        "status": "PENDING",
        "uid": uid,
        "message": "Application submitted for manual review.",
    }


# ============================================================
# GET CURRENT DOCTOR APPLICATION
# ============================================================

@router.get("/api/doctor/application")
async def get_own_doctor_application(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Return only the authenticated doctor's own application.
    """

    application_ref = (
        get_firestore()
        .collection("doctor_applications")
        .document(current_user["uid"])
    )

    snapshot = application_ref.get()

    if not snapshot.exists:
        raise HTTPException(
            status_code=404,
            detail="No doctor application was found.",
        )

    return snapshot.to_dict()


# ============================================================
# ADMIN: LIST DOCTOR APPLICATIONS
# ============================================================

@router.get("/api/admin/doctor-applications")
async def list_doctor_applications(
    status_filter: Optional[str] = None,
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Return doctor applications for administrator verification.

    This endpoint is separate from the general user directory.
    """

    query = get_firestore().collection(
        "doctor_applications"
    )

    if status_filter:
        normalized = status_filter.strip().upper()

        allowed_statuses = {
            "PENDING",
            "APPROVING",
            "APPROVED",
            "REJECTING",
            "REJECTED",
        }

        if normalized not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid application status filter.",
            )

        query = query.where(
            "status",
            "==",
            normalized,
        )

    applications = []

    for document in query.stream():
        data = document.to_dict() or {}
        data["uid"] = document.id
        applications.append(data)

    return {
        "success": True,
        "applications": applications,
    }


# ============================================================
# ADMIN: APPROVE DOCTOR APPLICATION
# ============================================================

@router.post(
    "/api/admin/doctor-applications/{uid}/approve"
)
async def approve_doctor_application(
    uid: str,
    payload: ReviewIn,
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Approve a doctor application.

    Synchronizes:
    1. Firebase Authentication custom claim.
    2. Firestore users/{uid}.
    3. Firestore approved_doctors/{uid}.
    4. Firestore doctor_applications/{uid}.
    """

    db = get_firestore()

    application_ref, public_profile_ref = (
        get_application_refs(db, uid)
    )

    state = begin_review(
        application_ref=application_ref,
        intermediate_status="APPROVING",
        final_status="APPROVED",
        admin_uid=admin["uid"],
        note=payload.note,
    )

    if state == "NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    if state == "CONFLICT":
        raise HTTPException(
            status_code=409,
            detail="This application is not pending approval.",
        )

    try:
        application_snapshot = application_ref.get()

        if not application_snapshot.exists:
            raise RuntimeError(
                "Doctor application could not be retrieved."
            )

        application_data = (
            application_snapshot.to_dict() or {}
        )

        # Update Firebase Authentication role.
        set_user_role(uid, "DOCTOR")

        # Synchronize the general user directory.
        sync_user_profile(
            db=db,
            uid=uid,
            role="DOCTOR",
            email=application_data.get("email"),
            name=application_data.get("full_name"),
        )

        # Publish limited public profile and finalize application.
        profile = finalize_approval(
            application_ref,
            public_profile_ref,
        )

    except Exception:
        logger.exception(
            "Doctor approval recovery required for UID %s",
            uid,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Approval is not fully completed. "
                "The application is saved for recovery. "
                "Retry the approval action."
            ),
        )

    return {
        "success": True,
        "status": "APPROVED",
        "uid": uid,
        "public_profile_created": True,
        "user_profile_synchronized": True,
    }


# ============================================================
# ADMIN: REJECT DOCTOR APPLICATION
# ============================================================

@router.post(
    "/api/admin/doctor-applications/{uid}/reject"
)
async def reject_doctor_application(
    uid: str,
    payload: ReviewIn,
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Reject a doctor application.

    Restores the account to USER and removes any public
    approved doctor profile.
    """

    db = get_firestore()

    application_ref, public_profile_ref = (
        get_application_refs(db, uid)
    )

    state = begin_review(
        application_ref=application_ref,
        intermediate_status="REJECTING",
        final_status="REJECTED",
        admin_uid=admin["uid"],
        note=payload.note,
    )

    if state == "NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    if state == "CONFLICT":
        raise HTTPException(
            status_code=409,
            detail="This application is not pending rejection.",
        )

    try:
        application_snapshot = application_ref.get()

        if not application_snapshot.exists:
            raise RuntimeError(
                "Doctor application could not be retrieved."
            )

        application_data = (
            application_snapshot.to_dict() or {}
        )

        # Restore Firebase Authentication role.
        set_user_role(uid, "USER")

        # Synchronize the general user directory.
        sync_user_profile(
            db=db,
            uid=uid,
            role="USER",
            email=application_data.get("email"),
            name=application_data.get("full_name"),
        )

        # Remove public profile and finalize rejection.
        finalize_rejection(
            application_ref,
            public_profile_ref,
        )

    except Exception:
        logger.exception(
            "Doctor rejection recovery required for UID %s",
            uid,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Rejection is not fully completed. "
                "The application is saved for recovery. "
                "Retry the rejection action."
            ),
        )

    return {
        "success": True,
        "status": "REJECTED",
        "uid": uid,
        "user_profile_synchronized": True,
    }
