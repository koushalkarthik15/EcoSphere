from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.services.urban_service import UrbanTelemetryService
from app.services.recommendation_engine import UrbanRecommendationEngine
from app.services.carbon_calculator import CarbonCalculator

router = APIRouter(prefix="/api/v1/urban", tags=["Urban Citizen Module"])

# Pydantic Schemas
class TelemetryRequest(BaseModel):
    lat: float = Field(default=31.6340, description="Latitude")
    lng: float = Field(default=74.8723, description="Longitude")
    min_lat: Optional[float] = None
    max_lat: Optional[float] = None
    min_lng: Optional[float] = None
    max_lng: Optional[float] = None

class CommuteCalculationRequest(BaseModel):
    distance_km: float = Field(..., gt=0, description="Travel distance in kilometers")
    mode: str = Field(..., description="Mode must be 'transit', 'cycling', or 'walking'")

class OffsetCalculationResponse(BaseModel):
    car_emissions_kg: float
    transit_emissions_kg: float
    co2_offset_kg: float
    money_saved_usd: float
    credits_earned: float
    projections: Dict[str, Any]

class Challenge(BaseModel):
    id: str
    title: str
    description: str
    target_offset_kg: float
    credits_reward: float
    completed: bool = False

class Achievement(BaseModel):
    id: str
    title: str
    description: str
    badge_icon: str
    earned: bool = False

# Dependency injection for telemetry service
def get_telemetry_service() -> UrbanTelemetryService:
    return UrbanTelemetryService()

@router.post("/telemetry", response_model=Dict[str, Any])
async def get_urban_telemetry(
    req: TelemetryRequest,
    service: UrbanTelemetryService = Depends(get_telemetry_service)
):
    """
    Returns normalized air quality NO2 indices and surface temperature heat maps.
    """
    bounds = {}
    if req.min_lat is not None and req.max_lat is not None:
        bounds = {
            "min_lat": req.min_lat, "max_lat": req.max_lat,
            "min_lng": req.min_lng, "max_lng": req.max_lng
        }
    return await service.get_normalized_telemetry(req.lat, req.lng, bounds)

@router.post("/recommendations", response_model=List[Dict[str, Any]])
async def get_commute_recommendations(
    req: TelemetryRequest,
    service: UrbanTelemetryService = Depends(get_telemetry_service)
):
    """
    Returns rule-based AI commute and pollution-avoidance suggestions.
    """
    telemetry = await service.get_normalized_telemetry(req.lat, req.lng)
    
    aqi_ppb = telemetry["air_quality"]["no2_ppb"]
    temp_c = telemetry["surface_temperature"]["landsat_surface_c"]
    
    # Simulate moderate traffic and a default distance of 5.5km
    return UrbanRecommendationEngine.generate_recommendations(
        aqi_no2_ppb=aqi_ppb,
        temperature_c=temp_c,
        traffic_congestion="moderate",
        distance_km=5.5,
        transit_available=True
    )

@router.post("/calculate", response_model=OffsetCalculationResponse)
async def calculate_offset_emissions(req: CommuteCalculationRequest):
    """
    Calculates carbon offset statistics and EcoCredits earned for alternative commutes.
    """
    mode = req.mode.strip().lower()
    if mode not in ["transit", "cycling", "walking"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid transport mode. Must be 'transit', 'cycling', or 'walking'."
        )

    savings = CarbonCalculator.calculate_commute_savings(req.distance_km, mode)
    projections = CarbonCalculator.get_projections(savings)
    
    return OffsetCalculationResponse(
        car_emissions_kg=savings["car_emissions_kg"],
        transit_emissions_kg=savings["transit_emissions_kg"],
        co2_offset_kg=savings["co2_offset_kg"],
        money_saved_usd=savings["money_saved_usd"],
        credits_earned=savings["credits_earned"],
        projections=projections
    )

@router.get("/challenges", response_model=List[Challenge])
async def get_daily_challenges():
    """
    Returns lists of active daily eco-challenges.
    """
    return [
        Challenge(
            id="ch_1",
            title="🚆 Green Commute Pioneer",
            description="Take public transit (metro/bus) for your commute today instead of a private car.",
            target_offset_kg=1.2,
            credits_reward=2.5,
            completed=False
        ),
        Challenge(
            id="ch_2",
            title="🚶 Clean Active Commute",
            description="Walk or cycle to any destination today for at least 2 kilometers.",
            target_offset_kg=0.5,
            credits_reward=1.5,
            completed=False
        ),
        Challenge(
            id="ch_3",
            title="💡 Smart Power Hour",
            description="Turn off idle home cooling units during peak local grid gridlock intervals.",
            target_offset_kg=1.0,
            credits_reward=2.0,
            completed=False
        )
    ]

@router.get("/achievements", response_model=List[Achievement])
async def get_achievements():
    """
    Returns gamification levels achievements.
    """
    return [
        Achievement(
            id="ach_1",
            title="Zero Emission Rookie",
            description="Offset your first 5kg of CO2 equivalent emissions.",
            badge_icon="🥉",
            earned=True
        ),
        Achievement(
            id="ach_2",
            title="Heat Island Shield",
            description="Walk through Landsat-shaded parks during peak hot days.",
            badge_icon="🛡️",
            earned=True
        ),
        Achievement(
            id="ach_3",
            title="EcoCredits Scholar",
            description="Earn over 50 EcoCredits offset balances.",
            badge_icon="🎓",
            earned=False
        )
    ]

@router.post("/summary", response_model=Dict[str, Any])
async def get_dashboard_summary(
    req: TelemetryRequest,
    service: UrbanTelemetryService = Depends(get_telemetry_service)
):
    """
    Aggregates telemetry, recommendations count, and defaults for dashboard panels.
    """
    telemetry = await service.get_normalized_telemetry(req.lat, req.lng)
    recs = UrbanRecommendationEngine.generate_recommendations(
        aqi_no2_ppb=telemetry["air_quality"]["no2_ppb"],
        temperature_c=telemetry["surface_temperature"]["landsat_surface_c"],
        traffic_congestion="moderate",
        distance_km=5.5
    )

    return {
        "telemetry": telemetry,
        "recommendations_count": len(recs),
        "daily_streak": 4, # 4-day daily streak
        "ecocredits_rank": "Green Scholar (Lvl 3)",
        "carbon_score": 85 # Carbon Score out of 100
    }
