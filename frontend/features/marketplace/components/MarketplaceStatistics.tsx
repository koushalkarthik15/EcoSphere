"use client";

import React from "react";
import { LucideCoins, LucideSprout, LucideFactory, LucideGlobe } from "lucide-react";

interface MarketplaceStatisticsProps {
  livePriceCoins: number;
  creditsAvailableTons: number;
  verifiedFarmsCount: number;
  industrialBuyersCount: number;
  className?: string;
}

export const MarketplaceStatistics: React.FC<MarketplaceStatisticsProps> = ({
  livePriceCoins,
  creditsAvailableTons,
  verifiedFarmsCount,
  industrialBuyersCount,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      
      {/* 1. Live Index Price */}
      <div className="bg-white border border-border p-4.5 rounded-2xl shadow-xs flex items-center gap-3.5">
        <div className="p-3 bg-[#FFB300]/10 border border-[#FFB300]/25 rounded-xl text-[#FFB300]">
          <LucideCoins className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Live Credit Index</span>
          <span className="text-md font-black text-text-deep mt-0.5 block">{livePriceCoins.toFixed(2)} Coins/t</span>
        </div>
      </div>

      {/* 2. Available Supply */}
      <div className="bg-white border border-border p-4.5 rounded-2xl shadow-xs flex items-center gap-3.5">
        <div className="p-3 bg-[#2E7D32]/10 border border-[#2E7D32]/25 rounded-xl text-[#2E7D32]">
          <LucideGlobe className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Credits Supply</span>
          <span className="text-md font-black text-text-deep mt-0.5 block">{creditsAvailableTons.toLocaleString()} t CO₂e</span>
        </div>
      </div>

      {/* 3. Verified Sellers */}
      <div className="bg-white border border-border p-4.5 rounded-2xl shadow-xs flex items-center gap-3.5">
        <div className="p-3 bg-[#66BB6A]/10 border border-[#66BB6A]/25 rounded-xl text-[#66BB6A]">
          <LucideSprout className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Verified Sellers</span>
          <span className="text-md font-black text-text-deep mt-0.5 block">{verifiedFarmsCount} Farmers</span>
        </div>
      </div>

      {/* 4. Industrial Buyers */}
      <div className="bg-white border border-border p-4.5 rounded-2xl shadow-xs flex items-center gap-3.5">
        <div className="p-3 bg-text-deep/10 border border-text-deep/25 rounded-xl text-text-deep">
          <LucideFactory className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] text-text-muted block font-bold uppercase leading-tight">Audited Buyers</span>
          <span className="text-md font-black text-text-deep mt-0.5 block">{industrialBuyersCount} Corporates</span>
        </div>
      </div>

    </div>
  );
};

export default MarketplaceStatistics;
