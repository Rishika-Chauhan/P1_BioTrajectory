import argparse
import sys
from pathlib import Path

# Add backend directory to Python import path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

import firebase_admin
from firebase_admin import credentials, auth

from app.core.config import settings
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("uid", help="Firebase UID")
    args = parser.parse_args()

    key_path = Path(settings.FIREBASE_CREDENTIALS_PATH).expanduser()
    if not key_path.is_file():
        raise FileNotFoundError("Service account file not found.")

    cred = credentials.Certificate(str(key_path))

    if cred.project_id != settings.FIREBASE_PROJECT_ID:
        raise RuntimeError("Firebase project mismatch.")

    firebase_admin.initialize_app(
        cred,
        options={"projectId": settings.FIREBASE_PROJECT_ID}
    )

    user = auth.get_user(args.uid)

    if not user.email_verified:
        raise RuntimeError("Admin email must be verified first.")

    print("Account:", user.email)
    print("UID:", user.uid)

    if input("Type GRANT ADMIN to continue: ") != "GRANT ADMIN":
        print("Cancelled.")
        return

    # Preserve existing custom claims.
    claims = user.custom_claims or {}
    claims["role"] = "ADMIN"

    auth.set_custom_user_claims(user.uid, claims)

    print("ADMIN role assigned successfully.")


if __name__ == "__main__":
    main()