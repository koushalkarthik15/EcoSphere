"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideSprout } from "lucide-react";

interface FieldCardProps {
  name: string;
  cropType: string;
  practice: string;
  acreage: number;
  daysActive: number;
  className?: string;
}

export const FieldCard: React.FC<FieldCardProps> = ({
  name,
  cropType,
  practice,
  acreage,
  daysActive,
  className = ""
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Background icon decoration */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DAEED2]/20 rounded-full flex items-center justify-center pointer-events-none">
        <LucideSprout className="h-12 w-12 text-[#1B5E20]/20" />
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">AgriCarbon Registry</span>
        <h3 className="font-display text-md font-bold text-text-deep mt-0.5">{name}</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Crop Domain</span>
            <span className="font-bold text-text-deep block mt-0.5">{cropType}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Tillage Practice</span>
            <span className="font-bold text-text-deep block mt-0.5 capitalize">{practice}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-between gap-2">
          <StatBadge label="Size" value={`${acreage} Acres`} type="info" />
          <StatBadge label="Active Period" value={`${daysActive} Days`} type="success" />
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed">
          This parcel is mapped using Sentinel spatial polygons. Carbon credits eligibility is monitored via daily NASA FIRMS thermal audits.
        </p>
      </div>
    </Card>
  );
};
export default FieldCard;
