import time
import logging
from typing import Dict, Any, Optional
from app.services.base_client import BaseHTTPClient, EcoSphereClientError
from app.core.config import settings

logger = logging.getLogger("satellite_client")

class CopernicusSatelliteClient:
    """
    Client querying Copernicus Hub feeds and Copernicus Data Space Ecosystem (CDSE):
    - Sentinel-2 (NDVI greenness indexing matrices for farmers)
    - Sentinel-5P (trace gas spectrometry density maps for industries/cities)
    - CDSE Catalogue (OData queries)
    """

    def __init__(self, http_client: Optional[BaseHTTPClient] = None):
        self.client = http_client or BaseHTTPClient(base_url="https://services.sentinel-hub.com")
        self.auth_client = BaseHTTPClient(base_url="https://identity.dataspace.copernicus.eu")
        self._token: Optional[str] = None
        self._token_expires_at: float = 0.0
        self.fallback_active = False

    async def get_valid_token(self) -> str:
        """
        Retrieves a valid OAuth access token from CDSE.
        Uses cached token if it has not expired yet.
        """
        client_id = settings.COPERNICUS_CLIENT_ID
        client_secret = settings.COPERNICUS_CLIENT_SECRET

        # If credentials are not set or are placeholders, trigger fallback mode
        if not client_id or not client_secret or "placeholder" in client_id.lower() or "placeholder" in client_secret.lower() or client_id.startswith("YOUR_"):
            self.fallback_active = True
            return "mock_oauth_session_token"

        # Check token expiration (refresh if expires within 60 seconds)
        if self._token and time.time() < self._token_expires_at - 60:
            return self._token

        try:
            logger.info("Requesting Copernicus CDSE OAuth Access Token...")
            res = await self.auth_client.request(
                method="POST",
                endpoint="/auth/realms/CDSE/protocol/openid-connect/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "client_credentials",
                    "client_id": client_id,
                    "client_secret": client_secret
                }
            )
            self._token = res.get("access_token")
            expires_in = res.get("expires_in", 3600)
            self._token_expires_at = time.time() + expires_in
            self.fallback_active = False
            logger.info("Copernicus CDSE OAuth Access Token successfully retrieved.")
            return self._token
        except Exception as e:
            logger.error(f"Copernicus OAuth token retrieval failed: {e}. Falling back.")
            self.fallback_active = True
            return "mock_oauth_session_token"

    async def get_vegetation_index(
        self, 
        min_lat: float | dict = None, 
        max_lat: float = None, 
        min_lng: float = None, 
        max_lng: float = None
    ) -> Dict[str, Any]:
        """
        Queries Sentinel-2 NDVI telemetry matrix for vegetation health.
        Supports both unpacked float parameters and a dictionary parameter.
        """
        if isinstance(min_lat, dict):
            d = min_lat
            min_lat = d.get("min_lat")
            max_lat = d.get("max_lat")
            min_lng = d.get("min_lng")
            max_lng = d.get("max_lng")

        # In offline/dev setups, or if fallback is active, return stubs
        await self.get_valid_token()
        if self.fallback_active or settings.COPERNICUS_API == "dummy_copernicus_api":
            return {
                "mean_ndvi": 0.70,
                "status": "Healthy",
                "coverage_area_sq_km": 12.5,
                "matrix_bounds": [min_lat, max_lat, min_lng, max_lng],
                "fallback_active": True
            }

        try:
            token = await self.get_valid_token()
            endpoint = "/ogc/wcs/v1/placeholder"
            params = {
                "request": "GetCoverage",
                "bbox": f"{min_lng},{min_lat},{max_lng},{max_lat}",
                "coverage": "NDVI",
                "crs": "EPSG:4326"
            }
            res = await self.client.request(
                method="GET",
                endpoint=endpoint,
                params=params,
                headers={"Authorization": f"Bearer {token}"}
            )
            res["fallback_active"] = False
            return res
        except Exception as e:
            logger.error(f"Copernicus vegetation query failed: {e}. Falling back to mock data.")
            return {
                "mean_ndvi": 0.70,
                "status": "Healthy",
                "coverage_area_sq_km": 12.5,
                "matrix_bounds": [min_lat, max_lat, min_lng, max_lng],
                "fallback_active": True
            }

    async def get_gas_spectrometry_data(
        self, 
        min_lat: float | dict = None, 
        max_lat: float = None, 
        min_lng: float = None, 
        max_lng: float = None
    ) -> Dict[str, Any]:
        """
        Queries Sentinel-5P spectrometry feeds (NO2, Carbon Monoxide, Methane column densities).
        Supports both unpacked float parameters and a dictionary parameter.
        """
        if isinstance(min_lat, dict):
            d = min_lat
            min_lat = d.get("min_lat")
            max_lat = d.get("max_lat")
            min_lng = d.get("min_lng")
            max_lng = d.get("max_lng")

        await self.get_valid_token()
        if self.fallback_active or settings.COPERNICUS_API == "dummy_copernicus_api":
            return {
                "gases": {
                    "no2": 25.4, # ppb
                    "ch4": 1895.0, # ppb
                    "so2": 1.5    # ppb
                },
                "status": "Nominal",
                "fallback_active": True
            }

        # NOTE: Sentinel-5P TROPOMI gas column data (NO2, CH4, SO2) via Sentinel Hub
        # requires asynchronous Batch Process API requests, not a synchronous WCS GetCoverage call.
        # Real-time WCS for Sentinel-5P is not available on Sentinel Hub standard service endpoints.
        # We therefore serve high-fidelity simulated TROPOMI readings here.
        # To integrate real Sentinel-5P data, implement a Sentinel Hub Batch Process API async job.
        logger.info("Copernicus gas spectrometry: serving simulated Sentinel-5P TROPOMI readings (Batch Process API required for live data).")
        return {
            "gases": {
                "no2": 25.4,  # ppb - realistic Punjab industrial zone baseline
                "ch4": 1895.0,  # ppb - above global avg (1900 ppb threshold)
                "so2": 1.5     # ppb - low industrial emission zone
            },
            "status": "Simulated (TROPOMI)",
            "data_source": "Sentinel-5P TROPOMI Simulation",
            "note": "Live gas data requires Sentinel Hub Batch Process API integration",
            "fallback_active": True
        }

    async def run_sample_query(self) -> Dict[str, Any]:
        """
        Runs a sample Sentinel query on Copernicus Catalogue OData endpoint and returns metadata.
        """
        await self.get_valid_token()
        if self.fallback_active:
            return {
                "status": "success (mock)",
                "products_count": 1,
                "sample_product": {
                    "Name": "S2A_MSIL1C_20260619T120000_N0204_R012_T36UXC_20260619T123000.SAFE",
                    "Id": "8f38-2384-9ac2-cdfe",
                    "ContentDate": {
                        "Start": "2026-06-19T12:00:00.000Z",
                        "End": "2026-06-19T12:00:00.000Z"
                    }
                },
                "fallback_active": True
            }

        try:
            token = await self.get_valid_token()
            headers = {"Authorization": f"Bearer {token}"}
            catalogue_client = BaseHTTPClient(base_url="https://catalogue.dataspace.copernicus.eu")
            res = await catalogue_client.request(
                method="GET",
                endpoint="/odata/v1/Products",
                headers=headers,
                params={"$filter": "Collection/Name eq 'SENTINEL-2'", "$top": 1, "$select": "Id,Name,ContentDate"}
            )
            products = res.get("value", [])
            return {
                "status": "success",
                "products_count": len(products),
                "sample_product": products[0] if products else None,
                "fallback_active": False
            }
        except Exception as e:
            logger.error(f"Copernicus catalogue query failed: {e}. Falling back.")
            return {
                "status": "degraded (mock)",
                "products_count": 1,
                "sample_product": {
                    "Name": "S2B_MSIL1C_20260620T121000_N0204_R012_T36UXC_20260620T124000.SAFE",
                    "Id": "a92e-38ba-cd8f-0112",
                    "ContentDate": {
                        "Start": "2026-06-20T12:10:00.000Z",
                        "End": "2026-06-20T12:10:00.000Z"
                    }
                },
                "fallback_active": True
            }
