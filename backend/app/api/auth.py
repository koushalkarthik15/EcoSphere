from fastapi import APIRouter, Response, Request, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional
import os
import json
import uuid
import hashlib
from app.core.security import SecurityManager

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

COOKIE_NAME = "ecosphere_session"
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "users.json")

# Pydantic Schemas for Requests/Responses
class LoginRequest(BaseModel):
    id_token: str

class RoleUpdateRequest(BaseModel):
    role: str = Field(..., description="Role must be 'urban', 'farmer', or 'industry'")

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    selectedRole: str
    mode: Optional[str] = "google"

class LocalRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    preferredRole: str

class LocalLoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False

# Lightweight local database helpers
def hash_password(password: str, salt: bytes = None) -> tuple[str, str]:
    if salt is None:
        salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return key.hex(), salt.hex()

def verify_password(stored_hash: str, salt_hex: str, password_to_check: str) -> bool:
    try:
        salt = bytes.fromhex(salt_hex)
        key = hashlib.pbkdf2_hmac(
            'sha256',
            password_to_check.encode('utf-8'),
            salt,
            100000
        )
        return key.hex() == stored_hash
    except Exception:
        return False

def get_local_users() -> dict:
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_local_users(users: dict):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Failed to save local users database: {e}")

# Helper to extract current user from HTTP cookie
async def get_current_user(request: Request) -> UserProfile:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing session token."
        )
    payload = SecurityManager.decode_session_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token is invalid or expired."
        )
    return UserProfile(
        id=payload["id"],
        name=payload["name"],
        email=payload["email"],
        avatar=payload["avatar"],
        selectedRole=payload["selectedRole"],
        mode=payload.get("mode", "google")
    )

@router.post("/register", response_model=UserProfile)
async def register(register_data: LocalRegisterRequest):
    """
    Registers a new local account, hashes credentials securely, and stores the profile.
    """
    users = get_local_users()
    email_clean = register_data.email.strip().lower()
    
    if not register_data.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name cannot be empty."
        )
    if not email_clean or "@" not in email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )
    if len(register_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters."
        )
    if register_data.preferredRole.strip().lower() not in ["urban", "farmer", "industry"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid preferred role selected."
        )
        
    if email_clean in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
        
    pwd_hash, salt_hex = hash_password(register_data.password)
    
    # Determine avatar seed
    avatar_seed = register_data.name.strip().replace(" ", "_")
    avatar = f"https://api.dicebear.com/7.x/adventurer/svg?seed={avatar_seed}"
    user_id = f"local_{uuid.uuid4().hex[:8]}"
    
    new_user = {
        "id": user_id,
        "name": register_data.name.strip(),
        "email": email_clean,
        "avatar": avatar,
        "selectedRole": register_data.preferredRole.strip().lower(),
        "password_hash": pwd_hash,
        "salt": salt_hex
    }
    
    users[email_clean] = new_user
    save_local_users(users)
    
    return UserProfile(
        id=user_id,
        name=new_user["name"],
        email=new_user["email"],
        avatar=new_user["avatar"],
        selectedRole=new_user["selectedRole"],
        mode="local"
    )

@router.post("/local-login", response_model=UserProfile)
async def local_login(login_data: LocalLoginRequest, response: Response, request: Request):
    """
    Authenticates a local user via hashed password comparison and sets session cookies.
    """
    users = get_local_users()
    email_clean = login_data.email.strip().lower()
    
    user = users.get(email_clean)
    if not user or not verify_password(user["password_hash"], user["salt"], login_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    profile = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "avatar": user["avatar"],
        "selectedRole": user["selectedRole"],
        "mode": "local"
    }
    
    session_jwt = SecurityManager.create_session_token(profile)
    is_secure = request.url.scheme == "https"
    
    # Cookie expiration based on Remember Me
    max_age = 86400 * 30 if login_data.rememberMe else 86400 # 30 days or 1 day
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=session_jwt,
        httponly=True,
        max_age=max_age,
        secure=is_secure,
        samesite="lax",
        path="/"
    )
    
    return UserProfile(**profile)

@router.post("/login", response_model=UserProfile)
async def login(login_data: LoginRequest, response: Response, request: Request):
    """
    Accepts Google OAuth token, creates session JWT, and sets it in an HTTP-only cookie.
    """
    google_profile = SecurityManager.verify_google_token(login_data.id_token)
    if not google_profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google OAuth token."
        )
    
    # Establish minimum user profile
    user_id = google_profile.get("sub", "")
    name = google_profile.get("name", "")
    email = google_profile.get("email", "")
    avatar = google_profile.get("picture", "")
    
    # Default role selection
    selected_role = "urban"
    
    profile = {
        "id": user_id,
        "name": name,
        "email": email,
        "avatar": avatar,
        "selectedRole": selected_role,
        "mode": "google"
    }
    
    session_jwt = SecurityManager.create_session_token(profile)
    
    # Set secure HTTP-only cookie
    is_secure = request.url.scheme == "https"
    response.set_cookie(
        key=COOKIE_NAME,
        value=session_jwt,
        httponly=True,
        max_age=86400, # 1 day
        secure=is_secure,
        samesite="lax",
        path="/"
    )
    
    return UserProfile(**profile)

@router.post("/logout")
async def logout(response: Response):
    """
    Clears the active user session cookie.
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        samesite="lax"
    )
    return {"message": "Logged out successfully."}

@router.get("/session", response_model=UserProfile)
async def session_check(current_user: UserProfile = Depends(get_current_user)):
    """
    Validates current active session cookie and returns user profile.
    """
    return current_user

@router.post("/role", response_model=UserProfile)
async def update_role(
    role_data: RoleUpdateRequest,
    response: Response,
    request: Request,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Updates the active persona role in the session and re-issues the session cookie.
    """
    target_role = role_data.role.strip().lower()
    if target_role not in ["urban", "farmer", "industry"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role selected. Must be 'urban', 'farmer', or 'industry'."
        )
    
    updated_profile = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "avatar": current_user.avatar,
        "selectedRole": target_role,
        "mode": current_user.mode
    }
    
    new_jwt = SecurityManager.create_session_token(updated_profile)
    is_secure = request.url.scheme == "https"
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=new_jwt,
        httponly=True,
        max_age=86400,
        secure=is_secure,
        samesite="lax",
        path="/"
    )
    
    return UserProfile(**updated_profile)
