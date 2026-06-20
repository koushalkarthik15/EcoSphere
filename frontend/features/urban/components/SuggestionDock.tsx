"use client";

import React from "react";
import { RecommendationCard } from "./RecommendationCard";

export interface DockRecommendation {
  type: string;
  title: string;
  content: string;
  action_label: string;
  impact_credits: number;
}

interface SuggestionDockProps {
  recommendations: DockRecommendation[];
  className?: string;
}

export const SuggestionDock: React.FC<SuggestionDockProps> = ({
  recommendations,
  className = ""
}) => {
  return (
    <div className={`w-full bg-[#FFFFFF] border border-border p-5 rounded-2xl shadow-md ${className}`}>
      <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-telemetry-healthy animate-ping" />
          <span className="text-[10px] font-bold text-text-deep uppercase tracking-wider">AI Suggestion Dock</span>
        </div>
        <span className="text-[9px] text-text-muted font-medium">Scroll horizontally for more contextual options</span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {recommendations.map((rec, idx) => (
          <RecommendationCard
            key={idx}
            type={rec.type}
            title={rec.title}
            content={rec.content}
            actionLabel={rec.action_label}
            impactCredits={rec.impact_credits}
          />
        ))}

        {/* Dynamic Static entries matching prompt list if not already present */}
        <RecommendationCard
          type="weather"
          title="🌤️ Weather Advisory"
          content="Calm morning winds. Ideal for active commutes. Air dispersion is favorable."
          actionLabel="View Forecast"
          impactCredits={0.1}
        />
        <RecommendationCard
          type="goal"
          title="🎯 Weekly Carbon Goal"
          content="Offset 10.0kg CO2 this week. You are currently at 65% completion progress."
          actionLabel="Review Goals"
          impactCredits={1.0}
        />
        <RecommendationCard
          type="tip"
          title="⚡ Passive Energy Saver"
          content="Switch home thermostat models to echo preset parameters while working away."
          actionLabel="Apply Setting"
          impactCredits={0.5}
        />
      </div>
    </div>
  );
};
export default SuggestionDock;
