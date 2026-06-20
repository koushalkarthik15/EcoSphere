from typing import Dict, Any, List

class AIRecommendationEngine:
    """
    Recommendation Engine generating personalized environmental recommendations
    for Urban, Farmer, Industry, and Marketplace domains based on current telemetry.
    """

    @classmethod
    def generate_recommendations(cls, role: str, telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Routing logic to fetch recommendations matching a specific user role.
        """
        role_lower = role.lower()
        if role_lower == "urban":
            return cls.get_urban_recommendations(telemetry)
        elif role_lower == "farmer":
            return cls.get_farmer_recommendations(telemetry)
        elif role_lower == "industry":
            return cls.get_industry_recommendations(telemetry)
        elif role_lower == "marketplace":
            return cls.get_marketplace_recommendations(telemetry)
        else:
            return []

    @staticmethod
    def get_urban_recommendations(telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates commute optimization, clean routing, energy saving tips for Urban Citizens.
        """
        aqi = telemetry.get("aqi", 45.0)
        lst = telemetry.get("uhi_celsius", 29.0)
        
        recommendations = []
        
        # Commute optimization
        if aqi > 75.0:
            recommendations.append({
                "id": "urban_commute_aqi",
                "type": "commute",
                "title": "🚇 Smart Commute: Take Eco-Transit",
                "content": "Elevated atmospheric index detected. Taking public transit or working from home today will reduce particulate exposure and save 2.8kg of CO2.",
                "action_label": "Explore Transit Options",
                "impact_credits": 3.0
            })
        else:
            recommendations.append({
                "id": "urban_commute_active",
                "type": "commute",
                "title": "🚲 Active Commute: Safe to Cycle",
                "content": f"The air quality index is healthy ({aqi}). Walk or cycle to offset 100% of commute emissions.",
                "action_label": "View Cleanest Route Map",
                "impact_credits": 5.0
            })

        # Heat island / green canopy recommendation
        if lst > 33.0:
            recommendations.append({
                "id": "urban_cooling_efficiency",
                "type": "energy",
                "title": "🔌 Peak Grid Load Optimization",
                "content": f"Local Land Surface Temp is high ({lst}°C). Shift high-energy appliance usage past peak hours (6 PM - 10 PM) to reduce grid strain.",
                "action_label": "Schedule Appliances",
                "impact_credits": 4.5
            })
        else:
            recommendations.append({
                "id": "urban_energy_conservation",
                "type": "energy",
                "title": "💡 Energy Conservation Opportunity",
                "content": "Comfortable local ambient temperatures. Setting home temperature settings 1°C closer to outdoor conditions saves 8% cooling energy.",
                "action_label": "View Energy Audit",
                "impact_credits": 2.0
            })

        # Sustainable route recommendations
        recommendations.append({
            "id": "urban_clean_route",
            "type": "route",
            "title": "🌳 Choose the Green-Canopy Route",
            "content": "A high-canopy route is available. Increases visual exposure to nature and keeps you cool, reducing ambient heat exposure by 2.5°C.",
            "action_label": "Map Green Route",
            "impact_credits": 1.5
        })

        return recommendations

    @staticmethod
    def get_farmer_recommendations(telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates irrigation timing, burn prevention, soil improvement, carbon sequestration suggestions.
        """
        soil_moisture = telemetry.get("soil_moisture", 35.0)
        fire_risk = telemetry.get("fire_risk", 20.0)
        vhi = telemetry.get("vhi", 65.0)

        recommendations = []

        # Irrigation recommendation
        if soil_moisture < 30.0:
            recommendations.append({
                "id": "farmer_irrigation_critical",
                "type": "irrigation",
                "title": "💦 Critical Irrigation Scheduling",
                "content": f"Soil dielectric moisture is low ({soil_moisture}%). Target watering tomorrow morning to prevent root stress and maximize absorption.",
                "action_label": "Trigger Precision Valves",
                "impact_credits": 10.0
            })
        else:
            recommendations.append({
                "id": "farmer_irrigation_nominal",
                "type": "irrigation",
                "title": "💧 Soil Moisture Adequate",
                "content": f"Soil moisture levels are stable ({soil_moisture}%). Defer additional watering cycles to conserve water and prevent nutrient leaching.",
                "action_label": "View Moisture Graphs",
                "impact_credits": 0.0
            })

        # Burn prevention / NASA FIRMS trigger
        if fire_risk > 60.0:
            recommendations.append({
                "id": "farmer_burn_prevention",
                "type": "burn_prevention",
                "title": "⚠️ Extreme Regional Fire Risk Alert",
                "content": f"Fire risk index is high ({fire_risk}). Under the zero-burn compliance scheme, stubble burning will trigger penalty logs. Log non-burn soil carbon mulching instead.",
                "action_label": "Request Mulching Support",
                "impact_credits": 25.0
            })

        # Soil improvement / Sequestration opportunities
        if vhi < 50.0:
            recommendations.append({
                "id": "farmer_soil_compost",
                "type": "soil",
                "title": "🌱 Soil Organic Carbon Sequestration",
                "content": "Vegetation index suggests stress. Apply biochar or organic compost to build carbon-sink capacity and capture 1.2 tons CO2e per hectare.",
                "action_label": "Order Verified Biochar",
                "impact_credits": 15.0
            })
        else:
            recommendations.append({
                "id": "farmer_carbon_credit",
                "type": "carbon_credit",
                "title": "🌾 Ledger Carbon Opportunities",
                "content": "Highly productive canopy observed. You are eligible to mint up to 1.8 new carbon tokens for this season's verified growth.",
                "action_label": "Mint Carbon Credits",
                "impact_credits": 30.0
            })

        return recommendations

    @staticmethod
    def get_industry_recommendations(telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates leak prevention, environmental compliance, solar adoption, and offset suggestions for industries.
        """
        emissions_idx = telemetry.get("industrial_emissions_index", 50.0)
        ch4_leak_prob = telemetry.get("methane_leak_probability", 15.0)

        recommendations = []

        # Methane leak warning
        if ch4_leak_prob > 35.0:
            recommendations.append({
                "id": "industry_leak_warning",
                "type": "leak_prevention",
                "title": "🚨 Methane (CH4) Fugitive Emission Warning",
                "content": f"Telemetry detects abnormal methane concentration anomalies (ch4 leak probability {ch4_leak_prob}%). Inspect piping seals in sector 4 immediately.",
                "action_label": "Dispatch Maintenance Crew",
                "impact_credits": 50.0
            })

        # Compliance suggestions
        if emissions_idx > 70.0:
            recommendations.append({
                "id": "industry_compliance_offset",
                "type": "compliance",
                "title": "🏭 Compliance Threat: High Emission Index",
                "content": f"Climate TRACE records emission levels ({emissions_idx}) exceeding regional regulatory limits. Buy 150 carbon credits to offset current excess.",
                "action_label": "Offset Excess Emissions",
                "impact_credits": 0.0
            })
        else:
            recommendations.append({
                "id": "industry_compliance_good",
                "type": "compliance",
                "title": "✅ Emission Compliance Positive",
                "content": "Facility is operating below local caps. Maintain offset balance to earn regional corporate sustainability rankings.",
                "action_label": "View ESG Rating Summary",
                "impact_credits": 10.0
            })

        # Solar adoption
        recommendations.append({
            "id": "industry_solar_transition",
            "type": "solar_adoption",
            "title": "☀️ Convert Factory Roof Space to Solar",
            "content": "Transition 3,500 sq meters of unused facility roofing to photovoltaic arrays. Displace 400 tons CO2e annually with an estimated 4.2-year payback period.",
            "action_label": "View Solar Layout Quote",
            "impact_credits": 40.0
        })

        return recommendations

    @staticmethod
    def get_marketplace_recommendations(telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates recommended projects, purchase advice, price dip alerts.
        """
        carbon_sink = telemetry.get("carbon_sink_score", 60.0)
        
        recommendations = []

        # Recommend local verified farm credits
        recommendations.append({
            "id": "market_regional_agri",
            "type": "marketplace",
            "title": "🌾 Regional Punjab Tillage Credit Bundle",
            "content": "Support adjacent agricultural communities. Punjabi farmer ledger credits are currently priced at a 10% discount ($22.0/ton) with a high confidence score.",
            "action_label": "Buy Punjab Credits",
            "impact_credits": 12.0
        })

        # High carbon sink yield projects
        if carbon_sink > 70.0:
            recommendations.append({
                "id": "market_carbon_sink_invest",
                "type": "marketplace",
                "title": "🌲 Himalayan Reforestation Initiative",
                "content": "High biomass yield verified by Google Earth Engine. Investing in these carbon sinks generates verified long-term offsets with high permanence.",
                "action_label": "Invest in Forestry",
                "impact_credits": 20.0
            })

        # Price opportunity recommendations
        recommendations.append({
            "id": "market_price_dip",
            "type": "marketplace",
            "title": "📉 Price Dip Alert: Desert Solar Project",
            "content": "Thar Desert Solar Sink credit prices are currently sitting at 18.5 EcoCoins, a 30-day low. Ideal window for industrial bulk purchases.",
            "action_label": "View Price Charts",
            "impact_credits": 15.0
        })

        return recommendations
