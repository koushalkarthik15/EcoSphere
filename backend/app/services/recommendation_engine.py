from typing import Dict, Any, List

class UrbanRecommendationEngine:
    """
    Rule-based recommendation engine for EcoSphere.
    Analyzes telemetry, traffic, and distance to construct context-aware guidelines.
    """

    @staticmethod
    def generate_recommendations(
        aqi_no2_ppb: float,
        temperature_c: float,
        traffic_congestion: str, # "low", "moderate", "high"
        distance_km: float,
        transit_available: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Builds a customized collection of environmental recommendations.
        """
        recommendations = []

        # 1. Morning / Commute options based on distance & traffic
        if distance_km < 3.0 and aqi_no2_ppb < 30.0 and 15.0 <= temperature_c <= 32.0:
            recommendations.append({
                "type": "commute",
                "title": "🌿 Active Morning Commute",
                "content": f"The weather is comfortable ({temperature_c}°C) and air quality is clean. Walking or cycling this {distance_km}km commute will offset approximately {round(distance_km * 0.21, 1)}kg of CO2.",
                "action_label": "Log Walk / Cycle",
                "impact_credits": round(distance_km * 0.21, 1)
            })
        elif traffic_congestion == "high" and transit_available:
            recommendations.append({
                "type": "commute",
                "title": "🚇 Skip Traffic Gridlock",
                "content": "Heavy road traffic detected. Taking the metro/bus transit will bypass congestion while saving 75% carbon emissions compared to driving.",
                "action_label": "Plan Transit Route",
                "impact_credits": round(distance_km * 0.16, 1)
            })
        else:
            recommendations.append({
                "type": "commute",
                "title": "🚌 Public Transit Option",
                "content": "Take the local bus alternative to reduce single-occupancy vehicle travel emissions.",
                "action_label": "View Transit Schedules",
                "impact_credits": round(distance_km * 0.16, 1)
            })

        # 2. Air Quality alert recommendation
        if aqi_no2_ppb >= 40.0:
            recommendations.append({
                "type": "pollution_avoidance",
                "title": "⚠️ Elevated NO2 Gas alert",
                "content": f"Sentinel-5P reports elevated NO2 column density of {aqi_no2_ppb} ppb. We advise avoiding outdoor cycling during peak morning hours. Prefer enclosed transit or work remotely if possible.",
                "action_label": "Check Indoor AQI",
                "impact_credits": 0.0
            })
        else:
            recommendations.append({
                "type": "pollution_avoidance",
                "title": "🌤️ Fresh Air Window",
                "content": f"Sentinel-5P indicates low pollutant densities ({aqi_no2_ppb} ppb). Outdoor activities and open-window air cycling are recommended.",
                "action_label": "View AQI History",
                "impact_credits": 0.0
            })

        # 3. Landsat Heat Island mitigation tip
        if temperature_c >= 35.0:
            recommendations.append({
                "type": "heat_island",
                "title": "🔥 Urban Heat Island Alert",
                "content": f"Local Landsat telemetry lists a surface temperature of {temperature_c}°C. Stick to green canopy zones (parks) to avoid paved thermal heat stores.",
                "action_label": "Find Green Zones",
                "impact_credits": 0.5
            })
        else:
            recommendations.append({
                "type": "heat_island",
                "title": "🍃 Cool Canopy Suggestion",
                "content": "Walking through tree-lined streets reduces cooling loads and supports local green parks.",
                "action_label": "View Canopy Index",
                "impact_credits": 0.2
            })

        # 4. Global carbon-saving tips
        recommendations.append({
            "type": "energy",
            "title": "🔌 Household Offset Tip",
            "content": "Avoid using heavy cooling/heating loads during peak grid intervals. Shifting load usage saves approximately 1.2kg CO2.",
            "action_label": "Join Peak Offset Challenge",
            "impact_credits": 1.2
        })

        return recommendations
