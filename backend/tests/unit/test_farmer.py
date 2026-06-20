import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.soil_carbon_engine import SoilCarbonEngine
from app.services.fire_verification import FireVerificationService
from app.services.credit_verification import CreditVerificationService

def test_soil_carbon_engine_calculations():
    # Test case 1: Zero acreage
    calc_zero = SoilCarbonEngine.calculate_field_sequestration(
        acreage=0,
        practice="conservation",
        days_active=100,
        mean_ndvi=0.70,
        soil_moisture_pct=45.0
    )
    assert calc_zero["estimated_storage_tons"] == 0.0
    assert calc_zero["season_gain_tons"] == 0.0

    # Test case 2: Conservation practices, high NDVI, high moisture
    calc_cons = SoilCarbonEngine.calculate_field_sequestration(
        acreage=10.0,
        practice="conservation",
        days_active=365,
        mean_ndvi=0.72,
        soil_moisture_pct=45.2
    )
    # Baseline: 10 * 45 = 450.0
    assert calc_cons["estimated_storage_tons"] == 450.0
    
    # Rate calculation check:
    # Base rate = 0.30
    # biological_modifier = 1.0 + 0.15 (NDVI > 0.6) + 0.10 (moisture > 40) = 1.25
    # adjusted_rate_annual = 0.30 * 1.25 = 0.375
    # annual_projection = 10 * 0.375 = 3.75
    # season_gain = 3.75 * 1 = 3.75
    assert calc_cons["sequestration_rate_annual_tons"] == 0.375
    assert calc_cons["annual_projection_tons"] == 3.75
    assert calc_cons["season_gain_tons"] == 3.75
    
    # Soil health score check
    # moisture_score = min(100, 45.2 * 2.0) = 90.4
    # ndvi_score = 0.72 * 100 = 72.0
    # practice_score = 100.0 (conservation)
    # health_score = 90.4 * 0.35 + 72 * 0.40 + 100 * 0.25 = 31.64 + 28.8 + 25.0 = 85.44 -> 85
    assert calc_cons["soil_health_score"] == 85

    # Test case 3: Conventional practices, low NDVI, low moisture
    calc_conv = SoilCarbonEngine.calculate_field_sequestration(
        acreage=10.0,
        practice="conventional",
        days_active=365,
        mean_ndvi=0.35,
        soil_moisture_pct=15.0
    )
    # Base rate = 0.05
    # biological_modifier = 1.0 - 0.20 (moisture < 20) = 0.80
    # adjusted_rate_annual = 0.05 * 0.80 = 0.04
    # annual_projection = 10 * 0.04 = 0.40
    # health_score check:
    # moisture_score = 15.0 * 2 = 30.0
    # ndvi_score = 0.35 * 100 = 35.0
    # practice_score = 40.0 (conventional)
    # health_score = 30 * 0.35 + 35 * 0.40 + 40 * 0.25 = 10.5 + 14.0 + 10.0 = 34.5 -> 34
    assert calc_conv["sequestration_rate_annual_tons"] == 0.04
    assert calc_conv["annual_projection_tons"] == 0.40
    assert calc_conv["soil_health_score"] == 34


def test_point_in_polygon_math():
    # Simple unit box polygon: [(0, 0), (1, 0), (1, 1), (0, 1)]
    poly = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
    
    # Point inside
    assert FireVerificationService.is_point_in_polygon((0.5, 0.5), poly) is True
    
    # Point outside
    assert FireVerificationService.is_point_in_polygon((1.5, 1.5), poly) is False


@pytest.mark.asyncio
async def test_fire_verification_service_scans():
    # Mock FirmsClient response
    mock_firms_client = MagicMock()
    mock_firms_client.get_active_fires_in_region = AsyncMock(return_value=[
        {"lat": 31.6400, "lng": 74.8680, "brightness": 330.0, "scan_time": "12:00"}, # Inside
        {"lat": 31.6500, "lng": 74.8800, "brightness": 310.0, "scan_time": "12:00"}  # Outside
    ])
    
    verifier = FireVerificationService(firms_client=mock_firms_client)
    
    # Field A polygon bounds
    poly_coords = [
        {"lat": 31.6380, "lng": 74.8650},
        {"lat": 31.6420, "lng": 74.8650},
        {"lat": 31.6420, "lng": 74.8710},
        {"lat": 31.6380, "lng": 74.8710}
    ]
    
    # Run check
    result = await verifier.verify_field_fires(
        field_id="field_a",
        polygon_coords=poly_coords,
        acreage=10.0
    )
    
    # Only 1 fire is inside bounds (31.6400, 74.8680)
    assert result["status"] == "DANGER"
    assert result["active_burns_detected"] == 1
    assert result["severity"] == "HIGH" # 330.0 > 325.0
    assert result["affected_area_percentage"] == 12.5
    # Estimated loss: 10 acres * 12.5% * 4.5 = 1.25 acres * 4.5 = 5.625 Tons -> 5.62 or similar (rounded)
    assert result["estimated_carbon_loss_tons"] == 5.62


def test_credit_verification_checks():
    # Rule 1: Fire Danger -> REJECTED
    res_fire = CreditVerificationService.verify_carbon_credits(
        field_id="field_a",
        fire_status="DANGER",
        mean_ndvi=0.72,
        season_gain_tons=2.5,
        practice="conservation"
    )
    assert res_fire["status"] == "REJECTED"
    assert "Active fire" in res_fire["verification_reason"]
    assert res_fire["rejected_credits"] == 2.5

    # Rule 2: Low NDVI -> REJECTED
    res_low_ndvi = CreditVerificationService.verify_carbon_credits(
        field_id="field_a",
        fire_status="SAFE",
        mean_ndvi=0.35, # < 0.40
        season_gain_tons=1.5,
        practice="conservation"
    )
    assert res_low_ndvi["status"] == "REJECTED"
    assert "falls below the minimum" in res_low_ndvi["verification_reason"]
    assert res_low_ndvi["rejected_credits"] == 1.5

    # Rule 3: Low Sequestration -> PENDING
    res_low_seq = CreditVerificationService.verify_carbon_credits(
        field_id="field_a",
        fire_status="SAFE",
        mean_ndvi=0.60,
        season_gain_tons=0.20, # < 0.25
        practice="conservation"
    )
    assert res_low_seq["status"] == "PENDING"
    assert "below minimum threshold" in res_low_seq["verification_reason"]
    assert res_low_seq["pending_credits"] == 0.20

    # Rule 4: Non-conservation Tillage -> PENDING
    res_practice = CreditVerificationService.verify_carbon_credits(
        field_id="field_a",
        fire_status="SAFE",
        mean_ndvi=0.65,
        season_gain_tons=1.2,
        practice="conventional" # Not conservation
    )
    assert res_practice["status"] == "PENDING"
    assert "Conventional farming" in res_practice["verification_reason"]
    assert res_practice["pending_credits"] == 1.2

    # Success: All check rules pass -> VERIFIED
    res_success = CreditVerificationService.verify_carbon_credits(
        field_id="field_a",
        fire_status="SAFE",
        mean_ndvi=0.72,
        season_gain_tons=1.54,
        practice="conservation"
    )
    assert res_success["status"] == "VERIFIED"
    assert "verified" in res_success["verification_reason"].lower()
    assert res_success["verified_credits"] == 1.54
