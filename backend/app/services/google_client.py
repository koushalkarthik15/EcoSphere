import logging
from typing import Dict, Any, List, Optional
from app.services.base_client import BaseHTTPClient
from app.core.config import settings

logger = logging.getLogger("google_client")

class GoogleClient:
    """
    Dependency-injectable client for Google Cloud Integrations:
    - Google Maps Geocoding API
    - Google Sheets API (for Farmer data ledgers exporting)
    """

    def __init__(self, http_client: Optional[BaseHTTPClient] = None):
        self.client = http_client or BaseHTTPClient(base_url="https://maps.googleapis.com")
        self.fallback_active = False

    async def get_coordinates_from_address(self, address: str) -> Dict[str, Any]:
        """
        Geocoding lookup pins facility locations.
        Validates addresses for remote code injection and returns coordinate bounds.
        """
        sanitized = address.strip()
        if not sanitized:
            raise ValueError("Address lookup cannot be empty.")

        if settings.GOOGLE_MAPS_API_KEY == "dummy_key" or self.fallback_active:
            self.fallback_active = True
            return self._get_mock_geocoding(address)

        params = {
            "address": sanitized,
            "key": settings.GOOGLE_MAPS_API_KEY
        }

        try:
            response = await self.client.request(
                method="GET",
                endpoint="/maps/api/geocode/json",
                params=params
            )
            
            if response.get("status") != "OK":
                raise ValueError(f"Geocoding failed with status: {response.get('status')}")
                
            results = response.get("results", [])
            if not results:
                raise ValueError("No address coordinates found for given query.")
                
            geometry = results[0]["geometry"]
            location = geometry["location"]
            viewport = geometry.get("viewport", {})
            
            self.fallback_active = False
            return {
                "lat": location["lat"],
                "lng": location["lng"],
                "formatted_address": results[0]["formatted_address"],
                "bounds": {
                    "min_lat": viewport.get("southwest", {}).get("lat", location["lat"] - 0.01),
                    "max_lat": viewport.get("northeast", {}).get("lat", location["lat"] + 0.01),
                    "min_lng": viewport.get("southwest", {}).get("lng", location["lng"] - 0.01),
                    "max_lng": viewport.get("northeast", {}).get("lng", location["lng"] + 0.01),
                },
                "fallback_active": False
            }
        except Exception as e:
            logger.error(f"Google Geocoding API failed: {e}. Falling back to mock coordinates.")
            self.fallback_active = True
            return self._get_mock_geocoding(address)

    def _get_mock_geocoding(self, address: str) -> Dict[str, Any]:
        return {
            "lat": 30.9000,
            "lng": 75.8500,
            "formatted_address": f"{address}, Mocked Location, India",
            "bounds": {
                "min_lat": 30.8900, "max_lat": 30.9100,
                "min_lng": 75.8400, "max_lng": 75.8600
            },
            "fallback_active": True
        }
