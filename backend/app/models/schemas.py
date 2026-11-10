"""
BioTrajectory Pydantic Schemas
Strict request and response validation models.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class WarningCard(BaseModel):
    level: str = Field(default="info", description="Warning level: critical, warning, or info")
    title: str = Field(..., description="Card title")
    measurement: str = Field(..., description="Associated measurement or observation")
    recommendation: str = Field(..., description="Guidance or instruction")
    actionText: str = Field(default="Consult Doctor", description="Button call to action")


class AttachmentItem(BaseModel):
    name: str = Field(..., max_length=255)
    size: Optional[str] = Field(default=None, max_length=50)
    type: Optional[str] = Field(default=None, max_length=50)


class ChatMessage(BaseModel):
    id: str = Field(..., description="Message unique identifier")
    sender: str = Field(..., description="'user' or 'assistant'")
    text: str = Field(..., description="Message text content")
    timestamp: Optional[str] = Field(default=None, description="Readable timestamp")
    attachments: Optional[List[AttachmentItem]] = Field(default=None)
    warningCard: Optional[WarningCard] = Field(default=None)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User question or statement")
    conversation_id: Optional[str] = Field(default=None, description="Existing conversation UUID")
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=None,
        description="Optional client-provided message history turns"
    )
    user_consent_given: bool = Field(default=True, description="Whether user provided consent for report reading")
    attachments: Optional[List[AttachmentItem]] = Field(default=None, description="Uploaded file metadata")

    @field_validator("message")
    @classmethod
    def validate_message_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message cannot be empty or whitespace only")
        return stripped


class ChatResponse(BaseModel):
    response: str = Field(..., description="AI response text")
    text: str = Field(..., description="Alias for response text to match existing frontend interface")
    conversation_id: str = Field(..., description="Conversation identifier")
    is_emergency: bool = Field(default=False, description="Whether an emergency condition was identified")
    warningCard: Optional[WarningCard] = Field(default=None, description="Clinical or informational warning card")
    timestamp: str = Field(..., description="Formatted response timestamp")
    model_used: Optional[str] = Field(default=None, description="Gemini model or safety engine used")


class HealthStatusResponse(BaseModel):
    status: str = Field(..., description="'ok' or 'degraded'")
    gemini_configured: bool = Field(..., description="Whether Gemini API key is configured")
    model: str = Field(..., description="Configured Gemini model name")
    auth_mode: str = Field(..., description="'production' or 'development_mock'")
    personal_records_enabled: bool = Field(..., description="Whether verified personal record access is active")
    timestamp: str = Field(..., description="Server ISO timestamp")
    uptime_seconds: float = Field(..., description="Backend process uptime")


class HistoryResponse(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]
    total_messages: int


class HealthSummaryResponse(BaseModel):
    available: bool = Field(..., description="Whether authorized personal health records are available")
    status: str = Field(..., description="Status summary string")
    reason: Optional[str] = Field(default=None, description="Explanation if records are unavailable")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Aggregated metric calculations")
    disclaimer: str = Field(..., description="Clinical educational disclaimer")

