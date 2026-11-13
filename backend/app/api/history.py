
"""
BioTrajectory History API Endpoints
Retrieves authorized conversation history partitioned by user.
"""

from typing import Any, Dict

from fastapi import APIRouter, Query, Depends

from app.models.schemas import HistoryResponse
from app.services.conversation_service import conversation_service
from app.core.security import get_current_user

router = APIRouter(prefix="/api", tags=["History"])


@router.get("/history", response_model=HistoryResponse)
async def get_conversation_history(
    conversation_id: str = Query(
        ...,
        description="ID of the conversation to retrieve"
    ),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Retrieve conversation history belonging to the authenticated user.
    """

    user_id = current_user["uid"]

    messages = conversation_service.get_history(
        conversation_id,
        user_id=user_id
    )

    return HistoryResponse(
        conversation_id=conversation_id,
        messages=messages,
        total_messages=len(messages)
    )
