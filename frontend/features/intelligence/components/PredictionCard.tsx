"use client";

import React from "react";

interface PredictionItem {
  indicator: string;
  trend: "improving" | "stable" | "declining";
  valueChange: string;
  timeline: string;
}

interface PredictionCardProps {
  predictions: PredictionItem[];
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ predictions }) => {
  const getTrendStyles = (trend: PredictionItem["trend"]) => {
    switch (trend) {
      case "improving": 
        return {
          icon: "📈",
          color: "text-telemetry-healthy bg-telemetry-healthy/10 border-telemetry-healthy/30",
          ariaLabel: "Improving Trend"
        };
      case "stable":
        return {
          icon: "➡️",
          color: "text-blue-600 bg-blue-50 border-blue-200",
          ariaLabel: "Stable Trend"
        };
      case "declining":
        return {
          icon: "📉",
          color: "text-telemetry-critical bg-telemetry-critical/10 border-telemetry-critical/30",
          ariaLabel: "Declining Trend"
        };
    }
  };

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Environmental Trend Forecasting"
    >
      <div>
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          🔮 Future Trend Forecasts
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Predictive telemetry outputs modeling environmental indicators
        </p>
      </div>

      <div className="space-y-3">
        {predictions.map((pred, index) => {
          const styles = getTrendStyles(pred.trend);
          return (
            <div 
              key={index}
              className="border border-border p-3.5 rounded-xl flex items-center justify-between gap-4 transition-smooth hover:border-text-muted/40"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  {pred.indicator}
                </span>
                <span className="text-xs font-semibold text-text-deep block">
                  Expected change: {pred.valueChange}
                </span>
                <span className="text-[9px] text-text-muted block">
                  Target timeline: {pred.timeline}
                </span>
              </div>

              <div 
                role="status"
                aria-label={styles.ariaLabel}
                className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-bold ${styles.color}`}
              >
                {styles.icon}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionCard;
