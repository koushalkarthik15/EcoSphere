"use client";

import React from "react";

interface StatusChipProps {
  label: string;
  status?: "healthy" | "neutral" | "warning" | "critical";
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  status = "neutral",
  className = ""
}) => {
  const getDotColors = () => {
    switch (status) {
      case "healthy": return "bg-telemetry-healthy shadow-[0_0_8px_#66BB6A]";
      case "warning": return "bg-telemetry-warning shadow-[0_0_8px_#FFB300]";
      case "critical": return "bg-telemetry-critical shadow-[0_0_8px_#E53935]";
      default: return "bg-telemetry-neutral shadow-[0_0_8px_#81D4FA]";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white border border-border text-text-deep shadow-sm uppercase tracking-wider ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColors()}`} />
      {label}
    </span>
  );
};
export default StatusChip;
