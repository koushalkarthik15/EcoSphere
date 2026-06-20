"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideAlertTriangle, LucideGavel } from "lucide-react";

interface RiskCardProps {
  riskRating: string;
  riskStatus: string;
  activeLeakDetected: boolean;
  regulatoryExposure: number;
  className?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  riskRating,
  riskStatus,
  activeLeakDetected,
  regulatoryExposure,
  className = ""
}) => {
  return (
    <Card title="⚖️ Regulatory Compliance & Risk" description="Active emissions liabilities and climate exposure checklist." className={className}>
      <div className="space-y-4">
        
        {/* Risk Level Badge */}
        <div className={`p-4 border rounded-xl flex items-center justify-between gap-4 ${
          riskStatus === "critical" 
            ? "bg-red-50 border-red-200 text-red-700" 
            : riskStatus === "warning"
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-[#F1F8E9] border-[#DCEED2] text-[#2E7D32]"
        }`}>
          <div className="flex items-center gap-3">
            <LucideAlertTriangle className="h-6 w-6 animate-pulse" />
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">Regulatory Risk</span>
              <span className="text-sm font-black block mt-0.5">{riskRating.toUpperCase()} RISK</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">Tax Exposure Est</span>
            <span className="text-sm font-black block mt-0.5">
              ${regulatoryExposure.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
            </span>
          </div>
        </div>

        {/* Audit items checklist */}
        <div className="border-t border-border pt-3 space-y-2 text-xs">
          <span className="font-bold text-text-deep uppercase block mb-1 text-[10px]">Compliance Audits Checklist</span>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">Direct Pipe Leaks status:</span>
            <span className={`font-bold ${activeLeakDetected ? "text-telemetry-critical animate-pulse" : "text-telemetry-healthy"}`}>
              {activeLeakDetected ? "FAIL (Active Leak)" : "PASS (Zero Leaks)"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">Scope emissions limits check:</span>
            <span className={`font-bold ${riskStatus === "critical" ? "text-telemetry-critical" : "text-telemetry-healthy"}`}>
              {riskStatus === "critical" ? "EXCEEDED LIMIT" : "UNDER LIMIT"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">TROPOMI orbit validation:</span>
            <span className="font-bold text-telemetry-healthy">VERIFIED</span>
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
          High-risk classifications require prompt leak repairs and offset purchases to mitigate fines under the Indian National Carbon Market (ICM) compliance guidelines.
        </p>

      </div>
    </Card>
  );
};

export default RiskCard;
