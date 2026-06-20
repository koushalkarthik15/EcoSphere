"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../../lib/providers/GoogleMapsProvider";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { SatelliteLegend } from "./SatelliteLegend";
import { LucideMapPin, LucideSliders } from "lucide-react";

interface Coord {
  lat: number;
  lng: number;
}

interface LandParcel {
  id: string;
  name: string;
  polygon: Coord[];
}

export type SatelliteLayer = "ndvi" | "moisture" | "fires" | "biomass" | "sink" | "historical";

interface FarmerGoogleMapProps {
  parcels: LandParcel[];
  selectedId: string;
  onSelectField: (id: string) => void;
  activeLayer: SatelliteLayer;
  onLayerChange: (layer: SatelliteLayer) => void;
  height?: string;
  className?: string;
}

export const FarmerGoogleMap: React.FC<FarmerGoogleMapProps> = ({
  parcels,
  selectedId,
  onSelectField,
  activeLayer,
  onLayerChange,
  height = "500px",
  className = ""
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMaps();
  const { currentLocation } = useTelemetry();
  const mapRef = useRef<HTMLDivElement>(null);

  const [opacity, setOpacity] = useState(60); // Default 60% opacity
  const polygonsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isLoaded || loadError || !mapRef.current) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      try {
        const activeParcel = parcels.find(p => p.id === selectedId);
        const mapCenter = activeParcel && activeParcel.polygon.length > 0
          ? activeParcel.polygon[0]
          : currentLocation;

        const map = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 14,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#F1F8E9" }] // Organic Base
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            }
          ]
        });

        setMapInstance(map);

        // Clean up previous polygons
        polygonsRef.current.forEach(poly => poly.setMap(null));
        polygonsRef.current = [];

        // Determine Layer Styling factors based on Opacity
        const fillAlpha = opacity / 100.0;
        
        const getLayerColor = () => {
          switch (activeLayer) {
            case "ndvi": return "#4CAF50";      // Green
            case "moisture": return "#2196F3";  // Blue
            case "fires": return "#F44336";     // Red
            case "biomass": return "#8BC34A";   // Light Green
            case "sink": return "#009688";      // Teal
            default: return "#FFEB3B";          // Yellow
          }
        };

        // Render each registered farm field polygon
        parcels.forEach((parcel) => {
          const isSelected = parcel.id === selectedId;
          
          const fieldPolygon = new window.google.maps.Polygon({
            paths: parcel.polygon,
            strokeColor: isSelected ? "#1B5E20" : "#DCEED2",
            strokeOpacity: 0.8,
            strokeWeight: isSelected ? 3 : 1.5,
            fillColor: getLayerColor(),
            fillOpacity: isSelected ? fillAlpha : 0.15,
            map: map
          });

          // Interactive polygon click selector
          fieldPolygon.addListener("click", () => {
            onSelectField(parcel.id);
          });

          polygonsRef.current.push(fieldPolygon);
        });

      } catch (err) {
        console.warn("Failed drawing Google Maps polygons overlays, rendering fallback:", err);
      }
    }
  }, [isLoaded, loadError, parcels, selectedId, activeLayer, opacity]);

  if (loadError) {
    return (
      <div
        className={`bg-red-50 border border-red-200 text-telemetry-critical p-6 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-xs font-semibold">Error rendering Google Maps layers: {loadError}</p>
      </div>
    );
  }

  const isMockMode = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === "dummy_key";

  return (
    <div
      ref={mapRef}
      className={`relative w-full rounded-2xl bg-[#E8F5E9] border border-border overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
      style={{ height }}
    >
      {isMockMode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F1F8E9] to-[#C8E6C9]/40 p-6 text-center gap-2">
          
          {/* Vector overlay layout simulator */}
          <div className="absolute inset-4 rounded-xl border border-dashed border-[#1B5E20]/20 bg-white/40 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Draw Simulated Fields Polygons */}
            {parcels.map((parcel) => {
              const isSelected = parcel.id === selectedId;
              
              const getSimulatedColor = () => {
                switch (activeLayer) {
                  case "ndvi": return "bg-[#66BB6A]";
                  case "moisture": return "bg-blue-400";
                  case "fires": return "bg-red-500 animate-pulse";
                  case "biomass": return "bg-lime-500";
                  case "sink": return "bg-teal-500";
                  default: return "bg-yellow-400";
                }
              };

              return (
                <button
                  key={parcel.id}
                  onClick={() => onSelectField(parcel.id)}
                  style={{ opacity: isSelected ? opacity / 100.0 : 0.2 }}
                  className={`absolute p-6 rounded-2xl border transition-smooth shadow-sm cursor-pointer ${getSimulatedColor()} ${
                    parcel.id === "field_a" 
                      ? "top-12 left-16 w-44 h-36 border-text-deep" 
                      : "bottom-12 right-20 w-36 h-28 border-border"
                  } ${isSelected ? "ring-4 ring-text-deep/20 scale-105" : ""}`}
                >
                  <span className="text-[9px] font-black text-text-deep bg-white px-2 py-0.5 rounded shadow">
                    {parcel.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}

            {/* Simulated overlays labels */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[8px] font-bold text-text-deep bg-white border border-border px-1.5 py-0.5 rounded shadow-sm">
                Active Layer: {activeLayer.toUpperCase()} ({opacity}% opacity)
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Satellite Status Overlay (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur shadow-md rounded-xl p-2.5 border border-border flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isMockMode ? 'bg-amber-500' : 'bg-green-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-text-deep">
            {isMockMode ? 'DEMO' : 'LIVE'}
          </span>
        </div>
        {!isMockMode && !loadError && (
          <div className="bg-white/95 backdrop-blur shadow-md rounded-xl px-4 py-1.5 border border-border flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">NASA FIRMS:</span>
            <span className="text-[10px] font-black text-telemetry-healthy">No active fire hotspots detected.</span>
          </div>
        )}
      </div>

      {/* Floating Map Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
        <SatelliteLegend />
      </div>

      {/* Floating Layer Toggles (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex flex-col gap-3 max-w-[200px] w-full bg-white/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-lg text-[10px] text-text-deep">
        <span className="font-bold text-text-deep uppercase block border-b border-border pb-1">
          Satellite Layer Controls
        </span>
        
        {/* Layer choices */}
        <div className="flex flex-col gap-1.5">
          {([
            { key: "ndvi", label: "🌱 NDVI Health" },
            { key: "moisture", label: "💧 Soil Moisture" },
            { key: "fires", label: "🔥 Active Burns" },
            { key: "biomass", label: "🌾 Crop Biomass" },
            { key: "sink", label: "🌀 Carbon Sink" },
            { key: "historical", label: "📅 Hist Vegetation" }
          ] as const).map((l) => (
            <label key={l.key} className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="radio"
                name="satellite-layer"
                checked={activeLayer === l.key}
                onChange={() => onLayerChange(l.key)}
                className="text-text-deep focus:ring-text-deep/20 h-3.5 w-3.5 cursor-pointer"
              />
              <span>{l.label}</span>
            </label>
          ))}
        </div>

        {/* Opacity slider */}
        <div className="border-t border-border/50 pt-2.5 space-y-1.5">
          <div className="flex justify-between font-bold text-[8px] text-text-muted">
            <span className="flex items-center gap-1">
              <LucideSliders className="h-3 w-3" />
              Layer Opacity
            </span>
            <span>{opacity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full accent-text-deep cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
export default FarmerGoogleMap;
