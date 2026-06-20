"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToasts } from "./ToastProvider";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: string | null;
  mapInstance: any | null;
  setMapInstance: (map: any) => void;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any | null>(null);
  const { addToast } = useToasts();

  useEffect(() => {
    // Check if we are running in browser context
    if (typeof window === "undefined") return;

    // Simulate or load google maps script loader
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "dummy_key";
    
    if (apiKey === "dummy_key" || apiKey.includes("PLACEHOLDER")) {
      // Offline/mock loading sandbox
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      return;
    }

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        addToast("Google Maps layer initialized successfully.", "success");
      };
      
      script.onerror = () => {
        setLoadError("Failed to fetch Google Maps API scripts.");
        addToast("Failed to initialize Google Maps layers.", "error");
      };
      
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  }, [addToast]);

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        loadError,
        mapInstance,
        setMapInstance,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
