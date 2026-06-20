"use client";

import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { LucideCoins, LucideLeaf, LucideRefreshCw, LucideAward } from "lucide-react";
import { StatBadge } from "../../../components/ui/StatBadge";

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  desc: string;
  timestamp: string;
}

interface WalletCardProps {
  ecoCredits: number;
  ecoCoins: number;
  purchasedCredits: number;
  verifiedCredits: number;
  ledgerHistory: LedgerEntry[];
  onConvertCredits: (amount: number) => Promise<void>;
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  ecoCredits,
  ecoCoins,
  purchasedCredits,
  verifiedCredits,
  ledgerHistory = [],
  onConvertCredits,
  className = ""
}) => {
  const [convertAmount, setConvertAmount] = useState(5.0);
  const [converting, setConverting] = useState(false);

  const handleConvert = async () => {
    if (convertAmount <= 0 || convertAmount > ecoCredits) return;
    setConverting(true);
    try {
      await onConvertCredits(convertAmount);
    } finally {
      setConverting(false);
    }
  };

  return (
    <Card title="💳 Wallet & Rewards Dashboard" description="Convert saved transit credits to EcoCoins and review ledger balances." className={className}>
      <div className="space-y-6">
        
        {/* Balances grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl">
            <span className="text-[9px] text-[#2E7D32] block font-bold uppercase leading-tight">EcoCredits (Offsets)</span>
            <div className="flex items-baseline gap-0.5 mt-1 text-[#2E7D32]">
              <span className="text-xl font-black text-text-deep">{ecoCredits.toFixed(1)}</span>
              <span className="text-[9px] text-text-muted font-bold">Tons</span>
            </div>
            <span className="text-[8px] text-text-muted block mt-1.5 font-semibold">Earned from green commutes</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="text-[9px] text-amber-700 block font-bold uppercase leading-tight font-display">EcoCoins Balance</span>
            <div className="flex items-baseline gap-0.5 mt-1 text-amber-700">
              <span className="text-xl font-black text-text-deep">{ecoCoins.toLocaleString()}</span>
              <span className="text-[9px] text-text-muted font-bold">Coins</span>
            </div>
            <span className="text-[8px] text-text-muted block mt-1.5 font-semibold">Spendable on offset credits</span>
          </div>
        </div>

        {/* Convert Box */}
        <div className="p-4 bg-[#F1F8E9]/50 border border-border rounded-2xl space-y-3.5 text-xs">
          <span className="font-bold text-text-deep uppercase block text-[9px] tracking-wider">
            Exchange: Convert saved credits to marketplace coins
          </span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0.5"
              step="0.5"
              max={ecoCredits}
              value={convertAmount}
              onChange={(e) => setConvertAmount(Math.max(0.5, parseFloat(e.target.value) || 0))}
              className="bg-white border border-border px-3 py-2 rounded-xl text-xs font-bold text-text-deep w-24 focus:outline-none focus:ring-2 focus:ring-text-deep/20"
            />
            <span className="text-[10px] text-text-muted font-bold">
              = {Math.round(convertAmount * 100)} coins (Rate: 1t = 100c)
            </span>
          </div>
          <button
            onClick={handleConvert}
            disabled={converting || ecoCredits < convertAmount}
            className="w-full py-2 bg-text-deep hover:bg-text-deep/90 text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-smooth disabled:opacity-40 cursor-pointer"
          >
            <LucideRefreshCw className={`h-3.5 w-3.5 ${converting ? "animate-spin" : ""}`} />
            Convert EcoCredits Rewards
          </button>
        </div>

        {/* Ledger Entries List */}
        <div className="border-t border-border pt-4">
          <span className="text-[10px] font-bold text-text-deep uppercase block mb-3.5">Recent Wallet Actions ({ledgerHistory.length})</span>
          <div className="max-h-40 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-border">
            {ledgerHistory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#F1F8E9]/40 border border-border/60 rounded-xl">
                <div>
                  <span className="font-bold text-text-deep block leading-tight">{item.desc}</span>
                  <span className="text-[8px] text-text-muted mt-0.5 block">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <div>
                  <StatBadge 
                    label="Amount" 
                    value={`${item.amount > 0 ? "+" : ""}${item.amount} coins`} 
                    type={item.amount > 0 ? "success" : "error"} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
};

export default WalletCard;
