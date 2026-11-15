
"""
BioTrajectory Admin API

Only verified ADMIN accounts can access these endpoints.
Only account-level information and aggregate statistics are returned.
No individual patient health records or private measurements are exposed.
"""

import logging
import calendar

from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth, firestore

from app.core.security import (
    initialize_firebase_admin,
    require_user_role,
)

logger = logging.getLogger("biotrajectory.admin")

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin dashboard"],
)


def get_firestore():
    if not initialize_firebase_admin():
        raise HTTPException(
            status_code=503,
            detail="Firebase Admin is not configured.",
        )

    return firestore.client()


def count_collection(db, collection_name: str) -> int:
    return sum(
        1 for _ in db.collection(collection_name).stream()
    )


def normalize_datetime(value):
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

    if isinstance(value, str):
        try:
            parsed = datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )
            if parsed.tzinfo is None:
                return parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc)
        except ValueError:
            return None

    return None


def serialize_profile_date(value):
    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, str):
        return value

    return None


def get_registration_history(db, months: int = 6):
    now = datetime.now(timezone.utc)
    month_keys = []

    for offset in range(months - 1, -1, -1):
        year = now.year
        month = now.month - offset

        while month <= 0:
            month += 12
            year -= 1

        month_keys.append((year, month))

    counts = {key: 0 for key in month_keys}
    timestamp_count = 0

    for document in db.collection("users").stream():
        profile = document.to_dict() or {}
        created_at = normalize_datetime(profile.get("createdAt"))

        if created_at is None:
            continue

        timestamp_count += 1
        key = (created_at.year, created_at.month)

        if key in counts:
            counts[key] += 1

    history = [
        {
            "month": calendar.month_abbr[month],
            "year": year,
            "newUsers": counts[(year, month)],
        }
        for year, month in month_keys
    ]

    return {
        "available": timestamp_count > 0,
        "source": "users.createdAt",
        "history": history,
    }


def get_appointment_statistics(db):
    statuses = {
        "PENDING": 0,
        "ACCEPTED": 0,
        "REJECTED": 0,
        "COMPLETED": 0,
    }

    total = 0

    for document in db.collection("appointments").stream():
        appointment = document.to_dict() or {}
        status = str(
            appointment.get("status", "")
        ).strip().upper()

        total += 1

        if status in statuses:
            statuses[status] += 1

    return {
        "total": total,
        "byStatus": statuses,
    }


@router.get("/dashboard/stats")
async def get_admin_dashboard_stats(
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    try:
        db = get_firestore()

        total_users = count_collection(db, "users")
        approved_doctors = count_collection(
            db, "approved_doctors"
        )

        applications = db.collection(
            "doctor_applications"
        ).stream()

        application_counts = {
            "PENDING": 0,
            "APPROVING": 0,
            "APPROVED": 0,
            "REJECTING": 0,
            "REJECTED": 0,
        }

        for document in applications:
            application = document.to_dict() or {}
            status = str(
                application.get("status", "")
            ).strip().upper()

            if status in application_counts:
                application_counts[status] += 1

        appointment_stats = get_appointment_statistics(db)
        registration_history = get_registration_history(db)

        return {
            "success": True,
            "generatedAt": datetime.now(
                timezone.utc
            ).isoformat(),
            "users": {
                "totalProfiles": total_users,
                "registrationHistory": registration_history,
            },
            "doctors": {
                "approved": approved_doctors,
                "applications": application_counts,
            },
            "appointments": appointment_stats,
            "system": {
                "uptime": None,
                "uptimeStatus": "NOT_MONITORED",
            },
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to generate admin dashboard statistics."
        )
        raise HTTPException(
            status_code=503,
            detail=(
                "Admin dashboard statistics are temporarily unavailable."
            ),
        )


@router.get("/users")
async def get_admin_users(
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Return account-level profiles only.

    Profile details come from Firestore.
    Email, disabled status and roles come from Firebase Authentication.
    No patient health information is returned.
    """

    try:
        db = get_firestore()
        users = []

        supported_roles = {
            "USER",
            "DOCTOR_PENDING",
            "DOCTOR",
            "DOCTOR_SUSPENDED",
            "ADMIN",
        }

        for document in db.collection("users").stream():
            profile = document.to_dict() or {}
            uid = document.id

            try:
                firebase_user = auth.get_user(uid)

            except auth.UserNotFoundError:
                users.append({
                    "uid": uid,
                    "name": profile.get("name") or "Unnamed user",
                    "email": None,
                    "role": "UNKNOWN",
                    "status": "UNKNOWN",
                    "createdAt": serialize_profile_date(
                        profile.get("createdAt")
                    ),
                })
                continue

            claims = firebase_user.custom_claims or {}
            role = str(
                claims.get("role", "USER")
            ).strip().upper()

            if role not in supported_roles:
                role = "UNKNOWN"

            users.append({
                "uid": uid,
                "name": (
                    profile.get("name")
                    or firebase_user.display_name
                    or "Unnamed user"
                ),
                "email": firebase_user.email,
                "role": role,
                "status": (
                    "SUSPENDED"
                    if firebase_user.disabled
                    else "ACTIVE"
                ),
                "createdAt": serialize_profile_date(
                    profile.get("createdAt")
                ),
            })

        users.sort(
            key=lambda user: user.get("createdAt") or "",
            reverse=True,
        )

        return {
            "success": True,
            "total": len(users),
            "users": users,
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to retrieve admin user profiles."
        )
        raise HTTPException(
            status_code=503,
            detail="User profiles are temporarily unavailable.",
        )
