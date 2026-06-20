"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideLineChart } from "lucide-react";

interface NDVICardProps {
  ndviValue: number;
  biomassScore: number;
  confidenceScore: number;
  className?: string;
}

export const NDVICard: React.FC<NDVICardProps> = ({
  ndviValue,
  biomassScore,
  confidenceScore,
  className = ""
}) => {
  const getNDVIStatus = () => {
    if (ndviValue >= 0.70) return { label: "Excellent Canopy", color: "text-telemetry-healthy bg-telemetry-healthy/10" };
    if (ndviValue >= 0.50) return { label: "Good Coverage", color: "text-telemetry-healthy bg-telemetry-healthy/10" };
    if (ndviValue >= 0.35) return { label: "Moderate Cover", color: "text-telemetry-warning bg-telemetry-warning/10" };
    return { label: "Sparse Canopy", color: "text-telemetry-critical bg-telemetry-critical/10" };
  };

  const ndviInfo = getNDVIStatus();

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideLineChart className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sentinel-2 NDVI Index</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${ndviInfo.color}`}>
          {ndviInfo.label}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Mean NDVI</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-display text-2xl font-black text-text-deep">{ndviValue.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Biomass Score</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-display text-2xl font-black text-text-deep">{biomassScore.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          Sentinel-2 infrared imagery gauges crop greenness. Positive vegetation trends directly correlate with organic nitrogen levels and carbon uptake.
        </p>

        <div className="pt-3 border-t border-border flex items-center justify-between text-[10px]">
          <span className="text-text-muted font-semibold">Telemetry Confidence:</span>
          <span className="font-bold text-text-deep">{confidenceScore.toFixed(1)}%</span>
        </div>
      </div>
    </Card>
  );
};
export default NDVICard;
