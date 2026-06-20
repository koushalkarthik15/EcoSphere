"use client";

import React from "react";

interface AIInsightCardProps {
  summary: string;
  headline?: string;
  incentiveText?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ 
  summary,
  headline = "AI Environmental Synthesis",
  incentiveText = "Log sustainable actions to improve local scores."
}) => {
  return (
    <div 
      className="bg-[#F1F8E9] border border-[#DCEED2] p-6 rounded-2xl shadow-sm transition-smooth hover:shadow-md flex flex-col justify-between space-y-4"
      role="region"
      aria-label="AI Generated Environmental Summary"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🧠</span>
          <h3 className="font-display text-xs font-black text-text-deep uppercase tracking-wider">
            {headline}
          </h3>
        </div>
        
        <p className="text-xs text-text-deep font-medium leading-relaxed font-sans antialiased">
          {summary}
        </p>
      </div>

      <div className="border-t border-[#DCEED2] pt-3 flex items-center justify-between gap-2 flex-wrap text-[10px] text-text-muted font-bold">
        <span>{incentiveText}</span>
        <span className="underline cursor-pointer hover:text-text-deep uppercase tracking-wider transition-colors">
          View Detailed Analytics
        </span>
      </div>
    </div>
  );
};

export default AIInsightCard;
