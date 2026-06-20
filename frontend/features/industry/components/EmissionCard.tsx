"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideFlame, LucideWind } from "lucide-react";

interface EmissionCardProps {
  methanePpb: number;
  so2Ppb: number;
  no2Ppb: number;
  leakSeverity: string;
  className?: string;
}

export const EmissionCard: React.FC<EmissionCardProps> = ({
  methanePpb,
  so2Ppb,
  no2Ppb,
  leakSeverity,
  className = ""
}) => {
  const getSeverityBadgeType = () => {
    switch (leakSeverity) {
      case "CRITICAL": return "error";
      case "HIGH": return "error";
      case "MEDIUM": return "warning";
      default: return "success";
    }
  };

  const isExcessMethane = methanePpb > 1880.0;
  const isExcessSo2 = so2Ppb > 2.0;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-red-100/10 rounded-full flex items-center justify-center pointer-events-none">
        <LucideFlame className="h-12 w-12 text-[#E53935]/15" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sentinel-5P Trace Spectrometry</span>
        <StatBadge label="Leak Severity" value={leakSeverity} type={getSeverityBadgeType()} />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Methane Gas */}
          <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl">
            <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Methane (CH₄)</span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-xl font-black text-text-deep">{methanePpb.toFixed(1)}</span>
              <span className="text-[9px] text-text-muted font-bold">ppb</span>
            </div>
            <span className={`text-[8px] font-bold block mt-1.5 ${isExcessMethane ? "text-[#E53935]" : "text-[#2E7D32]"}`}>
              {isExcessMethane ? "⚠️ Excess leak detected" : "✓ Normal baseline"}
            </span>
          </div>

          {/* Sulfur Dioxide */}
          <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl">
            <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Sulfur Dioxide (SO₂)</span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-xl font-black text-text-deep">{so2Ppb.toFixed(2)}</span>
              <span className="text-[9px] text-text-muted font-bold">ppb</span>
            </div>
            <span className={`text-[8px] font-bold block mt-1.5 ${isExcessSo2 ? "text-[#E53935]" : "text-[#2E7D32]"}`}>
              {isExcessSo2 ? "⚠️ Elevated stacks exhaust" : "✓ Normal baseline"}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed">
          TROPOMI spectrometers monitor trace gas column densities daily. Elevated methane indicate operational pipeline leakage.
        </p>

        <div className="pt-2.5 border-t border-border flex items-center justify-between text-[9px] font-semibold text-text-muted">
          <span>NO₂ Spectrometry Reading:</span>
          <span className="text-text-deep font-bold">{no2Ppb.toFixed(1)} ppb</span>
        </div>
      </div>
    </Card>
  );
};

export default EmissionCard;
