"use client";

import React from "react";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface TimelineEvent {
  provider: string;
  measurement: string;
  timestamp: string;
  units: string;
  quality_score: number;
  metadata: Record<string, any>;
}

interface TelemetryTimelineProps {
  events: TimelineEvent[];
}

export const TelemetryTimeline: React.FC<TelemetryTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-border p-6 rounded-2xl text-center text-xs text-text-muted">
        No satellite telemetry logs logged for this region.
      </div>
    );
  }

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Satellite Telemetry Verification Timeline"
    >
      <div className="mb-4">
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          🛰️ Telemetry Audit Trail
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Real-time verification feeds from Copernicus, GEE & NASA
        </p>
      </div>

      <div className="relative border-l border-border pl-4 ml-2 space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline Circle Node */}
            <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-text-deep shadow-sm transition-all duration-300 group-hover:scale-125 group-hover:bg-[#66BB6A]" />
            
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-text-deep uppercase">
                  {event.provider} - {event.measurement}
                </span>
                <ConfidenceBadge score={event.quality_score} label="Quality" />
              </div>
              
              <p className="text-[10px] text-text-muted font-medium">
                Captured: {new Date(event.timestamp).toLocaleString()}
              </p>
              
              <div className="bg-background/40 p-2.5 rounded-lg border border-border/50 text-[10px] text-text-muted">
                <span className="font-semibold text-text-deep">Measurement: </span>
                {event.metadata.estimated_biomass_tons_per_hectare 
                  ? `${event.metadata.estimated_biomass_tons_per_hectare} tons/ha`
                  : event.metadata.estimated_soil_moisture_percent
                  ? `${event.metadata.estimated_soil_moisture_percent}% Moisture`
                  : event.metadata.temperature_celsius
                  ? `${event.metadata.temperature_celsius}°C Surface`
                  : `${event.metadata.brightness_t31 || "Nominal"}`} {event.units}
                
                {event.metadata.is_stubble_burn_indicator && (
                  <span className="ml-2 font-bold text-telemetry-critical">
                    ⚠️ Stubble Burn Active
                  </span>
                )}
                {event.metadata.vegetation_health_status && (
                  <span className="ml-2 font-bold text-text-deep">
                    ({event.metadata.vegetation_health_status} Canopy)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryTimeline;
