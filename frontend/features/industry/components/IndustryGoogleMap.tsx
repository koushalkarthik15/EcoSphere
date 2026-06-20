"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../../lib/providers/GoogleMapsProvider";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { LucideSliders, LucideWind, LucideCompass, LucideBuilding } from "lucide-react";

interface Coord {
  lat: number;
  lng: number;
}

interface Asset {
  name: string;
  type: string;
  polygon: Coord[];
}

interface FacilityInfo {
  id: string;
  name: string;
  boundaries: Coord[];
  assets: Asset[];
  lat: number;
  lng: number;
}

export type MapViewMode = "satellite" | "hybrid" | "roadmap";

export interface IndustryLayersState {
  methanePlumes: boolean;
  so2Plumes: boolean;
  facilityAssets: boolean;
  solarRoof: boolean;
  windVector: boolean;
  complianceZones: boolean;
  riskZones: boolean;
}

interface IndustryGoogleMapProps {
  facility: FacilityInfo;
  layers: IndustryLayersState;
  onLayerChange: (key: keyof IndustryLayersState, val: boolean) => void;
  windAngle: number;
  windSpeed: number;
  height?: string;
  className?: string;
}

export const IndustryGoogleMap: React.FC<IndustryGoogleMapProps> = ({
  facility,
  layers,
  onLayerChange,
  windAngle,
  windSpeed,
  height = "500px",
  className = ""
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMaps();
  const { currentLocation } = useTelemetry();
  const mapRef = useRef<HTMLDivElement>(null);

  const [mapMode, setMapMode] = useState<MapViewMode>("roadmap");
  const [opacity, setOpacity] = useState(65); // default 65% opacity
  const overlaysRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isLoaded || loadError || !mapRef.current) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      try {
        const centerPos = { lat: facility.lat, lng: facility.lng };

        // Convert Map Mode type
        const getGoogleMapTypeId = () => {
          switch (mapMode) {
            case "satellite": return window.google.maps.MapTypeId.SATELLITE;
            case "hybrid": return window.google.maps.MapTypeId.HYBRID;
            default: return window.google.maps.MapTypeId.ROADMAP;
          }
        };

        const map = new window.google.maps.Map(mapRef.current, {
          center: centerPos,
          zoom: 16,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeId: getGoogleMapTypeId(),
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

        // Clean up previous layers overlays
        overlaysRef.current.forEach(over => over.setMap(null));
        overlaysRef.current = [];

        const fillAlpha = opacity / 100.0;

        // 1. Draw outer compliance boundary
        if (layers.complianceZones && facility.boundaries.length > 0) {
          const borderPoly = new window.google.maps.Polygon({
            paths: facility.boundaries,
            strokeColor: "#2E7D32",
            strokeOpacity: 0.85,
            strokeWeight: 2.5,
            fillColor: "#66BB6A",
            fillOpacity: 0.08,
            map: map
          });
          overlaysRef.current.push(borderPoly);
        }

        // 2. Draw Facility Assets (factory blocks, office, warehouses)
        if (layers.facilityAssets) {
          facility.assets.forEach(asset => {
            const assetColor = asset.type === "factory" ? "#1B5E20" : asset.type === "warehouse" ? "#388E3C" : "#455A64";
            const assetPoly = new window.google.maps.Polygon({
              paths: asset.polygon,
              strokeColor: assetColor,
              strokeOpacity: 0.7,
              strokeWeight: 1.5,
              fillColor: assetColor,
              fillOpacity: 0.35,
              map: map
            });
            
            // Info popups
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="color:#111; font-family:sans-serif; font-size:10px; font-weight:bold; padding:4px;">${asset.name} (${asset.type.toUpperCase()})</div>`
            });
            assetPoly.addListener("click", (e: any) => {
              infoWindow.setPosition(e.latLng);
              infoWindow.open(map);
            });
            
            overlaysRef.current.push(assetPoly);
          });
        }

        // 3. Draw Solar Roof analysis highlights
        if (layers.solarRoof) {
          facility.assets.forEach(asset => {
            // Factories and warehouses are solar candidates
            if (asset.type === "factory" || asset.type === "warehouse") {
              const solarPoly = new window.google.maps.Polygon({
                paths: asset.polygon,
                strokeColor: "#C0CA33", // Lime solar outline
                strokeOpacity: 0.9,
                strokeWeight: 3,
                fillColor: "#C0CA33",
                fillOpacity: fillAlpha * 0.4,
                map: map
              });
              overlaysRef.current.push(solarPoly);
            }
          });
        }

        // 4. Draw Methane Plume Simulation
        if (layers.methanePlumes) {
          const methaneCircle = new window.google.maps.Circle({
            strokeColor: "#9C27B0",
            strokeOpacity: 0.4,
            strokeWeight: 1,
            fillColor: "#9C27B0",
            fillOpacity: fillAlpha * 0.7,
            map: map,
            center: centerPos,
            radius: 120
          });
          overlaysRef.current.push(methaneCircle);
        }

        // 5. Draw SO2 Plume Simulation
        if (layers.so2Plumes) {
          const so2Circle = new window.google.maps.Circle({
            strokeColor: "#FF5722",
            strokeOpacity: 0.4,
            strokeWeight: 1,
            fillColor: "#FF5722",
            fillOpacity: fillAlpha * 0.6,
            map: map,
            center: { lat: centerPos.lat + 0.0005, lng: centerPos.lng + 0.0005 },
            radius: 80
          });
          overlaysRef.current.push(so2Circle);
        }

        // 6. Draw Wind direction vector line
        if (layers.windVector) {
          const angleRad = (windAngle * Math.PI) / 180.0;
          const endLat = centerPos.lat + Math.cos(angleRad) * 0.002;
          const endLng = centerPos.lng + Math.sin(angleRad) * 0.002;
          
          const windLine = new window.google.maps.Polyline({
            path: [centerPos, { lat: endLat, lng: endLng }],
            geodesic: true,
            strokeColor: "#0288D1",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            icons: [{
              icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
              offset: "100%"
            }],
            map: map
          });
          overlaysRef.current.push(windLine);
        }

        // 7. Draw Risk thermal hot spot circles
        if (layers.riskZones) {
          const riskCircle = new window.google.maps.Circle({
            strokeColor: "#E53935",
            strokeOpacity: 0.6,
            strokeWeight: 1.5,
            fillColor: "#E53935",
            fillOpacity: fillAlpha * 0.5,
            map: map,
            center: { lat: centerPos.lat - 0.0008, lng: centerPos.lng - 0.0006 },
            radius: 150
          });
          overlaysRef.current.push(riskCircle);
        }

      } catch (err) {
        console.warn("Failed drawing Industry Google Maps layers overlays, rendering fallback:", err);
      }
    }
  }, [isLoaded, loadError, facility, layers, mapMode, opacity]);

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
          {/* Custom fallback drawing map vector shapes */}
          <div className="absolute inset-4 rounded-xl border border-dashed border-[#1B5E20]/20 bg-white/50 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Draw boundaries */}
            {layers.complianceZones && (
              <div className="absolute inset-4 border-2 border-dashed border-[#2E7D32] bg-[#DAEED2]/5 rounded-xl pointer-events-none" />
            )}

            {/* Draw Methane Plumes */}
            {layers.methanePlumes && (
              <div 
                style={{ opacity: opacity / 100.0 }} 
                className="absolute top-24 left-1/3 w-40 h-40 rounded-full bg-purple-500/25 border border-purple-500/40 flex items-center justify-center text-[8px] font-black text-purple-700 animate-pulse"
              >
                Methane Plume Leak
              </div>
            )}

            {/* Draw SO2 Plumes */}
            {layers.so2Plumes && (
              <div 
                style={{ opacity: opacity / 100.0 }} 
                className="absolute top-16 right-1/4 w-32 h-32 rounded-full bg-orange-500/20 border border-orange-500/45 flex items-center justify-center text-[8px] font-black text-orange-700"
              >
                SO₂ Plume Plume
              </div>
            )}

            {/* Draw Facility Assets */}
            {layers.facilityAssets && (
              <div className="absolute inset-x-8 inset-y-12 flex flex-wrap items-center justify-around gap-4 pointer-events-none opacity-80">
                {facility.assets.map((as, idx) => (
                  <div key={idx} className="bg-white/80 border border-border px-3 py-1.5 rounded-lg shadow flex items-center gap-1">
                    <LucideBuilding className="h-3 w-3 text-text-deep" />
                    <span className="text-[8px] font-black text-text-deep">{as.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Draw Solar Roof */}
            {layers.solarRoof && (
              <div className="absolute inset-16 border-4 border-[#C0CA33]/70 rounded-xl flex items-start p-2 pointer-events-none">
                <span className="text-[8px] font-bold text-white bg-[#C0CA33] px-1 rounded">
                  Solar Panel Capacity Suitable
                </span>
              </div>
            )}

            {/* Draw Risk Zones */}
            {layers.riskZones && (
              <div 
                style={{ opacity: opacity / 100.0 }}
                className="absolute bottom-8 left-12 w-36 h-36 rounded-full bg-red-500/15 border border-red-500/35 flex items-center justify-center text-[8px] font-black text-red-600"
              >
                Risk Zone Area
              </div>
            )}

            {/* Draw Wind direction */}
            {layers.windVector && (
              <div 
                style={{ transform: `rotate(${windAngle}deg)` }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-sky-700 pointer-events-none"
              >
                <LucideWind className="h-10 w-10 animate-bounce" />
                <span className="text-[8px] font-black">{windSpeed} m/s</span>
              </div>
            )}

            {/* Center facility indicator */}
            <div className="relative flex flex-col items-center gap-1 z-10 pointer-events-auto">
              <div className="bg-[#DAEED2] p-2.5 rounded-full text-text-deep shadow-md border border-border">
                <LucideCompass className="h-5 w-5 animate-spin-slow" />
              </div>
              <span className="text-[9px] font-black text-text-deep bg-white px-2 py-0.5 rounded shadow">
                {facility.name}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Floating Map Legends (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-white/95 backdrop-blur border border-border p-3 rounded-xl shadow-md text-[9px] text-text-deep space-y-1.5 max-w-[160px] w-full">
        <span className="font-bold uppercase tracking-wider block border-b border-border pb-0.5">Legend Indices</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-purple-500/30 border border-purple-500" />
          <span>Methane Plume</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-500/30 border border-orange-500" />
          <span>SO₂ Smoke Stack</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#C0CA33]/30 border border-[#C0CA33]" />
          <span>Solar Suitability</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-red-500/20 border border-red-500" />
          <span>High Risk Zones</span>
        </div>
      </div>

      {/* Floating Map Type Switcher (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto flex gap-1 bg-white/90 p-1 rounded-xl border border-border shadow">
        {(["roadmap", "satellite", "hybrid"] as MapViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setMapMode(mode)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold capitalize transition-smooth ${
              mapMode === mode ? "bg-text-deep text-white" : "text-text-deep hover:bg-[#F1F8E9]"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Floating Layer Toggles (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex flex-col gap-3 max-w-[200px] w-full bg-white/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-lg text-[10px] text-text-deep">
        <span className="font-bold text-text-deep uppercase block border-b border-border pb-1">
          Interactive Layers
        </span>
        
        {/* Layer checkboxes */}
        <div className="flex flex-col gap-1.5">
          {([
            { key: "methanePlumes", label: "🟣 Methane Plumes" },
            { key: "so2Plumes", label: "🟠 SO₂ Plumes" },
            { key: "facilityAssets", label: "🏢 Facility Assets" },
            { key: "solarRoof", label: "🟡 Solar Suitability" },
            { key: "windVector", label: "🔵 Wind Direction" },
            { key: "complianceZones", label: "🟢 Compliance Zones" },
            { key: "riskZones", label: "🔴 Risk Heat Zones" }
          ] as const).map((l) => (
            <label key={l.key} className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={layers[l.key]}
                onChange={(e) => onLayerChange(l.key, e.target.checked)}
                className="text-text-deep focus:ring-text-deep/20 h-3.5 w-3.5 cursor-pointer rounded"
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

export default IndustryGoogleMap;
