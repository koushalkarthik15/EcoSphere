import pytest
import time
from unittest.mock import AsyncMock, MagicMock
from app.services.gee_client import GeeClient
from app.services.telemetry_normalizer import TelemetryNormalizer
from app.services.intelligence_engine import EnvironmentalIntelligenceEngine, SmartCache
from app.services.ai_recommendation_engine import AIRecommendationEngine
from app.services.cross_module_intelligence import CrossModuleIntelligence

def test_gee_client_mock_fallbacks():
    client = GeeClient()
    # Explicitly force dummy mode to verify mocks
    client.is_dummy = True
    
    # Sentinel-2
    coords = [[30.9, 75.8], [30.9, 75.9], [31.0, 75.9], [31.0, 75.8], [30.9, 75.8]]
    import asyncio
    s2_data = asyncio.run(client.get_sentinel2_data(coords))
    assert s2_data["provider"] == "Google Earth Engine"
    assert "mean_ndvi" in s2_data["statistics"]
    assert s2_data["statistics"]["mean_ndvi"] >= 0.45

    # Sentinel-1
    s1_data = asyncio.run(client.get_sentinel1_data(coords))
    assert "estimated_soil_moisture_percent" in s1_data["statistics"]
    assert s1_data["confidence"] == 88.0

    # Landsat
    landsat_data = asyncio.run(client.get_landsat_data(coords))
    assert "mean_land_surface_temperature_celsius" in landsat_data["statistics"]
    assert len(landsat_data["statistics"]["historical_time_series"]) == 3


def test_telemetry_normalizer_schemas():
    # 1. GEE Sentinel-2 normalization
    s2_raw = {
        "provider": "Google Earth Engine",
        "instrument": "Sentinel-2 MSI",
        "statistics": {
            "mean_ndvi": 0.72,
            "estimated_biomass_tons_per_hectare": 85.5,
            "cloud_cover_percentage": 2.5
        },
        "confidence": 95.0,
        "timestamp": "2026-06-19T12:00:00Z"
    }
    norm_s2 = TelemetryNormalizer.normalize_gee_sentinel2(s2_raw, 30.9, 75.8)
    
    assert norm_s2["location"]["lat"] == 30.9
    assert norm_s2["confidence"] == 95.0
    assert norm_s2["provider"] == "Google Earth Engine"
    assert norm_s2["measurement"] == "Vegetation Index (NDVI)"
    assert norm_s2["units"] == "index"
    assert norm_s2["quality_score"] == 93.75 # 95.0 - 2.5 * 0.5

    # 2. NASA FIRMS normalization
    fire_raw = {
        "lat": 30.905,
        "lng": 75.858,
        "brightness": 320.0,
        "scan_time": "12:30"
    }
    norm_fire = TelemetryNormalizer.normalize_nasa_firms(fire_raw)
    assert norm_fire["provider"] == "NASA FIRMS"
    assert norm_fire["measurement"] == "Active Thermal Anomalies"
    assert norm_fire["units"] == "count"
    assert norm_fire["metadata"]["is_stubble_burn_indicator"] is True
    assert norm_fire["confidence"] == round(min(max((320.0 - 250.0) / 1.5, 30.0), 99.0), 1)


@pytest.mark.asyncio
async def test_intelligence_engine_index_calculations():
    # Mock GeeClient
    mock_gee = MagicMock()
    mock_gee.get_sentinel2_data = AsyncMock(return_value={
        "provider": "Google Earth Engine",
        "instrument": "Sentinel-2 MSI",
        "statistics": {
            "mean_ndvi": 0.75,
            "vegetation_health_status": "Healthy",
            "estimated_biomass_tons_per_hectare": 95.0,
            "cloud_cover_percentage": 1.0
        },
        "confidence": 95.0,
        "timestamp": "2026-06-19T12:00:00Z"
    })
    mock_gee.get_sentinel1_data = AsyncMock(return_value={
        "provider": "Google Earth Engine",
        "instrument": "Sentinel-1 SAR",
        "statistics": {
            "backscatter_vv_db": -10.0,
            "backscatter_vh_db": -15.0,
            "estimated_soil_moisture_percent": 40.0,
            "flood_inundation_fraction": 0.05,
            "radar_anomaly_detected": False
        },
        "confidence": 90.0,
        "timestamp": "2026-06-19T12:00:00Z"
    })
    mock_gee.get_landsat_data = AsyncMock(return_value={
        "provider": "Google Earth Engine",
        "instrument": "Landsat-8 TIRS",
        "statistics": {
            "mean_land_surface_temperature_celsius": 30.0,
            "urban_heat_island_intensity_index": 0.5,
            "historical_time_series": []
        },
        "confidence": 90.0,
        "timestamp": "2026-06-19T12:00:00Z"
    })

    mock_firms = MagicMock()
    mock_firms.get_active_fires_in_region = AsyncMock(return_value=[])

    mock_trace = MagicMock()
    mock_trace.get_facility_emissions = AsyncMock(return_value={
        "facility_id": "facility_1",
        "sector": "manufacturing",
        "annual_emissions_co2_equivalent_tons": 18450.0,
        "gases": {
            "co2": 15000.0,
            "ch4": 120.0,
            "so2": 4.5
        }
    })

    mock_copernicus = MagicMock()
    mock_copernicus.get_gas_spectrometry_data = AsyncMock(return_value={
        "gases": {
            "no2": 20.0,
            "ch4": 1850.0,
            "so2": 1.2
        }
    })

    engine = EnvironmentalIntelligenceEngine(
        gee_client=mock_gee,
        firms_client=mock_firms,
        climate_trace_client=mock_trace,
        copernicus_client=mock_copernicus
    )
    
    # Invalidate potential existing caches
    engine.cache.invalidate("telemetry:30.900:75.850")
    
    res = await engine.get_unified_telemetry(30.9, 75.8)
    
    # Verify calculated indexes
    assert "indexes" in res
    assert "aqi" in res["indexes"]
    assert "vhi" in res["indexes"]
    assert "carbon_sink_score" in res["indexes"]
    assert "fire_risk_score" in res["indexes"]
    assert "regional_sustainability_score" in res["indexes"]
    
    # Index equations checks
    # Carbon Sink: NDVI (0.75 * 50 = 37.5) + Moisture (40.0 * 0.3 = 12.0) + Biomass (min(95*0.2, 20) = 19.0) = 68.5
    assert res["indexes"]["carbon_sink_score"] == 68.5
    assert len(res["historical_analytics"]) == 5


def test_smart_cache_ttl():
    cache = SmartCache()
    # Cache miss
    assert cache.get("test_key") is None
    
    # Cache set with 1s TTL
    cache.set("test_key", {"val": 42}, ttl_seconds=1)
    assert cache.get("test_key") == {"val": 42}
    
    # Wait for expiration
    time.sleep(1.1)
    assert cache.get("test_key") is None


def test_ai_recommendation_engine():
    # Test Urban recommendations
    telemetry_urban = {"aqi": 80.0, "uhi_celsius": 34.0}
    recs_urban = AIRecommendationEngine.generate_recommendations("urban", telemetry_urban)
    assert len(recs_urban) == 3
    assert recs_urban[0]["type"] == "commute"
    assert "Take Eco-Transit" in recs_urban[0]["title"]

    # Test Farmer recommendations
    telemetry_farmer = {"soil_moisture": 25.0, "fire_risk": 75.0, "vhi": 40.0}
    recs_farmer = AIRecommendationEngine.generate_recommendations("farmer", telemetry_farmer)
    assert len(recs_farmer) == 3
    assert recs_farmer[0]["type"] == "irrigation"
    assert recs_farmer[1]["type"] == "burn_prevention"


def test_cross_module_intelligence():
    nearby_farms = CrossModuleIntelligence.get_nearby_farms(30.901, 75.850)
    assert len(nearby_farms) > 0
    assert nearby_farms[0]["distance_km"] < 10.0 # Punjab farm 1 is at 30.901, 75.850 - distance 0km
    
    rankings = CrossModuleIntelligence.get_community_rankings()
    assert len(rankings) == 3
    assert rankings[0]["rank"] == 1
