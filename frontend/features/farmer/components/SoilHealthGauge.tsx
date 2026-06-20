"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { ProgressRing } from "../../../components/ui/ProgressRing";
import { LucideHeart } from "lucide-react";

interface SoilHealthGaugeProps {
  score: number;
  className?: string;
}

export const SoilHealthGauge: React.FC<SoilHealthGaugeProps> = ({
  score,
  className = ""
}) => {
  const getQualityLabel = () => {
    if (score >= 80) return "Premium quality";
    if (score >= 60) return "Healthy organic";
    if (score >= 40) return "Moderate soil";
    return "Degraded topsoil";
  };

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Bio-telemetry Indexes</span>
          <h3 className="font-display text-md font-bold text-text-deep mt-0.5">Soil Quality Index</h3>
        </div>
        <div className="text-text-muted bg-[#DAEED2]/50 p-2 rounded-full border border-border/30">
          <LucideHeart className="h-5 w-5 text-telemetry-healthy" />
        </div>
      </div>

      <div className="my-4 flex items-center justify-center">
        <ProgressRing progress={score} radius={45} strokeWidth={6} color="text-telemetry-healthy" />
      </div>

      <div className="text-center">
        <span className="text-xs font-black text-text-deep uppercase block">{getQualityLabel()}</span>
        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
          Index combines S1 radar moisture, S2 cover density, and zero burn histories.
        </p>
      </div>
    </Card>
  );
};
export default SoilHealthGauge;
