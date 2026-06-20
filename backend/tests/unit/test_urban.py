import pytest
from app.services.carbon_calculator import CarbonCalculator
from app.services.recommendation_engine import UrbanRecommendationEngine

def test_commute_savings_calculations():
    """Validates distance travel offsets and credits conversions."""
    distance = 10.0 # 10 kilometers
    
    # Mode: Transit (metro/bus)
    result = CarbonCalculator.calculate_commute_savings(distance, "transit")
    
    # Car = 10 * 0.21 = 2.1kg
    # Transit = 10 * 0.05 = 0.5kg
    # Offset = 1.6kg
    # Credits = 1.6
    # Cost saved = 10 * (0.15 - 0.03) = 1.2 USD
    assert result["car_emissions_kg"] == 2.1
    assert result["transit_emissions_kg"] == 0.5
    assert result["co2_offset_kg"] == 1.6
    assert result["credits_earned"] == 1.6
    assert result["money_saved_usd"] == 1.2


def test_zero_emissions_active_commute():
    """Validates clean active transport (cycling/walking) emissions differences."""
    distance = 5.0
    result = CarbonCalculator.calculate_commute_savings(distance, "cycling")
    
    # Car = 1.05kg
    # Cycling = 0.0kg
    # Offset = 1.05kg
    assert result["co2_offset_kg"] == 1.05
    assert result["transit_emissions_kg"] == 0.0


def test_recommendation_engine_triggers():
    """Ensures AI recommendation tips respond correctly to telemetry warning metrics."""
    
    # High pollution alert trigger check
    recs_high_aqi = UrbanRecommendationEngine.generate_recommendations(
        aqi_no2_ppb=45.0, # Elevated > 40
        temperature_c=25.0,
        traffic_congestion="low",
        distance_km=5.0
    )
    
    # Check if high AQI alert block exists
    aqi_alerts = [r for r in recs_high_aqi if r["type"] == "pollution_avoidance"]
    assert len(aqi_alerts) > 0
    assert "Elevated" in aqi_alerts[0]["title"]
    
    # Comfortable / Clean air cycling suggestions check
    recs_comfortable = UrbanRecommendationEngine.generate_recommendations(
        aqi_no2_ppb=15.0, # Healthy
        temperature_c=22.0, # Comfortable
        traffic_congestion="low",
        distance_km=2.0 # Walkable
    )
    
    commute_recs = [r for r in recs_comfortable if r["type"] == "commute"]
    assert len(commute_recs) > 0
    assert "Active" in commute_recs[0]["title"]
