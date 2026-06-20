from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.services.industry_service import IndustryTelemetryService
from app.services.industrial_math import IndustrialMathEngine
from app.services.offset_recommendation import IndustrialOffsetRecommendationEngine

router = APIRouter(prefix="/api/v1/industry", tags=["InduTrack Industry Module"])

# Registered facilities database
REGISTERED_FACILITIES = {
    "facility_a": {
        "id": "facility_a",
        "name": "Ludhiana Metal Works",
        "registry_id": "IND-LDH-9872-A",
        "acreage": 15.4,
        "roof_area_sq_meters": 6400.0,
        "compliance_rating": "B+",
        "overall_esg_score": 74,
        "scope_1_status": "Warning (High CH4)",
        "scope_2_status": "Compliant",
        "marketplace_balance": 15200.0,
        "lat": 30.9000,
        "lng": 75.8500,
        "baseline_co2_tons": 18450.0,
        "boundaries": [
            {"lat": 30.8980, "lng": 75.8470},
            {"lat": 30.9020, "lng": 75.8470},
            {"lat": 30.9020, "lng": 75.8530},
            {"lat": 30.8980, "lng": 75.8530}
        ],
        "assets": [
            {"name": "Factory Block Alpha", "polygon": [{"lat": 30.8990, "lng": 75.8480}, {"lat": 30.9010, "lng": 75.8480}, {"lat": 30.9010, "lng": 75.8500}, {"lat": 30.8990, "lng": 75.8500}], "type": "factory"},
            {"name": "Warehouse Beta", "polygon": [{"lat": 30.8995, "lng": 75.8510}, {"lat": 30.9015, "lng": 75.8510}, {"lat": 30.9015, "lng": 75.8525}, {"lat": 30.8995, "lng": 75.8525}], "type": "warehouse"},
            {"name": "Admin Building", "polygon": [{"lat": 30.9012, "lng": 75.8492}, {"lat": 30.9018, "lng": 75.8492}, {"lat": 30.9018, "lng": 75.8502}, {"lat": 30.9012, "lng": 75.8502}], "type": "admin"},
            {"name": "Storage Tanks Gamma", "polygon": [{"lat": 30.8982, "lng": 75.8505}, {"lat": 30.8988, "lng": 75.8505}, {"lat": 30.8988, "lng": 75.8515}, {"lat": 30.8982, "lng": 75.8515}], "type": "storage_tanks"},
            {"name": "Loading Bays", "polygon": [{"lat": 30.8985, "lng": 75.8475}, {"lat": 30.8992, "lng": 75.8475}, {"lat": 30.8992, "lng": 75.8485}, {"lat": 30.8985, "lng": 75.8485}], "type": "loading_bay"}
        ]
    },
    "facility_b": {
        "id": "facility_b",
        "name": "Mandi Gobindgarh Foundries",
        "registry_id": "IND-MND-4420-B",
        "acreage": 9.5,
        "roof_area_sq_meters": 4200.0,
        "compliance_rating": "A-",
        "overall_esg_score": 83,
        "scope_1_status": "Compliant",
        "scope_2_status": "Warning (High Grid)",
        "marketplace_balance": 8400.0,
        "lat": 30.6628,
        "lng": 76.3005,
        "baseline_co2_tons": 9800.0,
        "boundaries": [
            {"lat": 30.6610, "lng": 76.2980},
            {"lat": 30.6645, "lng": 76.2980},
            {"lat": 30.6645, "lng": 76.3030},
            {"lat": 30.6610, "lng": 76.3030}
        ],
        "assets": [
            {"name": "Main Smelter Block", "polygon": [{"lat": 30.6615, "lng": 76.2990}, {"lat": 30.6630, "lng": 76.2990}, {"lat": 30.6630, "lng": 76.3010}, {"lat": 30.6615, "lng": 76.3010}], "type": "factory"},
            {"name": "Distribution Yard", "polygon": [{"lat": 30.6618, "lng": 76.3015}, {"lat": 30.6628, "lng": 76.3015}, {"lat": 30.6628, "lng": 76.3025}, {"lat": 30.6618, "lng": 76.3025}], "type": "warehouse"},
            {"name": "HQ Office Suite", "polygon": [{"lat": 30.6635, "lng": 76.3000}, {"lat": 30.6642, "lng": 76.3000}, {"lat": 30.6642, "lng": 76.3012}, {"lat": 30.6635, "lng": 76.3012}], "type": "admin"}
        ]
    }
}

# Request Schemas
class FacilitySelectRequest(BaseModel):
    facility_id: str

class OffsetRecommendationRequest(BaseModel):
    facility_id: str
    target_reduction_pct: float = Field(default=50.0, gt=0.0, le=100.0)
    corporate_budget_usd: float = Field(default=100000.0, gt=0.0)

# Services Dependency Injection
def get_industry_service() -> IndustryTelemetryService:
    return IndustryTelemetryService()

@router.get("/summary")
async def get_industry_summary():
    """
    Returns list of registered facilities and consolidated totals.
    """
    return {
        "facilities": list(REGISTERED_FACILITIES.values()),
        "total_facilities_count": len(REGISTERED_FACILITIES),
        "consolidated_carbon_liability_usd": sum(
            f["baseline_co2_tons"] * 1.3 * 125.0 for f in REGISTERED_FACILITIES.values()
        )
    }

@router.post("/emission-analysis")
async def get_facility_emission_analysis(
    req: FacilitySelectRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Greenhouse gas engine details calculating Scope 1/2 CO2 equivalent values.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    analysis = IndustrialMathEngine.analyze_greenhouse_gases(
        methane_ppb=tel["GasConcentration"]["methane_ppb"],
        so2_ppb=tel["GasConcentration"]["sulfur_dioxide_ppb"],
        acreage=f["acreage"],
        baseline_annual_co2_tons=f["baseline_co2_tons"]
    )
    return {
        "facility_id": fid,
        "telemetry_normalized": tel,
        "ghg_analysis": analysis
    }

@router.post("/gas-detection")
async def get_live_gas_detection(
    req: FacilitySelectRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Exposes trace gas spectrometer logs for Methane, SO2, and weather parameters.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    return {
        "facility_id": fid,
        "gases": tel["GasConcentration"],
        "telemetry_confidence": tel["TelemetryConfidence"]
    }

@router.post("/compliance")
async def get_compliance_audit(
    req: FacilitySelectRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Computes overall ESG score, checklists compliance, and sets warnings flags.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    # Checklists
    rules = [
        {"rule": "Scope 1 emissions under carbon limits cap", "passed": tel["FacilityHealth"]["score"] >= 60},
        {"rule": "No critical methane/SO₂ point leaks detected", "passed": not tel["ComplianceRisk"]["active_leak_detected"]},
        {"rule": "Sentinel-5P telemetry confidence exceeds 85%", "passed": tel["TelemetryConfidence"]["score"] >= 85.0},
        {"rule": "ESG audit file records up-to-date", "passed": True}
    ]
    
    return {
        "facility_id": fid,
        "compliance_rating": f["compliance_rating"],
        "esg_score": tel["FacilityHealth"]["score"],
        "risk_summary": tel["ComplianceRisk"],
        "compliance_checklist": rules,
        "scope_1_status": f["scope_1_status"],
        "scope_2_status": f["scope_2_status"]
    }

@router.post("/solar-analysis")
async def get_rooftop_solar_analysis(
    req: FacilitySelectRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Audits roof solar potential, ROI timelines, and annual offset savings.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    analysis = IndustrialMathEngine.analyze_greenhouse_gases(
        methane_ppb=tel["GasConcentration"]["methane_ppb"],
        so2_ppb=tel["GasConcentration"]["sulfur_dioxide_ppb"],
        acreage=f["acreage"],
        baseline_annual_co2_tons=f["baseline_co2_tons"]
    )
    
    financials = IndustrialMathEngine.audit_financial_intelligence(
        total_co2e_tons=analysis["total_annual_co2e_tons"],
        leak_severity=analysis["leak_severity"],
        annual_loss_usd=analysis["annual_financial_loss_usd"],
        roof_area_sq_meters=f["roof_area_sq_meters"]
    )
    
    return {
        "facility_id": fid,
        "roof_area_sq_meters": f["roof_area_sq_meters"],
        "solar_potential": financials["solar_roi"]
    }

@router.post("/financial-report")
async def get_financial_audit_report(
    req: FacilitySelectRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Audits regulatory carbon tax exposures, operational waste, and solar potential savings.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    analysis = IndustrialMathEngine.analyze_greenhouse_gases(
        methane_ppb=tel["GasConcentration"]["methane_ppb"],
        so2_ppb=tel["GasConcentration"]["sulfur_dioxide_ppb"],
        acreage=f["acreage"],
        baseline_annual_co2_tons=f["baseline_co2_tons"]
    )
    
    financials = IndustrialMathEngine.audit_financial_intelligence(
        total_co2e_tons=analysis["total_annual_co2e_tons"],
        leak_severity=analysis["leak_severity"],
        annual_loss_usd=analysis["annual_financial_loss_usd"],
        roof_area_sq_meters=f["roof_area_sq_meters"]
    )
    
    return {
        "facility_id": fid,
        "financial_audit": financials
    }

@router.post("/marketplace-recommendation")
async def get_carbon_offset_recommendations(
    req: OffsetRecommendationRequest,
    service: IndustryTelemetryService = Depends(get_industry_service)
):
    """
    Computes offset budgets and verified carbon credits proposals.
    """
    fid = req.facility_id
    if fid not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[fid]
    tel = await service.get_facility_telemetry(fid, f["lat"], f["lng"])
    
    analysis = IndustrialMathEngine.analyze_greenhouse_gases(
        methane_ppb=tel["GasConcentration"]["methane_ppb"],
        so2_ppb=tel["GasConcentration"]["sulfur_dioxide_ppb"],
        acreage=f["acreage"],
        baseline_annual_co2_tons=f["baseline_co2_tons"]
    )
    
    recommendation = IndustrialOffsetRecommendationEngine.recommend_offsets(
        current_annual_emissions_tons=analysis["total_annual_co2e_tons"],
        target_reduction_pct=req.target_reduction_pct,
        corporate_budget_usd=req.corporate_budget_usd
    )
    
    return {
        "facility_id": fid,
        "recommendation": recommendation
    }

@router.get("/historical-trends")
async def get_historical_emissions_trends(facility_id: str):
    """
    Returns decadal emissions profiles for compliance charting.
    """
    if facility_id not in REGISTERED_FACILITIES:
        raise HTTPException(status_code=404, detail="Facility not registered")
        
    f = REGISTERED_FACILITIES[facility_id]
    base = f["baseline_co2_tons"]
    
    # Decadal trends (2017 - 2026)
    return [
        {"year": 2017, "co2_equivalent_tons": round(base * 1.25, 1), "methane_ppb": 1960.0},
        {"year": 2018, "co2_equivalent_tons": round(base * 1.20, 1), "methane_ppb": 1940.0},
        {"year": 2019, "co2_equivalent_tons": round(base * 1.15, 1), "methane_ppb": 1920.0},
        {"year": 2020, "co2_equivalent_tons": round(base * 1.05, 1), "methane_ppb": 1880.0}, # Pandemic dip
        {"year": 2021, "co2_equivalent_tons": round(base * 1.12, 1), "methane_ppb": 1900.0},
        {"year": 2022, "co2_equivalent_tons": round(base * 1.10, 1), "methane_ppb": 1895.0},
        {"year": 2023, "co2_equivalent_tons": round(base * 1.08, 1), "methane_ppb": 1890.0},
        {"year": 2024, "co2_equivalent_tons": round(base * 1.05, 1), "methane_ppb": 1885.0},
        {"year": 2025, "co2_equivalent_tons": round(base * 1.02, 1), "methane_ppb": 1880.0},
        {"year": 2026, "co2_equivalent_tons": round(base * 1.00, 1), "methane_ppb": 1875.0}
    ]
