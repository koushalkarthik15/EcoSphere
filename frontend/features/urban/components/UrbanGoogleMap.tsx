"use client";

import React, { useEffect, useRef } from "react";
import { useGoogleMaps } from "../../../lib/providers/GoogleMapsProvider";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { MapLayersState } from "./LayerToggle";
import { MapLegend } from "./MapLegend";
import { LayerToggle } from "./LayerToggle";
import { LucideMapPin } from "lucide-react";

interface UrbanGoogleMapProps {
  layers: MapLayersState;
  onLayerChange: (key: keyof MapLayersState, val: boolean) => void;
  height?: string;
  className?: string;
}

export const UrbanGoogleMap: React.FC<UrbanGoogleMapProps> = ({
  layers,
  onLayerChange,
  height = "500px",
  className = ""
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMaps();
  const { currentLocation } = useTelemetry();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Track active layer objects to clean them up on state changes
  const trafficLayerRef = useRef<any>(null);
  const transitLayerRef = useRef<any>(null);
  const customOverlaysRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isLoaded || loadError || !mapRef.current) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 13,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#F1F8E9" }] // Organic Canvas Background
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#E8F5E9" }]
            }
          ]
        });

        setMapInstance(map);

        // Add user marker
        new window.google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#1B5E20",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }
        });

        // 1. Google Maps Traffic Layer
        if (layers.traffic) {
          trafficLayerRef.current = new window.google.maps.TrafficLayer();
          trafficLayerRef.current.setMap(map);
        } else {
          trafficLayerRef.current?.setMap(null);
        }

        // 2. Google Maps Transit Layer
        if (layers.transit) {
          transitLayerRef.current = new window.google.maps.TransitLayer();
          transitLayerRef.current.setMap(map);
        } else {
          transitLayerRef.current?.setMap(null);
        }

        // Clean up previous custom rectangles/polylines
        customOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
        customOverlaysRef.current = [];

        // 3. Air Quality Layer (translucent Sentinel-5P grid simulation overlay)
        if (layers.airQuality) {
          const aqiRect = new window.google.maps.Rectangle({
            strokeColor: "#FFB300",
            strokeOpacity: 0.35,
            strokeWeight: 1,
            fillColor: "#FFB300",
            fillOpacity: 0.15,
            map: map,
            bounds: {
              north: currentLocation.lat + 0.012,
              south: currentLocation.lat - 0.008,
              east: currentLocation.lng + 0.015,
              west: currentLocation.lng - 0.012,
            }
          });
          customOverlaysRef.current.push(aqiRect);
        }

        // 4. Heat Island Layer (Landsat Surface Temperature simulation overlay)
        if (layers.heatIsland) {
          const heatRect = new window.google.maps.Rectangle({
            strokeColor: "#E53935",
            strokeOpacity: 0.45,
            strokeWeight: 1,
            fillColor: "#E53935",
            fillOpacity: 0.22,
            map: map,
            bounds: {
              north: currentLocation.lat + 0.005,
              south: currentLocation.lat - 0.005,
              east: currentLocation.lng + 0.005,
              west: currentLocation.lng - 0.005,
            }
          });
          customOverlaysRef.current.push(heatRect);
        }

        // 5. Green Canopies highlight
        if (layers.greenZones) {
          const parkCircle = new window.google.maps.Circle({
            strokeColor: "#66BB6A",
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: "#66BB6A",
            fillOpacity: 0.35,
            map: map,
            center: { lat: currentLocation.lat + 0.006, lng: currentLocation.lng - 0.008 },
            radius: 400
          });
          customOverlaysRef.current.push(parkCircle);
        }

        // 6. Carbon Saving Alternative Route Polyline
        if (layers.savingRoutes) {
          const greenRoute = new window.google.maps.Polyline({
            path: [
              currentLocation,
              { lat: currentLocation.lat + 0.005, lng: currentLocation.lng + 0.005 },
              { lat: currentLocation.lat + 0.010, lng: currentLocation.lng + 0.003 }
            ],
            geodesic: true,
            strokeColor: "#2E7D32",
            strokeOpacity: 0.85,
            strokeWeight: 5,
            map: map
          });
          customOverlaysRef.current.push(greenRoute);
        }

      } catch (err) {
        console.warn("Failed loading live map overlays, rendering fallback:", err);
      }
    }
  }, [isLoaded, loadError, currentLocation, layers]);

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
          {/* Custom vector mapping simulator drawing map features based on active toggle check states */}
          <div className="absolute inset-4 rounded-xl border border-dashed border-[#1B5E20]/20 bg-white/40 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Grid coordinate system representation */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.04] pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-text-deep" />
              ))}
            </div>

            {/* Base Coordinate Dot */}
            <div className="relative flex flex-col items-center gap-1 z-10">
              <div className="bg-[#DAEED2] p-3 rounded-full text-text-deep animate-pulse shadow-md border border-border">
                <LucideMapPin className="h-6 w-6 text-text-deep" />
              </div>
              <span className="text-[10px] font-black text-text-deep bg-white px-2 py-0.5 rounded shadow">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </span>
            </div>

            {/* Simulated overlays rendering dynamically based on layer toggles */}
            {layers.airQuality && (
              <div className="absolute inset-10 bg-telemetry-warning/10 border border-telemetry-warning/30 rounded-xl flex items-center justify-center">
                <span className="text-[8px] font-bold text-text-deep bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  Sentinel-5P NO2 Layer
                </span>
              </div>
            )}

            {layers.heatIsland && (
              <div className="absolute inset-20 bg-telemetry-critical/10 border border-telemetry-critical/30 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-text-deep bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  Landsat Surface Heat Center
                </span>
              </div>
            )}

            {layers.greenZones && (
              <div className="absolute top-8 left-12 w-28 h-28 bg-[#66BB6A]/20 border border-[#66BB6A]/40 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#1B5E20] bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  Cool Green Canopy
                </span>
              </div>
            )}

            {layers.savingRoutes && (
              <div className="absolute bottom-16 right-16 w-36 h-2 bg-text-deep/80 rounded-full rotate-45 flex items-center justify-center">
                <span className="absolute -top-5 text-[8px] font-bold text-white bg-text-deep px-1.5 py-0.5 rounded">
                  🚲 Active Green Route
                </span>
              </div>
            )}
            
            {layers.traffic && (
              <div className="absolute inset-0 bg-[#FFB300]/5 flex items-center justify-end p-4">
                <span className="text-[8px] font-bold text-text-deep bg-white border border-border px-1.5 py-0.5 rounded shadow-sm">
                  Simulated Traffic Congestion
                </span>
              </div>
            )}

            {layers.transit && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="text-[8px] font-bold text-text-deep bg-white border border-border px-1.5 py-0.5 rounded shadow-sm">
                  Simulated Bus/Metro Network
                </span>
              </div>
            )}
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
        <MapLegend />
      </div>

      {/* Floating Layer Toggles (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <LayerToggle layers={layers} onChange={onLayerChange} />
      </div>
    </div>
  );
};
export default UrbanGoogleMap;
