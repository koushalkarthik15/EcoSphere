"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideDroplets } from "lucide-react";

interface MoistureCardProps {
  moisturePct: number;
  className?: string;
}

export const MoistureCard: React.FC<MoistureCardProps> = ({
  moisturePct,
  className = ""
}) => {
  const getMoistureInfo = () => {
    if (moisturePct >= 40.0) return { status: "Optimal", color: "bg-telemetry-healthy/10 text-text-deep border-telemetry-healthy" };
    if (moisturePct >= 25.0) return { status: "Moderate", color: "bg-[#DAEED2] text-text-deep border-border" };
    return { status: "Drought Alert", color: "bg-telemetry-critical/10 text-telemetry-critical border-telemetry-critical" };
  };

  const info = getMoistureInfo();

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideDroplets className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sentinel-1 Radar (Moisture)</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${info.color}`}>
          {info.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-text-muted block uppercase font-semibold">Active Soil Moisture</span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="font-display text-3xl font-black text-text-deep">{moisturePct.toFixed(1)}</span>
            <span className="text-xs text-text-muted font-bold">%</span>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          Sentinel-1 Synthetic Aperture Radar (SAR) senses topsoil dielectric indicators. Maintaining optimal moisture levels stabilizes carbon pools and prevents organic matter loss.
        </p>

        <div className="pt-3 border-t border-border flex items-center justify-between text-[10px]">
          <span className="text-text-muted font-semibold">Irrigation Action:</span>
          <span className="font-bold text-text-deep">
            {moisturePct < 30.0 ? "Watering recommended" : "Soil saturation is stable"}
          </span>
        </div>
      </div>
    </Card>
  );
};
export default MoistureCard;
