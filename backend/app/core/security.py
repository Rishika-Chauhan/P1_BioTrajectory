
"""
BioTrajectory Security & Authentication Module

Responsibilities:
- Firebase Admin SDK initialization
- Cryptographic Firebase ID token verification
- Authenticated-user dependencies
- Role-based authorization
- Per-IP sliding-window rate limiting
"""

import logging
import threading
import time

from collections import defaultdict
from pathlib import Path
from typing import Optional, Tuple, Dict, Any, Set

import firebase_admin
from firebase_admin import credentials, auth

from fastapi import (
    Request,
    HTTPException,
    status,
    Depends,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings


logger = logging.getLogger("biotrajectory.security")


# --------------------------------------------------
# Authentication configuration
# --------------------------------------------------

bearer_scheme = HTTPBearer(auto_error=False)

SUPPORTED_ROLES = {
    "USER",
    "DOCTOR_PENDING",
    "DOCTOR",
    "DOCTOR_SUSPENDED",
    "ADMIN",
}

_firebase_initialized = False
_firebase_lock = threading.Lock()


# --------------------------------------------------
# Firebase Admin initialization
# --------------------------------------------------

def initialize_firebase_admin() -> bool:
    """
    Initialize Firebase Admin SDK using a service account.

    Returns:
        True if Firebase Admin is initialized.
        False if production credentials are unavailable.
    """

    global _firebase_initialized

    with _firebase_lock:

        if _firebase_initialized:
            return True

        try:
            # Reuse an already initialized default Firebase app.
            try:
                firebase_app = firebase_admin.get_app()

                app_project = (
                    firebase_app.project_id
                    or firebase_app.options.get("projectId")
                )

                if app_project != settings.FIREBASE_PROJECT_ID:
                    logger.error(
                        "Existing Firebase app project does not match "
                        "configured project."
                    )
                    return False

                _firebase_initialized = True
                return True

            except ValueError:
                pass

            credentials_path = Path(
                settings.FIREBASE_CREDENTIALS_PATH
            ).expanduser()

            if not settings.FIREBASE_PROJECT_ID:
                logger.error("Firebase project ID is missing.")
                return False

            if not credentials_path.is_file():
                logger.warning(
                    "Firebase service account file not found."
                )
                return False

            firebase_credentials = credentials.Certificate(
                str(credentials_path)
            )

            credential_project = firebase_credentials.project_id

            if credential_project != settings.FIREBASE_PROJECT_ID:
                logger.error(
                    "Firebase service account project mismatch."
                )
                return False

            firebase_admin.initialize_app(
                firebase_credentials,
                options={
                    "projectId": settings.FIREBASE_PROJECT_ID
                },
            )

            _firebase_initialized = True

            logger.info(
                "Firebase Admin initialized for project %s",
                settings.FIREBASE_PROJECT_ID,
            )

            return True

        except Exception:
            logger.exception(
                "Firebase Admin initialization failed."
            )
            return False


# --------------------------------------------------
# Role extraction
# --------------------------------------------------

def extract_role_from_claims(
    claims: Dict[str, Any]
) -> Optional[str]:
    """
    Extract a role from verified Firebase custom claims.

    Roles must be assigned through a trusted backend.
    Client-provided roles are never accepted here.
    """

    if not isinstance(claims, dict):
        return None

    role = claims.get("role")

    if role is None:
        firebase_claims = claims.get("firebase", {})
        if isinstance(firebase_claims, dict):
            role = firebase_claims.get("role")

    if not isinstance(role, str):
        return None

    role = role.strip().upper()

    if role not in SUPPORTED_ROLES:
        return None

    return role


# --------------------------------------------------
# Token verification
# --------------------------------------------------

def verify_auth_token(
    auth_header: Optional[str],
) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
    """
    Cryptographically verify a Firebase ID token.

    Returns:
        (verified, authentication_mode, claims)
    """

    if not auth_header:
        return False, "unauthenticated", None

    parts = auth_header.strip().split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return False, "invalid_header", None

    token = parts[1]

    # Never accept mock tokens as authenticated users.
    if token.startswith("mock_") or "sig_mock_" in token:
        return False, "invalid_token", None

    if not initialize_firebase_admin():
        return False, "production_not_configured", None

    try:
        decoded_claims = auth.verify_id_token(
            token,
            check_revoked=True,
        )

        uid = decoded_claims.get("uid")

        if not uid:
            return False, "missing_uid", None

        # Only verified Firebase claims are trusted.
        verified_claims = dict(decoded_claims)

        role = extract_role_from_claims(verified_claims)

        # Ordinary authenticated users receive the default role.
        verified_claims["role"] = role or "USER"

        return True, "production_verified", verified_claims

    except auth.ExpiredIdTokenError:
        logger.warning("Firebase ID token has expired.")
        return False, "expired_token", None

    except auth.RevokedIdTokenError:
        logger.warning("Firebase ID token has been revoked.")
        return False, "revoked_token", None

    except ValueError:
        logger.warning("Invalid Firebase ID token.")
        return False, "invalid_token", None

    except Exception:
        logger.exception("Firebase token verification failed.")
        return False, "verification_failed", None


# --------------------------------------------------
# Authenticated-user dependency
# --------------------------------------------------

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        bearer_scheme
    ),
) -> Dict[str, Any]:
    """
    FastAPI dependency that requires a valid Firebase ID token.
    """

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    auth_header = f"Bearer {credentials.credentials}"

    verified, mode, claims = verify_auth_token(auth_header)

    if not verified or not claims:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return claims


# Backward-compatible dependency alias.
require_authenticated_user = get_current_user


# --------------------------------------------------
# Role-based authorization
# --------------------------------------------------

def require_role(
    claims: Dict[str, Any],
    allowed_roles: Set[str],
) -> bool:
    """
    Check whether verified claims contain an allowed role.
    """

    if not isinstance(claims, dict):
        return False

    role = claims.get("role")

    if not isinstance(role, str):
        return False

    return role.upper() in {
        item.upper() for item in allowed_roles
    }


def require_user_role(*allowed_roles: str):
    """
    Create a FastAPI dependency for role-based access.

    Example:
        Depends(require_user_role("ADMIN"))
    """

    async def role_dependency(
        current_user: Dict[str, Any] = Depends(get_current_user),
    ) -> Dict[str, Any]:

        if not require_role(
            current_user,
            set(allowed_roles),
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return current_user

    return role_dependency


# --------------------------------------------------
# Rate limiter
# --------------------------------------------------

class RateLimiter:
    """
    Thread-safe in-memory sliding-window rate limiter.

    Note:
    This limiter is local to one backend process.
    It is not a distributed production rate limiter.
    """

    def __init__(self, requests_per_minute: int = 60):
        self.rate = requests_per_minute
        self.clients = defaultdict(list)
        self.lock = threading.Lock()

    def is_allowed(self, client_id: str) -> bool:

        now = time.time()
        window_start = now - 60.0

        with self.lock:

            timestamps = [
                timestamp
                for timestamp in self.clients[client_id]
                if timestamp > window_start
            ]

            self.clients[client_id] = timestamps

            if len(timestamps) >= self.rate:
                return False

            self.clients[client_id].append(now)

            return True


rate_limiter = RateLimiter(
    requests_per_minute=settings.RATE_LIMIT_PER_MINUTE
)


# --------------------------------------------------
# Rate-limit middleware
# --------------------------------------------------

async def rate_limit_middleware(request: Request, call_next):
    """
    Apply per-IP rate limiting.
    """

    client_ip = (
        request.client.host
        if request.client
        else "unknown"
    )

    excluded_paths = {
        "/health",
        "/docs",
        "/openapi.json",
    }

    if request.url.path not in excluded_paths:

        if not rate_limiter.is_allowed(client_ip):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "Rate limit exceeded. "
                    "Please wait before sending another request."
                ),
            )

    return await call_next(request)
