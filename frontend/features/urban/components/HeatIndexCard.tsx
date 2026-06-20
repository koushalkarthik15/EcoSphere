"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideThermometer } from "lucide-react";

interface HeatIndexCardProps {
  landsatSurfaceC: number;
  ambientAirC: number;
  intensity: string;
  className?: string;
  fallbackActive?: boolean;
}

export const HeatIndexCard: React.FC<HeatIndexCardProps> = ({
  landsatSurfaceC,
  ambientAirC,
  intensity,
  className = "",
  fallbackActive = false
}) => {
  const diff = landsatSurfaceC - ambientAirC;
  const isHighIntensity = diff >= 3.0;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideThermometer className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Landsat Surface Thermal</span>
        <div className="flex items-center gap-2">
          {fallbackActive && <StatBadge label="Source" value="Demo Data" type="warning" />}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
            isHighIntensity ? "bg-telemetry-warning/15 text-text-deep" : "bg-[#DAEED2] text-text-deep"
          }`}>
            Heat Island: {intensity.split(" ")[0]}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Surface Temp</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-display text-2xl font-black text-text-deep">{landsatSurfaceC.toFixed(1)}</span>
              <span className="text-[10px] text-text-muted">°C</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Ambient Air</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-display text-2xl font-black text-text-deep">{ambientAirC.toFixed(1)}</span>
              <span className="text-[10px] text-text-muted">°C</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          Paved and built areas are <span className="font-bold text-text-deep">+{diff.toFixed(1)}°C</span> hotter than surrounding ambient air. Commute through tree-shaded paths to reduce thermal load.
        </p>

        <div className="pt-3 border-t border-border flex items-center justify-between text-[10px]">
          <span className="text-text-muted font-semibold">Microclimate Shield:</span>
          <span className="font-bold text-telemetry-healthy">Active Canopy Route recommended</span>
        </div>
      </div>
    </Card>
  );
};
export default HeatIndexCard;
