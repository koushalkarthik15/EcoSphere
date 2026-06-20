import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_and_session_routes():
    """Checks OAuth mock login, session profile loading, and logout routing."""
    # 1. Login request with google token
    login_payload = {"id_token": "mock_google_id_token_vignesh"}
    res = client.post("/api/v1/auth/login", json=login_payload)
    
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "vignesh@example.com"
    assert data["selectedRole"] == "urban"
    
    # Session cookie should be set
    assert "ecosphere_session" in res.cookies
    session_cookie = res.cookies["ecosphere_session"]
    
    # 2. Access session check endpoint
    # Pass session cookie
    res_session = client.get("/api/v1/auth/session", cookies={"ecosphere_session": session_cookie})
    assert res_session.status_code == 200
    assert res_session.json()["id"] == data["id"]
    
    # 3. Request role switch to farmer
    res_role = client.post(
        "/api/v1/auth/role", 
        json={"role": "farmer"}, 
        cookies={"ecosphere_session": session_cookie}
    )
    assert res_role.status_code == 200
    assert res_role.json()["selectedRole"] == "farmer"
    
    # 4. Logout endpoint
    res_logout = client.post("/api/v1/auth/logout")
    assert res_logout.status_code == 200
    # Cookie should be cleared (deleted value or expiration in past)
    # The client cookies should no longer contain valid sessions
