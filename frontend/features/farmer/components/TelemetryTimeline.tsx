"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideCalendar } from "lucide-react";

export interface TimelineEvent {
  date: string;
  type: string;
  ndvi: number;
  moisture: number;
  status: string;
}

interface TelemetryTimelineProps {
  events?: TimelineEvent[];
  className?: string;
}

export const TelemetryTimeline: React.FC<TelemetryTimelineProps> = ({
  events: initialEvents,
  className = ""
}) => {
  const events = initialEvents || [
    { date: "June 18, 2026", type: "Sentinel-2 Orbit Check", ndvi: 0.72, moisture: 45.2, status: "Healthy" },
    { date: "June 10, 2026", type: "Sentinel-1 Radar Sweep", ndvi: 0.70, moisture: 46.8, status: "Healthy" },
    { date: "June 02, 2026", type: "NASA Active Fire Scan", ndvi: 0.68, moisture: 48.0, status: "Healthy" }
  ];

  return (
    <Card title="⏱️ Telemetry Check History" description="Recent satellite orbital verification scans." className={className}>
      <div className="space-y-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((ev, evIdx) => (
              <li key={evIdx}>
                <div className="relative pb-8">
                  {evIdx !== events.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}
                  
                  <div className="relative flex space-x-3 items-start">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-[#DAEED2] flex items-center justify-center text-text-deep ring-8 ring-white">
                        <LucideCalendar className="h-4 w-4" />
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-xs font-bold text-text-deep">{ev.type}</p>
                        <p className="text-[10px] text-text-muted mt-1 leading-normal">
                          Mean NDVI: {ev.ndvi.toFixed(2)} • Moisture: {ev.moisture.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-text-muted">
                        <span className="font-bold text-text-deep block">{ev.status}</span>
                        <time className="block mt-1 font-semibold">{ev.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
export default TelemetryTimeline;
