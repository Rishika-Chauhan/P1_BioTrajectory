"""
BioTrajectory Backend Configuration
Core settings and environment variable management.
"""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")


class Settings:
    # Project Info
    PROJECT_NAME: str = "BioTrajectory Health Assistant Backend"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development").lower()

    # Server Bindings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Groq API Configuration
    # Verify the configured model against the live Groq account before using it.
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", os.getenv("GEMINI_API_KEY", "")).strip()
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", os.getenv("GEMINI_MODEL", "qwen/qwen3.8-27b")).strip()
    GROQ_TIMEOUT_SECONDS: float = float(os.getenv("GROQ_TIMEOUT_SECONDS", os.getenv("GEMINI_TIMEOUT_SECONDS", "120.0")))
    GROQ_MAX_RETRIES: int = int(os.getenv("GROQ_MAX_RETRIES", os.getenv("GEMINI_MAX_RETRIES", "2")))
    GROQ_RETRY_INITIAL_DELAY: float = float(os.getenv("GROQ_RETRY_INITIAL_DELAY", os.getenv("GEMINI_RETRY_INITIAL_DELAY", "1.0")))
    GROQ_RETRY_EXP_BASE: float = float(os.getenv("GROQ_RETRY_EXP_BASE", os.getenv("GEMINI_RETRY_EXP_BASE", "2.0")))

    # Backward compatibility aliases retained while the app still references legacy Gemini names.
    GEMINI_API_KEY: str = GROQ_API_KEY
    GEMINI_MODEL: str = GROQ_MODEL
    GEMINI_TIMEOUT_SECONDS: float = GROQ_TIMEOUT_SECONDS
    GEMINI_MAX_RETRIES: int = GROQ_MAX_RETRIES
    GEMINI_RETRY_INITIAL_DELAY: float = GROQ_RETRY_INITIAL_DELAY
    GEMINI_RETRY_EXP_BASE: float = GROQ_RETRY_EXP_BASE

    # Security & CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    ALLOWED_ORIGINS: List[str] = [
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Rate Limiting & Request Limits
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    MAX_REQUEST_SIZE_BYTES: int = int(os.getenv("MAX_REQUEST_SIZE_BYTES", str(1 * 1024 * 1024))) # 1 MB
    MAX_MESSAGE_LENGTH: int = int(os.getenv("MAX_MESSAGE_LENGTH", "4000"))
    MAX_CONVERSATION_HISTORY_TURNS: int = int(os.getenv("MAX_CONVERSATION_HISTORY_TURNS", "20"))

    # Firebase Authentication
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "biotrajectory-prod")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "").strip()

    @property
    def is_groq_configured(self) -> bool:
        """Check if a non-placeholder Groq API key is configured."""
        return bool(self.GROQ_API_KEY and self.GROQ_API_KEY not in {"YOUR_API_KEY", "YOUR_GROQ_API_KEY", ""})

    @property
    def is_gemini_configured(self) -> bool:
        """Backward-compatible alias for Groq configuration."""
        return self.is_groq_configured

    @property
    def is_production_firebase_configured(self) -> bool:
        """Check if production Firebase Admin credentials are provided."""
        return bool(self.FIREBASE_CREDENTIALS_PATH and os.path.exists(self.FIREBASE_CREDENTIALS_PATH))


settings = Settings()

