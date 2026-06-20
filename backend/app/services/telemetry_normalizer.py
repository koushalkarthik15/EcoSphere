from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class TelemetryNormalizer:
    """
    Normalizes environmental raw telemetry datasets from various sources (GEE, NASA FIRMS, Climate TRACE, Weather)
    into a standardized data payload that the frontend components consume uniformly.
    Standardized Schema:
    {
        "provider": str,
        "timestamp": str,
        "location": { "lat": float, "lng": float, "formatted_address": str },
        "coordinates": { "lat": float, "lng": float },
        "confidence": float,
        "measurement": str,
        "units": str,
        "metadata": dict,
        "fallback_active": bool,
        "quality_score": float (optional, kept for backwards compatibility)
    }
    """

    @staticmethod
    def normalize_gee_sentinel2(data: Dict[str, Any], center_lat: float, center_lng: float) -> Dict[str, Any]:
        """
        Transforms GEE Sentinel-2 MSI metrics into normalized telemetry format.
        """
        stats = data.get("statistics", {})
        mean_ndvi = stats.get("mean_ndvi", 0.0)
        confidence = float(data.get("confidence", 90.0))
        fallback_active = data.get("fallback_active", False)
        
        # Calculate quality score based on confidence and cloud cover
        cloud_cover = stats.get("cloud_cover_percentage", 0.0)
        quality_score = min(max(confidence - cloud_cover * 0.5, 0.0), 100.0)

        return {
            "provider": "Google Earth Engine",
            "timestamp": data.get("timestamp", datetime.now(timezone.utc).isoformat() + "Z"),
            "location": {
                "lat": center_lat,
                "lng": center_lng,
                "formatted_address": f"Polygon Center ({center_lat:.4f}, {center_lng:.4f})"
            },
            "coordinates": {
                "lat": center_lat,
                "lng": center_lng
            },
            "confidence": confidence,
            "measurement": "Vegetation Index (NDVI)",
            "units": "index",
            "metadata": {
                "instrument": data.get("instrument", "Sentinel-2 MSI"),
                "vegetation_health_status": stats.get("vegetation_health_status", "Nominal"),
                "estimated_biomass_tons_per_hectare": stats.get("estimated_biomass_tons_per_hectare", 0.0),
                "cloud_cover_percentage": cloud_cover
            },
            "quality_score": round(quality_score, 2),
            "fallback_active": fallback_active
        }

    @staticmethod
    def normalize_gee_sentinel1(data: Dict[str, Any], center_lat: float, center_lng: float) -> Dict[str, Any]:
        """
        Transforms GEE Sentinel-1 SAR metrics into normalized telemetry format.
        """
        stats = data.get("statistics", {})
        sm_percent = stats.get("estimated_soil_moisture_percent", 0.0)
        confidence = float(data.get("confidence", 85.0))
        fallback_active = data.get("fallback_active", False)
        
        # Quality score based on signal strength/polarizations
        quality_score = min(max(confidence * 0.95, 0.0), 100.0)

        return {
            "provider": "Google Earth Engine",
            "timestamp": data.get("timestamp", datetime.now(timezone.utc).isoformat() + "Z"),
            "location": {
                "lat": center_lat,
                "lng": center_lng,
                "formatted_address": f"SAR Cell Grid ({center_lat:.4f}, {center_lng:.4f})"
            },
            "coordinates": {
                "lat": center_lat,
                "lng": center_lng
            },
            "confidence": confidence,
            "measurement": "Soil Moisture Index",
            "units": "percent",
            "metadata": {
                "instrument": data.get("instrument", "Sentinel-1 SAR"),
                "backscatter_vv_db": stats.get("backscatter_vv_db", 0.0),
                "backscatter_vh_db": stats.get("backscatter_vh_db", 0.0),
                "flood_inundation_fraction": stats.get("flood_inundation_fraction", 0.0),
                "radar_anomaly_detected": stats.get("radar_anomaly_detected", False)
            },
            "quality_score": round(quality_score, 2),
            "fallback_active": fallback_active
        }

    @staticmethod
    def normalize_gee_landsat(data: Dict[str, Any], center_lat: float, center_lng: float) -> Dict[str, Any]:
        """
        Transforms GEE Landsat metrics into normalized telemetry format.
        """
        stats = data.get("statistics", {})
        lst = stats.get("mean_land_surface_temperature_celsius", 0.0)
        confidence = float(data.get("confidence", 85.0))
        fallback_active = data.get("fallback_active", False)
        quality_score = min(max(confidence * 0.90, 0.0), 100.0)

        return {
            "provider": "Google Earth Engine",
            "timestamp": data.get("timestamp", datetime.now(timezone.utc).isoformat() + "Z"),
            "location": {
                "lat": center_lat,
                "lng": center_lng,
                "formatted_address": f"Thermal Observation Zone ({center_lat:.4f}, {center_lng:.4f})"
            },
            "coordinates": {
                "lat": center_lat,
                "lng": center_lng
            },
            "confidence": confidence,
            "measurement": "Land Surface Temperature",
            "units": "Celsius",
            "metadata": {
                "instrument": data.get("instrument", "Landsat-8 TIRS"),
                "urban_heat_island_intensity_index": stats.get("urban_heat_island_intensity_index", 0.0),
                "historical_time_series": stats.get("historical_time_series", [])
            },
            "quality_score": round(quality_score, 2),
            "fallback_active": fallback_active
        }

    @staticmethod
    def normalize_nasa_firms(fire_event: Dict[str, Any], timestamp_str: Optional[str] = None) -> Dict[str, Any]:
        """
        Transforms individual NASA FIRMS active fire coordinate items into normalized telemetry format.
        """
        brightness = fire_event.get("brightness", 300.0)
        fallback_active = fire_event.get("fallback_active", False)
        # Determine confidence based on brightness index
        confidence = min(max((brightness - 250.0) / 1.5, 30.0), 99.0)
        quality_score = min(max(confidence * 1.01, 0.0), 100.0)

        lat = fire_event.get("lat", 0.0)
        lng = fire_event.get("lng", 0.0)

        return {
            "provider": "NASA FIRMS",
            "timestamp": timestamp_str or datetime.now(timezone.utc).isoformat() + "Z",
            "location": {
                "lat": lat,
                "lng": lng,
                "formatted_address": f"Fire Hotspot Lat {lat:.4f}, Lng {lng:.4f}"
            },
            "coordinates": {
                "lat": lat,
                "lng": lng
            },
            "confidence": round(confidence, 1),
            "measurement": "Active Thermal Anomalies",
            "units": "count",
            "metadata": {
                "brightness_t31": brightness,
                "scan_time": fire_event.get("scan_time", ""),
                "is_stubble_burn_indicator": brightness > 310.0
            },
            "quality_score": round(quality_score, 2),
            "fallback_active": fallback_active
        }

    @staticmethod
    def normalize_climate_trace(facility_data: Dict[str, Any], lat: float, lng: float) -> Dict[str, Any]:
        """
        Transforms Climate TRACE greenhouse gas asset inventories into normalized telemetry format.
        """
        annual_co2e = facility_data.get("annual_emissions_co2_equivalent_tons", 0.0)
        fallback_active = facility_data.get("fallback_active", False)
        # Higher confidence for validated Climate TRACE registry assets
        confidence = 95.0
        quality_score = 98.0

        return {
            "provider": "Climate TRACE",
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "location": {
                "lat": lat,
                "lng": lng,
                "formatted_address": f"Facility ID {facility_data.get('facility_id', 'unknown')}"
            },
            "coordinates": {
                "lat": lat,
                "lng": lng
            },
            "confidence": confidence,
            "measurement": "Industrial Greenhouse Gas Emissions",
            "units": "tons CO2e",
            "metadata": {
                "facility_id": facility_data.get("facility_id", ""),
                "industrial_sector": facility_data.get("sector", ""),
                "gases_breakdown": facility_data.get("gases", {})
            },
            "quality_score": quality_score,
            "fallback_active": fallback_active
        }

    @staticmethod
    def normalize_openweather(weather_data: Dict[str, Any], lat: float, lng: float) -> Dict[str, Any]:
        """
        Transforms weather data elements into normalized telemetry format.
        """
        confidence = float(weather_data.get("confidence", 90.0))
        fallback_active = weather_data.get("fallback_active", False)
        quality_score = confidence * 0.95

        return {
            "provider": "OpenWeather",
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "location": {
                "lat": lat,
                "lng": lng,
                "formatted_address": weather_data.get("name", f"Region {lat:.2f}, {lng:.2f}")
            },
            "coordinates": {
                "lat": lat,
                "lng": lng
            },
            "confidence": confidence,
            "measurement": "Atmospheric Conditions",
            "units": "Celsius",
            "metadata": {
                "temperature_celsius": weather_data.get("temp", 20.0),
                "humidity_percent": weather_data.get("humidity", 50.0),
                "wind_speed_mps": weather_data.get("wind_speed", 3.5),
                "description": weather_data.get("description", "clear sky")
            },
            "quality_score": round(quality_score, 2),
            "fallback_active": fallback_active
        }
