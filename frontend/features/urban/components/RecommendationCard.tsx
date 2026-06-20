"use client";

import React from "react";
import { useToasts } from "../../../lib/providers/ToastProvider";

interface RecommendationCardProps {
  type: string;
  title: string;
  content: string;
  actionLabel: string;
  impactCredits: number;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  content,
  actionLabel,
  impactCredits,
  className = ""
}) => {
  const { addToast } = useToasts();

  const handleAction = () => {
    addToast(
      `Activity logged: "${title}". Earned +${impactCredits || 0.2} EcoCredits.`,
      "success"
    );
  };

  return (
    <div className={`flex-shrink-0 w-72 bg-white border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-smooth ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-text-deep leading-snug">{title}</span>
          {impactCredits > 0 && (
            <span className="text-[9px] font-black text-telemetry-healthy bg-telemetry-healthy/10 px-2 py-0.5 rounded-full whitespace-nowrap">
              +{impactCredits} cr
            </span>
          )}
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed">{content}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
        <button
          onClick={handleAction}
          className="text-[10px] font-bold text-text-deep hover:text-[#2E7D32] hover:underline"
        >
          {actionLabel}
        </button>
        <span className="text-[8px] text-text-muted uppercase tracking-wider font-semibold">AI Recommendation</span>
      </div>
    </div>
  );
};
export default RecommendationCard;
