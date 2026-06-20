"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../../../lib/providers/GoogleMapsProvider";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { LucideCompass, LucideMapPin } from "lucide-react";
import { ProjectInfo } from "./ProjectCard";

interface ProjectMapProps {
  projects: ProjectInfo[];
  selectedProjectId: string;
  onProjectSelect: (project: ProjectInfo) => void;
  height?: string;
  className?: string;
}

export const ProjectMap: React.FC<ProjectMapProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  height = "450px",
  className = ""
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMaps();
  const { currentLocation } = useTelemetry();
  const mapRef = useRef<HTMLDivElement>(null);

  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isLoaded || loadError || !mapRef.current) return;

    if (typeof window !== "undefined" && window.google?.maps) {
      try {
        const activeProj = projects.find(p => p.id === selectedProjectId);
        const mapCenter = activeProj ? { lat: activeProj.lat, lng: activeProj.lng } : currentLocation;

        const map = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 6, // regional zoom showing Punjab, Rajasthan, Uttarakhand
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#F1F8E9" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#DAEED2" }]
            }
          ]
        });

        setMapInstance(map);

        // Clean up markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // Add markers for all regional projects
        projects.forEach(proj => {
          const marker = new window.google.maps.Marker({
            position: { lat: proj.lat, lng: proj.lng },
            map: map,
            title: proj.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: proj.id === selectedProjectId ? 12 : 7,
              fillColor: proj.type === "Solar Energy" ? "#FFB300" : proj.type === "Soil Sequestration" ? "#2E7D32" : "#0288D1",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2
            }
          });

          marker.addListener("click", () => {
            onProjectSelect(proj);
          });

          markersRef.current.push(marker);
        });

      } catch (err) {
        console.warn("Failed drawing regional project markers, rendering fallback:", err);
      }
    }
  }, [isLoaded, loadError, projects, selectedProjectId]);

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
            
            {/* Draw Regional Projects Buttons */}
            {projects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              
              const getPinColor = () => {
                switch (proj.type) {
                  case "Soil Sequestration": return "bg-[#2E7D32]";
                  case "Solar Energy": return "bg-[#FFB300]";
                  default: return "bg-sky-600";
                }
              };

              return (
                <button
                  key={proj.id}
                  onClick={() => onProjectSelect(proj)}
                  className={`absolute p-4.5 rounded-2xl border transition-smooth shadow-sm cursor-pointer ${getPinColor()} text-white text-left ${
                    proj.id === "proj_punjab_tillage" 
                      ? "top-10 left-10 w-44" 
                      : proj.id === "proj_rajasthan_solar"
                      ? "bottom-14 left-1/3 w-44"
                      : "top-14 right-10 w-44"
                  } ${isSelected ? "ring-4 ring-text-deep/20 scale-105" : "opacity-80"}`}
                >
                  <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded uppercase block w-max">
                    {proj.type.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-black block mt-1.5 leading-tight">{proj.name}</span>
                  <span className="text-[9px] text-white/80 block mt-0.5">{proj.location}</span>
                </button>
              );
            })}

            {/* Center coordinates reference */}
            <div className="relative flex flex-col items-center gap-1 z-10">
              <div className="bg-[#DAEED2] p-2.5 rounded-full text-text-deep shadow border border-border">
                <LucideMapPin className="h-5 w-5 animate-bounce text-text-deep" />
              </div>
              <span className="text-[9px] font-black text-text-deep bg-white px-2 py-0.5 rounded shadow">
                Regional Offset Registry
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-white/95 backdrop-blur border border-border p-3 rounded-xl shadow-md text-[9px] text-text-deep space-y-1 max-w-[140px] w-full font-bold">
        <span className="font-black uppercase tracking-wider block border-b border-border pb-0.5">Legend</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
          <span>Agriculture</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />
          <span>Renewables</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
          <span>Afforestation</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
