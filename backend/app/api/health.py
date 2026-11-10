"""
BioTrajectory Health API Endpoints
Health check status and authorized health summary endpoints.
"""

import time
from typing import Optional
from fastapi import APIRouter, Header, Depends
from app.models.schemas import HealthStatusResponse, HealthSummaryResponse
from app.core.config import settings
from app.core.security import verify_auth_token
from app.services.health_service import HealthDataService
from app.utils.helpers import get_current_iso_timestamp

router = APIRouter(tags=["Health"])

START_TIME = time.time()


@router.get("/health", response_model=HealthStatusResponse)
async def get_health_status():
    """Returns backend system status, provider configuration, and authentication mode."""
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
async def get_health_summary(authorization: Optional[str] = Header(None)):
    """
    Returns clinical health summary based on authorized available records.
    Strictly enforces that unverified tokens or missing production configurations
    do not fabricate patient data.
    """
    is_prod_verified, auth_mode, claims = verify_auth_token(authorization)
    user_id = claims.get("uid") if claims else None

    result = HealthDataService.retrieve_authorized_health_records(
        user_id=user_id,
        is_production_authenticated=is_prod_verified
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

