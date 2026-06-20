import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.industry_service import IndustryTelemetryService
from app.services.industrial_math import IndustrialMathEngine
from app.services.offset_recommendation import IndustrialOffsetRecommendationEngine

@pytest.mark.asyncio
async def test_industry_telemetry_normalization():
    # Mock clients
    mock_sat = MagicMock()
    mock_sat.get_gas_spectrometry_data = AsyncMock(return_value={
        "gases": {"ch4": 1895.0, "so2": 1.5, "no2": 25.4},
        "status": "Nominal"
    })
    mock_trace = MagicMock()
    mock_trace.get_facility_emissions = AsyncMock(return_value={
        "facility_id": "facility_a",
        "sector": "manufacturing",
        "annual_emissions_co2_equivalent_tons": 10000.0
    })

    service = IndustryTelemetryService(satellite_client=mock_sat, climate_trace_client=mock_trace)
    res = await service.get_facility_telemetry("facility_a", 30.9000, 75.8500)

    # Verify keys exist
    assert "FacilityHealth" in res
    assert "EmissionSummary" in res
    assert "GasConcentration" in res
    assert "ComplianceRisk" in res
    assert "TelemetryConfidence" in res

    # Verify fields logic
    assert res["FacilityHealth"]["score"] > 0
    assert res["GasConcentration"]["methane_ppb"] == 1895.0
    assert res["GasConcentration"]["sulfur_dioxide_ppb"] == 1.5
    assert res["EmissionSummary"]["scope_1_tons_co2e"] > 10000.0


def test_greenhouse_gas_analysis_math():
    # Base parameters: 10 acres, 1895 ppb Methane, 1.5 ppb SO2, 10000 tons baseline CO2
    res = IndustrialMathEngine.analyze_greenhouse_gases(
        methane_ppb=1895.0,
        so2_ppb=1.5,
        acreage=10.0,
        baseline_annual_co2_tons=10000.0
    )

    # ch4_excess = 1895 - 1850 = 45 ppb
    # ch4_leak_tons_year = 45 * 0.05 * 1.0 = 2.25 tons
    # ch4_co2e_tons = 2.25 * 28.0 = 63.0 tons
    # scope1 = 10000 + 63 = 10063.0 tons
    # scope2 = 10000 * 0.30 = 3000.0 tons
    # total = 10063 + 3000 = 13063.0 tons
    assert res["methane_excess_ppb"] == 45.0
    assert res["ch4_leak_tons_year"] == 2.25
    assert res["so2_leak_tons_year"] == 0.04  # (1.5 - 1.0) * 0.08 = 0.04
    assert res["ch4_co2e_tons_year"] == 63.0
    assert res["scope_1_annual_co2e_tons"] == 10063.0
    assert res["scope_2_annual_co2e_tons"] == 3000.0
    assert res["total_annual_co2e_tons"] == 13063.0
    assert res["monthly_co2e_tons"] == round(13063.0 / 12.0, 1)
    assert res["leak_severity"] == "HIGH"
    
    # annual_financial_loss_usd:
    # ch4 loss = 2.25 * 350.0 = $787.5
    # energy loss = 3000.0 * 8.50 = $25500.0
    # total loss = 25500 + 787.5 = 26287.5
    assert res["annual_financial_loss_usd"] == 26287.5
    assert res["regulatory_tax_exposure_usd"] == 13063.0 * 125.0


def test_financial_intelligence_roi_auditing():
    # 2000 m2 roof, 10000 tons emissions, High leak, $26000 loss
    res = IndustrialMathEngine.audit_financial_intelligence(
        total_co2e_tons=10000.0,
        leak_severity="HIGH",
        annual_loss_usd=26000.0,
        roof_area_sq_meters=2000.0
    )

    # carbon_tax = 10000 * 125 = $1250000
    # leak savings = 26000 * 90% = $23400
    # capacity = 2000 / 10 = 200 kW
    # install cost = 200 * 1200 = $240000
    # annual solar savings = 200 * 1500 * 0.10 = $30000
    # payback months = 240000 / 30000 * 12 = 96 months
    # ESG improvement = 200 * 0.12 = 24 -> capped at 15
    assert res["carbon_tax_liability_usd"] == 1250000.0
    assert res["operational_waste_usd"] == 26000.0
    assert res["leak_repair_savings_usd"] == 23400.0
    assert res["solar_roi"]["capacity_kw"] == 200.0
    assert res["solar_roi"]["install_cost_usd"] == 240000.0
    assert res["solar_roi"]["annual_savings_usd"] == 30000.0
    assert res["solar_roi"]["payback_period_months"] == 96.0
    assert res["solar_roi"]["esg_improvement_score"] == 15
    assert res["annual_savings_total_usd"] == 23400.0 + 30000.0


def test_offset_recommendations_rules():
    # 1000 tons emissions, 50% target, $20000 budget
    res = IndustrialOffsetRecommendationEngine.recommend_offsets(
        current_annual_emissions_tons=1000.0,
        target_reduction_pct=50.0,
        corporate_budget_usd=20000.0
    )

    # required = 1000 * 0.5 = 500 tons
    # cost usd = 500 * 24.50 = $12250
    # cost coins = 500 * 15 = 7500 coins
    # cost <= budget ($12250 <= $20000) -> neutrality months = 6, status: Accelerated
    assert res["credits_required_tons"] == 500.0
    assert res["estimated_purchase_cost_usd"] == 12250.0
    assert res["estimated_purchase_cost_coins"] == 7500.0
    assert res["neutrality_months"] == 6
    assert res["carbon_neutrality_timeline"] == "Accelerated (Net-Zero in 6 months)"
    assert res["budget_status"] == "SUFFICIENT"
    assert len(res["recommended_projects"]) == 3
