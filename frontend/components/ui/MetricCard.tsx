"use client";

import React from "react";
import { LucideTrendingUp, LucideTrendingDown, LucideMinus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  status?: "healthy" | "neutral" | "warning" | "critical";
  className?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  sparklineData?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  status = "neutral",
  className = "",
  trend,
  trendDirection,
  icon,
  sparklineData
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "healthy": return "text-[#2E7D32] bg-[#2E7D32]/10 border-[#2E7D32]/30";
      case "warning": return "text-telemetry-warning bg-telemetry-warning/10 border-telemetry-warning/30";
      case "critical": return "text-telemetry-critical bg-telemetry-critical/10 border-telemetry-critical/30";
      default: return "text-blue-700 bg-blue-50 border-blue-200";
    }
  };

  const drawSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 60;
    const height = 24;
    const padding = 2;
    const minVal = Math.min(...sparklineData);
    const maxVal = Math.max(...sparklineData);
    const range = maxVal - minVal || 1;

    const points = sparklineData.map((val, index) => {
      const x = padding + (index / (sparklineData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - minVal) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return (
      <svg width={width} height={height} className="select-none overflow-visible" aria-hidden="true">
        <polyline
          fill="none"
          stroke={status === "healthy" ? "#2E7D32" : status === "critical" ? "#E53935" : "#66BB6A"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div 
      className={`bg-white border border-border p-5 rounded-2xl shadow-sm transition-smooth hover:shadow-md hover:border-text-muted/30 flex flex-col justify-between space-y-4 ${className}`}
      role="region"
      aria-label={`${title} is ${value}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted block">
            {title}
          </span>
          <span className="font-display text-2.5xl font-black text-text-deep tracking-tight block leading-none">
            {value}
          </span>
        </div>
        {icon && (
          <span className="text-xl text-text-deep/80" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
            trendDirection === "up" 
              ? "bg-[#2E7D32]/10 text-[#2E7D32]" 
              : trendDirection === "down" 
              ? "bg-[#E53935]/10 text-[#E53935]" 
              : "bg-gray-100 text-gray-700"
          }`}>
            {trendDirection === "up" && <LucideTrendingUp className="h-3 w-3" />}
            {trendDirection === "down" && <LucideTrendingDown className="h-3 w-3" />}
            {trendDirection === "flat" && <LucideMinus className="h-3 w-3" />}
            <span>{trend}</span>
          </div>
        )}

        {/* Mini Sparkline */}
        {sparklineData && drawSparkline()}

        {/* Status Badge */}
        <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase ${getStatusColor()}`}>
          {status}
        </span>
      </div>

      {description && (
        <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
          {description}
        </p>
      )}
    </div>
  );
};
export default MetricCard;
