"use client";

import React from "react";

interface CommunityImpactProps {
  score: number;
  totalCredits: number;
  totalOffsetTexts: string;
  activeCount: number;
  grade?: string;
}

export const CommunityImpactCard: React.FC<CommunityImpactProps> = ({
  score,
  totalCredits,
  totalOffsetTexts,
  activeCount,
  grade = "A+"
}) => {
  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Local Community Environmental Impact Summary"
    >
      <div>
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          👥 Local Community Impact
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Collective ecological indicators for this local region
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background/40 p-4 border border-border/50 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
            Community Grade
          </span>
          <span className="text-3xl font-black text-text-deep block">
            {grade}
          </span>
        </div>

        <div className="bg-background/40 p-4 border border-border/50 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
            Engagement Score
          </span>
          <span className="text-3xl font-black text-text-deep block">
            {score.toFixed(0)}/100
          </span>
        </div>

        <div className="bg-background/40 p-4 border border-border/50 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
            Farms Supported
          </span>
          <span className="text-lg font-black text-text-deep block">
            {totalCredits.toFixed(0)} Active
          </span>
        </div>

        <div className="bg-background/40 p-4 border border-border/50 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
            Carbon Displaced
          </span>
          <span className="text-lg font-black text-text-deep block">
            {totalOffsetTexts}
          </span>
        </div>
      </div>

      <div className="bg-[#DAEED2]/20 p-3 rounded-lg border border-border text-[10px] text-text-muted font-semibold flex items-center justify-between">
        <span>Active local eco-citizens: {activeCount}</span>
        <span className="w-2.5 h-2.5 rounded-full bg-telemetry-healthy animate-pulse" />
      </div>
    </div>
  );
};

export default CommunityImpactCard;
