"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideTrendingDown } from "lucide-react";

interface CarbonSavingsCardProps {
  co2OffsetKg: number;
  creditsEarned: number;
  moneySavedUsd: number;
  className?: string;
}

export const CarbonSavingsCard: React.FC<CarbonSavingsCardProps> = ({
  co2OffsetKg,
  creditsEarned,
  moneySavedUsd,
  className = ""
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideTrendingDown className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Carbon Ledger Summary</span>
        <h3 className="font-display text-md font-bold text-text-deep mt-0.5">Environmental Balance</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3.5 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Total CO₂ Offset</span>
            <span className="text-xl font-black text-text-deep">{co2OffsetKg.toFixed(1)} kg</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted block font-semibold">EcoCredits Earned</span>
            <span className="text-xl font-black text-telemetry-healthy">+{creditsEarned.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          Your carbon offsets are calculated by evaluating alternative travel methods against a standard gasoline vehicle emissions coefficient (0.21 kg/km). By choosing cleaner transit alternatives, you have also saved a total of <span className="font-bold text-text-deep">${moneySavedUsd.toFixed(2)}</span> in estimated travel costs.
        </p>

        {/* Weekly & Monthly projection tables */}
        <div className="border-t border-border pt-3">
          <span className="text-[10px] font-bold text-text-deep uppercase block mb-2">Projections (If sustained)</span>
          <div className="grid grid-cols-2 gap-4 text-[10px] bg-[#DAEED2]/20 p-2.5 rounded-lg border border-border/50">
            <div>
              <span className="text-text-muted font-semibold block uppercase">Weekly savings</span>
              <span className="font-bold text-text-deep block">{(co2OffsetKg * 5).toFixed(1)} kg CO₂</span>
              <span className="text-text-muted block">Saved: ${(moneySavedUsd * 5).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-text-muted font-semibold block uppercase">Monthly savings</span>
              <span className="font-bold text-text-deep block">{(co2OffsetKg * 20).toFixed(1)} kg CO₂</span>
              <span className="text-text-muted block">Saved: ${(moneySavedUsd * 20).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CarbonSavingsCard;
