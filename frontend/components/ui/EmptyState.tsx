"use client";

import React from "react";
import { LucideInfo } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Found",
  message,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-2xl bg-white ${className}`}>
      <div className="bg-[#DAEED2] p-3 rounded-full text-text-deep mb-3">
        <LucideInfo className="h-6 w-6" />
      </div>
      <h4 className="font-display text-sm font-bold text-text-deep">{title}</h4>
      <p className="text-xs text-text-muted mt-1 max-w-sm leading-relaxed">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
export default EmptyState;
