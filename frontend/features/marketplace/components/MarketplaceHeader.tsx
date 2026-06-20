"use client";

import React from "react";
import { LucideLeaf, LucideCoins } from "lucide-react";

interface MarketplaceHeaderProps {
  carbonBalance: number;
  marketplaceBalance: number;
  className?: string;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  carbonBalance,
  marketplaceBalance,
  className = ""
}) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}>
      {/* Absolute decor assets */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-white/5 rounded-full -ml-16 -mb-16 pointer-events-none" />

      {/* Hero Content */}
      <div className="space-y-2 z-10 text-center md:text-left">
        <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase font-black tracking-widest">
          Circular Eco-Economy
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight mt-1.5">
          EcoSphere Carbon Marketplace
        </h1>
        <p className="text-xs text-white/80 max-w-md font-semibold leading-relaxed">
          Verify, buy, and trade dynamic offset credits directly from Punjab agricultural projects using secure Google Pay checkout.
        </p>
      </div>

      {/* Live Balance widgets */}
      <div className="flex gap-4 z-10 w-full md:w-auto justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <LucideLeaf className="h-5 w-5 text-[#66BB6A]" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold text-white/70">EcoCredits</span>
            <span className="text-sm font-black">{carbonBalance.toFixed(1)} Tons</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <LucideCoins className="h-5 w-5 text-[#FFB300]" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold text-white/70">EcoCoins</span>
            <span className="text-sm font-black">{marketplaceBalance.toLocaleString()} Coins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
