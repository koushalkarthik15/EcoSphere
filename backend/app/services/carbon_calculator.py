from typing import Dict, Any

class CarbonCalculator:
    """
    Implements standard environmental math for urban commute offsets.
    Uses carbon multipliers matching Ecosia, National Geographic, and WWF statistics.
    """
    
    # Emission Factors (EF) in kg CO2 per kilometer
    EF_CAR = 0.21       # Typical passenger car
    EF_TRANSIT = 0.05   # Metro / Bus alternative
    EF_CYCLING = 0.00   # Zero-emission
    EF_WALKING = 0.00   # Zero-emission

    # Cost factors (average fuel, wear, and maintenance savings per km in USD)
    COST_PER_KM_CAR = 0.15
    COST_PER_KM_TRANSIT = 0.03

    @classmethod
    def calculate_commute_savings(cls, distance_km: float, mode: str) -> Dict[str, Any]:
        """
        Calculates emissions offset, money saved, and EcoCredits earned for a single commute.
        """
        if distance_km <= 0:
            return {
                "car_emissions_kg": 0.0,
                "transit_emissions_kg": 0.0,
                "co2_offset_kg": 0.0,
                "money_saved_usd": 0.0,
                "credits_earned": 0.0
            }

        # Calculate base car emissions
        car_emissions = distance_km * cls.EF_CAR

        # Calculate alternative emissions
        if mode == "transit":
            alt_emissions = distance_km * cls.EF_TRANSIT
            money_saved = distance_km * (cls.COST_PER_KM_CAR - cls.COST_PER_KM_TRANSIT)
        elif mode in ["cycling", "walking"]:
            alt_emissions = 0.0
            money_saved = distance_km * cls.COST_PER_KM_CAR
        else:
            alt_emissions = car_emissions
            money_saved = 0.0

        co2_offset = max(0.0, car_emissions - alt_emissions)
        
        # 1 EcoCredit per 1.0 kg CO2 offset
        credits_earned = round(co2_offset * 1.0, 2)

        return {
            "car_emissions_kg": round(car_emissions, 2),
            "transit_emissions_kg": round(alt_emissions, 2),
            "co2_offset_kg": round(co2_offset, 2),
            "money_saved_usd": round(money_saved, 2),
            "credits_earned": credits_earned
        }

    @classmethod
    def get_projections(cls, daily_savings: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates weekly (5-day) and monthly (20-day) environmental and cost savings projections.
        """
        co2_daily = daily_savings.get("co2_offset_kg", 0.0)
        money_daily = daily_savings.get("money_saved_usd", 0.0)
        credits_daily = daily_savings.get("credits_earned", 0.0)

        return {
            "weekly": {
                "co2_offset_kg": round(co2_daily * 5, 2),
                "money_saved_usd": round(money_daily * 5, 2),
                "credits_earned": round(credits_daily * 5, 2)
            },
            "monthly": {
                "co2_offset_kg": round(co2_daily * 20, 2),
                "money_saved_usd": round(money_daily * 20, 2),
                "credits_earned": round(credits_daily * 20, 2)
            }
        }
