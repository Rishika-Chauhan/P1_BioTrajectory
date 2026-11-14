
"""
Doctor applications and admin review endpoints.

Doctor roles and application statuses are controlled by the backend.
The frontend must never assign roles or approve applications.
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
        max_length=160
    )


class ReviewIn(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    note: Optional[str] = Field(
        default=None,
        max_length=1000
    )


def get_firestore():
    """Return Firestore client after Firebase Admin initialization."""

    if not initialize_firebase_admin():
        raise HTTPException(
            status_code=503,
            detail="Firebase Admin is not configured.",
        )

    return firestore.client()


def set_user_role(uid: str, role: str):
    """Set trusted Firebase custom claims while preserving other claims."""

    user = auth.get_user(uid)

    claims = dict(user.custom_claims or {})
    claims["role"] = role

    auth.set_custom_user_claims(uid, claims)


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def is_email_verification_bypass_enabled() -> bool:
    """
    Allow skipping email verification only when both conditions are true:
    1. Backend environment is explicitly development.
    2. SKIP_DOCTOR_EMAIL_VERIFICATION is explicitly enabled.
    """

    return (
        settings.ENVIRONMENT == "development"
        and settings.SKIP_DOCTOR_EMAIL_VERIFICATION
    )


@router.post(
    "/api/doctor/applications",
    status_code=status.HTTP_201_CREATED,
)
async def submit_doctor_application(
    payload: DoctorApplicationIn,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Submit a doctor application for manual admin review."""

    email_verified = current_user.get("email_verified", False)

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

    application_ref = (
        db.collection("doctor_applications")
        .document(uid)
    )

    existing = application_ref.get()

    if existing.exists:
        existing_data = existing.to_dict() or {}

        if existing_data.get("status") in {
            "PENDING",
            "APPROVED"
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
    """Return only the authenticated doctor's own application."""

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
    """List applications. Only ADMIN accounts can access this endpoint."""

    query = get_firestore().collection("doctor_applications")

    if status_filter:
        normalized = status_filter.strip().upper()

        allowed_statuses = {
            "PENDING",
            "APPROVED",
            "REJECTED",
            "SUSPENDED",
        }

        if normalized not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid application status filter.",
            )

        query = query.where(
            "status",
            "==",
            normalized
        )

    applications = []

    for document in query.stream():
        data = document.to_dict() or {}
        data["uid"] = document.id
        applications.append(data)

    return {
        "applications": applications
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
    """Approve a pending application and assign the DOCTOR role."""

    db = get_firestore()

    application_ref = (
        db.collection("doctor_applications")
        .document(uid)
    )

    snapshot = application_ref.get()

    if not snapshot.exists:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    application = snapshot.to_dict() or {}

    if application.get("status") != "PENDING":
        raise HTTPException(
            status_code=409,
            detail="Only pending applications can be approved.",
        )

    try:
        set_user_role(uid, "DOCTOR")

        application_ref.update({
            "status": "APPROVED",
            "reviewed_at": utc_now(),
            "reviewed_by": admin["uid"],
            "review_note": payload.note,
        })

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Approval could not be completed. Please retry.",
        )

    return {
        "status": "APPROVED",
        "uid": uid,
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
    """Reject a pending application and restore the normal USER role."""

    db = get_firestore()

    application_ref = (
        db.collection("doctor_applications")
        .document(uid)
    )

    snapshot = application_ref.get()

    if not snapshot.exists:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    application = snapshot.to_dict() or {}

    if application.get("status") != "PENDING":
        raise HTTPException(
            status_code=409,
            detail="Only pending applications can be rejected.",
        )

    try:
        set_user_role(uid, "USER")

        application_ref.update({
            "status": "REJECTED",
            "reviewed_at": utc_now(),
            "reviewed_by": admin["uid"],
            "review_note": payload.note,
        })

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Rejection could not be completed. Please retry.",
        )

    return {
        "status": "REJECTED",
        "uid": uid,
    }
