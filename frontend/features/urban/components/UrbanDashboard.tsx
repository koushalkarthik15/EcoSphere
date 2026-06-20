"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { AirQualityCard } from "./AirQualityCard";
import { HeatIndexCard } from "./HeatIndexCard";
import { TransitRecommendationCard } from "./TransitRecommendationCard";
import { CarbonSavingsCard } from "./CarbonSavingsCard";
import { DailyChallengeCard } from "./DailyChallengeCard";
import { CarbonProgress } from "./CarbonProgress";
import { AchievementBadge } from "./AchievementBadge";
import { SuggestionDock } from "./SuggestionDock";
import { UrbanGoogleMap } from "./UrbanGoogleMap";
import { MapLayersState } from "./LayerToggle";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { HeroSection } from "../../../components/ui/HeroSection";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { URBAN_DEMO_DATA } from "../../../lib/demoData";

export const UrbanDashboard: React.FC = () => {
  const { currentLocation } = useTelemetry();
  const { addToast } = useToasts();
  const { mode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);

  // Default Map Layers state
  const [mapLayers, setMapLayers] = useState<MapLayersState>({
    heatIsland: false,
    airQuality: true,
    traffic: false,
    transit: false,
    greenZones: false,
    savingRoutes: false,
  });

  const handleLayerChange = (key: keyof MapLayersState, val: boolean) => {
    setMapLayers((prev) => ({ ...prev, [key]: val }));
    addToast(
      `Map overlay layer: ${key.replace(/([A-Z])/g, " $1")} ${val ? "enabled" : "disabled"}.`,
      "info"
    );
  };

  // Callback to calculate carbon savings route offsets
  const handleCalculateCommute = async (distance: number, commuteMode: string) => {
    if (mode === "demo") {
      const car_emissions = distance * 0.21;
      const alt_emissions = commuteMode === "transit" ? distance * 0.05 : 0.0;
      const offset = car_emissions - alt_emissions;
      return {
        car_emissions_kg: car_emissions,
        transit_emissions_kg: alt_emissions,
        co2_offset_kg: offset,
        money_saved_usd: distance * 0.12,
        credits_earned: offset,
        projections: {
          weekly: { co2_offset_kg: offset * 5, money_saved_usd: distance * 0.12 * 5 },
          monthly: { co2_offset_kg: offset * 20, money_saved_usd: distance * 0.12 * 20 }
        }
      };
    }
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/urban/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distance_km: distance, mode: commuteMode }),
        credentials: "include"
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error("Offset calculations API call returned failure.");
    } catch (err) {
      console.error(err);
      // Fallback calculations offline
      const car_emissions = distance * 0.21;
      const alt_emissions = commuteMode === "transit" ? distance * 0.05 : 0.0;
      const offset = car_emissions - alt_emissions;
      return {
        car_emissions_kg: car_emissions,
        transit_emissions_kg: alt_emissions,
        co2_offset_kg: offset,
        money_saved_usd: distance * 0.12,
        credits_earned: offset,
        projections: {
          weekly: { co2_offset_kg: offset * 5, money_saved_usd: distance * 0.12 * 5 },
          monthly: { co2_offset_kg: offset * 20, money_saved_usd: distance * 0.12 * 20 }
        }
      };
    }
  };

  // Fetch telemetry and recommendations from backend APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    if (mode === "demo") {
      setTelemetry(URBAN_DEMO_DATA.telemetry);
      setRecommendations(URBAN_DEMO_DATA.recommendations);
      setChallenges(URBAN_DEMO_DATA.challenges);
      setAchievements(URBAN_DEMO_DATA.achievements);
      setDashboardSummary(URBAN_DEMO_DATA.summary);
      setLoading(false);
      return;
    }
    
    try {
      const requestPayload = {
        lat: currentLocation.lat,
        lng: currentLocation.lng
      };

      // 1. Fetch telemetry
      const telRes = await fetch("http://localhost:8000/api/v1/urban/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });
      if (telRes.ok) {
        setTelemetry(await telRes.json());
      }

      // 2. Fetch recommendations
      const recRes = await fetch("http://localhost:8000/api/v1/urban/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });
      if (recRes.ok) {
        setRecommendations(await recRes.json());
      }

      // 3. Fetch challenges
      const chRes = await fetch("http://localhost:8000/api/v1/urban/challenges", {
        credentials: "include"
      });
      if (chRes.ok) {
        setChallenges(await chRes.json());
      }

      // 4. Fetch achievements
      const achRes = await fetch("http://localhost:8000/api/v1/urban/achievements", {
        credentials: "include"
      });
      if (achRes.ok) {
        setAchievements(await achRes.json());
      }

      // 5. Fetch summary
      const sumRes = await fetch("http://localhost:8000/api/v1/urban/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });
      if (sumRes.ok) {
        setDashboardSummary(await sumRes.json());
      }

    } catch (e) {
      console.warn("Failed fetching dashboard APIs, using defaults:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentLocation]);

  if (loading) {
    return <LoadingScreen message="Aggregating atmospheric spectrometry models..." />;
  }

  // Fallbacks if backend server connection fails
  const aqInfo = telemetry?.air_quality || { no2_ppb: 24.5, status: "neutral", label: "Moderate", baseline_comparison: { historical_no2: 22.1, variance_percentage: 10.8 } };
  const tempInfo = telemetry?.surface_temperature || { landsat_surface_c: 31.7, ambient_air_c: 28.5, heat_island_intensity: "moderate" };
  const summaryInfo = dashboardSummary || { daily_streak: 4, ecocredits_rank: "Green Scholar (Lvl 3)", carbon_score: 85 };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <HeroSection
        title="Urban Citizen Environmental Intelligence Workspace"
        description="Monitor Sentinel-5P nitrogen columns, Landsat thermal heat islands, and calculate carbon-neutral commuting offsets dynamically across Ludhiana's urban canopy wards."
        primaryActionLabel="Analyze Air Quality"
        secondaryActionLabel="Open Challenges"
        onPrimaryClick={() => addToast("GPRS Spectrometry bounds updated to local sector 4.", "info")}
        onSecondaryClick={() => addToast("Toggled Daily eco-challenges feed list.", "info")}
      />

      {/* Primary Telemetry Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AirQualityCard
          no2Ppb={aqInfo.no2_ppb}
          status={aqInfo.status}
          label={aqInfo.label}
          historicalNo2={aqInfo.baseline_comparison.historical_no2}
          variancePercentage={aqInfo.baseline_comparison.variance_percentage}
          fallbackActive={aqInfo.fallback_active || mode === "demo"}
        />
        <HeatIndexCard
          landsatSurfaceC={tempInfo.landsat_surface_c}
          ambientAirC={tempInfo.ambient_air_c}
          intensity={tempInfo.heat_island_intensity}
          fallbackActive={tempInfo.fallback_active || mode === "demo"}
        />
        <CarbonProgress
          streak={summaryInfo.daily_streak}
          rank={summaryInfo.ecocredits_rank}
          carbonScore={summaryInfo.carbon_score}
        />
      </div>

      {/* Main Interactive Map Centerpiece */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
          Spatial Telemetry Canvas
        </span>
        <UrbanGoogleMap
          layers={mapLayers}
          onLayerChange={handleLayerChange}
          height="450px"
        />
      </div>

      {/* Replaced SuggestionDock with Right Drawer Alert */}
      <div className="bg-[#F1F8E9] border border-[#DCEED2] p-4 rounded-2xl text-xs text-text-deep flex items-center justify-between gap-3 shadow-xs">
        <span>💡 EcoSphere AI recommendations are active for your region. Inspect personalized suggestions in the right-side Assistant.</span>
        <button 
          onClick={() => addToast("Recommendations are docked in your right Assistant panel drawer.", "info")}
          className="underline font-bold text-text-deep hover:text-text-muted cursor-pointer uppercase tracking-wider text-[10px]"
        >
          Verify Recommendations
        </button>
      </div>

      {/* Offsets Calculator, Challenges & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransitRecommendationCard
            distanceKm={5.5}
            onCalculate={handleCalculateCommute}
          />
        </div>
        <div className="flex flex-col gap-6">
          <DailyChallengeCard challenges={challenges.length > 0 ? challenges : [
            { id: "ch_1", title: "🚆 Green Commute Pioneer", description: "Take public transit today.", target_offset_kg: 1.2, credits_reward: 2.5, completed: false },
            { id: "ch_2", title: "🚶 Clean Active Commute", description: "Walk/cycle for at least 2km.", target_offset_kg: 0.5, credits_reward: 1.5, completed: false }
          ]} />
          
          <AchievementBadge achievements={achievements.length > 0 ? achievements : [
            { id: "ach_1", title: "Zero Emission Rookie", description: "Offset first 5kg of CO2.", badge_icon: "🥉", earned: true },
            { id: "ach_2", title: "Heat Island Shield", description: "Walk through shaded parks.", badge_icon: "🛡️", earned: true }
          ]} />
        </div>
      </div>
    </div>
  );
};
export default UrbanDashboard;
