"use client";

import React from "react";
import { LucideCompass, LucideLeaf } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Environmental Intelligence for Smarter Sustainability",
  description = "Access high-resolution Copernicus Sentinel spectrometry, Landsat thermal imagery, and NASA fire anomaly reports. Audited models normalize telemetry grids, enabling industries and communities to target carbon offsets local boundaries.",
  primaryActionLabel = "Inspect Live Telemetry",
  secondaryActionLabel = "Verify Offsets Ledger",
  onPrimaryClick,
  onSecondaryClick
}) => {
  return (
    <div 
      className="bg-white border border-border p-8 md:p-12 rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-5 gap-8 items-center transition-smooth hover:shadow-md"
      role="banner"
      aria-label="Environmental Intelligence Banner"
    >
      {/* Left: Content Text */}
      <div className="lg:col-span-3 space-y-5">
        <h1 className="font-display text-2xl md:text-3.5xl font-black text-text-deep tracking-tight leading-tight antialiased">
          {title}
        </h1>
        
        <p className="text-xs md:text-sm text-text-muted leading-relaxed font-medium max-w-xl">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onPrimaryClick}
            className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-full shadow-xs hover:shadow transition-smooth cursor-pointer flex items-center gap-2 uppercase tracking-wider"
          >
            <LucideCompass className="h-4 w-4" />
            {primaryActionLabel}
          </button>
          
          <button
            onClick={onSecondaryClick}
            className="px-6 py-3 border border-border hover:border-text-deep bg-background hover:bg-white text-text-deep font-bold text-xs rounded-full transition-smooth cursor-pointer flex items-center gap-2 uppercase tracking-wider"
          >
            <LucideLeaf className="h-4 w-4" />
            {secondaryActionLabel}
          </button>
        </div>
      </div>

      {/* Right: Premium Editorial Vector Illustration */}
      <div className="lg:col-span-2 flex items-center justify-center">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full max-w-[220px] select-none hover:scale-105 transition-smooth"
          aria-hidden="true"
        >
          {/* Earth/Circular Boundary Grid */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="#E6EFE3" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#E6EFE3" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#E6EFE3" strokeWidth="0.5" />
          
          {/* Outer Satellite Trajectory Orbit */}
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#66BB6A" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="150" cy="35" r="4.5" fill="#2E7D32" />
          <path d="M 147 35 L 153 35 M 150 32 L 150 38" stroke="white" strokeWidth="1" />

          {/* Mountains Vector Outline */}
          <polygon points="40,150 85,75 130,150" fill="none" stroke="#C4D3BE" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="90,150 125,95 160,150" fill="none" stroke="#E6EFE3" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* Forest Trees Vector Outlines */}
          <polygon points="50,150 60,132 70,150" fill="none" stroke="#558B2F" strokeWidth="1.5" />
          <polygon points="53,137 60,123 67,137" fill="none" stroke="#558B2F" strokeWidth="1.5" />
          
          <polygon points="120,150 130,128 140,150" fill="none" stroke="#1B5E20" strokeWidth="1.5" />
          <polygon points="123,134 130,118 137,134" fill="none" stroke="#1B5E20" strokeWidth="1.5" />

          {/* Wind Turbines outlines */}
          <line x1="85" y1="150" x2="85" y2="120" stroke="#1B5E20" strokeWidth="1.5" />
          <path d="M 85 120 L 78 116 M 85 120 L 92 116 M 85 120 L 85 128" stroke="#1B5E20" strokeWidth="1" strokeLinecap="round" />

          <line x1="105" y1="150" x2="105" y2="110" stroke="#558B2F" strokeWidth="1.5" />
          <path d="M 105 110 L 97 106 M 105 110 L 113 106 M 105 110 L 105 119" stroke="#558B2F" strokeWidth="1" strokeLinecap="round" />

          {/* Ground Base Line */}
          <line x1="20" y1="150" x2="180" y2="150" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
