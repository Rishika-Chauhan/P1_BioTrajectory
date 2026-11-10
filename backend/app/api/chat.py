"""
BioTrajectory Chat API Endpoint
Core conversational gateway connecting client requests to safety evaluation,
conversation persistence, and the Gemini AI service.
"""

import logging
from typing import Optional
from fastapi import APIRouter, Header, Depends, HTTPException, status
from app.models.schemas import ChatRequest, ChatResponse
from app.services.safety_service import ClinicalSafetyService
from app.services.conversation_service import conversation_service
from app.services.gemini_service import gemini_service
from app.services.health_service import HealthDataService
from app.core.security import verify_auth_token
from app.utils.helpers import get_current_time_str, sanitize_text

logger = logging.getLogger("biotrajectory.chat")

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def handle_chat(
    payload: ChatRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Process incoming user message through clinical safety, context assembly,
    and Gemini health intelligence.
    """
    clean_message = sanitize_text(payload.message)
    if not clean_message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Message content cannot be blank."
        )

    # 1. Authoritative Token Check
    is_prod_verified, auth_mode, claims = verify_auth_token(authorization)
    user_id = claims.get("uid") if claims else None

    # 2. Immediate Clinical Emergency Triage
    is_emergency, emergency_text, emergency_card = ClinicalSafetyService.evaluate_emergency(clean_message)
    if is_emergency and emergency_text:
        logger.warning("Clinical emergency response triggered. Bypassing LLM generation.")
        session = conversation_service.get_or_create(payload.conversation_id, user_id=user_id)
        current_time = get_current_time_str()
        
        # Save emergency turn into history
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

    # 3. Retrieve or Create Conversation Session
    session = conversation_service.get_or_create(payload.conversation_id, user_id=user_id)
    
    # Priority for history: server session history, supplemented with client history if session is brand new
    history_to_use = session.messages
    if not history_to_use and payload.conversation_history:
        history_to_use = payload.conversation_history

    # 4. Context Grounding & Data Boundaries
    context_notes = None
    if not is_prod_verified:
        context_notes = (
            "Verified patient health records are unavailable because production authentication is not active. "
            "You MUST NOT invent, guess, or fabricate patient lab results or vital readings. "
            "Explain clinical principles, healthy ranges, and lifestyle habits educationally."
        )

    # 5. Gemini Generation
    response_text, warning_card, model_used = await gemini_service.generate_response(
        message=clean_message,
        history=history_to_use,
        user_consent=payload.user_consent_given,
        attachments=payload.attachments,
        context_notes=context_notes
    )

    current_time = get_current_time_str()

    # 6. Persist Conversation Turn
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

    return ChatResponse(
        response=response_text,
        text=response_text,
        conversation_id=session.conversation_id,
        is_emergency=False,
        warningCard=warning_card,
        timestamp=current_time,
        model_used=model_used
    )
