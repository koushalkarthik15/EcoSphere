"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideBell, LucideCheckCircle, LucideAlertTriangle, LucideInfo } from "lucide-react";

export interface MarketplaceNotification {
  id: string;
  type: string; // "info", "success", "warning"
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationCenterProps {
  notifications: MarketplaceNotification[];
  onClear: () => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onClear,
  className = ""
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <LucideCheckCircle className="h-4 w-4 text-telemetry-healthy" />;
      case "warning":
        return <LucideAlertTriangle className="h-4 w-4 text-telemetry-critical" />;
      default:
        return <LucideInfo className="h-4 w-4 text-sky-600" />;
    }
  };

  return (
    <Card 
      title="🔔 Marketplace Alerts & Notifications" 
      description="Real-time environmental audits logs and transactional updates feed." 
      className={className}
    >
      <div className="space-y-4">
        
        {/* Alerts list */}
        <div className="max-h-[320px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-border">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-xs text-text-muted font-semibold">
              No recent notifications logged.
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                className="flex items-start gap-2.5 p-2.5 bg-[#F1F8E9]/50 border border-border rounded-xl"
              >
                <div className="p-1.5 bg-white rounded-lg border border-border/80 shadow-xs">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-bold text-text-deep block leading-tight">{notif.title}</span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-snug font-medium">{notif.message}</p>
                  <span className="text-[8px] text-text-muted font-bold mt-1 block">{notif.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear action */}
        {notifications.length > 0 && (
          <div className="pt-2 border-t border-border flex justify-end">
            <button
              onClick={onClear}
              className="text-[9px] font-black text-telemetry-critical hover:underline uppercase cursor-pointer"
            >
              Clear Alerts History
            </button>
          </div>
        )}

      </div>
    </Card>
  );
};

export default NotificationCenter;
