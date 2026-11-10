"""
BioTrajectory Groq-backed AI Service.
Uses the official Groq Python SDK while preserving the existing chat API contract,
conversation history handling, clinical safety checks, and response schema.
"""

import logging
import re
from typing import List, Optional, Any, Tuple
from groq import Groq, APIError, APIConnectionError, APITimeoutError, RateLimitError, InternalServerError

from app.core.config import settings
from app.models.schemas import ChatMessage, WarningCard
from app.services.safety_service import ClinicalSafetyService
from app.utils.helpers import build_warning_card, sanitize_error_message

logger = logging.getLogger("biotrajectory.groq")

SYSTEM_INSTRUCTION = """You are BioTrajectory AI, an educational health assistant.

You should:
1. Answer general health questions.
2. Explain health measurements in simple everyday language.
3. Explain heart rate and blood pressure.
4. Explain blood glucose when relevant.
5. Discuss sleep and physical activity.
6. Summarize actual authorized health records when verified and available.
7. Explain health trends clearly and constructively.
8. Use understandable, empathetic, jargon-free language.
9. Acknowledge uncertainty honestly.
10. Recommend professional medical consultation when appropriate.

Safety restrictions:
- Never diagnose diseases.
- Never prescribe medicines or drug dosages.
- Never fabricate health readings.
- Never claim access to unavailable records.
- Never present synthetic data as real patient information.
- Never replace professional medical advice.

Always structure your replies cleanly using bullet points or short paragraphs where helpful.
"""


class GeminiService:
    """Encapsulates the Groq client and conversation pipeline."""

    def __init__(self):
        self._client: Optional[Groq] = None
        self._model_name = settings.GROQ_MODEL or settings.GEMINI_MODEL
        self._init_client()

    def _init_client(self):
        """Initialize the Groq client with a bounded timeout and retry budget."""
        if settings.is_groq_configured:
            try:
                self._client = Groq(
                    api_key=settings.GROQ_API_KEY,
                    timeout=settings.GROQ_TIMEOUT_SECONDS,
                    max_retries=settings.GROQ_MAX_RETRIES,
                )
                logger.info(
                    f"Groq client initialized: model={self._model_name}, "
                    f"timeout={settings.GROQ_TIMEOUT_SECONDS}s, max_retries={settings.GROQ_MAX_RETRIES}"
                )
            except Exception as e:
                safe_err = sanitize_error_message(str(e))
                logger.error(f"Failed to initialize Groq client: {safe_err}")
                self._client = None
        else:
            self._client = None
            logger.warning("Groq API key is not set or is using placeholder. Live API calls disabled.")

    @property
    def is_available(self) -> bool:
        """Check if the Groq client is ready to make requests."""
        return self._client is not None and settings.is_groq_configured

    @staticmethod
    def _requires_personal_history_context(current_message: str) -> bool:
        """Only include prior personal context when the user explicitly asks about their own readings or records."""
        lower = current_message.lower().strip()
        if not lower:
            return False

        personal_markers = [
            "my blood pressure",
            "my bp",
            "my glucose",
            "my readings",
            "my report",
            "my results",
            "my labs",
            "my health",
            "what does my",
            "how is my",
            "i have",
            "i am having",
            "my doctor",
            "my recent",
            "my chart",
            "my vitals"
        ]
        return any(marker in lower for marker in personal_markers)

    def _build_contents(
        self,
        current_message: str,
        history: Optional[List[ChatMessage]] = None,
        context_notes: Optional[str] = None
    ) -> List[dict]:
        """Format past turns and the current prompt into Groq chat messages."""
        messages: List[dict] = [{"role": "system", "content": SYSTEM_INSTRUCTION}]

        if history and self._requires_personal_history_context(current_message):
            recent_turns = history[-4:]
            for msg in recent_turns:
                if msg.text and msg.text.strip():
                    role = "user" if msg.sender == "user" else "assistant"
                    messages.append({"role": role, "content": msg.text.strip()})

        final_prompt = current_message
        if context_notes:
            final_prompt = f"System Context: {context_notes}\n\nUser Question: {current_message}"

        messages.append({"role": "user", "content": final_prompt})
        return messages

    async def generate_response(
        self,
        message: str,
        history: Optional[List[ChatMessage]] = None,
        user_consent: bool = True,
        attachments: Optional[List[Any]] = None,
        context_notes: Optional[str] = None
    ) -> Tuple[str, Optional[WarningCard], str]:
        """
        Generate educational health response using the Groq API with clear bounded retries.

        Strict Requirements:
        - Never returns an offline mock response as though it came from the provider.
        - Transparently informs the user when the model remains unavailable.
        - Logs provider errors safely without exposing credentials or patient data.
        """
        attachment_notice = ""
        if attachments and len(attachments) > 0:
            file_names = ", ".join([getattr(a, 'name', 'Report') for a in attachments])
            attachment_notice = (
                f"\n\n*Note on attached report ({file_names}): Automated clinical document parsing "
                "is currently in educational preview mode. I can explain general medical terms and "
                "reference ranges, but please share the document directly with your physician for diagnostic review.*"
            )

        # Never return an offline mock response as though it came from Gemini
        if not self.is_available:
            logger.info("Groq API is unconfigured; returning transparent service notice.")
            notice_text = (
                "The BioTrajectory AI Assistant is currently offline because the Groq API key is not configured "
                "in the backend environment. Please set a valid `GROQ_API_KEY` in `backend/.env` to enable live AI responses."
            )
            notice_card = build_warning_card(
                level="warning",
                title="AI Assistant Offline",
                measurement="Groq API: Unconfigured",
                recommendation="Configure GROQ_API_KEY in backend/.env to connect to the configured Groq model.",
                action_text="Configure Key"
            )
            return notice_text, notice_card, "groq_unconfigured"

        try:
            messages = self._build_contents(
                current_message=message,
                history=history,
                context_notes=context_notes
            )

            response = self._client.chat.completions.create(
                model=self._model_name,
                messages=messages,
                temperature=0.4,
                max_tokens=1024,
                timeout=settings.GROQ_TIMEOUT_SECONDS,
            )

            raw_text = None
            provider_model = getattr(response, "model", None) or self._model_name
            finish_reason = None
            if response and getattr(response, "choices", None):
                first_choice = response.choices[0]
                finish_reason = getattr(first_choice, "finish_reason", None)
                if getattr(first_choice, "message", None):
                    raw_text = getattr(first_choice.message, "content", None)

            if finish_reason == "length":
                logger.warning("Groq response truncated by max_tokens; returning incomplete-response notice.")
                return (
                    "The answer was cut off by the model output limit before it could finish. "
                    "Please ask a shorter, more focused question or try again with a more specific prompt.",
                    None,
                    provider_model
                )

            if not raw_text or not str(raw_text).strip():
                logger.warning("Groq returned empty or blank response.")
                return (
                    "I received your question, but could not formulate a clear explanation. "
                    "Could you rephrase your question or ask about a specific health measurement?",
                    None,
                    provider_model
                )

            # Enforce post-generation educational boundaries
            safe_text = ClinicalSafetyService.enforce_educational_boundaries(raw_text.strip())
            
            if attachment_notice:
                safe_text += attachment_notice

            # Derive contextual warning card only from explicit measurements or verified data.
            warning_card = self._derive_contextual_warning_card(message, safe_text)

            return safe_text, warning_card, provider_model

        except (APIError, APIConnectionError, APITimeoutError, RateLimitError, InternalServerError) as e:
            status_code = getattr(e, "status_code", None) or getattr(e, "code", None)
            if isinstance(e, RateLimitError):
                status_code = 429
            if isinstance(e, InternalServerError):
                status_code = 500
            safe_err = sanitize_error_message(str(e))
            logger.error(f"Groq provider error (HTTP {status_code}): {safe_err}")

            if status_code == 503 or isinstance(e, InternalServerError):
                friendly_503 = (
                    "BioTrajectory AI is currently experiencing high demand and could not process your question right now. "
                    "Please wait a few moments and try asking again. "
                    "If you have an immediate medical concern, please consult your physician or local healthcare provider."
                )
                card_503 = build_warning_card(
                    level="warning",
                    title="Assistant Temporarily Unavailable",
                    measurement="Groq Service: High Demand (503)",
                    recommendation="The AI model is temporarily overloaded. Please wait a moment and resubmit your question.",
                    action_text="Try Again"
                )
                return friendly_503, card_503, f"{self._model_name}_unavailable_503"

            if status_code == 429 or isinstance(e, RateLimitError):
                friendly_429 = (
                    "The AI health assistant has reached its temporary rate limit. "
                    "Please wait a moment before sending another question. "
                    "For urgent medical questions, please reach out to your doctor."
                )
                card_429 = build_warning_card(
                    level="warning",
                    title="Rate Limit Reached",
                    measurement="Groq Service: Rate Limited (429)",
                    recommendation="Please pause for a few seconds before asking another health question.",
                    action_text="Wait & Retry"
                )
                return friendly_429, card_429, f"{self._model_name}_rate_limited"

            friendly_general = (
                f"The health assistant service encountered a temporary provider issue (Error {status_code or 'unknown'}). "
                "Please try again shortly. If you have an urgent medical concern, please reach out to your doctor."
            )
            card_general = build_warning_card(
                level="warning",
                title="Service Issue",
                measurement=f"Groq Service: Error {status_code or 'unknown'}",
                recommendation="A temporary provider error occurred. Please try again shortly.",
                action_text="Retry"
            )
            return friendly_general, card_general, f"{self._model_name}_error_{status_code or 'unknown'}"

        except Exception as e:
            safe_err = sanitize_error_message(str(e))
            logger.error(f"Unexpected error calling Groq API: {type(e).__name__}: {safe_err}")
            friendly_fallback = (
                "I am having difficulty connecting to the health intelligence engine right now. "
                "Please try asking your question again in a moment."
            )
            card_fallback = build_warning_card(
                level="warning",
                title="Connection Issue",
                measurement="Health Engine: Unavailable",
                recommendation="Unable to complete generation. Please try again in a few moments.",
                action_text="Retry"
            )
            return friendly_fallback, card_fallback, "error_fallback"

    def _derive_contextual_warning_card(self, query: str, response: str) -> Optional[WarningCard]:
        """Only attach a warning card when there is actual patient-specific measurement context, not general guidance."""
        lower_q = query.lower()
        lower_r = response.lower()

        def has_patient_bp_measurement(text: str) -> bool:
            return bool(re.search(
                r"\b(?:my|current|recent|today|home|last)\s*(?:blood pressure|bp)\s*(?:is|=|:)?\s*\d{2,3}\s*/\s*\d{2,3}\b",
                text,
                re.IGNORECASE,
            )) or bool(re.search(
                r"\b(?:my|current|recent|today|home|last)\s*(?:reading|readings|result|results)\s*(?:for|of)?\s*(?:blood pressure|bp)\s*(?:is|=|:)?\s*\d{2,3}\s*/\s*\d{2,3}\b",
                text,
                re.IGNORECASE,
            )) or bool(re.search(
                r"\b(?:your|my)\s*(?:blood pressure|bp)\s*(?:is|=|:)?\s*\d{2,3}\s*/\s*\d{2,3}\b",
                text,
                re.IGNORECASE,
            ))

        def has_patient_glucose_measurement(text: str) -> bool:
            return bool(re.search(
                r"\b(?:my|current|recent|today|home|last)\s*(?:glucose|blood sugar)\s*(?:is|=|:)?\s*\d{2,3}\b",
                text,
                re.IGNORECASE,
            )) or bool(re.search(
                r"\b(?:your|my)\s*(?:glucose|blood sugar)\s*(?:is|=|:)?\s*\d{2,3}\b",
                text,
                re.IGNORECASE,
            ))

        has_bp_measurement_context = has_patient_bp_measurement(query) or has_patient_bp_measurement(response)
        has_glucose_measurement_context = has_patient_glucose_measurement(query) or has_patient_glucose_measurement(response)

        if has_bp_measurement_context and any(w in lower_q or w in lower_r for w in ["blood pressure", "bp", "hypertension", "systolic", "diastolic"]):
            if any(w in lower_r for w in ["stage 1", "stage 2", "elevated", "high blood pressure", "hypertension"]):
                return build_warning_card(
                    level="warning",
                    title="Monitor Blood Pressure Closely",
                    measurement="Elevated or borderline readings discussed",
                    recommendation="Rest quietly for 5 minutes before checking blood pressure. Keep a 7-day log for your doctor.",
                    action_text="View Your Health Trends"
                )

        if has_glucose_measurement_context and any(w in lower_q or w in lower_r for w in ["blood sugar", "glucose", "diabetes"]):
            if any(w in lower_r for w in ["low blood sugar", "high blood sugar", "pre-diabetes", "diabetes"]):
                return build_warning_card(
                    level="warning",
                    title="Review Glucose Patterns",
                    measurement="Blood sugar trend noted",
                    recommendation="Track your readings and discuss patterns with your clinician if they remain outside the expected range.",
                    action_text="Review Your Readings"
                )

        return None


gemini_service = GeminiService()
