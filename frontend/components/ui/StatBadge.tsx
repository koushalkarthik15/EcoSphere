"use client";

import React from "react";

interface StatBadgeProps {
  label: string;
  value: string;
  type?: "success" | "warning" | "error" | "info" | "neutral";
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  value,
  type = "neutral",
  className = ""
}) => {
  const getTypeColors = () => {
    switch (type) {
      case "success": return "bg-telemetry-healthy/10 text-text-deep border-telemetry-healthy/30";
      case "warning": return "bg-telemetry-warning/10 text-text-deep border-telemetry-warning/30";
      case "error": return "bg-telemetry-critical/10 text-telemetry-critical border-telemetry-critical/30";
      case "info": return "bg-[#DAEED2]/50 text-text-deep border-border";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded text-[10px] font-bold ${getTypeColors()} ${className}`}>
      <span className="opacity-70 font-semibold">{label}:</span>
      <span className="font-black uppercase tracking-wider">{value}</span>
    </div>
  );
};
export default StatBadge;
