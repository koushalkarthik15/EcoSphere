"use client";

import React from "react";

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-lg text-[10px] text-text-deep space-y-2.5 max-w-[200px] w-full">
      <span className="font-bold text-text-deep uppercase block border-b border-border pb-1">Map Telemetry Legend</span>
      
      <div className="space-y-1.5">
        <span className="font-semibold text-text-muted uppercase block">Air Quality (NO₂ Column)</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-telemetry-healthy/40 border border-telemetry-healthy/60" />
          <span>Healthy (&lt; 20 ppb)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-telemetry-warning/40 border border-telemetry-warning/60" />
          <span>Moderate (20-40 ppb)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-telemetry-critical/40 border border-telemetry-critical/60" />
          <span>Elevated (&gt; 40 ppb)</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1.5 border-t border-border/50">
        <span className="font-semibold text-text-muted uppercase block">Heat Island (Landsat Surface)</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          <span>Ambient Area Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-400/40 border border-red-500/60" />
          <span>Urban Core Heat Store</span>
        </div>
      </div>
    </div>
  );
};
export default MapLegend;
