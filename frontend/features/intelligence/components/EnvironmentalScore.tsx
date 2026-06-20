"use client";

import React from "react";

interface EnvironmentalScoreProps {
  score: number;
  label?: string;
  subtext?: string;
}

export const EnvironmentalScore: React.FC<EnvironmentalScoreProps> = ({
  score,
  label = "Regional Sustainability",
  subtext = "Weighted Environmental Index"
}) => {
  // SVG drawing variables
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // HSL gradient color representation depending on score
  const getGradientColor = () => {
    // Hue from 0 (red) to 120 (green)
    const hue = (score / 100) * 120;
    return `hsl(${hue}, 70%, 45%)`;
  };

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transition-smooth hover:shadow-md"
      role="region"
      aria-label={`${label} details. Current score is ${score} out of 100.`}
    >
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
        {label}
      </h3>
      
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-background"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={getGradientColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Text Center Overlay */}
        <div className="absolute flex flex-col items-center">
          <span 
            className="text-3xl font-black text-text-deep tracking-tight"
            aria-live="polite"
          >
            {score.toFixed(0)}
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wide">
            Score
          </span>
        </div>
      </div>
      
      <p className="text-[11px] text-text-muted mt-4 font-medium max-w-[200px]">
        {subtext}
      </p>
    </div>
  );
};

export default EnvironmentalScore;
