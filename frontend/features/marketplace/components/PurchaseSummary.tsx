"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideCreditCard, LucideCoins } from "lucide-react";

interface PurchaseSummaryProps {
  creditsNeeded: number;
  costCoins: number;
  recommendedProjectName: string;
  onCheckout: () => void;
  isProcessing?: boolean;
  className?: string;
}

export const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  creditsNeeded,
  costCoins,
  recommendedProjectName,
  onCheckout,
  isProcessing = false,
  className = ""
}) => {
  return (
    <Card title="🛒 Offset Purchase Summary" description="Review offset credit costs and execute sandbox payment confirmations." className={className}>
      <div className="space-y-4">
        
        {/* Cost details */}
        <div className="p-4 bg-[#F1F8E9] border border-border rounded-2xl space-y-3.5 text-xs">
          <div className="flex justify-between font-semibold border-b border-border/40 pb-2">
            <span className="text-text-muted">Target Credits:</span>
            <span className="font-bold text-text-deep">{creditsNeeded.toFixed(1)} Tons CO₂e</span>
          </div>
          <div className="flex justify-between font-semibold border-b border-border/40 pb-2">
            <span className="text-text-muted">Selected Registry:</span>
            <span className="font-bold text-text-deep truncate max-w-[200px] text-right">{recommendedProjectName}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-text-muted flex items-center gap-1.5 font-bold">
              <LucideCoins className="h-4 w-4 text-[#FFB300] animate-pulse" />
              Total Cost Est:
            </span>
            <span className="text-sm font-black text-[#2E7D32] font-display">
              {costCoins.toLocaleString()} coins
            </span>
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
          Disclaimer: Checkout runs via a secure Google Pay Sandbox simulation. Successfully purchased credits will be verified on the main wallet accounts ledger.
        </p>

        <button
          onClick={onCheckout}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition-smooth cursor-pointer disabled:opacity-40"
        >
          <LucideCreditCard className="h-4 w-4" />
          {isProcessing ? "Processing Sandbox Checkout..." : "Secure Google Pay Sandbox Pay"}
        </button>

      </div>
    </Card>
  );
};

export default PurchaseSummary;
