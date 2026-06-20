from typing import Dict, Any, List, Optional
from datetime import datetime

class MarketplaceService:
    """
    Manages active carbon credit listings, reserves, expirations, and sales history logs.
    """

    def __init__(self):
        # In-memory listings database representation for simulation
        self.listings = [
            {
                "id": "list_1",
                "project_id": "proj_punjab_tillage",
                "seller_id": "farmer_punjab",
                "seller_name": "Punjab Field A (Wheat)",
                "volume_tons": 120.0,
                "price_per_ton_coins": 15.0,
                "status": "AVAILABLE", # AVAILABLE, PENDING, SOLD, EXPIRED, RESERVED
                "quality_grade": "A+",
                "vintage_year": 2026,
                "verification_confidence": 92.5
            },
            {
                "id": "list_2",
                "project_id": "proj_rajasthan_solar",
                "seller_id": "solar_thar",
                "seller_name": "Thar Solar Plant",
                "volume_tons": 350.0,
                "price_per_ton_coins": 12.0,
                "status": "AVAILABLE",
                "quality_grade": "A-",
                "vintage_year": 2025,
                "verification_confidence": 95.0
            },
            {
                "id": "list_3",
                "project_id": "proj_himalayan_forests",
                "seller_id": "forest_himalaya",
                "seller_name": "Dehradun Forest Canopy",
                "volume_tons": 50.0,
                "price_per_ton_coins": 18.0,
                "status": "AVAILABLE",
                "quality_grade": "A++",
                "vintage_year": 2026,
                "verification_confidence": 88.0
            }
        ]

        self.transactions = [
            {
                "id": "tx_981a28",
                "listing_id": "list_1",
                "buyer_id": "industry_ludhiana",
                "seller_id": "farmer_punjab",
                "volume_tons": 15.0,
                "total_price_coins": 225.0,
                "timestamp": "2026-06-18T10:30:00Z",
                "status": "COMPLETED"
            },
            {
                "id": "tx_410b91",
                "listing_id": "list_2",
                "buyer_id": "industry_ludhiana",
                "seller_id": "solar_thar",
                "volume_tons": 5.0,
                "total_price_coins": 60.0,
                "timestamp": "2026-06-15T14:45:00Z",
                "status": "COMPLETED"
            }
        ]

    def get_all_listings(self) -> List[Dict[str, Any]]:
        return [l for l in self.listings if l["status"] == "AVAILABLE"]

    def create_listing(
        self,
        project_id: str,
        seller_id: str,
        seller_name: str,
        volume: float,
        price_per_ton: float,
        quality_grade: str = "A",
        vintage_year: int = 2026,
        confidence: float = 90.0
    ) -> Dict[str, Any]:
        """
        Publishes a new carbon credit listing onto the marketplace.
        """
        listing = {
            "id": f"list_{len(self.listings) + 1}",
            "project_id": project_id,
            "seller_id": seller_id,
            "seller_name": seller_name,
            "volume_tons": round(volume, 1),
            "price_per_ton_coins": round(price_per_ton, 1),
            "status": "AVAILABLE",
            "quality_grade": quality_grade,
            "vintage_year": vintage_year,
            "verification_confidence": confidence
        }
        self.listings.append(listing)
        return listing

    def execute_transaction(
        self,
        listing_id: str,
        buyer_id: str,
        volume_tons: float
    ) -> Dict[str, Any]:
        """
        Deducts credit volume from listings and records transaction history.
        """
        listing = next((l for l in self.listings if l["id"] == listing_id), None)
        if not listing:
            raise ValueError("Listing ID not found")
        if listing["status"] != "AVAILABLE":
            raise ValueError("Listing is no longer available for purchase")
        if listing["volume_tons"] < volume_tons:
            raise ValueError("Insufficient credit volume available in listing")

        # Reduce volume
        listing["volume_tons"] = round(listing["volume_tons"] - volume_tons, 1)
        if listing["volume_tons"] <= 0.0:
            listing["status"] = "SOLD"

        total_price = volume_tons * listing["price_per_ton_coins"]
        
        tx = {
            "id": f"tx_{datetime.now().strftime('%f')[:6]}",
            "listing_id": listing_id,
            "buyer_id": buyer_id,
            "seller_id": listing["seller_id"],
            "volume_tons": round(volume_tons, 1),
            "total_price_coins": round(total_price, 1),
            "timestamp": datetime.now().isoformat() + "Z",
            "status": "COMPLETED"
        }
        self.transactions.append(tx)
        return tx

    def get_transaction_history(self) -> List[Dict[str, Any]]:
        return self.transactions
