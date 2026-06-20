"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { ProgressRing } from "../../../components/ui/ProgressRing";
import { LucideAward } from "lucide-react";

interface ComplianceGaugeProps {
  score: number;
  rating: string;
  className?: string;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({
  score,
  rating,
  className = ""
}) => {
  const getRatingColor = () => {
    if (score >= 85) return "text-[#2E7D32]"; // Success Green
    if (score >= 60) return "text-[#FFB300]"; // Warning Amber
    return "text-[#E53935]"; // Critical Red
  };

  const getRatingStatus = () => {
    if (score >= 85) return "High ESG Grade (Pass)";
    if (score >= 60) return "Medium compliance list (Awaiting Triage)";
    return "Compliance Hazard (Critical Limit Exceeded)";
  };

  return (
    <Card className={`relative flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">ESG Facility Auditing</span>
          <h3 className="font-display text-md font-bold text-text-deep mt-0.5">Overall ESG Score</h3>
        </div>
        <div className={`p-2 rounded-full border border-border bg-[#DAEED2]/30 ${getRatingColor()}`}>
          <LucideAward className="h-5 w-5" />
        </div>
      </div>

      <div className="my-3.5 flex items-center justify-center">
        <ProgressRing progress={score} radius={50} strokeWidth={7} color={getRatingColor()} />
      </div>

      <div className="text-center">
        <span className={`text-xs font-black uppercase block ${getRatingColor()}`}>
          Grade: {rating} • {getRatingStatus()}
        </span>
        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
          Aggregates Sentinel column density analysis, Climate TRACE history, and active stubble leakage checks.
        </p>
      </div>
    </Card>
  );
};

export default ComplianceGauge;
