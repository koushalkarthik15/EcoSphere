"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideAward, LucideCoins, LucideShieldCheck } from "lucide-react";

export interface CreditListing {
  id: string;
  project_id: string;
  seller_name: string;
  volume_tons: number;
  price_per_ton_coins: number;
  quality_grade: string;
  vintage_year: number;
  verification_confidence: number;
}

interface CreditCardProps {
  listing: CreditListing;
  onBuyClick: (listing: CreditListing) => void;
  className?: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  listing,
  onBuyClick,
  className = ""
}) => {
  const {
    id,
    seller_name,
    volume_tons,
    price_per_ton_coins,
    quality_grade,
    vintage_year,
    verification_confidence
  } = listing;

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Grade badge highlight */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <span className="text-[9px] bg-[#DAEED2] text-text-deep border border-border px-2 py-0.5 rounded-full font-black uppercase">
          Grade {quality_grade}
        </span>
      </div>

      <div className="space-y-4 w-full">
        <div>
          <span className="text-[9px] text-text-muted font-bold block uppercase leading-tight">Vintage: {vintage_year}</span>
          <h4 className="font-display font-bold text-text-deep mt-1 pr-16 truncate">{seller_name}</h4>
        </div>

        {/* Quantities grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Available Volume</span>
            <span className="font-bold text-text-deep block mt-0.5">{volume_tons.toFixed(1)} Tons</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Verification confidence</span>
            <span className="font-bold text-telemetry-healthy block mt-0.5 flex items-center gap-1">
              <LucideShieldCheck className="h-3.5 w-3.5" />
              {verification_confidence.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Pricing details */}
        <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-text-muted block font-bold uppercase">Unit Price</span>
            <span className="text-sm font-black text-text-deep">{price_per_ton_coins.toFixed(1)} coins/t</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-text-muted block font-bold uppercase">Total Cost (listing)</span>
            <span className="text-sm font-black text-[#2E7D32]">
              {(volume_tons * price_per_ton_coins).toLocaleString()} coins
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border mt-4 w-full">
        <button
          onClick={() => onBuyClick(listing)}
          className="w-full py-2 bg-text-deep text-white hover:bg-text-deep/90 text-xs font-bold rounded-full shadow-xs hover:shadow transition-smooth cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LucideCoins className="h-3.5 w-3.5 animate-pulse" />
          Buy Offsets Credits
        </button>
      </div>
    </Card>
  );
};

export default CreditCard;
