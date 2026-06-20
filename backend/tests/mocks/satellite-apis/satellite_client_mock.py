"""
Satellite APIs Mock Classes for Python Backend Unit Testing.
Provides offline stub classes for Copernicus Sentinel-2/5P and NASA FIRMS.
"""

from typing import Dict, Any, List

class CopernicusSentinelMock:
    """Mock Copernicus Sentinel-2 (NDVI) & Sentinel-5P (Gas Spectrometry) API Client."""
    
    @staticmethod
    def get_ndvi_matrix(lat: float, lng: float, radius_km: float = 5.0) -> Dict[str, Any]:
        """Simulates Copernicus Sentinel-2 greenness index matrix lookup."""
        return {
            "center": {"lat": lat, "lng": lng},
            "radius_km": radius_km,
            "mean_ndvi": 0.68,
            "min_ndvi": 0.42,
            "max_ndvi": 0.81,
            "matrix_dimensions": "100x100"
        }

    @staticmethod
    def get_gas_spectrometry(bounds: Dict[str, float]) -> Dict[str, Any]:
        """Simulates Sentinel-5P trace gas density measurements (NO2, Methane)."""
        return {
            "bounds": bounds,
            "spectrometry": {
                "no2_density_mol_m2": 0.000085,
                "ch4_column_ppb": 1885.2,
                "so2_density_mol_m2": 0.000012
            }
        }


class NasaFirmsMock:
    """Mock NASA FIRMS active thermal alert checker."""
    
    def __init__(self):
        # Sample coordinates containing fires (e.g. stubble burns)
        self.active_fire_database = [
            {"lat": 30.905, "lng": 75.858, "brightness": 320.5},
            {"lat": 31.020, "lng": 76.100, "brightness": 345.2}
        ]

    def check_boundary_for_fires(self, bounds: Dict[str, float]) -> Dict[str, Any]:
        """
        Scans bounds for active thermal coordinates.
        If fire data coordinates fall inside boundaries, returns DANGER status.
        """
        min_lat = bounds.get("min_lat", 30.0)
        max_lat = bounds.get("max_lat", 32.0)
        min_lng = bounds.get("min_lng", 75.0)
        max_lng = bounds.get("max_lng", 77.0)

        intersecting_fires = []
        for fire in self.active_fire_database:
            if min_lat <= fire["lat"] <= max_lat and min_lng <= fire["lng"] <= max_lng:
                intersecting_fires.append(fire)

        if intersecting_fires:
            return {
                "active_burns_detected": len(intersecting_fires),
                "status": "DANGER",
                "fires": intersecting_fires
            }
            
        return {
            "active_burns_detected": 0,
            "status": "SAFE",
            "fires": []
        }
