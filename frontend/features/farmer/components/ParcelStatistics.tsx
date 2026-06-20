"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";

interface Coord {
  lat: number;
  lng: number;
}

interface ParcelStatisticsProps {
  polygon: Coord[];
  className?: string;
}

export const ParcelStatistics: React.FC<ParcelStatisticsProps> = ({
  polygon,
  className = ""
}) => {
  // Estimate bounds
  const lats = polygon.map(p => p.lat);
  const lngs = polygon.map(p => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return (
    <Card title="📐 Field Geometry & Bounds" description="Spatial coordinates boundaries logged in the registry ledger." className={className}>
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#F1F8E9] rounded-xl border border-border">
            <span className="text-[9px] text-text-muted block font-semibold uppercase">Latitude Bounds</span>
            <span className="font-mono text-[10px] text-text-deep font-bold mt-1 block">
              {minLat.toFixed(4)} to {maxLat.toFixed(4)}
            </span>
          </div>
          <div className="p-3 bg-[#F1F8E9] rounded-xl border border-border">
            <span className="text-[9px] text-text-muted block font-semibold uppercase">Longitude Bounds</span>
            <span className="font-mono text-[10px] text-text-deep font-bold mt-1 block">
              {minLng.toFixed(4)} to {maxLng.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <span className="text-[10px] font-bold text-text-deep uppercase block mb-2">Boundary Vertices ({polygon.length})</span>
          <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-border pr-2">
            {polygon.map((p, idx) => (
              <div key={idx} className="flex justify-between text-[10px] py-1 border-b border-border/50">
                <span className="text-text-muted">Node {idx + 1}:</span>
                <span className="font-mono font-bold text-text-deep">{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ParcelStatistics;
