"use client";

import React from "react";
import { LucideLayers } from "lucide-react";

export interface MapLayersState {
  heatIsland: boolean;
  airQuality: boolean;
  traffic: boolean;
  transit: boolean;
  greenZones: boolean;
  savingRoutes: boolean;
}

interface LayerToggleProps {
  layers: MapLayersState;
  onChange: (key: keyof MapLayersState, val: boolean) => void;
  className?: string;
}

export const LayerToggle: React.FC<LayerToggleProps> = ({
  layers,
  onChange,
  className = ""
}) => {
  const options: { key: keyof MapLayersState; label: string }[] = [
    { key: "heatIsland", label: "🔥 Heat Island View" },
    { key: "airQuality", label: "🌬️ Air Quality View" },
    { key: "traffic", label: "🚗 Traffic Flow" },
    { key: "transit", label: "🚇 Transit Network" },
    { key: "greenZones", label: "🌳 Green Canopies" },
    { key: "savingRoutes", label: "🚲 Carbon Saving Routes" },
  ];

  return (
    <div className={`bg-white/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-lg text-[10px] text-text-deep space-y-2.5 max-w-[200px] w-full ${className}`}>
      <span className="font-bold text-text-deep uppercase flex items-center gap-1.5 border-b border-border pb-1">
        <LucideLayers className="h-3.5 w-3.5" />
        Map Overlay Layers
      </span>
      
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label
            key={opt.key}
            className="flex items-center gap-2 cursor-pointer select-none hover:text-text-deep font-semibold"
          >
            <input
              type="checkbox"
              checked={layers[opt.key]}
              onChange={(e) => onChange(opt.key, e.target.checked)}
              className="rounded border-border text-text-deep focus:ring-text-deep/20 h-3.5 w-3.5 cursor-pointer"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default LayerToggle;
