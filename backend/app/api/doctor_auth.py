
"""
Doctor applications and admin review endpoints.

Roles and verification are controlled by the trusted backend.

Collections:
- doctor_applications/{uid}: private verification/application data
- approved_doctors/{uid}: limited public doctor profile

The approval/rejection workflow uses recoverable intermediate states
because Firebase Auth custom claims and Firestore cannot share one
atomic transaction.
"""

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

router = APIRouter(tags=["Doctor verification"])


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
    """Update Firebase custom claims without deleting other claims."""

    user = auth.get_user(uid)

    claims = dict(user.custom_claims or {})
    claims["role"] = role

    auth.set_custom_user_claims(uid, claims)


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


def begin_review(
    application_ref,
    intermediate_status,
    final_status,
    admin_uid,
    note,
):
    """
    Atomically claim a pending application for review.

    APPROVING and REJECTING are recoverable states. A retry can
    continue the same operation if Firebase Auth or Firestore fails.
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


def finalize_approval(
    application_ref,
    public_profile_ref,
):
    """Publish the public profile and finalize approval atomically."""

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

        # Deliberately limited public fields.
        # Never expose registration number, phone, email,
        # issuing council or private verification information.
        public_profile = {
            "uid": application_ref.id,
            "full_name": application.get("full_name", ""),
            "specialization": application.get(
                "specialization", ""
            ),
            "qualification": application.get(
                "qualification", ""
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


def finalize_rejection(
    application_ref,
    public_profile_ref,
):
    """Finalize rejection and ensure no public profile remains."""

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


@router.post(
    "/api/doctor/applications",
    status_code=status.HTTP_201_CREATED,
)
async def submit_doctor_application(
    payload: DoctorApplicationIn,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
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
        set_user_role(uid, "DOCTOR_PENDING")

    except Exception:
        application_ref.delete()

        raise HTTPException(
            status_code=503,
            detail="Could not update account status. Please retry.",
        )

    return {
        "status": "PENDING",
        "message": "Application submitted for manual review.",
    }


@router.get("/api/doctor/application")
async def get_own_doctor_application(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
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


@router.get("/api/admin/doctor-applications")
async def list_doctor_applications(
    status_filter: Optional[str] = None,
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
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
        "applications": applications,
    }


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
        # Safe to repeat: this sets the same trusted role.
        set_user_role(uid, "DOCTOR")

        profile = finalize_approval(
            application_ref,
            public_profile_ref,
        )

    except Exception as error:
        print(
            f"[DoctorApproval] Recovery required for {uid}: {error}"
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
        "status": "APPROVED",
        "uid": uid,
        "public_profile_created": True,
    }


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
        set_user_role(uid, "USER")

        finalize_rejection(
            application_ref,
            public_profile_ref,
        )

    except Exception as error:
        print(
            f"[DoctorRejection] Recovery required for {uid}: {error}"
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
        "status": "REJECTED",
        "uid": uid,
    }
