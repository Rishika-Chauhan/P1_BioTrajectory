
"""
BioTrajectory Conversation Management Service.

Handles conversation sessions, history persistence,
and strict Firebase UID-based ownership.
"""

import logging
import time
import uuid

from threading import Lock
from typing import Dict, List, Optional

from app.models.schemas import ChatMessage, WarningCard, AttachmentItem
from app.core.config import settings

logger = logging.getLogger("biotrajectory.conversation")


class ConversationSession:
    """Represents a conversation owned by one user."""

    def __init__(self, conversation_id: str, user_id: str):
        self.conversation_id = conversation_id
        self.user_id = user_id
        self.messages: List[ChatMessage] = []
        self.created_at = time.time()
        self.updated_at = time.time()

    def add_message(
        self,
        sender: str,
        text: str,
        timestamp: Optional[str] = None,
        attachments: Optional[List[AttachmentItem]] = None,
        warning_card: Optional[WarningCard] = None,
    ) -> ChatMessage:

        msg = ChatMessage(
            id=f"{sender[:3]}_{uuid.uuid4().hex}",
            sender=sender,
            text=text,
            timestamp=timestamp,
            attachments=attachments,
            warningCard=warning_card,
        )

        self.messages.append(msg)
        self.updated_at = time.time()

        max_turns = settings.MAX_CONVERSATION_HISTORY_TURNS

        if len(self.messages) > max_turns * 2:
            self.messages = self.messages[-(max_turns * 2):]

        return msg


class ConversationService:
    """Thread-safe in-memory conversation store with strict ownership."""

    def __init__(self):
        self._conversations: Dict[str, ConversationSession] = {}
        self._lock = Lock()

    @staticmethod
    def _validate_user(user_id: Optional[str]) -> str:
        if not user_id or not user_id.strip():
            raise ValueError("Authenticated user ID is required.")

        return user_id.strip()

    def get_or_create(
        self,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> ConversationSession:

        clean_user = self._validate_user(user_id)

        with self._lock:

            if conversation_id and conversation_id in self._conversations:

                session = self._conversations[conversation_id]

                # Ownership must match exactly.
                if session.user_id != clean_user:

                    logger.warning(
                        "Conversation ownership mismatch rejected."
                    )

                    # Never return another user's session.
                    new_id = str(uuid.uuid4())

                    new_session = ConversationSession(
                        new_id,
                        clean_user,
                    )

                    self._conversations[new_id] = new_session

                    return new_session

                return session

            # Create a new conversation.
            new_id = (
                conversation_id
                if conversation_id and len(conversation_id) >= 8
                else str(uuid.uuid4())
            )

            session = ConversationSession(
                new_id,
                clean_user,
            )

            self._conversations[new_id] = session

            return session

    def get_history(
        self,
        conversation_id: str,
        user_id: Optional[str] = None,
    ) -> List[ChatMessage]:

        clean_user = self._validate_user(user_id)

        with self._lock:

            session = self._conversations.get(conversation_id)

            if session is None:
                return []

            # Exact UID match required.
            if session.user_id != clean_user:
                logger.warning(
                    "Unauthorized conversation history access rejected."
                )
                return []

            return list(session.messages)

    def append_turn(
        self,
        conversation_id: str,
        user_text: str,
        assistant_text: str,
        user_timestamp: str,
        assistant_timestamp: str,
        attachments: Optional[List[AttachmentItem]] = None,
        warning_card: Optional[WarningCard] = None,
        user_id: Optional[str] = None,
    ):

        session = self.get_or_create(
            conversation_id=conversation_id,
            user_id=user_id,
        )

        with self._lock:

            session.add_message(
                "user",
                user_text,
                timestamp=user_timestamp,
                attachments=attachments,
            )

            session.add_message(
                "assistant",
                assistant_text,
                timestamp=assistant_timestamp,
                warning_card=warning_card,
            )

        return session.conversation_id

    def prune_expired(
        self,
        max_idle_seconds: float = 86400 * 2,
    ):

        now = time.time()

        with self._lock:

            expired_keys = [
                key
                for key, session in self._conversations.items()
                if now - session.updated_at > max_idle_seconds
            ]

            for key in expired_keys:
                del self._conversations[key]


conversation_service = ConversationService()
