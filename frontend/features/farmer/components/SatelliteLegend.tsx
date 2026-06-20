"use client";

import React from "react";

export const SatelliteLegend: React.FC = () => {
  return (
    <div className="bg-white/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-lg text-[10px] text-text-deep space-y-2.5 max-w-[200px] w-full">
      <span className="font-bold text-text-deep uppercase block border-b border-border pb-1">Satellite Legend</span>
      
      <div className="space-y-1.5">
        <span className="font-semibold text-text-muted uppercase block">Vegetation Coverage (NDVI)</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1B5E20]/40 border border-[#1B5E20]/60" />
          <span>High NDVI (&gt; 0.6)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#81C784]/40 border border-[#81C784]/60" />
          <span>Moderate NDVI (0.35-0.6)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FFD54F]/40 border border-[#FFD54F]/60" />
          <span>Fallow / Bare soil (&lt; 0.35)</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1.5 border-t border-border/50">
        <span className="font-semibold text-text-muted uppercase block">Soil Moisture (S1 SAR)</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          <span>Dry (20-30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-400/40 border border-blue-500/60" />
          <span>Moist (&gt; 40%)</span>
        </div>
      </div>
    </div>
  );
};
export default SatelliteLegend;
