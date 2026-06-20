from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api import auth, urban, farmer, industry, marketplace, intelligence
from app.services.background_jobs import BackgroundTelemetryRefresher

# Initialize SlowAPI rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="EcoSphere environmental intelligence API",
    description="Backend services for Urban Citizen, Farmer, and Industry telemetry.",
    version="1.0.0"
)

# Register rate limiter handles
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configurations for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for security headers (OWASP/Helmet rules)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.dicebear.com;"
    return response

# Instantiate background refresher
refresher = BackgroundTelemetryRefresher()

@app.on_event("startup")
async def startup_event():
    await refresher.start()

@app.on_event("shutdown")
async def shutdown_event():
    await refresher.stop()

# Register API Routers
app.include_router(auth.router)
app.include_router(urban.router)
app.include_router(farmer.router)
app.include_router(industry.router)
app.include_router(marketplace.router)
app.include_router(intelligence.router)

@app.get("/health", tags=["System"])
async def health_check():
    """
    Standard health check endpoint.
    """
    return {
        "status": "healthy",
        "environment": settings.FASTAPI_ENV
    }

