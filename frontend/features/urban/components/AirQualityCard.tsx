"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatusChip } from "../../../components/ui/StatusChip";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideWind } from "lucide-react";

interface AirQualityCardProps {
  no2Ppb: number;
  status: "healthy" | "neutral" | "warning" | "critical";
  label: string;
  historicalNo2: number;
  variancePercentage: number;
  className?: string;
  fallbackActive?: boolean;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({
  no2Ppb,
  status,
  label,
  historicalNo2,
  variancePercentage,
  className = "",
  fallbackActive = false
}) => {
  const getAQIDesc = () => {
    switch (status) {
      case "healthy": return "Air quality is excellent. Suitable for all outdoor commutes and physical exercises.";
      case "warning": return "High NO2 concentration detected. Outdoor running or active cycling is not advised.";
      case "critical": return "Hazardous air pollution levels. Avoid outdoor exposures completely.";
      default: return "Moderate air quality. Sensitive individuals should monitor baseline indexes.";
    }
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Absolute background accent ring */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideWind className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Sentinel-5P Spectrum</span>
        <div className="flex items-center gap-2">
          {fallbackActive && <StatBadge label="Source" value="Demo Data" type="warning" />}
          <StatusChip label={label} status={status} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs text-text-muted">Nitrogen Dioxide (NO₂)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-3xl font-black text-text-deep">{no2Ppb.toFixed(1)}</span>
            <span className="text-xs text-text-muted">ppb</span>
          </div>
        </div>

        <p className="text-[11px] text-text-muted leading-relaxed">
          {getAQIDesc()}
        </p>

        <div className="pt-3 border-t border-border flex justify-between text-[10px]">
          <div>
            <span className="text-text-muted block">Historical Baseline</span>
            <span className="font-semibold text-text-deep">{historicalNo2.toFixed(1)} ppb</span>
          </div>
          <div className="text-right">
            <span className="text-text-muted block">Variance</span>
            <span className={`font-bold ${variancePercentage > 0 ? "text-telemetry-warning" : "text-telemetry-healthy"}`}>
              {variancePercentage > 0 ? `+${variancePercentage}` : variancePercentage}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default AirQualityCard;
