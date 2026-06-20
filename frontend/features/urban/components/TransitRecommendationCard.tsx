"use client";

import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { LucideCar, LucideBus, LucideNavigation, LucideCoins } from "lucide-react";

interface TransitRecommendationCardProps {
  distanceKm: number;
  onCalculate: (distance: number, mode: string) => Promise<any>;
  className?: string;
}

export const TransitRecommendationCard: React.FC<TransitRecommendationCardProps> = ({
  distanceKm,
  onCalculate,
  className = ""
}) => {
  const [activeMode, setActiveMode] = useState<"transit" | "cycling" | "walking">("transit");
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (mode: "transit" | "cycling" | "walking") => {
    setActiveMode(mode);
    setLoading(true);
    try {
      const result = await onCalculate(distanceKm, mode);
      setCalculationResult(result);
    } catch (e) {
      console.error("Calculation failure:", e);
    } finally {
      setLoading(false);
    }
  };

  // Trigger default calculation on mount/distance change
  React.useEffect(() => {
    handleCalculate(activeMode);
  }, [distanceKm]);

  return (
    <Card title="Alternative Route Calculator" description="Compute precise carbon savings and EcoCredits rewards for transit options." className={className}>
      <div className="space-y-6">
        {/* Route selector buttons */}
        <div className="flex gap-2">
          {(["transit", "cycling", "walking"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleCalculate(m)}
              className={`flex-1 px-4 py-2 border rounded-xl text-xs font-bold transition-smooth uppercase tracking-wide ${
                activeMode === m
                  ? "bg-text-deep text-white border-text-deep"
                  : "border-border text-text-muted hover:text-text-deep"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center text-xs text-text-muted font-bold animate-pulse">
            Recalculating offsets metrics...
          </div>
        ) : calculationResult ? (
          <div className="space-y-4">
            {/* Emission Comparison chart/row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center gap-3">
                <LucideCar className="h-5 w-5 text-telemetry-critical" />
                <div>
                  <span className="text-[10px] text-text-muted block">Solo Car Ride</span>
                  <span className="text-xs font-black text-text-deep">
                    {calculationResult.car_emissions_kg.toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>

              <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-3">
                <LucideBus className="h-5 w-5 text-telemetry-healthy" />
                <div>
                  <span className="text-[10px] text-text-muted block uppercase font-bold">{activeMode}</span>
                  <span className="text-xs font-black text-text-deep">
                    {calculationResult.transit_emissions_kg.toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>
            </div>

            {/* Savings banner */}
            <div className="p-4 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#DAEED2] p-2 rounded-full text-text-deep">
                  <LucideNavigation className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block font-semibold">Total Carbon Mitigated</span>
                  <span className="text-sm font-black text-text-deep">
                    {calculationResult.co2_offset_kg.toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-text-muted block font-semibold">EcoCredits Earned</span>
                <span className="text-sm font-black text-telemetry-healthy flex items-center gap-1 justify-end">
                  +{calculationResult.credits_earned.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-border text-[10px]">
              <div>
                <span className="text-text-muted block">Fuel Money Saved</span>
                <span className="font-bold text-text-deep">${calculationResult.money_saved_usd.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Weekly Offset</span>
                <span className="font-bold text-text-deep">{calculationResult.projections.weekly.co2_offset_kg.toFixed(1)} kg</span>
              </div>
              <div>
                <span className="text-text-muted block">Monthly Offset</span>
                <span className="font-bold text-text-deep">{calculationResult.projections.monthly.co2_offset_kg.toFixed(1)} kg</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-text-muted">No route bounds selected.</div>
        )}
      </div>
    </Card>
  );
};
export default TransitRecommendationCard;
