"""
BioTrajectory Backend Helpers
Utility functions for timestamps, string sanitization, and structured responses.
"""

import re
from datetime import datetime, timezone
from typing import Optional
from app.models.schemas import WarningCard


def sanitize_error_message(msg: str) -> str:
    """Mask potential API keys, auth tokens, or private credentials from error strings."""
    if not msg:
        return ""
    # Mask provider keys such as Google (AIza...), Groq (gsk_...), and OpenAI-style keys (sk-...)
    masked = re.sub(r'(?<![A-Za-z0-9_])(?:AIzaSy[A-Za-z0-9_\-]{33}|gsk_[A-Za-z0-9_\-]{20,}|sk-[A-Za-z0-9_\-]{20,})', '[API_KEY_MASKED]', msg)
    # Mask explicit env assignments like GROQ_API_KEY=... or key=...
    masked = re.sub(r'(?i)((?:GROQ_API_KEY|GOOGLE_API_KEY|GEMINI_API_KEY|api_key|key)\s*[:=]\s*)[^\s\"\']+', r'\1[API_KEY_MASKED]', masked)
    # Mask query param keys and tokens
    masked = re.sub(r'([?&](?:key|api_key|token)=)[^&]+', r'\1[CREDENTIAL_MASKED]', masked, flags=re.IGNORECASE)
    # Mask Bearer tokens
    masked = re.sub(r'(Bearer\s+)[A-Za-z0-9._\-]+', r'\1[TOKEN_MASKED]', masked, flags=re.IGNORECASE)
    return masked


def get_current_iso_timestamp() -> str:
    """Return ISO 8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat()


def get_current_time_str() -> str:
    """Return local 12-hour formatted time string, e.g., '02:30 PM'."""
    now = datetime.now()
    return now.strftime("%I:%M %p")


def sanitize_text(text: str) -> str:
    """Strip null bytes, excessive control characters, and leading/trailing whitespace."""
    if not text:
        return ""
    # Strip null bytes and control characters except common whitespace
    cleaned = "".join(ch for ch in text if ch == "\n" or ch == "\r" or ch == "\t" or ord(ch) >= 32)
    return cleaned.strip()


def build_warning_card(
    level: str,
    title: str,
    measurement: str,
    recommendation: str,
    action_text: str = "Consult Doctor"
) -> WarningCard:
    """Convenience factory for WarningCard instances."""
    return WarningCard(
        level=level,
        title=title,
        measurement=measurement,
        recommendation=recommendation,
        actionText=action_text
    )


def mask_token(token: Optional[str]) -> str:
    """Safely mask tokens for secure audit logging without leaking secrets."""
    if not token:
        return "none"
    if len(token) <= 8:
        return "***"
    return f"{token[:4]}...{token[-4:]}"

