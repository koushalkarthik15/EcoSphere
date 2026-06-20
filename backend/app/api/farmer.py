from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.services.soil_carbon_engine import SoilCarbonEngine
from app.services.fire_verification import FireVerificationService
from app.services.credit_verification import CreditVerificationService

router = APIRouter(prefix="/api/v1/farmer", tags=["AgriCarbon Farmer Module"])

# Registered Farm Fields mock database
REGISTERED_FIELDS = {
    "field_a": {
        "id": "field_a",
        "name": "Punjab Field A (Wheat crop)",
        "crop_type": "Wheat",
        "practice": "conservation", # Conservation tillage
        "acreage": 12.5,
        "polygon": [
            {"lat": 31.6380, "lng": 74.8650},
            {"lat": 31.6420, "lng": 74.8650},
            {"lat": 31.6420, "lng": 74.8710},
            {"lat": 31.6380, "lng": 74.8710}
        ],
        "mean_ndvi": 0.72,
        "soil_moisture_pct": 45.2,
        "days_active": 120
    },
    "field_b": {
        "id": "field_b",
        "name": "Punjab Field B (Rice paddies)",
        "crop_type": "Rice",
        "practice": "conventional", # Conventional tillage
        "acreage": 8.0,
        "polygon": [
            {"lat": 31.6300, "lng": 74.8750},
            {"lat": 31.6350, "lng": 74.8750},
            {"lat": 31.6350, "lng": 74.8820},
            {"lat": 31.6300, "lng": 74.8820}
        ],
        "mean_ndvi": 0.38, # Sparse canopy (post-harvest)
        "soil_moisture_pct": 28.5,
        "days_active": 90
    }
}

# Request Schemas
class FieldSelectRequest(BaseModel):
    field_id: str

class ExportRequest(BaseModel):
    sheet_title: str = "EcoSphere AgriCarbon Ledger Report"

# Services Dependency Injections
def get_soil_engine() -> SoilCarbonEngine:
    return SoilCarbonEngine()

def get_fire_verifier() -> FireVerificationService:
    return FireVerificationService()

def get_credit_verifier() -> CreditVerificationService:
    return CreditVerificationService

@router.get("/summary")
async def get_farmer_summary():
    """
    Returns registered field names and historical offsets totals.
    """
    return {
        "fields": list(REGISTERED_FIELDS.values()),
        "total_acreage": sum(f["acreage"] for f in REGISTERED_FIELDS.values()),
        "total_verified_credits": 240.5,
        "total_pending_credits": 12.0,
        "sequestration_goal_pct": 82.5 # Goal Progress %
    }

@router.post("/satellite-analysis")
async def analyze_field_satellite(
    req: FieldSelectRequest,
    engine: SoilCarbonEngine = Depends(get_soil_engine)
):
    """
    Aggregates Sentinel-1 (moisture) and Sentinel-2 (NDVI, biomass) indices.
    """
    field_id = req.field_id
    if field_id not in REGISTERED_FIELDS:
        raise HTTPException(status_code=404, detail="Field ID not registered.")

    f = REGISTERED_FIELDS[field_id]
    
    # Calculate carbon estimates
    calc = engine.calculate_field_sequestration(
        acreage=f["acreage"],
        practice=f["practice"],
        days_active=f["days_active"],
        mean_ndvi=f["mean_ndvi"],
        soil_moisture_pct=f["soil_moisture_pct"]
    )
    
    # Biomass Score calculation placeholder
    biomass_score = round(f["mean_ndvi"] * 1.15, 2)
    confidence_score = 92.5 if f["practice"] == "conservation" else 88.0

    return {
        "field_id": field_id,
        "ndvi": f["mean_ndvi"],
        "soil_moisture_pct": f["soil_moisture_pct"],
        "biomass_score": biomass_score,
        "carbon_estimate_tons": calc["season_gain_tons"],
        "confidence_score": confidence_score
    }

@router.post("/fire-detection")
async def check_field_fires(
    req: FieldSelectRequest,
    verifier: FireVerificationService = Depends(get_fire_verifier)
):
    """
    Detects crop residues active burn events in field bounds using NASA FIRMS.
    """
    field_id = req.field_id
    if field_id not in REGISTERED_FIELDS:
        raise HTTPException(status_code=404, detail="Field ID not registered.")

    f = REGISTERED_FIELDS[field_id]
    
    # Execute polygon intersections check
    return await verifier.verify_field_fires(
        field_id=field_id,
        polygon_coords=f["polygon"],
        acreage=f["acreage"]
    )

@router.post("/carbon-ledger")
async def get_carbon_calculations(
    req: FieldSelectRequest,
    engine: SoilCarbonEngine = Depends(get_soil_engine)
):
    """
    Detailed Soil Carbon Engine calculations report logs.
    """
    field_id = req.field_id
    if field_id not in REGISTERED_FIELDS:
        raise HTTPException(status_code=404, detail="Field ID not registered.")

    f = REGISTERED_FIELDS[field_id]
    return engine.calculate_field_sequestration(
        acreage=f["acreage"],
        practice=f["practice"],
        days_active=f["days_active"],
        mean_ndvi=f["mean_ndvi"],
        soil_moisture_pct=f["soil_moisture_pct"]
    )

@router.post("/credit-verification")
async def verify_credits_eligibility(
    req: FieldSelectRequest,
    engine: SoilCarbonEngine = Depends(get_soil_engine),
    verifier: FireVerificationService = Depends(get_fire_verifier)
):
    """
    Mints carbon offset credits according to strict satellite validation rules.
    """
    field_id = req.field_id
    if field_id not in REGISTERED_FIELDS:
        raise HTTPException(status_code=404, detail="Field ID not registered.")

    f = REGISTERED_FIELDS[field_id]

    # Run check calculations
    calc = engine.calculate_field_sequestration(
        acreage=f["acreage"],
        practice=f["practice"],
        days_active=f["days_active"],
        mean_ndvi=f["mean_ndvi"],
        soil_moisture_pct=f["soil_moisture_pct"]
    )
    
    # Run active fires check
    fire_chk = await verifier.verify_field_fires(
        field_id=field_id,
        polygon_coords=f["polygon"],
        acreage=f["acreage"]
    )

    # Validate mint criteria
    verification = CreditVerificationService.verify_carbon_credits(
        field_id=field_id,
        fire_status=fire_chk["status"],
        mean_ndvi=f["mean_ndvi"],
        season_gain_tons=calc["season_gain_tons"],
        practice=f["practice"]
    )

    return {
        "field_id": field_id,
        "verification_status": verification["status"],
        "details": verification
    }



@router.get("/notifications")
async def get_farmer_notifications():
    """
    Returns alerts feeds alerts (e.g. fire hazard warnings).
    """
    return [
        {
            "id": "notif_1",
            "type": "fire_hazard",
            "title": "🔥 Stubble Burn Risk Alert",
            "message": "NASA FIRMS coordinates report fire thermal anomalies 1.5km south-east of Field A boundary.",
            "timestamp": "10 minutes ago"
        },
        {
            "id": "notif_2",
            "type": "moisture_warning",
            "title": "💧 Low Soil Moisture Warn",
            "message": "Sentinel-1 moisture indexes for Field B dropped below 30%. Irrigation recommended.",
            "timestamp": "1 hour ago"
        }
    ]
