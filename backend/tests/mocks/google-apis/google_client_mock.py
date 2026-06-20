"""
Google APIs Mock Classes for Python Backend Unit Testing.
Provides offline stub classes for Geocoding API and Google Sheets API.
"""

from typing import Dict, Any, List

class GoogleGeocodingMock:
    """Mock Google Maps Geocoding API Client."""
    
    @staticmethod
    def geocode_address(address: str) -> Dict[str, Any]:
        """Returns standard geocoding coordinates bounds mock response."""
        sanitized = address.strip().lower()
        if "sql" in sanitized or "select" in sanitized or "union" in sanitized:
            # Simple simulation of input sanitization checks
            raise ValueError("Potential injection signature detected in address string.")
            
        return {
            "status": "OK",
            "results": [
                {
                    "formatted_address": f"{address.strip()}, Industrial Zone, India",
                    "geometry": {
                        "location": {"lat": 30.900965, "lng": 75.857277},
                        "viewport": {
                            "northeast": {"lat": 30.910000, "lng": 75.860000},
                            "southwest": {"lat": 30.890000, "lng": 75.850000}
                        }
                    }
                }
            ]
        }



