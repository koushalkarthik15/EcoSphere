from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.services.marketplace_service import MarketplaceService
from app.services.pricing_engine import CarbonCreditPricingEngine
from app.services.wallet_service import WalletService

router = APIRouter(prefix="/api/v1/marketplace", tags=["Carbon Marketplace Module"])

# Mock regional carbon projects registry
REGIONAL_PROJECTS = [
    {
        "id": "proj_punjab_tillage",
        "name": "🌾 Punjab Zero-Till Agri-Ledger",
        "type": "Soil Sequestration",
        "location": "Amritsar, Punjab",
        "lat": 31.6360,
        "lng": 74.8700,
        "funding_status": "92%",
        "credits_available": 1240.0,
        "price_per_ton_coins": 15.0,
        "vintage_year": 2026,
        "description": "Aggregates smallholder Punjabi wheat farms utilizing cover crops and zero-till methods."
    },
    {
        "id": "proj_rajasthan_solar",
        "name": "☀️ Rajasthan Thar Desert Solar Sink",
        "type": "Solar Energy",
        "location": "Jodhpur, Rajasthan",
        "lat": 26.2743,
        "lng": 73.0243,
        "funding_status": "78%",
        "credits_available": 5400.0,
        "price_per_ton_coins": 12.0,
        "vintage_year": 2025,
        "description": "Multi-megawatt solar arrays in Jodhpur offsetting conventional fossil energy imports."
    },
    {
        "id": "proj_himalayan_forests",
        "name": "🌲 Himalayan Foothills Reforestation",
        "type": "Afforestation",
        "location": "Dehradun, Uttarakhand",
        "lat": 30.3165,
        "lng": 78.0322,
        "funding_status": "100%",
        "credits_available": 850.0,
        "price_per_ton_coins": 18.0,
        "vintage_year": 2026,
        "description": "Protected forest ecosystems sequestering carbon while guarding Himalayan local biodiversity."
    }
]

# Request Schemas
class PurchaseRequest(BaseModel):
    listing_id: str
    amount_tons: float = Field(..., gt=0.0)

class SellRequest(BaseModel):
    project_id: str
    seller_name: str
    volume_tons: float = Field(..., gt=0.0)
    listing_price_coins: float = Field(..., gt=0.0)

class ConvertRequest(BaseModel):
    credits_amount: float = Field(..., gt=0.0)

# Dependencies injections
def get_marketplace_service() -> MarketplaceService:
    return MarketplaceService()

def get_wallet_service() -> WalletService:
    return WalletService()

# Endpoints
@router.get("/summary")
async def get_marketplace_summary(
    m_service: MarketplaceService = Depends(get_marketplace_service)
):
    """
    Returns general marketplace metrics: buyers, sellers, prices, active tons.
    """
    listings = m_service.get_all_listings()
    total_tons = sum(l["volume_tons"] for l in listings)
    
    # Calculate average live price index
    pricing = CarbonCreditPricingEngine.calculate_credit_price(
        supply_volume=total_tons,
        demand_volume=550.0,
        quality_grade="A+",
        verification_confidence=92.5
    )

    return {
        "live_price_coins": pricing["current_price_coins"],
        "suggested_price_coins": pricing["suggested_price_coins"],
        "credits_available_tons": round(total_tons, 1),
        "verified_farms_count": 48,
        "industrial_buyers_count": 18,
        "recent_transactions_count": len(m_service.get_transaction_history())
    }

@router.get("/projects")
async def get_marketplace_projects():
    """
    Returns registered regional carbon offset projects.
    """
    return REGIONAL_PROJECTS

@router.get("/listings")
async def get_marketplace_listings(
    m_service: MarketplaceService = Depends(get_marketplace_service)
):
    """
    Returns available credits listings for sale.
    """
    return m_service.get_all_listings()

@router.post("/purchase")
async def purchase_carbon_credits(
    req: PurchaseRequest,
    m_service: MarketplaceService = Depends(get_marketplace_service),
    w_service: WalletService = Depends(get_wallet_service)
):
    """
    Purchase credits using sandbox coins. Updates listings and wallet balance.
    """
    # 1. Look up listing to find pricing
    listings = m_service.listings
    listing = next((l for l in listings if l["id"] == req.listing_id), None)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    try:
        # 2. Deduct coins from default user's wallet
        w_service.deduct_payment_for_buy(
            user_id="default_user",
            volume_tons=req.amount_tons,
            price_per_ton=listing["price_per_ton_coins"]
        )
        
        # 3. Execute listing transaction
        tx = m_service.execute_transaction(
            listing_id=req.listing_id,
            buyer_id="default_user",
            volume_tons=req.amount_tons
        )
        return {"success": True, "transaction": tx}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sell")
async def create_carbon_listings(
    req: SellRequest,
    m_service: MarketplaceService = Depends(get_marketplace_service),
    w_service: WalletService = Depends(get_wallet_service)
):
    """
    Allows farmers to sell their verified credits onto the marketplace listings.
    """
    try:
        # Create listing
        listing = m_service.create_listing(
            project_id=req.project_id,
            seller_id="default_user",
            seller_name=req.seller_name,
            volume=req.volume_tons,
            price_per_ton=req.listing_price_coins
        )
        
        # Adjust wallet (remove verified credits, pay coins in mock transactions)
        w_service.receive_payment_for_sell(
            user_id="default_user",
            volume_tons=req.volume_tons,
            price_per_ton=req.listing_price_coins
        )
        return {"success": True, "listing": listing}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/wallet")
async def get_user_wallet(
    w_service: WalletService = Depends(get_wallet_service)
):
    """
    Returns default user's wallet details and deposits ledgers.
    """
    return w_service.get_wallet("default_user")

@router.get("/transactions")
async def get_user_transactions(
    m_service: MarketplaceService = Depends(get_marketplace_service)
):
    """
    Returns recent transactions timelines.
    """
    return m_service.get_transaction_history()

@router.get("/price-history")
async def get_price_trends():
    """
    Returns weekly index prices.
    """
    return CarbonCreditPricingEngine.get_historical_price_trend()

@router.post("/convert-rewards")
async def convert_urban_rewards(
    req: ConvertRequest,
    w_service: WalletService = Depends(get_wallet_service)
):
    """
    Converts Urban Citizens saved transit EcoCredits into EcoCoins.
    """
    try:
        wallet = w_service.convert_credits_to_coins("default_user", req.credits_amount)
        return {
            "success": True,
            "converted_credits": req.credits_amount,
            "new_coins_balance": wallet["eco_coins"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
