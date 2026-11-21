
"""
BioTrajectory Admin API

Only verified ADMIN accounts can access these endpoints.

Provides:
- Admin dashboard statistics
- Account-level user directory
- Privacy-protected population medical aggregates

Individual patient medical records and readings are never
returned by the population analytics endpoint.
"""

import logging
import calendar
import math
import os

from datetime import datetime, timezone, timedelta
from statistics import mean
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth, firestore

from app.core.security import (
    initialize_firebase_admin,
    require_user_role,
)


logger = logging.getLogger("biotrajectory.admin")

# IMPORTANT: Define router before using @router.get decorators.
router = APIRouter(
    prefix="/api/admin",
    tags=["Admin dashboard"],
)


# ============================================================
# PRIVACY CONFIGURATION
# ============================================================

APP_ENV = os.getenv("APP_ENV", "production").strip().lower()

ALLOW_LOW_COHORT_AGGREGATES = (
    os.getenv("ALLOW_LOW_COHORT_AGGREGATES", "false")
    .strip()
    .lower()
    == "true"
)

# Default minimum: 50 distinct patients.
# Lower threshold is allowed only in explicitly configured development.
if APP_ENV == "development" and ALLOW_LOW_COHORT_AGGREGATES:
    MINIMUM_COHORT_SIZE = 1
else:
    MINIMUM_COHORT_SIZE = 50

AGGREGATE_PERIODS = {
    "7d": 7,
    "30d": 30,
    "6m": 183,
    "1y": 365,
}

SUPPORTED_ROLES = {
    "USER",
    "DOCTOR_PENDING",
    "DOCTOR",
    "DOCTOR_SUSPENDED",
    "ADMIN",
}


# ============================================================
# FIRESTORE AND DATE HELPERS
# ============================================================

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


def get_document_data(collection, uid):
    snapshot = collection.document(uid).get()

    if not snapshot.exists:
        return {}

    return snapshot.to_dict() or {}


# ============================================================
# DASHBOARD HELPERS
# ============================================================

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

        created_at = normalize_datetime(
            profile.get("createdAt")
        )

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


# ============================================================
# ADMIN DASHBOARD STATISTICS
# GET /api/admin/dashboard/stats
# ============================================================

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
            db,
            "approved_doctors",
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


# ============================================================
# ADMIN USER DIRECTORY
# GET /api/admin/users
# ============================================================

@router.get("/users")
async def get_admin_users(
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Return account-level information only.

    Sources:
    - users
    - approved_doctors
    - doctor_applications

    Firebase Authentication is authoritative for email,
    disabled status, and custom role claims.

    No medical information or private doctor application
    documents are returned.
    """

    try:
        db = get_firestore()

        users_by_uid = {}

        # ----------------------------------------------------
        # 1. Read basic user profiles.
        # ----------------------------------------------------

        for document in db.collection("users").stream():
            profile = document.to_dict() or {}
            uid = document.id

            users_by_uid[uid] = {
                "uid": uid,
                "name": (
                    profile.get("name")
                    or profile.get("fullName")
                    or "Unnamed user"
                ),
                "createdAt": serialize_profile_date(
                    profile.get("createdAt")
                ),
            }

        # ----------------------------------------------------
        # 2. Include approved doctors who may not yet have
        #    a corresponding users document.
        # ----------------------------------------------------

        for document in db.collection("approved_doctors").stream():
            doctor = document.to_dict() or {}
            uid = document.id

            existing = users_by_uid.setdefault(
                uid,
                {
                    "uid": uid,
                    "name": "Unnamed user",
                    "createdAt": None,
                },
            )

            existing["name"] = (
                doctor.get("name")
                or doctor.get("full_name")
                or existing["name"]
            )

            if not existing.get("createdAt"):
                existing["createdAt"] = serialize_profile_date(
                    doctor.get("createdAt")
                    or doctor.get("created_at")
                )

        # ----------------------------------------------------
        # 3. Include applicants who may not yet have a
        #    corresponding users document.
        #    Only safe account-level fields are read into
        #    the response. Private application fields are
        #    never returned.
        # ----------------------------------------------------

        for document in db.collection("doctor_applications").stream():
            application = document.to_dict() or {}
            uid = document.id

            existing = users_by_uid.setdefault(
                uid,
                {
                    "uid": uid,
                    "name": "Unnamed user",
                    "createdAt": None,
                },
            )

            existing["name"] = (
                application.get("full_name")
                or application.get("name")
                or existing["name"]
            )

            if not existing.get("createdAt"):
                existing["createdAt"] = serialize_profile_date(
                    application.get("createdAt")
                    or application.get("created_at")
                    or application.get("submittedAt")
                )

        # ----------------------------------------------------
        # 4. Resolve authoritative Firebase Authentication
        #    information for each UID.
        # ----------------------------------------------------

        users = []

        for uid, profile in users_by_uid.items():
            try:
                firebase_user = auth.get_user(uid)

            except auth.UserNotFoundError:
                users.append({
                    "uid": uid,
                    "name": profile.get("name") or "Unnamed user",
                    "email": None,
                    "role": "UNKNOWN",
                    "status": "UNKNOWN",
                    "createdAt": profile.get("createdAt"),
                })
                continue

            claims = firebase_user.custom_claims or {}

            role = str(
                claims.get("role", "USER")
            ).strip().upper()

            if role not in SUPPORTED_ROLES:
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
                "createdAt": profile.get("createdAt"),
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


# ============================================================
# MEDICAL ANALYTICS VALIDATION HELPERS
# ============================================================

def valid_measurement(value, minimum, maximum):
    """
    Reject missing values, text, booleans, NaN, infinity,
    and values outside the accepted aggregation range.
    """

    if isinstance(value, bool):
        return None

    try:
        number = float(value)

    except (TypeError, ValueError):
        return None

    if not math.isfinite(number):
        return None

    if number < minimum or number > maximum:
        return None

    return number


def empty_metric(reason="Insufficient anonymized cohort size."):
    return {
        "available": False,
        "average": None,
        "unit": None,
        "patientCount": None,
        "reason": reason,
    }


def aggregate_patient_values(patient_values, unit):
    """
    Each patient contributes one average, regardless of how
    many readings that patient has submitted.

    Suppress the result below the configured cohort threshold.
    """

    if len(patient_values) < MINIMUM_COHORT_SIZE:
        return empty_metric()

    return {
        "available": True,
        "average": round(
            mean(patient_values.values()),
            2,
        ),
        "unit": unit,
        "patientCount": len(patient_values),
        "reason": None,
    }


def get_bucket_key(measured_at, period):
    if period in ("7d", "30d"):
        monday = measured_at.date() - timedelta(
            days=measured_at.weekday()
        )

        return monday.isoformat()

    return measured_at.strftime("%Y-%m")


def build_metric_trend(patient_bucket_values, unit):
    result = []

    for bucket in sorted(patient_bucket_values):
        patient_averages = {
            patient_id: mean(values)
            for patient_id, values
            in patient_bucket_values[bucket].items()
            if values
        }

        if len(patient_averages) < MINIMUM_COHORT_SIZE:
            continue

        result.append({
            "period": bucket,
            "average": round(
                mean(patient_averages.values()),
                2,
            ),
            "unit": unit,
            "patientCount": len(patient_averages),
        })

    return result


def is_fasting_glucose(values):
    """
    Accepted fasting glucose indicators:
    - fastingGlucose field
    - glucose field with isFasting=True
    - glucose field with measurementContext='fasting'
    """

    if values.get("fastingGlucose") is not None:
        return True

    if values.get("isFasting") is True:
        return True

    context = str(
        values.get("measurementContext", "")
    ).strip().lower()

    return context == "fasting"


# ============================================================
# POPULATION MEDICAL RECORD ANALYTICS
# GET /api/admin/medical-records/aggregate
# ============================================================

@router.get("/medical-records/aggregate")
async def get_population_medical_aggregates(
    period: str = "30d",
    admin: Dict[str, Any] = Depends(
        require_user_role("ADMIN")
    ),
):
    """
    Return aggregate population-level medical statistics.

    Supported periods:
    - 7d
    - 30d
    - 6m
    - 1y

    Privacy:
    - Requires ADMIN authentication.
    - Reads patient measurements only on the trusted backend.
    - Does not return patient IDs.
    - Does not return individual readings.
    - Suppresses metrics below the configured cohort threshold.
    - Does not use demo or mock data.

    Clinical limitations:
    - Glucose averages include fasting measurements only.
    - Diabetes prevalence requires reliable diagnosis data.
    - Predictions require a validated prediction model.
    """

    if period not in AGGREGATE_PERIODS:
        raise HTTPException(
            status_code=400,
            detail="Period must be one of: 7d, 30d, 6m, 1y.",
        )

    try:
        db = get_firestore()

        now = datetime.now(timezone.utc)

        start_date = now - timedelta(
            days=AGGREGATE_PERIODS[period]
        )

        # Internal patient-level aggregation.
        # Patient IDs are never returned to the frontend.

        patient_metrics = {
            "systolic": {},
            "diastolic": {},
            "glucose": {},
            "hba1c": {},
        }

        trend_data = {
            metric: {}
            for metric in patient_metrics
        }

        # Expected structure:
        # patient_records/{patientUid}/readings/{readingId}

        patient_documents = db.collection(
            "patient_records"
        ).stream()

        for patient_document in patient_documents:
            patient_uid = patient_document.id

            readings = (
                patient_document.reference
                .collection("readings")
                .stream()
            )

            for reading_document in readings:
                reading = reading_document.to_dict() or {}

                measured_at = normalize_datetime(
                    reading.get("measuredAt")
                )

                if measured_at is None:
                    continue

                if measured_at < start_date or measured_at > now:
                    continue

                source = reading.get("source")

                if source not in ("manual", "imported"):
                    continue

                record_type = reading.get("type")
                values = reading.get("values") or {}

                if not isinstance(values, dict):
                    continue

                extracted = {}

                # --------------------------------------------
                # BLOOD PRESSURE
                # Both systolic and diastolic must be valid.
                # --------------------------------------------

                if record_type == "blood_pressure":
                    systolic = valid_measurement(
                        values.get("systolic"),
                        60,
                        260,
                    )

                    diastolic = valid_measurement(
                        values.get("diastolic"),
                        30,
                        150,
                    )

                    if (
                        systolic is not None
                        and diastolic is not None
                    ):
                        extracted["systolic"] = systolic
                        extracted["diastolic"] = diastolic

                # --------------------------------------------
                # BLOOD TEST
                # --------------------------------------------

                elif record_type == "blood_test":
                    if is_fasting_glucose(values):
                        glucose_value = (
                            values.get("fastingGlucose")
                            if values.get("fastingGlucose") is not None
                            else values.get("glucose")
                        )

                        glucose = valid_measurement(
                            glucose_value,
                            20,
                            800,
                        )

                        if glucose is not None:
                            extracted["glucose"] = glucose

                    hba1c = valid_measurement(
                        values.get("hba1c"),
                        3,
                        20,
                    )

                    if hba1c is not None:
                        extracted["hba1c"] = hba1c

                if not extracted:
                    continue

                bucket = get_bucket_key(
                    measured_at,
                    period,
                )

                for metric, value in extracted.items():
                    patient_metrics[metric].setdefault(
                        patient_uid,
                        [],
                    ).append(value)

                    trend_data[metric].setdefault(
                        bucket,
                        {},
                    ).setdefault(
                        patient_uid,
                        [],
                    ).append(value)

        # --------------------------------------------
        # CALCULATE ONE AVERAGE PER PATIENT
        # --------------------------------------------

        patient_averages = {
            metric: {
                patient_uid: mean(readings)
                for patient_uid, readings
                in patient_metrics[metric].items()
                if readings
            }
            for metric in patient_metrics
        }

        # --------------------------------------------
        # POPULATION METRICS
        # --------------------------------------------

        metrics = {
            "averageSystolic": aggregate_patient_values(
                patient_averages["systolic"],
                "mmHg",
            ),
            "averageDiastolic": aggregate_patient_values(
                patient_averages["diastolic"],
                "mmHg",
            ),
            "averageGlucose": aggregate_patient_values(
                patient_averages["glucose"],
                "mg/dL",
            ),
            "averageHbA1c": aggregate_patient_values(
                patient_averages["hba1c"],
                "%",
            ),
        }

        # --------------------------------------------
        # POPULATION TRENDS
        # --------------------------------------------

        trends = {
            "systolic": build_metric_trend(
                trend_data["systolic"],
                "mmHg",
            ),
            "diastolic": build_metric_trend(
                trend_data["diastolic"],
                "mmHg",
            ),
            "glucose": build_metric_trend(
                trend_data["glucose"],
                "mg/dL",
            ),
            "hba1c": build_metric_trend(
                trend_data["hba1c"],
                "%",
            ),
        }

        # --------------------------------------------
        # RESPONSE
        # --------------------------------------------

        return {
            "success": True,
            "period": period,
            "generatedAt": now.isoformat(),
            "privacy": {
                "minimumDistinctPatients": MINIMUM_COHORT_SIZE,
                "individualRecordsReturned": False,
                "environment": APP_ENV,
            },
            "metrics": metrics,
            "trends": trends,
            "diabetesPrevalence": {
                "available": False,
                "percentage": None,
                "reason": (
                    "Reliable population-level diagnosis data "
                    "is not yet available. Individual glucose "
                    "measurements alone cannot establish "
                    "diabetes prevalence."
                ),
            },
            "predictions": {
                "available": False,
                "reason": (
                    "No validated population prediction model "
                    "is currently connected to this endpoint."
                ),
            },
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to calculate population medical aggregates."
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Population medical analytics are temporarily "
                "unavailable."
            ),
        )
