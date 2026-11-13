
"""
BioTrajectory Chat API Endpoint
Core conversational gateway connecting client requests to safety evaluation,
conversation persistence, and the Groq AI service.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status

from app.models.schemas import ChatRequest, ChatResponse
from app.services.safety_service import ClinicalSafetyService
from app.services.conversation_service import conversation_service
from app.services.gemini_service import gemini_service
from app.core.security import get_current_user
from app.utils.helpers import get_current_time_str, sanitize_text

logger = logging.getLogger("biotrajectory.chat")

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def handle_chat(
    payload: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Process incoming user messages.
    Requires a valid Firebase ID token.
    """

    # 1. Get authenticated Firebase user
    user_id = current_user["uid"]

    # 2. Validate message
    clean_message = sanitize_text(payload.message)

    if not clean_message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Message content cannot be blank."
        )

    # 3. Immediate clinical emergency triage
    is_emergency, emergency_text, emergency_card = (
        ClinicalSafetyService.evaluate_emergency(clean_message)
    )

    if is_emergency and emergency_text:
        logger.warning(
            "Clinical emergency response triggered. Bypassing LLM generation."
        )

        session = conversation_service.get_or_create(
            payload.conversation_id,
            user_id=user_id
        )

        current_time = get_current_time_str()

        conversation_service.append_turn(
            conversation_id=session.conversation_id,
            user_text=clean_message,
            assistant_text=emergency_text,
            user_timestamp=current_time,
            assistant_timestamp=current_time,
            attachments=payload.attachments,
            warning_card=emergency_card,
            user_id=user_id
        )

        return ChatResponse(
            response=emergency_text,
            text=emergency_text,
            conversation_id=session.conversation_id,
            is_emergency=True,
            warningCard=emergency_card,
            timestamp=current_time,
            model_used="clinical_safety_emergency_protocol"
        )

    # 4. Retrieve or create conversation session
    session = conversation_service.get_or_create(
        payload.conversation_id,
        user_id=user_id
    )

    # 5. Prepare conversation history
    history_to_use = session.messages

    if not history_to_use and payload.conversation_history:
        history_to_use = payload.conversation_history

    # 6. Generate AI response
    # No patient records are assumed or fabricated here.
    context_notes = None

    response_text, warning_card, model_used = (
        await gemini_service.generate_response(
            message=clean_message,
            history=history_to_use,
            user_consent=payload.user_consent_given,
            attachments=payload.attachments,
            context_notes=context_notes
        )
    )

    current_time = get_current_time_str()

    # 7. Save conversation turn
    conversation_service.append_turn(
        conversation_id=session.conversation_id,
        user_text=clean_message,
        assistant_text=response_text,
        user_timestamp=current_time,
        assistant_timestamp=current_time,
        attachments=payload.attachments,
        warning_card=warning_card,
        user_id=user_id
    )

    # 8. Return response
    return ChatResponse(
        response=response_text,
        text=response_text,
        conversation_id=session.conversation_id,
        is_emergency=False,
        warningCard=warning_card,
        timestamp=current_time,
        model_used=model_used
    )
