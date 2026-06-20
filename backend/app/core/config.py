import os
from typing import Optional, List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    EcoSphere Application Settings.
    Loads and validates all necessary environment variables.
    """

    # Application
    FASTAPI_ENV: str = Field(default="development", alias="FASTAPI_ENV")
    PORT: int = Field(default=8000)

    # Frontend
    FRONTEND_URL: str = Field(
        default="http://localhost:3000",
        alias="FRONTEND_URL"
    )

    # NEW: comma-separated list of allowed frontend origins
    CORS_ORIGINS: str = Field(
        default="http://localhost:3000,https://eco-sphere-ntbi-git-main-koushalkarthik15s-projects.vercel.app",
        alias="CORS_ORIGINS"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # Google
    GOOGLE_MAPS_API_KEY: str = Field(..., alias="GOOGLE_MAPS_API_KEY")
    GOOGLE_CLIENT_ID: str = Field(..., alias="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(..., alias="GOOGLE_CLIENT_SECRET")

    GOOGLE_PAY_MERCHANT_ID: Optional[str] = Field(
        default=None,
        alias="GOOGLE_PAY_MERCHANT_ID"
    )

    GOOGLE_SHEETS_CLIENT: Optional[str] = Field(
        default=None,
        alias="GOOGLE_SHEETS_CLIENT"
    )

    # Environmental APIs
    NASA_FIRMS_API: str = Field(..., alias="NASA_FIRMS_API")
    COPERNICUS_API: str = Field(..., alias="COPERNICUS_API")
    COPERNICUS_CLIENT_ID: Optional[str] = Field(default=None, alias="COPERNICUS_CLIENT_ID")
    COPERNICUS_CLIENT_SECRET: Optional[str] = Field(default=None, alias="COPERNICUS_CLIENT_SECRET")

    CLIMATE_TRACE_ENDPOINT: str = Field(
        default="https://api.climatetrace.org/v7",
        alias="CLIMATE_TRACE_ENDPOINT"
    )

    GOOGLE_EARTH_ENGINE_PROJECT: Optional[str] = Field(
        default=None,
        alias="GOOGLE_EARTH_ENGINE_PROJECT"
    )

    # JWT
    JWT_SECRET: str = Field(..., alias="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", alias="JWT_ALGORITHM")

    model_config = SettingsConfigDict(
        env_file=os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )


try:
    settings = Settings()
except Exception as e:
    import sys

    print(f"❌ Backend configuration load error: {e}", file=sys.stderr)

    os.environ.setdefault("GOOGLE_MAPS_API_KEY", "dummy_key")
    os.environ.setdefault("GOOGLE_CLIENT_ID", "dummy_client_id")
    os.environ.setdefault("GOOGLE_CLIENT_SECRET", "dummy_client_secret")
    os.environ.setdefault("NASA_FIRMS_API", "dummy_nasa_api")
    os.environ.setdefault("COPERNICUS_API", "dummy_copernicus_api")
    os.environ.setdefault("JWT_SECRET", "super_secret_key_for_testing_purposes_only")
    os.environ.setdefault("JWT_ALGORITHM", "HS256")
    os.environ.setdefault(
    "CORS_ORIGINS",
    "http://localhost:3000,https://eco-sphere-ntbi-git-main-koushalkarthik15s-projects.vercel.app"
)

    settings = Settings()