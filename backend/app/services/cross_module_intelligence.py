import math
from typing import Dict, Any, List

class CrossModuleIntelligence:
    """
    Evaluates correlations and connects Urban Citizens, Farmers, and Industries:
    - Urban citizens nearby verified farms for community-supported agriculture (CSA).
    - Industries purchasing regional credits for targeted localized offsets.
    - Community sustainability rankings of regions.
    - Regional carbon impacts and trends.
    - Role-based insights.
    """

    @staticmethod
    def get_nearby_farms(citizen_lat: float, citizen_lng: float) -> List[Dict[str, Any]]:
        """
        Calculates and returns verified local farms within 50km of the citizen.
        Uses basic Haversine distance formula.
        """
        # Mock database of verified EcoSphere farms
        farms = [
            {"id": "farm_punjab_1", "name": "🌾 Golden Fields Organic Agri", "lat": 30.901, "lng": 75.850, "type": "Wheat & Pulse Zero-Till", "carbon_sink_yield": 85.5},
            {"id": "farm_punjab_2", "name": "🌱 Ludhiana Hydroponic Hub", "lat": 30.850, "lng": 75.780, "type": "Smart Irrigation Soil-Sink", "carbon_sink_yield": 92.0},
            {"id": "farm_haryana_1", "name": "🚜 Green Canopy Co-op", "lat": 29.980, "lng": 76.820, "type": "Regenerative Agroforestry", "carbon_sink_yield": 78.4}
        ]

        results = []
        for farm in farms:
            dist = haversine_distance(citizen_lat, citizen_lng, farm["lat"], farm["lng"])
            if dist < 150.0:  # Allow 150km for regional Punjab-area matching
                results.append({
                    "id": farm["id"],
                    "name": farm["name"],
                    "distance_km": round(dist, 1),
                    "type": farm["type"],
                    "carbon_sink_yield": farm["carbon_sink_yield"],
                    "match_type": "Community Farm Tour & Veggie Share",
                    "credits_available": round(farm["carbon_sink_yield"] * 0.4, 1)
                })

        # Sort by distance
        results.sort(key=lambda x: x["distance_km"])
        return results

    @staticmethod
    def get_industry_offset_matches(facility_id: str, industry_lat: float, industry_lng: float) -> List[Dict[str, Any]]:
        """
        Matches heavy industries with localized carbon sink projects from verified farms in the same region,
        enabling corporations to buy nearby offsets.
        """
        # Local farm offset listings
        farm_projects = [
            {"id": "proj_ludhiana_agro", "name": "🌾 Ludhiana Agri-Carbon Ledger", "lat": 30.860, "lng": 75.800, "type": "Soil-Sink Zero-Tillage", "price_per_ton": 22.0, "available_tons": 450},
            {"id": "proj_jalandhar_reforest", "name": "🌲 Jalandhar Green Canopy Project", "lat": 31.320, "lng": 75.570, "type": "Regenerative Agroforestry", "price_per_ton": 25.5, "available_tons": 180},
            {"id": "proj_amritsar_biochar", "name": "🍂 Amritsar Crop Biochar Bed", "lat": 31.630, "lng": 74.870, "type": "Biochar Sequestration", "price_per_ton": 21.0, "available_tons": 620}
        ]

        matches = []
        for proj in farm_projects:
            dist = haversine_distance(industry_lat, industry_lng, proj["lat"], proj["lng"])
            # Match projects within same state / nearby zones (e.g. within 250km)
            if dist < 250.0:
                # Calculate direct suitability score
                suitability = 100 - int(dist * 0.2)
                suitability = max(40, min(98, suitability))
                
                matches.append({
                    "project_id": proj["id"],
                    "project_name": proj["name"],
                    "distance_km": round(dist, 1),
                    "type": proj["type"],
                    "price_per_ton": proj["price_per_ton"],
                    "available_tons": proj["available_tons"],
                    "suitability_score": suitability,
                    "insight": f"Purchasing these credits offsets {proj['type']} locally, reducing regional air pollution indices."
                })

        # Sort by suitability score descending
        matches.sort(key=lambda x: x["suitability_score"], reverse=True)
        return matches

    @staticmethod
    def get_community_rankings() -> List[Dict[str, Any]]:
        """
        Returns rankings of regions or sectors based on aggregate EcoCredits, compliance levels,
        and sustainability index.
        """
        return [
            {
                "rank": 1,
                "region": "Ludhiana Smart-Canopy Ward",
                "composite_sustainability": 88.5,
                "total_credits_minted": 1420.0,
                "compliance_rate": 96.0,
                "status": "Leader"
            },
            {
                "rank": 2,
                "region": "Amritsar Regenerative Zone",
                "composite_sustainability": 82.1,
                "total_credits_minted": 1150.5,
                "compliance_rate": 91.5,
                "status": "Improving"
            },
            {
                "rank": 3,
                "region": "Jalandhar Industrial Belt",
                "composite_sustainability": 64.8,
                "total_credits_minted": 890.0,
                "compliance_rate": 78.0,
                "status": "At Risk"
            }
        ]

    @staticmethod
    def get_regional_carbon_impact(lat: float, lng: float) -> Dict[str, Any]:
        """
        Returns regional carbon displacement details and trends.
        """
        return {
            "region_name": f"Punjab Region Grid ({lat:.2f}, {lng:.2f})",
            "total_co2_sequestered_tons": 4580.0,
            "total_co2_offset_by_commutes_tons": 34.8,
            "net_carbon_balance_status": "ACCUMULATING_SINK",
            "annual_trend_percentage": +12.4, # 12.4% increase in sink capacity year-over-year
            "soil_organic_carbon_buildup_tons": 1820.5
        }

    @staticmethod
    def get_role_based_insights(role: str, lat: float, lng: float) -> Dict[str, Any]:
        """
        Generates role-based cross-module recommendations and alerts.
        """
        role_lower = role.lower()
        if role_lower == "urban":
            return {
                "headline": "🥗 Support local carbon farming",
                "detail": "There are 2 verified regenerative farms nearby. Purchasing local veggie boxes from Ludhiana Hydroponic Hub helps finance their zero-burn farming methods.",
                "actionable_link": "/dashboard?tab=marketplace",
                "credits_incentive": 10
            }
        elif role_lower == "farmer":
            return {
                "headline": "🏭 Industrial offsets demand is peaking",
                "detail": "Jalandhar Industrial Belt is seeking 500 tons of local agroforestry credits. Lock in your credit minting to list them at a premium.",
                "actionable_link": "/dashboard?tab=ledger",
                "credits_incentive": 25
            }
        elif role_lower == "industry":
            return {
                "headline": "🌾 High-Permanence Local Agriculture Sinks Available",
                "detail": "Ludhiana Smart-Canopy Ward farmers have minted 450 tons of zero-till credits. Buying local offset listings improves local goodwill and ESG compliance scores.",
                "actionable_link": "/marketplace",
                "credits_incentive": 50
            }
        else:
            return {
                "headline": "🌱 Join the Carbon Platform",
                "detail": "Switch your profile to participate in local offset trades and carbon auditing.",
                "actionable_link": "/profile",
                "credits_incentive": 0
            }

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Computes distance between coordinates using the Haversine formula in kilometers.
    """
    R = 6371.0 # earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
