import logging
from typing import Dict, Any, List, Optional
from app.services.base_client import BaseHTTPClient
from app.core.config import settings

logger = logging.getLogger("firms_client")

class FirmsClient:
    """
    Dependency-injectable client querying NASA FIRMS active fire telemetry feeds.
    Detects stubble burning thermal coordinate markers and handles graceful failover.
    """

    def __init__(self, http_client: Optional[BaseHTTPClient] = None):
        self.client = http_client or BaseHTTPClient(base_url="https://firms.modaps.eosdis.nasa.gov")
        self.fallback_active = False

    async def get_active_fires_in_region(
        self, 
        min_lat: float, 
        max_lat: float, 
        min_lng: float, 
        max_lng: float
    ) -> List[Dict[str, Any]]:
        """
        Retrieves active fire thermal indicators within a coordinates bounding box.
        """
        if settings.NASA_FIRMS_API == "dummy_nasa_api" or self.fallback_active:
            self.fallback_active = True
            return self._get_mock_fires()

        # Official NASA FIRMS query endpoint path, using 10 days to increase detection chance
        endpoint = f"/api/area/csv/{settings.NASA_FIRMS_API}/MODIS_SP/{min_lng},{min_lat},{max_lng},{max_lat}/10"
        
        try:
            csv_response = await self.client.request(
                method="GET",
                endpoint=endpoint
            )
            
            lines = csv_response.get("text", "").strip().split("\n")
            if len(lines) <= 1:
                self.fallback_active = False
                return []
                
            header = lines[0].split(",")
            results = []
            for line in lines[1:]:
                values = line.split(",")
                if len(values) == len(header):
                    row = dict(zip(header, values))
                    try:
                        results.append({
                            "lat": float(row.get("latitude", 0.0)),
                            "lng": float(row.get("longitude", 0.0)),
                            "brightness": float(row.get("bright_t31", 0.0)),
                            "scan_time": row.get("acq_time", ""),
                            "fallback_active": False
                        })
                    except ValueError:
                        continue
            
            self.fallback_active = False
            return results
        except Exception as e:
            logger.error(f"NASA FIRMS active fire query failed: {e}. Falling back to mock data.")
            self.fallback_active = True
            return self._get_mock_fires()

    def _get_mock_fires(self) -> List[Dict[str, Any]]:
        """Returns mock active fire coordinates."""
        return [
            {"lat": 30.905, "lng": 75.858, "brightness": 312.4, "scan_time": "12:30", "fallback_active": True},
            {"lat": 30.898, "lng": 75.852, "brightness": 320.1, "scan_time": "14:15", "fallback_active": True}
        ]
