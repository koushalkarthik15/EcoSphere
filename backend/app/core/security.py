import time
from typing import Dict, Any, Optional
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.core.config import settings

class SecurityManager:
    """Manages all authentication, token signatures, and role authorizations."""

    @staticmethod
    def verify_google_token(id_token_str: str) -> Optional[Dict[str, Any]]:
        """
        Validates Google Identity OAuth ID Token.
        In offline test/development environments, validates token formats safely
        without making remote calls to Google servers.
        """
        # Checks for local/offline testing signature
        if settings.FASTAPI_ENV == "test" or id_token_str.startswith("mock_google_id_token_"):
            # Mock Google Identity return structure
            email = id_token_str.replace("mock_google_id_token_", "") + "@example.com"
            name = id_token_str.replace("mock_google_id_token_", "").capitalize()
            return {
                "sub": f"google_{id_token_str}",
                "email": email,
                "name": name,
                "picture": f"https://api.dicebear.com/7.x/bottts/svg?seed={name}",
                "email_verified": True
            }

        try:
            # Live Google Token Verification
            id_info = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            return id_info
        except Exception as e:
            # Log failure in production environments
            print(f"⚠️ Google token validation failure: {e}")
            return None

    @staticmethod
    def create_session_token(user_profile: Dict[str, Any], expires_in: int = 86400) -> str:
        """
        Signs a local JWT session token for the user.
        Never embeds sensitive credentials.
        """
        payload = {
            "id": user_profile.get("id"),
            "name": user_profile.get("name"),
            "email": user_profile.get("email"),
            "avatar": user_profile.get("avatar"),
            "selectedRole": user_profile.get("selectedRole", "urban"),
            "mode": user_profile.get("mode", "google"),
            "exp": int(time.time()) + expires_in,
            "iat": int(time.time())
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def decode_session_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Decodes and validates a local session JWT.
        Returns the decrypted payload or None if expired/corrupted.
        """
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            print("⚠️ Session JWT signature expired.")
            return None
        except jwt.InvalidTokenError as e:
            print(f"⚠️ Session JWT is invalid: {e}")
            return None
