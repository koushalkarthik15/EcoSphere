"use client";

import React from "react";
import { LucideX, LucideCompass, LucideTrendingUp, LucideInfo, LucideCoins } from "lucide-react";

interface ProjectInfo {
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

interface ProjectDetailsProps {
  project: ProjectInfo;
  onClose: () => void;
  onBuyClick: (vol: number) => void;
  className?: string;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onClose,
  onBuyClick,
  className = ""
}) => {
  const {
    name,
    type,
    location,
    lat,
    lng,
    funding_status,
    credits_available,
    price_per_ton_coins,
    vintage_year,
    description
  } = project;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-border shadow-2xl flex flex-col p-6 space-y-6 animate-slide-in ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <LucideInfo className="h-5 w-5 text-text-deep animate-bounce" />
          <span className="font-display font-black text-sm text-text-deep uppercase">Project Audit Dossier</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-[#F1F8E9] rounded-full text-text-muted hover:text-text-deep transition-smooth cursor-pointer"
          aria-label="Close dossier panel"
        >
          <LucideX className="h-5 w-5" />
        </button>
      </div>

      {/* Main Details scrollable */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin scrollbar-thumb-border">
        
        <div>
          <span className="text-[9px] bg-[#DAEED2] text-[#1B5E20] px-2.5 py-0.5 rounded-full font-black uppercase inline-block">
            {type}
          </span>
          <h3 className="font-display font-black text-md text-text-deep mt-2 leading-tight">{name}</h3>
          <span className="text-xs text-text-muted mt-1 block font-semibold">{location}</span>
        </div>

        {/* Mapped stats grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-[#F1F8E9]/60 p-3.5 border border-border rounded-xl">
          <div>
            <span className="text-[9px] text-text-muted block uppercase font-bold">Vintage Registry</span>
            <span className="font-bold text-text-deep mt-0.5 block">{vintage_year} Ledger</span>
          </div>
          <div>
            <span className="text-[9px] text-text-muted block uppercase font-bold">Funding Goal Status</span>
            <span className="font-bold text-[#2E7D32] mt-0.5 block flex items-center gap-0.5">
              <LucideTrendingUp className="h-3.5 w-3.5" />
              {funding_status}
            </span>
          </div>
          <div className="col-span-2 border-t border-border/40 pt-2 flex justify-between">
            <div>
              <span className="text-[9px] text-text-muted block uppercase font-bold">Geo Coordinates</span>
              <span className="font-mono text-[10px] text-text-deep font-bold mt-0.5 block">
                {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-text-muted block uppercase font-bold">Credits Unit Price</span>
              <span className="font-bold text-[#2E7D32] mt-0.5 block font-display">
                {price_per_ton_coins.toFixed(1)} coins/t
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-text-deep uppercase block">Project Description</span>
          <p className="text-text-muted leading-relaxed font-semibold">
            {description}
          </p>
          <p className="text-text-muted leading-relaxed font-semibold">
            By purchasing offset credits from this verified regional project registry, you directly support local smallholders, renewable generators, and regional carbon sequestration policies.
          </p>
        </div>

        {/* Verification seal */}
        <div className="p-3 bg-[#DAEED2]/40 border border-dashed border-[#1B5E20]/30 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-border text-[#1B5E20]">
            <LucideCompass className="h-5 w-5" />
          </div>
          <div className="text-[10px]">
            <span className="font-bold text-[#1B5E20] block">EcoSphere Audited Registry Seal</span>
            <span className="text-text-muted leading-tight block mt-0.5 font-semibold">
              Credits volumes are validated daily via Sentinel spectrometry column densities.
            </span>
          </div>
        </div>

      </div>

      {/* Footer checkout trigger */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => onBuyClick(10.0)} // Default purchase volume trigger
          className="w-full py-3 bg-text-deep hover:bg-text-deep/95 text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LucideCoins className="h-4 w-4" />
          Purchase 10 Tons Offsets Now
        </button>
      </div>

    </div>
  );
};

export default ProjectDetails;
