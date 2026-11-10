"""
BioTrajectory History API Endpoints
Retrieves authorized conversation history partitioned by user.
"""

from typing import Optional
from fastapi import APIRouter, Query, Header, HTTPException, status
from app.models.schemas import HistoryResponse
from app.services.conversation_service import conversation_service
from app.core.security import verify_auth_token

router = APIRouter(prefix="/api", tags=["History"])


@router.get("/history", response_model=HistoryResponse)
async def get_conversation_history(
    conversation_id: str = Query(..., description="ID of the conversation to retrieve"),
    authorization: Optional[str] = Header(None)
):
    """
    Retrieve conversation turns for a given conversation_id.
    Prevents cross-user history leakage.
    """
    is_prod_verified, auth_mode, claims = verify_auth_token(authorization)
    user_id = claims.get("uid") if claims else None

    messages = conversation_service.get_history(conversation_id, user_id=user_id)
    
    return HistoryResponse(
        conversation_id=conversation_id,
        messages=messages,
        total_messages=len(messages)
    )

