"use client";

import React from "react";
import { LucideCheckCircle, LucideXCircle, LucideAlertTriangle, LucideInfo } from "lucide-react";

interface NotificationToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  onClose?: () => void;
  className?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = "info",
  title,
  onClose,
  className = ""
}) => {
  const getIcon = () => {
    switch (type) {
      case "success": return <LucideCheckCircle className="h-5 w-5 text-telemetry-healthy" />;
      case "error": return <LucideXCircle className="h-5 w-5 text-telemetry-critical" />;
      case "warning": return <LucideAlertTriangle className="h-5 w-5 text-telemetry-warning" />;
      default: return <LucideInfo className="h-5 w-5 text-telemetry-neutral" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-lg flex gap-3 relative glassmorphism ${className} ${
        type === "success" ? "border-telemetry-healthy/20" :
        type === "error" ? "border-telemetry-critical/20" :
        type === "warning" ? "border-telemetry-warning/20" :
        "border-telemetry-neutral/20"
      }`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <span className="text-xs font-bold text-text-deep">{title}</span>}
        <span className="text-[11px] text-text-muted leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-deep absolute top-2 right-2 text-sm p-1"
          aria-label="Dismiss toast"
        >
          &times;
        </button>
      )}
    </div>
  );
};
export default NotificationToast;
