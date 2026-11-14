import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

key_path = Path(settings.FIREBASE_CREDENTIALS_PATH).expanduser()

cred = credentials.Certificate(str(key_path))

firebase_admin.initialize_app(
    cred,
    options={"projectId": settings.FIREBASE_PROJECT_ID}
)

uid = "H5F9k22a4mdNEOPbe699DtQlPnb2"

user = auth.get_user(uid)

if user.email_verified:
    print("Email is already verified.")
else:
    link = auth.generate_email_verification_link(user.email)
    print("\nOpen this verification link in your browser:\n")
    print(link)
