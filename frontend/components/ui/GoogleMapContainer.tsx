"use client";

import React, { useEffect, useRef } from "react";
import { useGoogleMaps } from "../../lib/providers/GoogleMapsProvider";
import { useTelemetry } from "../../lib/providers/TelemetryProvider";
import { LucideMapPin } from "lucide-react";

interface GoogleMapContainerProps {
  height?: string;
  className?: string;
}

export const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({
  height = "350px",
  className = ""
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMaps();
  const { currentLocation } = useTelemetry();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || loadError || !mapRef.current) return;

    // Check if the actual google maps object exists (if dummy_key, we mock the UI elements)
    if (typeof window !== "undefined" && (window as any).google?.maps) {
      try {
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 12,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }]
            },
            {
              featureType: "landscape.natural",
              elementType: "geometry",
              stylers: [{ color: "#F1F8E9" }] // Match organic green
            }
          ]
        });

        // Set instance globally
        setMapInstance(map);

        // Add user marker
        new (window as any).google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Current Telemetry Location"
        });

        // Note: Real NASA FIRMS markers would be added here.
        // Currently no active fire hotspots detected in demo coordinates.

      } catch (err) {
        console.warn("Failed loading live map, rendering fallback UI:", err);
      }
    }
  }, [isLoaded, loadError, currentLocation, setMapInstance]);

  // Fallback UI or loading UI
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
      className={`relative w-full rounded-xl bg-[#E8F5E9] border border-border overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
      style={{ height }}
    >
      {/* Satellite Status Overlay (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-white/95 backdrop-blur shadow-md rounded-xl p-2.5 border border-border flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isMockMode ? 'bg-amber-500' : 'bg-green-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-text-deep">
            {isMockMode ? 'DEMO' : 'LIVE'}
          </span>
        </div>
      </div>

      {isMockMode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]/40 text-center gap-2">
          <div className="bg-[#DAEED2] p-3 rounded-full text-text-deep animate-pulse shadow">
            <LucideMapPin className="h-6 w-6 text-text-deep" />
          </div>
          <span className="text-xs font-bold text-text-deep">Google Maps Offline Simulator</span>
          <p className="text-[10px] text-text-muted max-w-sm">
            Displaying mock telemetry markers at target coordinate indices:
            <br />
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-border/50 inline-block mt-1 font-bold">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </span>
          </p>
          <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-full text-[10px] font-bold shadow-sm">
            <span className="animate-pulse">🔥</span> NASA FIRMS Active Fire Data Overlay: Enabled (No active fire hotspots detected)
          </div>
        </div>
      )}

      {/* When live maps are loaded but no hotspots exist, show status */}
      {!isMockMode && !loadError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur shadow-md rounded-full px-4 py-1.5 border border-border flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">NASA FIRMS:</span>
            <span className="text-[10px] font-black text-telemetry-healthy">No active fire hotspots detected.</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default GoogleMapContainer;
