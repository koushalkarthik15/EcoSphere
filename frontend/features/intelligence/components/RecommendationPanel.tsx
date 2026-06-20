"use client";

import React, { useState } from "react";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  content: string;
  action_label: string;
  impact_credits: number;
}

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  onExecuteAction?: (recommendationId: string) => Promise<void> | void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  onExecuteAction
}) => {
  const [executingId, setExecutingId] = useState<string | null>(null);

  const handleAction = async (id: string) => {
    if (!onExecuteAction) return;
    setExecutingId(id);
    try {
      await onExecuteAction(id);
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingId(null);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white border border-border p-6 rounded-2xl text-center text-xs text-text-muted">
        No active suggestions for the current telemetry region.
      </div>
    );
  }

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Personalized AI Recommendations Panel"
    >
      <div>
        <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
          💡 Centralized AI Action Panel
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Proactive recommendations tailored to optimize your local carbon impact
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="border border-border/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-smooth hover:border-text-muted/40 hover:shadow-sm"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase bg-[#DAEED2] text-text-deep px-2 py-0.5 rounded">
                  {rec.type}
                </span>
                <span className="text-xs font-black text-text-deep">{rec.title}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                {rec.content}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {rec.impact_credits > 0 && (
                <span className="text-[10px] font-bold text-text-deep bg-[#DAEED2] border border-border px-2 py-1 rounded">
                  +{rec.impact_credits.toFixed(1)} Credits
                </span>
              )}

              <button
                onClick={() => handleAction(rec.id)}
                disabled={executingId !== null}
                className="bg-text-deep hover:bg-text-muted text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition-smooth shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-text-deep focus:ring-offset-2"
                aria-label={`Execute: ${rec.title}`}
              >
                {executingId === rec.id ? "Executing..." : rec.action_label}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;
