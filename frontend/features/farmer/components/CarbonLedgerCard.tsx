"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideLineChart } from "lucide-react";

interface CarbonLedgerCardProps {
  estimatedStorageTons: number;
  sequestrationRateAnnualTons: number;
  seasonGainTons: number;
  annualProjectionTons: number;
  practice: string;
  explanation: string;
  className?: string;
}

export const CarbonLedgerCard: React.FC<CarbonLedgerCardProps> = ({
  estimatedStorageTons,
  sequestrationRateAnnualTons,
  seasonGainTons,
  annualProjectionTons,
  practice,
  explanation,
  className = ""
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideLineChart className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">AgriCarbon Registry Log</span>
        <h3 className="font-display text-md font-bold text-text-deep mt-0.5">Topsoil Carbon Sink Ledger</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3.5 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Active Season Sequestration</span>
            <span className="text-xl font-black text-text-deep">{seasonGainTons.toFixed(2)} Tons CO₂e</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted block font-semibold">Rate factor</span>
            <span className="text-xl font-black text-telemetry-healthy">+{sequestrationRateAnnualTons.toFixed(2)} t/a/y</span>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          {explanation}
        </p>

        {/* Projections block */}
        <div className="border-t border-border pt-3">
          <span className="text-[10px] font-bold text-text-deep uppercase block mb-2">Soil-Sink Volumes</span>
          <div className="grid grid-cols-2 gap-4 text-[10px] bg-[#DAEED2]/20 p-2.5 rounded-lg border border-border/50">
            <div>
              <span className="text-text-muted font-semibold block uppercase">Total Carbon Storage</span>
              <span className="font-bold text-text-deep block">{estimatedStorageTons.toFixed(1)} t CO₂e</span>
            </div>
            <div>
              <span className="text-text-muted font-semibold block uppercase">Annual Projection</span>
              <span className="font-bold text-text-deep block">{annualProjectionTons.toFixed(1)} t CO₂e / yr</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CarbonLedgerCard;
