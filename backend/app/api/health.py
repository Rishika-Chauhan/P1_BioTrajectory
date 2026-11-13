
"""
BioTrajectory Health API Endpoints
Health check status and authorized health summary endpoints.
"""

import time
from typing import Any, Dict

from fastapi import APIRouter, Depends

from app.models.schemas import HealthStatusResponse, HealthSummaryResponse
from app.core.config import settings
from app.core.security import get_current_user
from app.services.health_service import HealthDataService
from app.utils.helpers import get_current_iso_timestamp

router = APIRouter(tags=["Health"])

START_TIME = time.time()


@router.get("/health", response_model=HealthStatusResponse)
async def get_health_status():
    """
    Public backend health check.
    Does not expose patient information.
    """
    uptime = round(time.time() - START_TIME, 2)

    return HealthStatusResponse(
        status="ok",
        gemini_configured=settings.is_groq_configured,
        model=settings.GROQ_MODEL,
        auth_mode="production" if settings.is_production_firebase_configured else "development_mock",
        personal_records_enabled=HealthDataService.is_production_ready(),
        timestamp=get_current_iso_timestamp(),
        uptime_seconds=uptime
    )


@router.get("/api/health/summary", response_model=HealthSummaryResponse)
async def get_health_summary(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Return health records belonging only to the authenticated user.
    Firebase authentication is mandatory.
    """

    result = HealthDataService.retrieve_authorized_health_records(
        user_id=current_user["uid"],
        is_production_authenticated=True
    )

    return HealthSummaryResponse(
        available=result["available"],
        status=result["status"],
        reason=result.get("reason"),
        data=result.get("data"),
        disclaimer=(
            "BioTrajectory health summaries are educational and generated strictly from verified records. "
            "They do not replace formal clinical assessment or laboratory diagnostics."
        )
    )
