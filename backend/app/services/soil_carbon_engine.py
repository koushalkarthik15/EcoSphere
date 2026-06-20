from typing import Dict, Any, List

class SoilCarbonEngine:
    """
    Evaluates agricultural topsoil carbon sinks.
    Calculates carbon balances based on field parameters, vegetation coverage, and farming practices.
    """
    
    # Sequestration factors (Tons of CO2 equivalent sequestered per acre per year)
    # Conservation farming: no-till, cover crops, crop rotation
    FACTOR_CONSERVATION_SEQUESTRATION = 0.30 
    FACTOR_CONVENTIONAL_SEQUESTRATION = 0.05
    
    # Soil organic carbon (SOC) baseline multiplier (Tons CO2 equivalent per acre)
    SOC_BASELINE_PER_ACRE = 45.0

    @classmethod
    def calculate_field_sequestration(
        cls, 
        acreage: float, 
        practice: str, # "conservation", "conventional"
        days_active: int,
        mean_ndvi: float,
        soil_moisture_pct: float
    ) -> Dict[str, Any]:
        """
        Estimates total stored soil carbon, seasonal sequestration offsets, and health scores.
        """
        if acreage <= 0:
            return {
                "estimated_storage_tons": 0.0,
                "sequestration_rate_annual_tons": 0.0,
                "season_gain_tons": 0.0,
                "annual_projection_tons": 0.0,
                "soil_health_score": 0,
                "biomass_trend": "stable",
                "explanation": "No land parcel bounds specified."
            }

        # Stored Carbon Baseline
        estimated_storage = acreage * cls.SOC_BASELINE_PER_ACRE
        
        # Determine Sequestration Rate
        rate_factor = (
            cls.FACTOR_CONSERVATION_SEQUESTRATION 
            if practice == "conservation" 
            else cls.FACTOR_CONVENTIONAL_SEQUESTRATION
        )
        
        # Adjust sequestration rate dynamically based on NDVI and Moisture (biological activity)
        # NDVI above 0.5 and moisture above 40% optimize organic degradation
        biological_modifier = 1.0
        if mean_ndvi > 0.6:
            biological_modifier += 0.15
        if soil_moisture_pct > 40.0:
            biological_modifier += 0.10
        elif soil_moisture_pct < 20.0:
            biological_modifier -= 0.20 # Drought limits microbial actions
            
        adjusted_rate_annual = rate_factor * biological_modifier
        
        # Calculate Gains
        annual_projection = acreage * adjusted_rate_annual
        season_gain = annual_projection * (days_active / 365.0)

        # Calculate Soil Health Score (Index 0-100)
        # Combined weight: Moisture (35%), NDVI coverage (40%), Practice (25%)
        moisture_score = min(100.0, soil_moisture_pct * 2.0) # 50% is optimal
        ndvi_score = mean_ndvi * 100.0
        practice_score = 100.0 if practice == "conservation" else 40.0
        
        soil_health_score = int(
            (moisture_score * 0.35) + 
            (ndvi_score * 0.40) + 
            (practice_score * 0.25)
        )
        soil_health_score = max(0, min(100, soil_health_score))

        # Evaluate Biomass Trend based on NDVI
        if mean_ndvi >= 0.65:
            biomass_trend = "Robust Growth"
        elif mean_ndvi >= 0.45:
            biomass_trend = "Stable Cover"
        else:
            biomass_trend = "Sparse Canopy"

        explanation = (
            f"Calculated for a {acreage}-acre parcel using {practice} farming. "
            f"Base sequestration coefficient of {rate_factor} t/acre/yr adjusted to {round(adjusted_rate_annual, 3)} t/acre/yr "
            f"due to active biological modifiers (Mean NDVI: {round(mean_ndvi, 2)}, Soil Moisture: {round(soil_moisture_pct, 1)}%)."
        )

        return {
            "estimated_storage_tons": round(estimated_storage, 2),
            "sequestration_rate_annual_tons": round(adjusted_rate_annual, 3),
            "season_gain_tons": round(season_gain, 2),
            "annual_projection_tons": round(annual_projection, 2),
            "soil_health_score": soil_health_score,
            "biomass_trend": biomass_trend,
            "explanation": explanation
        }
