"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";

interface TrendData {
  year: number;
  co2_equivalent_tons: number;
  methane_ppb: number;
}

interface EmissionTimelineProps {
  data: TrendData[];
  className?: string;
}

export const EmissionTimeline: React.FC<EmissionTimelineProps> = ({
  data = [],
  className = ""
}) => {
  // Find max value to scale chart bars relatively
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.co2_equivalent_tons)) : 100;

  return (
    <Card title="⏱️ Historical Emission Timeline" description="Decadal Scope 1 & 2 carbon equivalent trends (2017 - 2026)." className={className}>
      <div className="space-y-6">
        
        {/* Visual Chart Canvas */}
        <div className="h-44 flex items-end justify-between gap-2.5 pt-4 border-b border-border/80 pb-1 select-none">
          {data.map((d, idx) => {
            const pct = (d.co2_equivalent_tons / maxVal) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                {/* Tooltip on hover */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-text-deep text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow -translate-y-12 pointer-events-none z-10">
                  {d.co2_equivalent_tons.toLocaleString()} t
                </div>
                
                {/* Bar */}
                <div
                  style={{ height: `${Math.max(10, pct * 0.85)}px` }}
                  className={`w-full rounded-t-lg transition-smooth ${
                    d.year === 2026 
                      ? "bg-text-deep shadow-xs" 
                      : "bg-[#66BB6A] hover:bg-[#2E7D32]"
                  }`}
                />
                
                {/* Year Label */}
                <span className="text-[9px] font-black text-text-muted font-mono">{d.year}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-[9px] font-bold text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#66BB6A]" />
            Historical emissions base
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-text-deep" />
            Current audited year (2026)
          </span>
        </div>

      </div>
    </Card>
  );
};

export default EmissionTimeline;
