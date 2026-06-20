"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideCompass, LucideTrendingUp, LucideInfo } from "lucide-react";

export interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  funding_status: string;
  credits_available: number;
  price_per_ton_coins: number;
  vintage_year: number;
  description: string;
}

interface ProjectCardProps {
  project: ProjectInfo;
  onViewDetails: (project: ProjectInfo) => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  className = ""
}) => {
  const {
    name,
    type,
    location,
    funding_status,
    credits_available,
    price_per_ton_coins
  } = project;

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between ${className}`}>
      
      {/* Visual Header */}
      <div className="space-y-3.5 w-full">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-[#DAEED2]/50 border border-border rounded-xl text-text-deep">
            <LucideCompass className="h-4 w-4 animate-pulse-slow" />
          </div>
          <span className="text-[9px] bg-white border border-border/80 text-text-muted px-2 py-0.5 rounded-full font-black uppercase">
            {type}
          </span>
        </div>

        <div>
          <h4 className="font-display font-bold text-text-deep leading-snug truncate pr-6">{name}</h4>
          <span className="text-[10px] text-text-muted font-bold mt-0.5 block">{location}</span>
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[9px] text-text-muted block font-semibold uppercase">Offsets Available</span>
            <span className="font-bold text-text-deep block mt-0.5">{credits_available.toLocaleString()} t</span>
          </div>
          <div>
            <span className="text-[9px] text-text-muted block font-semibold uppercase">Funding level</span>
            <span className="font-bold text-[#2E7D32] block mt-0.5 flex items-center gap-0.5">
              <LucideTrendingUp className="h-3.5 w-3.5" />
              {funding_status}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border mt-4 w-full flex items-center gap-2">
        {/* Pricing badge info */}
        <div className="flex-1 text-xs">
          <span className="text-[9px] text-text-muted block font-semibold">Unit Index</span>
          <span className="font-black text-text-deep">{price_per_ton_coins.toFixed(1)} coins/t</span>
        </div>
        <button
          onClick={() => onViewDetails(project)}
          className="py-1.5 px-4 border border-text-deep text-text-deep hover:bg-text-deep hover:text-white transition-smooth text-[10px] font-bold rounded-full cursor-pointer flex items-center gap-1"
        >
          <LucideInfo className="h-3 w-3" />
          Details
        </button>
      </div>

    </Card>
  );
};

export default ProjectCard;
