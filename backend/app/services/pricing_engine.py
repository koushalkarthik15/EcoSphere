from typing import Dict, Any, List

class CarbonCreditPricingEngine:
    """
    Evaluates dynamic pricing indexes for verified carbon offsets.
    Accounts for supply/demand spreads, verification levels, quality grades, regional priorities, and vintages.
    """

    BASE_PRICE_COINS = 15.0

    @classmethod
    def calculate_credit_price(
        self,
        supply_volume: float,
        demand_volume: float,
        quality_grade: str, # A++, A+, A, A-, B
        verification_confidence: float,
        regional_priority: bool = False,
        vintage_year: int = 2026
    ) -> Dict[str, Any]:
        """
        Dynamically calculates the current credit price and suggested price modifiers.
        """
        price = self.BASE_PRICE_COINS

        # 1. Supply / Demand adjustments
        # Ratio of supply to demand scales base pricing
        if supply_volume > 0 and demand_volume > 0:
            sd_ratio = demand_volume / supply_volume
            # If demand is high, pricing climbs (up to 40% premium)
            # If supply is high, pricing dips (up to 20% discount)
            if sd_ratio > 1.5:
                price *= 1.25
            elif sd_ratio > 1.1:
                price *= 1.10
            elif sd_ratio < 0.6:
                price *= 0.85
            elif sd_ratio < 0.3:
                price *= 0.80

        # 2. Quality Grade modifiers
        grade_multiplier = 1.0
        if quality_grade == "A++":
            grade_multiplier = 1.20
        elif quality_grade == "A+":
            grade_multiplier = 1.12
        elif quality_grade == "A":
            grade_multiplier = 1.05
        elif quality_grade == "A-":
            grade_multiplier = 0.95
        elif quality_grade == "B":
            grade_multiplier = 0.85
        price *= grade_multiplier

        # 3. Verification confidence modifiers (e.g. standard base is 90%)
        confidence_multiplier = verification_confidence / 90.0
        price *= max(0.8, min(1.15, confidence_multiplier))

        # 4. Regional priority additions (e.g., local stubble burn mitigation)
        if regional_priority:
            price *= 1.10

        # 5. Vintage offset ages
        if vintage_year >= 2026:
            price *= 1.05 # Fresh credits premium
        elif vintage_year <= 2024:
            price *= 0.90 # Older credits discount

        # Round values
        current_price = round(price, 2)
        suggested_price = round(price * 1.05, 2) # Suggested list price has standard retail markups

        return {
            "current_price_coins": current_price,
            "suggested_price_coins": suggested_price,
            "modifiers": {
                "supply_demand_ratio": round(demand_volume / supply_volume, 2) if supply_volume > 0 else 1.0,
                "grade_premium": round(grade_multiplier - 1.0, 2),
                "confidence_multiplier": round(confidence_multiplier, 2),
                "regional_priority_applied": regional_priority,
                "vintage_year_applied": vintage_year
            }
        }

    @classmethod
    def get_historical_price_trend(self) -> List[Dict[str, Any]]:
        """
        Returns weekly historical marketplace index prices.
        """
        return [
            {"week": "W16", "index_price_coins": 13.5},
            {"week": "W17", "index_price_coins": 13.8},
            {"week": "W18", "index_price_coins": 14.2},
            {"week": "W19", "index_price_coins": 14.0},
            {"week": "W20", "index_price_coins": 14.5},
            {"week": "W21", "index_price_coins": 14.8},
            {"week": "W22", "index_price_coins": 15.0},
            {"week": "W23", "index_price_coins": 15.2},
            {"week": "W24", "index_price_coins": 15.5}
        ]
