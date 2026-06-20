"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const UrbanGoogleMap = dynamic(() => import("../../../features/urban/components/UrbanGoogleMap"), { 
  ssr: false, 
  loading: () => <div className="w-full h-[550px] flex items-center justify-center bg-[#F6FAF4] text-text-muted text-xs font-bold uppercase tracking-wider animate-pulse rounded-xl border border-border">Loading Live Map Engine...</div> 
});
import { MapLayersState } from "../../../features/urban/components/LayerToggle";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { HeroSection } from "../../../components/ui/HeroSection";
import { Card } from "../../../components/ui/Card";
import { 
  LucideSearch, 
  LucidePlay, 
  LucidePause, 
  LucideLayers, 
  LucideCompass, 
  LucideActivity,
  LucideCloudSun,
  LucideWind
} from "lucide-react";

export default function MapPage() {
  const { currentLocation } = useTelemetry();
  const { addToast } = useToasts();
  
  const [layers, setLayers] = useState<MapLayersState>({
    heatIsland: false,
    airQuality: true,
    traffic: false,
    transit: false,
    greenZones: true,
    savingRoutes: false,
  });

  const [mapSearch, setMapSearch] = useState("");
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(4);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  const timelineSteps = [
    "06:00 AM",
    "09:00 AM",
    "12:00 PM",
    "03:00 PM",
    "06:00 PM",
    "09:00 PM",
    "Midnight"
  ];

  const handleLayerToggle = (key: keyof MapLayersState, val: boolean) => {
    setLayers((prev) => ({ ...prev, [key]: val }));
    addToast(
      `Layer switched: ${key.replace(/([A-Z])/g, " $1")} is now ${val ? "ON" : "OFF"}.`,
      "info"
    );
  };

  const handleTimelinePlay = () => {
    setIsPlayingTimeline(!isPlayingTimeline);
    addToast(
      isPlayingTimeline ? "Telemetry playback paused." : "Playing historical telemetry timeline...",
      isPlayingTimeline ? "info" : "success"
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;
    addToast(`Locating coordinate index for: "${mapSearch}"`, "success", "Search Grids");
  };

  return (
    <div className="space-y-6">
      <HeroSection
        title="Live Planetary Telemetry Mapping"
        description="Interact with real-time ecological indices. Overlays coordinate Sentinel-5P air quality data, Landsat surface thermal signatures, transit corridors, and green canopy offsets."
        primaryActionLabel="Request High-Res Refresh"
        secondaryActionLabel="Export Geospatial GeoJSON"
        onPrimaryClick={() => addToast("Re-indexing NASA FIRMS hotspot anomalies.", "success")}
        onSecondaryClick={() => addToast("GeoJSON exported to local downloads folder.", "info")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map Viewport (65-70% content area equivalent - Span 2 out of 3 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-2xl border border-border shadow-md overflow-hidden bg-white">
            
            {/* Search Overlay inside map */}
            <div className="absolute top-4 left-4 z-20 w-72 pointer-events-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LucideSearch className="h-4 w-4 text-text-muted" />
                </span>
                <input
                  type="text"
                  placeholder="Go to coordinates or project..."
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  className="w-full bg-white/95 border border-border pl-9 pr-3 py-2 rounded-full text-xs font-semibold text-text-deep shadow-lg focus:outline-none focus:ring-2 focus:ring-text-deep/20"
                />
              </form>
            </div>

            {/* Main Google Maps simulation container */}
            <UrbanGoogleMap
              layers={layers}
              onLayerChange={handleLayerToggle}
              height="550px"
            />
          </div>

          {/* Map Timeline Controller */}
          <div className="bg-white border border-border p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTimelinePlay}
                  className="bg-text-deep hover:bg-text-deep/90 text-white p-2 rounded-full transition-smooth cursor-pointer"
                  aria-label={isPlayingTimeline ? "Pause timeline playback" : "Play timeline playback"}
                >
                  {isPlayingTimeline ? <LucidePause className="h-4 w-4" /> : <LucidePlay className="h-4 w-4" />}
                </button>
                <div>
                  <h4 className="text-xs font-black text-text-deep uppercase">Temporal Telemetry Timeline</h4>
                  <p className="text-[9px] text-text-muted">Simulate telemetry fluctuations across standard active slots</p>
                </div>
              </div>
              <span className="text-xs font-bold text-text-deep bg-[#DAEED2] px-2.5 py-1 rounded-full">
                Selected: {timelineSteps[selectedTimelineIndex]}
              </span>
            </div>

            {/* Timeline Sliders */}
            <div className="relative pt-2">
              <div className="flex justify-between text-[9px] text-text-muted font-bold uppercase mb-2 px-1">
                {timelineSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTimelineIndex(idx)}
                    className={`transition-smooth cursor-pointer ${
                      selectedTimelineIndex === idx ? "text-text-deep font-black" : "hover:text-text-deep"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max={timelineSteps.length - 1}
                value={selectedTimelineIndex}
                onChange={(e) => setSelectedTimelineIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls Panel (30-35% area equivalent) */}
        <div className="space-y-6">
          


          {/* Quick Layer Information */}
          <Card title="🗺️ Available Geospatial Datasets" description="Configure map display variables to reveal environmental anomalies.">
            <div className="space-y-3.5 pt-2 text-xs">
              <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border/80 flex items-start gap-3">
                <div className="bg-[#2E7D32] text-white p-1.5 rounded-lg">
                  <LucideLayers className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-text-deep">Landsat Surface Temperature</h5>
                  <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                    Analyzes thermal signatures to identify severe local urban heat island zones.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border/80 flex items-start gap-3">
                <div className="bg-[#81D4FA] text-[#1B5E20] p-1.5 rounded-lg">
                  <LucideLayers className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-text-deep">Sentinel-5P Tropospheric NO₂</h5>
                  <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                    Displays gas density anomalies using high-resolution solar radiation backscatter.
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
