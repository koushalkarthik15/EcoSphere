"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  label,
  description,
  icon,
  className = ""
}) => {
  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <h3 className="font-display text-3xl font-black text-text-deep tracking-tight">{value}</h3>
            {label && <span className="text-xs text-text-muted">{label}</span>}
          </div>
        </div>
        {icon && <div className="text-text-muted bg-[#DAEED2]/50 p-2 rounded-full border border-border/30">{icon}</div>}
      </div>
      {description && <p className="text-[11px] text-text-muted mt-3 leading-relaxed">{description}</p>}
    </Card>
  );
};
export default StatCard;
