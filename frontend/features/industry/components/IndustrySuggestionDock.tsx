"use client";

import React from "react";
import { RecommendationCard } from "../../urban/components/RecommendationCard";

interface IndustrySuggestionDockProps {
  isMethaneLeak: boolean;
  isSo2Leak: boolean;
  solarROIYears: number;
  creditsRecommendationTons: number;
  className?: string;
}

export const IndustrySuggestionDock: React.FC<IndustrySuggestionDockProps> = ({
  isMethaneLeak,
  isSo2Leak,
  solarROIYears,
  creditsRecommendationTons,
  className = ""
}) => {
  return (
    <div className={`w-full bg-[#FFFFFF] border border-border p-5 rounded-2xl shadow-md ${className}`}>
      <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-telemetry-healthy animate-ping" />
          <span className="text-[10px] font-bold text-text-deep uppercase tracking-wider font-display">Auditor Suggestion Dock</span>
        </div>
        <span className="text-[9px] text-text-muted font-semibold">Scroll horizontally for real-time compliance steps</span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        
        {/* Dynamic Methane leak alert */}
        {isMethaneLeak && (
          <RecommendationCard
            type="hazard"
            title="⚠️ Methane Leak Warning"
            content="Sentinel-5P spectrometer indicates a methane plume (excess >40 ppb). Schedule pipe inspections."
            actionLabel="Schedule Maintenance"
            impactCredits={2.5}
          />
        )}

        {/* Dynamic SO2 leak alert */}
        {isSo2Leak && (
          <RecommendationCard
            type="hazard"
            title="⚠️ SO₂ Stack Emission Warning"
            content="Elevated sulfur dioxide readings detected over factory stacks. Optimize combustion settings."
            actionLabel="Tune Boiler"
            impactCredits={1.8}
          />
        )}

        {/* Solar ROI Card */}
        <RecommendationCard
          type="irrigation" // Reuse color code theme
          title="☀️ Rooftop Solar Potential"
          content={`Roof potential analysis indicates a ${solarROIYears.toFixed(1)}-year cost payback timeline. Secure capital offset.`}
          actionLabel="View Solar Spec"
          impactCredits={12.0}
        />

        {/* Carbon Offset recommendation */}
        <RecommendationCard
          type="credits"
          title="🔑 Carbon Offset Strategy"
          content={`Buy ${creditsRecommendationTons.toLocaleString()} verified credits from Punjab Farmer tillage projects to hit Net-Zero.`}
          actionLabel="Buy Offsets"
          impactCredits={creditsRecommendationTons}
        />

        {/* Equipment maintenance */}
        <RecommendationCard
          type="fertilizer"
          title="🔧 Equipment Maintenance"
          content="Perform biannual gas valve audits to satisfy National Carbon Market compliance certifications."
          actionLabel="Log Valve Audit"
          impactCredits={0.8}
        />

        {/* Cost saving opportunity */}
        <RecommendationCard
          type="irrigation"
          title="💡 Cost Saving Opportunity"
          content="Offset Scope 2 indirect carbon base with local farmer credits to unlock municipal tax rebates."
          actionLabel="Verify Reinvestment"
          impactCredits={4.2}
        />
      </div>
    </div>
  );
};

export default IndustrySuggestionDock;
