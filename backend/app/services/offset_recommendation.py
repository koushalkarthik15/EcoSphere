from typing import Dict, Any, List

class IndustrialOffsetRecommendationEngine:
    """
    Formulates strategic carbon offsets recommendation reports for industrial compliance.
    Calculates carbon offset requirements, timelines, budget usage, and highlights regional projects.
    """

    CREDIT_PRICE_COINS_PER_TON = 15.0 # Cost of 1 carbon credit in EcoCoins (or USD equivalent)

    @classmethod
    def recommend_offsets(
        self,
        current_annual_emissions_tons: float,
        target_reduction_pct: float, # e.g. 50.0 for 50%
        corporate_budget_usd: float
    ) -> Dict[str, Any]:
        """
        Computes credit volumes required to hit reduction target, evaluates credit purchase
        costs, builds neutrality timeline projections, and reviews active offset projects.
        """
        target_fraction = target_reduction_pct / 100.0
        emissions_to_offset_tons = current_annual_emissions_tons * target_fraction

        # Costs calculations
        total_credit_cost_usd = emissions_to_offset_tons * 24.50 # $24.50 per verified credit ton
        total_credit_cost_coins = emissions_to_offset_tons * self.CREDIT_PRICE_COINS_PER_TON

        # Determine neutrality timeline:
        # Assuming typical corporate credit purchase deployment happens over 12-36 months
        if total_credit_cost_usd <= corporate_budget_usd:
            timeline_status = "Accelerated (Net-Zero in 6 months)"
            neutrality_months = 6
        elif total_credit_cost_usd <= corporate_budget_usd * 3.0:
            timeline_status = "Standard (Net-Zero in 18 months)"
            neutrality_months = 18
        else:
            timeline_status = "Gradual (Net-Zero in 36 months)"
            neutrality_months = 36

        # Mapped Regional Projects
        regional_projects = [
            {
                "id": "proj_punjab_tillage",
                "name": "🌾 Punjab Zero-Till Agri-Ledger",
                "type": "Agriculture Sequestration",
                "location": "Amritsar, Punjab",
                "credits_available": 1240.0,
                "price_per_ton_usd": 22.0
            },
            {
                "id": "proj_rajasthan_solar",
                "name": "☀️ Rajasthan Thar Desert Solar Sink",
                "type": "Renewable Energy",
                "location": "Jodhpur, Rajasthan",
                "credits_available": 5400.0,
                "price_per_ton_usd": 18.50
            },
            {
                "id": "proj_himalayan_forests",
                "name": "🌲 Himalayan Foothills Reforestation",
                "type": "Afforestation",
                "location": "Dehradun, Uttarakhand",
                "credits_available": 850.0,
                "price_per_ton_usd": 28.0
            }
        ]

        return {
            "annual_emissions_tons": current_annual_emissions_tons,
            "target_reduction_percentage": target_reduction_pct,
            "credits_required_tons": round(emissions_to_offset_tons, 1),
            "estimated_purchase_cost_usd": round(total_credit_cost_usd, 2),
            "estimated_purchase_cost_coins": round(total_credit_cost_coins, 1),
            "carbon_neutrality_timeline": timeline_status,
            "neutrality_months": neutrality_months,
            "recommended_projects": regional_projects,
            "budget_status": "SUFFICIENT" if total_credit_cost_usd <= corporate_budget_usd else "DEFICIT"
        }
