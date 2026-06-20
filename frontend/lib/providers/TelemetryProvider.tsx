"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapBounds {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
}

interface TelemetryContextType {
  currentLocation: LatLng;
  mapBounds: MapBounds | null;
  isLoadingLocation: boolean;
  updateLocation: (coords: LatLng) => void;
  updateMapBounds: (bounds: MapBounds) => void;
  triggerGeoBrowserLookup: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

// Default coordinates: Amritsar, Punjab baseline scale
const DEFAULT_COORDS: LatLng = { lat: 31.6340, lng: 74.8723 };

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng>(DEFAULT_COORDS);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>({
    min_lat: 31.6240, max_lat: 31.6440,
    min_lng: 74.8623, max_lng: 74.8823
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const updateLocation = (coords: LatLng) => {
    setCurrentLocation(coords);
    // Automatically estimate bounds around center
    setMapBounds({
      min_lat: coords.lat - 0.01,
      max_lat: coords.lat + 0.01,
      min_lng: coords.lng - 0.01,
      max_lng: coords.lng + 0.01
    });
  };

  const updateMapBounds = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  const triggerGeoBrowserLookup = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoadingLocation(false);
      },
      (err) => {
        console.warn("Geolocation lookup denied, using baseline coordinate templates:", err.message);
        setIsLoadingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    triggerGeoBrowserLookup();
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        currentLocation,
        mapBounds,
        isLoadingLocation,
        updateLocation,
        updateMapBounds,
        triggerGeoBrowserLookup,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
};
