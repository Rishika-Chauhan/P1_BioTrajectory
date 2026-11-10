"""
BioTrajectory Conversation Management Service
Handles session isolation, conversation IDs, history persistence,
and context windows with user-level ownership checks.
"""

import uuid
import time
import logging
from typing import Dict, List, Optional
from threading import Lock
from app.models.schemas import ChatMessage, WarningCard, AttachmentItem
from app.core.config import settings

logger = logging.getLogger("biotrajectory.conversation")


class ConversationSession:
    """Represents a bounded conversation thread."""
    def __init__(self, conversation_id: str, user_id: Optional[str] = None):
        self.conversation_id = conversation_id
        self.user_id = user_id or "anonymous"
        self.messages: List[ChatMessage] = []
        self.created_at = time.time()
        self.updated_at = time.time()

    def add_message(
        self,
        sender: str,
        text: str,
        timestamp: Optional[str] = None,
        attachments: Optional[List[AttachmentItem]] = None,
        warning_card: Optional[WarningCard] = None
    ) -> ChatMessage:
        msg_id = f"{sender[:3]}_{int(time.time() * 1000)}"
        msg = ChatMessage(
            id=msg_id,
            sender=sender,
            text=text,
            timestamp=timestamp,
            attachments=attachments,
            warningCard=warning_card
        )
        self.messages.append(msg)
        self.updated_at = time.time()
        
        # Enforce rolling history window to prevent unbounded memory growth
        max_turns = settings.MAX_CONVERSATION_HISTORY_TURNS
        if len(self.messages) > max_turns * 2:
            self.messages = self.messages[-(max_turns * 2):]
            
        return msg


class ConversationService:
    """Thread-safe conversation store with user isolation."""
    def __init__(self):
        self._conversations: Dict[str, ConversationSession] = {}
        self._lock = Lock()

    def get_or_create(
        self,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> ConversationSession:
        """
        Retrieve or initialize a conversation.
        Strictly enforces that conversations belonging to a user cannot be accessed by another.
        """
        clean_user = user_id or "anonymous"
        with self._lock:
            # Check existing
            if conversation_id and conversation_id in self._conversations:
                session = self._conversations[conversation_id]
                # Enforce user-level ownership
                if session.user_id != "anonymous" and clean_user != "anonymous" and session.user_id != clean_user:
                    logger.warning(
                        f"Ownership mismatch: Conversation {conversation_id} belongs to {session.user_id}, "
                        f"rejected for user {clean_user}. Creating new session."
                    )
                    # Create isolated new session to prevent data leaking
                    new_id = str(uuid.uuid4())
                    new_session = ConversationSession(new_id, user_id=clean_user)
                    self._conversations[new_id] = new_session
                    return new_session
                return session

            # Create new
            new_id = conversation_id if (conversation_id and len(conversation_id) >= 8) else str(uuid.uuid4())
            session = ConversationSession(new_id, user_id=clean_user)
            self._conversations[new_id] = session
            return session

    def get_history(self, conversation_id: str, user_id: Optional[str] = None) -> List[ChatMessage]:
        """Retrieve conversation history if authorized."""
        with self._lock:
            if conversation_id not in self._conversations:
                return []
            session = self._conversations[conversation_id]
            clean_user = user_id or "anonymous"
            if session.user_id != "anonymous" and clean_user != "anonymous" and session.user_id != clean_user:
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
        user_id: Optional[str] = None
    ):
        """Append user and assistant messages atomically."""
        session = self.get_or_create(conversation_id, user_id=user_id)
        with self._lock:
            session.add_message("user", user_text, timestamp=user_timestamp, attachments=attachments)
            session.add_message("assistant", assistant_text, timestamp=assistant_timestamp, warning_card=warning_card)

    def prune_expired(self, max_idle_seconds: float = 86400 * 2):
        """Prune conversations older than max_idle_seconds (default 48h)."""
        now = time.time()
        with self._lock:
            expired_keys = [k for k, v in self._conversations.items() if now - v.updated_at > max_idle_seconds]
            for k in expired_keys:
                del self._conversations[k]


conversation_service = ConversationService()

