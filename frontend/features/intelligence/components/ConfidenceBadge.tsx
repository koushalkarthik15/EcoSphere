"use client";

import React from "react";

interface ConfidenceBadgeProps {
  score: number;
  label?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, label = "Confidence" }) => {
  const getBadgeStyles = () => {
    if (score >= 90) {
      return {
        bg: "bg-telemetry-healthy/10",
        text: "text-text-deep",
        border: "border-telemetry-healthy/30",
        ariaLabel: `${label} is High: ${score}%`
      };
    } else if (score >= 75) {
      return {
        bg: "bg-telemetry-neutral/10",
        text: "text-blue-800",
        border: "border-telemetry-neutral/30",
        ariaLabel: `${label} is Moderate: ${score}%`
      };
    } else if (score >= 50) {
      return {
        bg: "bg-telemetry-warning/10",
        text: "text-amber-800",
        border: "border-telemetry-warning/30",
        ariaLabel: `${label} is Low: ${score}%`
      };
    } else {
      return {
        bg: "bg-telemetry-critical/10",
        text: "text-telemetry-critical",
        border: "border-telemetry-critical/30",
        ariaLabel: `${label} is Critical: ${score}%`
      };
    }
  };

  const styles = getBadgeStyles();

  return (
    <div
      role="status"
      aria-label={styles.ariaLabel}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[11px] font-bold transition-smooth hover:scale-105 select-none ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span className="opacity-80 font-medium">{label}:</span>
      <span>{score.toFixed(0)}%</span>
    </div>
  );
};

export default ConfidenceBadge;
