"use client";

import React from "react";

interface MetricItem {
  label: string;
  value: number;
  status: "healthy" | "neutral" | "warning" | "critical";
  description: string;
  icon: string;
}

interface AnalyticsCardProps {
  metrics: MetricItem[];
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ metrics }) => {
  const getStatusColor = (status: MetricItem["status"]) => {
    switch (status) {
      case "healthy": return "text-telemetry-healthy bg-telemetry-healthy/10 border-telemetry-healthy/30";
      case "neutral": return "text-blue-600 bg-blue-50 border-blue-200";
      case "warning": return "text-telemetry-warning bg-telemetry-warning/10 border-telemetry-warning/30";
      case "critical": return "text-telemetry-critical bg-telemetry-critical/10 border-telemetry-critical/30";
    }
  };

  const getProgressColor = (status: MetricItem["status"]) => {
    switch (status) {
      case "healthy": return "bg-telemetry-healthy";
      case "neutral": return "bg-blue-400";
      case "warning": return "bg-telemetry-warning";
      case "critical": return "bg-telemetry-critical";
    }
  };

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Environmental Metrics Indices"
    >
      <div>
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          📊 Environmental Indexes
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Dynamic environmental health ratings calculated from current telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="border border-border p-4 rounded-xl flex flex-col justify-between space-y-3 transition-smooth hover:border-text-muted/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl" aria-hidden="true">{metric.icon}</span>
              <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                {metric.label}
              </span>
              <span className="text-2xl font-black text-text-deep mt-0.5 block">
                {metric.value.toFixed(0)}/100
              </span>
            </div>

            {/* Indicator bar */}
            <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(metric.status)}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>

            <p className="text-[10px] text-text-muted leading-relaxed font-medium">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsCard;
