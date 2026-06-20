"use client";

import React from "react";
import { RecommendationCard } from "../../urban/components/RecommendationCard";

export interface DockNotification {
  id: string;
  type: string;
  title: string;
  message: string;
}

interface LedgerDockProps {
  notifications: DockNotification[];
  className?: string;
}

export const LedgerDock: React.FC<LedgerDockProps> = ({
  notifications,
  className = ""
}) => {
  return (
    <div className={`w-full bg-[#FFFFFF] border border-border p-5 rounded-2xl shadow-md ${className}`}>
      <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-telemetry-healthy animate-ping" />
          <span className="text-[10px] font-bold text-text-deep uppercase tracking-wider">AI Agri-Ledger Dock</span>
        </div>
        <span className="text-[9px] text-text-muted font-medium">Scroll horizontally for real-time alerts & advice</span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {notifications.map((notif) => (
          <RecommendationCard
            key={notif.id}
            type={notif.type}
            title={notif.title}
            content={notif.message}
            actionLabel="Acknowledge Alert"
            impactCredits={0.2}
          />
        ))}

        {/* Dynamic Static entries matching prompt guidelines */}
        <RecommendationCard
          type="irrigation"
          title="💧 Smart Irrigation Tip"
          content="SAR radar logs 28% topsoil moisture in Field B. Watering at 6PM offsets evaporation loss."
          actionLabel="Log Watering"
          impactCredits={0.5}
        />
        <RecommendationCard
          type="fertilizer"
          title="🌾 Nitrogen Soil Health"
          content="NDVI vegetation index indicates high biomass density. Fertilizer applications are optional."
          actionLabel="Optimize Load"
          impactCredits={0.8}
        />
        <RecommendationCard
          type="credits"
          title="🔑 Verification Progress"
          content=" पंजाब Field A complies with no-burn policies. Mints 3.75 verified credits this week."
          actionLabel="Verify Ledger"
          impactCredits={3.75}
        />
      </div>
    </div>
  );
};
export default LedgerDock;
