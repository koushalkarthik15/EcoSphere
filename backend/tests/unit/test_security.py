import pytest
import time
import jwt
from app.core.security import SecurityManager
from app.core.config import settings

def test_google_mock_token_verification():
    """Verifies that SecurityManager correctly parses simulated google id tokens."""
    token = "mock_google_id_token_testuser"
    profile = SecurityManager.verify_google_token(token)
    
    assert profile is not None
    assert profile["email"] == "testuser@example.com"
    assert profile["name"] == "Testuser"
    assert profile["sub"] == "google_mock_google_id_token_testuser"


def test_session_jwt_lifecycle():
    """Ensures local user sessions JWTs encode and decode successfully."""
    profile = {
        "id": "google_12345",
        "name": "Karthik",
        "email": "karthik@example.com",
        "avatar": "https://avatar.url",
        "selectedRole": "urban"
    }
    
    # Create token
    token = SecurityManager.create_session_token(profile, expires_in=100)
    assert isinstance(token, str)
    
    # Decode token
    decoded = SecurityManager.decode_session_token(token)
    assert decoded is not None
    assert decoded["id"] == profile["id"]
    assert decoded["name"] == profile["name"]
    assert decoded["selectedRole"] == "urban"


def test_expired_session_jwt():
    """Verifies that expired session JWTs return None."""
    profile = {"id": "google_12345"}
    
    # Create token with expired time in past
    token = SecurityManager.create_session_token(profile, expires_in=-10)
    decoded = SecurityManager.decode_session_token(token)
    
    assert decoded is None
