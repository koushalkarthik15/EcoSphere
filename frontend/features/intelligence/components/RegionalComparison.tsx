"use client";

import React from "react";

interface RegionalItem {
  region: string;
  score: number;
  creditsMinted: number;
  status: string;
}

interface RegionalComparisonProps {
  items: RegionalItem[];
}

export const RegionalComparison: React.FC<RegionalComparisonProps> = ({ items }) => {
  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Regional Environmental Comparison"
    >
      <div>
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          🌐 Regional ESG Rankings
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Comparative baseline analysis across active administrative sectors
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-text-deep">{item.region}</span>
              <span className="text-text-muted">{item.score.toFixed(1)}/100</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Progressive comparative bar */}
              <div className="flex-1 bg-background h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-text-deep h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              
              <span className="text-[9px] font-black uppercase text-text-deep w-14 text-right">
                {item.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-[9px] text-text-muted font-bold">
              <span>Verified Credits: {item.creditsMinted.toFixed(1)} tons</span>
              <span>Regional Hub</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalComparison;
