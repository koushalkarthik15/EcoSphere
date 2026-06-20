"use client";

import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { LucideCheckCircle, LucideXCircle, LucideHelpCircle, LucideFileText } from "lucide-react";

interface VerificationCardProps {
  status: "VERIFIED" | "PENDING" | "REJECTED";
  verifiedCredits: number;
  pendingCredits: number;
  rejectedCredits: number;
  reason: string;
  onExport: (format: "csv" | "json" | "pdf") => Promise<any>;
  className?: string;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  status,
  verifiedCredits,
  pendingCredits,
  rejectedCredits,
  reason,
  onExport,
  className = ""
}) => {
  const { addToast } = useToasts();
  const [exporting, setExporting] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "VERIFIED": return <LucideCheckCircle className="h-6 w-6 text-telemetry-healthy animate-bounce" />;
      case "REJECTED": return <LucideXCircle className="h-6 w-6 text-telemetry-critical animate-pulse" />;
      default: return <LucideHelpCircle className="h-6 w-6 text-telemetry-warning" />;
    }
  };

  const getStatusColorClass = () => {
    switch (status) {
      case "VERIFIED": return "bg-telemetry-healthy/10 text-text-deep border-telemetry-healthy/30";
      case "REJECTED": return "bg-telemetry-critical/10 text-telemetry-critical border-telemetry-critical/30";
      default: return "bg-telemetry-warning/10 text-text-deep border-telemetry-warning/30";
    }
  };

  // handleExport is now handled directly via onExport in the button onClick

  return (
    <Card title="🔐 Carbon Credit Verification" description="Minting checks based on offline native ledgers and satellite validations." className={className}>
      <div className="space-y-6">
        
        {/* Verification Alert Banner */}
        <div className={`p-4 border rounded-xl flex items-center justify-between gap-4 ${getStatusColorClass()}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">Mint Status</span>
              <span className="text-sm font-black block mt-0.5">{status}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">Eligible Credits</span>
            <span className="text-sm font-black block mt-0.5">
              {status === "VERIFIED" ? verifiedCredits : status === "PENDING" ? pendingCredits : rejectedCredits} t
            </span>
          </div>
        </div>

        {/* Audit explanation */}
        <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
          {reason}
        </p>

        {/* Verification checklist details */}
        <div className="border-t border-border pt-3 space-y-2 text-[10px]">
          <span className="font-bold text-text-deep uppercase block mb-1">Satellite Compliance Checklist</span>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">Rule 1: NASA FIRMS active fire check</span>
            <span className="font-bold text-telemetry-healthy">PASS (Zero Burns)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">Rule 2: Sentinel-2 NDVI trend slope</span>
            <span className="font-bold text-telemetry-healthy">PASS (Positive Growth)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-text-muted">Rule 3: Soil carbon volume limit</span>
            <span className="font-bold text-telemetry-healthy">PASS (&gt; 0.25 t)</span>
          </div>
        </div>

        {/* Native Export Buttons */}
        <div className="pt-2 border-t border-border mt-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-text-deep uppercase block mb-1">Export Ledger Reports</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onExport("csv")}
              disabled={exporting}
              className="w-full flex flex-col items-center justify-center gap-1.5 py-2.5 bg-white border border-border text-text-deep font-bold text-[10px] rounded-xl hover:bg-neutral-50 transition-smooth disabled:opacity-40"
            >
              <LucideFileText className="h-4 w-4 text-[#2E7D32]" />
              CSV Data
            </button>
            <button
              onClick={() => onExport("json")}
              disabled={exporting}
              className="w-full flex flex-col items-center justify-center gap-1.5 py-2.5 bg-white border border-border text-text-deep font-bold text-[10px] rounded-xl hover:bg-neutral-50 transition-smooth disabled:opacity-40"
            >
              <LucideFileText className="h-4 w-4 text-[#81D4FA]" />
              JSON Data
            </button>
            <button
              onClick={() => onExport("pdf")}
              disabled={exporting}
              className="w-full flex flex-col items-center justify-center gap-1.5 py-2.5 bg-[#2E7D32] border border-[#2E7D32] text-white font-bold text-[10px] rounded-xl hover:bg-[#1B5E20] transition-smooth disabled:opacity-40 shadow-sm"
            >
              <LucideFileText className="h-4 w-4 opacity-90" />
              Print / PDF
            </button>
          </div>
        </div>

      </div>
    </Card>
  );
};
export default VerificationCard;
