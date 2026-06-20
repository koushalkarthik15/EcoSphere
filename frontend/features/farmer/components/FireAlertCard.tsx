"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideFlame } from "lucide-react";

interface FireAlertCardProps {
  status: string; // "SAFE", "DANGER"
  burnsDetected: number;
  severity: string;
  affectedAreaPct: number;
  carbonLossTons: number;
  className?: string;
}

export const FireAlertCard: React.FC<FireAlertCardProps> = ({
  status,
  burnsDetected,
  severity,
  affectedAreaPct,
  carbonLossTons,
  className = ""
}) => {
  const isDanger = status === "DANGER";

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-red-100/10 rounded-full flex items-center justify-center pointer-events-none">
        <LucideFlame className={`h-12 w-12 ${isDanger ? "text-telemetry-critical/20" : "text-text-deep/5"}`} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">NASA FIRMS Thermal Audit</span>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
          isDanger ? "bg-telemetry-critical/15 text-telemetry-critical animate-pulse" : "bg-[#DAEED2] text-text-deep"
        }`}>
          {status === "DANGER" ? "🔥 active fire" : "✓ safe"}
        </span>
      </div>

      {isDanger ? (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-semibold">Active Fires Detected</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-2xl font-black text-telemetry-critical">{burnsDetected} Points</span>
            </div>
          </div>

          <p className="text-[11px] text-telemetry-critical leading-relaxed font-semibold">
            Warning: Stubble burn detected within field coordinates. Severity rating: <span className="font-black">{severity}</span>. Affected area: {affectedAreaPct}%.
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[10px]">
            <span className="text-text-muted font-semibold">Estimated Carbon Loss:</span>
            <span className="font-bold text-telemetry-critical">-{carbonLossTons.toFixed(1)} Tons CO₂e released</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <p className="text-[11px] text-text-muted leading-relaxed">
            NASA FIRMS satellite sensors report no active thermal combustion anomalies inside your registered parcel boundaries. Topsoil carbon sinks are verified safe.
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[10px]">
            <span className="text-text-muted font-semibold">Stubble Burn Hazards:</span>
            <span className="font-bold text-telemetry-healthy">0 Anomaly warnings</span>
          </div>
        </div>
      )}
    </Card>
  );
};
export default FireAlertCard;
