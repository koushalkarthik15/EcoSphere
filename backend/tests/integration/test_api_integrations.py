import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.satellite_client import CopernicusSatelliteClient
from app.services.climate_trace_client import ClimateTraceClient
from app.services.firms_client import FirmsClient
from app.services.google_client import GoogleClient
from app.services.telemetry_normalizer import TelemetryNormalizer
from fastapi.testclient import TestClient
from app.main import app
import httpx

client = TestClient(app)

@pytest.mark.asyncio
async def test_copernicus_client_oauth_and_query():
    """Verify Copernicus client authentication, token refresh, and Sentinel query."""
    with patch("app.services.base_client.BaseHTTPClient.request") as mock_request, \
         patch("app.core.config.settings.COPERNICUS_CLIENT_ID", "sh-38aa69b4-c373-4247-b570-7b16e9723c77"), \
         patch("app.core.config.settings.COPERNICUS_CLIENT_SECRET", "j5jt45lz1Vt1ou8kxn4BnHlYjppFeAh7"):
        # Mock successful token retrieval
        mock_request.side_effect = [
            {"access_token": "valid_token_abc", "expires_in": 3600}, # Auth call
            {"value": [{"Id": "prod1", "Name": "Sentinel-2 Image", "ContentDate": {"Start": "2026-06-20"}}] } # Query call
        ]

        copernicus_client = CopernicusSatelliteClient()
        
        # Test token retrieval
        token = await copernicus_client.get_valid_token()
        assert token == "valid_token_abc"
        assert not copernicus_client.fallback_active

        # Test sample query
        query_res = await copernicus_client.run_sample_query()
        assert query_res["status"] == "success"
        assert query_res["products_count"] == 1
        assert not query_res["fallback_active"]

@pytest.mark.asyncio
async def test_copernicus_client_fallback():
    """Verify Copernicus client handles connection errors gracefully."""
    with patch("app.services.base_client.BaseHTTPClient.request", new_callable=AsyncMock) as mock_request:
        # Induce exception
        mock_request.side_effect = Exception("Connection timed out")

        copernicus_client = CopernicusSatelliteClient()
        
        # Oauth should degrade and return simulated token
        token = await copernicus_client.get_valid_token()
        assert token == "mock_oauth_session_token"
        assert copernicus_client.fallback_active

        # Query should fall back to mock data
        query_res = await copernicus_client.run_sample_query()
        assert "mock" in query_res["status"]
        assert query_res["fallback_active"]

@pytest.mark.asyncio
async def test_climate_trace_v7_client():
    """Verify Climate TRACE client v7 endpoint calls and pagination."""
    with patch("app.services.base_client.BaseHTTPClient.request") as mock_request:
        mock_request.return_value = {
            "sources": [{"facility_id": "test_fac", "name": "Facility A"}],
            "total_count": 1,
            "fallback_active": False
        }

        ct_client = ClimateTraceClient()
        res = await ct_client.get_sources(year=2025, limit=5, offset=0)
        assert "sources" in res
        assert not res["fallback_active"]

@pytest.mark.asyncio
async def test_nasa_firms_client_parsing():
    """Verify NASA FIRMS client active fire CSV decoding and coordinate mappings."""
    with patch("app.services.base_client.BaseHTTPClient.request") as mock_request:
        mock_csv = "latitude,longitude,bright_t31,acq_time\n30.901,75.850,318.5,12:00"
        mock_request.return_value = {"text": mock_csv}

        firms_client = FirmsClient()
        res = await firms_client.get_active_fires_in_region(30.8, 31.0, 75.7, 75.9)
        assert len(res) == 1
        assert res[0]["lat"] == 30.901
        assert res[0]["lng"] == 75.850
        assert res[0]["brightness"] == 318.5
        assert not res[0]["fallback_active"]

@pytest.mark.asyncio
async def test_google_client_geocoding_fallback():
    """Verify Google client maps geocoding handles connection failure."""
    with patch("app.services.base_client.BaseHTTPClient.request") as mock_request:
        mock_request.side_effect = Exception("API Key limit reached")

        google_client = GoogleClient()
        res = await google_client.get_coordinates_from_address("Ludhiana, India")
        assert res["lat"] == 30.9000
        assert res["lng"] == 75.8500
        assert res["fallback_active"]

def test_telemetry_normalization_schema():
    """Verify telemetry normalization strictly structures raw datasets into standard EcoSphere schema."""
    raw_fire = {"lat": 31.634, "lng": 74.872, "brightness": 315.2, "scan_time": "14:00", "fallback_active": True}
    normalized = TelemetryNormalizer.normalize_nasa_firms(raw_fire)
    
    assert normalized["provider"] == "NASA FIRMS"
    assert "timestamp" in normalized
    assert normalized["location"]["lat"] == 31.634
    assert normalized["location"]["lng"] == 74.872
    assert normalized["coordinates"]["lat"] == 31.634
    assert normalized["coordinates"]["lng"] == 74.872
    assert normalized["fallback_active"] is True
    assert "measurement" in normalized
    assert "units" in normalized

def test_api_health_endpoint():
    """Verify the API health endpoint responds with full status audits report metadata."""
    res = client.get("/api/v1/intelligence/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "providers" in data
    assert "cache" in data
    
    # Check that it contains all audited providers
    provider_names = [p["name"] for p in data["providers"]]
    assert "Google Maps Geocoding" in provider_names
    assert "Google Earth Engine" in provider_names
    assert "Google Sheets API" in provider_names
    assert "Google Identity OAuth" in provider_names
    assert "Copernicus CDSE Hub" in provider_names
    assert "NASA FIRMS Active Fires" in provider_names
    assert "Climate TRACE (v7)" in provider_names
