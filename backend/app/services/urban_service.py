from typing import Dict, Any, Optional
from app.services.satellite_client import CopernicusSatelliteClient
from app.core.config import settings

class UrbanTelemetryService:
    """
    Coordinates environmental data parsing for the Urban Citizen view.
    Combines Sentinel-5P, Landsat surface indicators, and historical baselines.
    """

    def __init__(self, satellite_client: Optional[CopernicusSatelliteClient] = None):
        self.satellite_client = satellite_client or CopernicusSatelliteClient()

    async def get_normalized_telemetry(
        self, 
        lat: float, 
        lng: float,
        bounds: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Gathers NO2 values, surface temperature readings, and maps baseline variances.
        """
        # Formulate coordinate bounding viewport
        min_lat = bounds.get("min_lat", lat - 0.01) if bounds else lat - 0.01
        max_lat = bounds.get("max_lat", lat + 0.01) if bounds else lat + 0.01
        min_lng = bounds.get("min_lng", lng - 0.01) if bounds else lng - 0.01
        max_lng = bounds.get("max_lng", lng + 0.01) if bounds else lng + 0.01

        # Fetch gas spectrometry data from Sentinel-5P wrapper
        gas_data = await self.satellite_client.get_gas_spectrometry_data(
            min_lat=min_lat, max_lat=max_lat, min_lng=min_lng, max_lng=max_lng
        )

        gases = gas_data.get("gases", {})
        no2_val = gases.get("no2", 24.5)
        ch4_val = gases.get("ch4", 1890.0)

        # Landsat Surface Temperature Simulation
        # Paved surfaces are warmer. Let's model a standard heat island reading (3C higher than ambient)
        base_temp = 28.5
        heat_island_surface_temp = base_temp + 3.2

        # Evaluate Air Quality Index Rating
        if no2_val < 20.0:
            aqi_status = "healthy"
            aqi_label = "Good"
        elif no2_val < 40.0:
            aqi_status = "neutral"
            aqi_label = "Moderate"
        else:
            aqi_status = "warning"
            aqi_label = "Elevated"

        # Compare against historical pollution baseline (Punjabi / Delhi urban baselines)
        historical_no2_baseline = 22.1
        variance_percentage = round(((no2_val - historical_no2_baseline) / historical_no2_baseline) * 100, 1)
        fallback_active = gas_data.get("fallback_active", False)

        return {
            "coordinates": {"lat": lat, "lng": lng},
            "air_quality": {
                "no2_ppb": no2_val,
                "ch4_ppb": ch4_val,
                "status": aqi_status,
                "label": aqi_label,
                "baseline_comparison": {
                    "historical_no2": historical_no2_baseline,
                    "variance_percentage": variance_percentage
                },
                "fallback_active": fallback_active
            },
            "surface_temperature": {
                "landsat_surface_c": round(heat_island_surface_temp, 1),
                "ambient_air_c": round(base_temp, 1),
                "heat_island_intensity": "moderate (+3.2°C)",
                "fallback_active": True # Surface temp is mocked locally in urban service
            }
        }
