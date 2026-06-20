"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideCalendar, LucideCoins } from "lucide-react";

export interface Transaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  volume_tons: number;
  total_price_coins: number;
  timestamp: string;
  status: string;
}

interface TransactionTimelineProps {
  transactions: Transaction[];
  className?: string;
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  transactions = [],
  className = ""
}) => {
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"});
    } catch {
      return isoStr;
    }
  };

  return (
    <Card title="⏱️ Recent Transactions Ledger" description="Real-time log of carbon offsets traded in the EcoSphere network." className={className}>
      <div className="space-y-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {transactions.map((tx, idx) => (
              <li key={tx.id}>
                <div className="relative pb-8">
                  {idx !== transactions.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}

                  <div className="relative flex space-x-3 items-start">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-[#DAEED2] flex items-center justify-center text-text-deep ring-8 ring-white shadow-xs">
                        <LucideCalendar className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-xs font-bold text-text-deep">
                          Offset credits purchase of {tx.volume_tons.toFixed(1)} t
                        </p>
                        <p className="text-[10px] text-text-muted mt-1 leading-normal font-semibold">
                          Seller ID: {tx.seller_id} • Status: <span className="text-telemetry-healthy font-bold uppercase">{tx.status}</span>
                        </p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-text-muted">
                        <span className="font-bold text-text-deep block flex items-center justify-end gap-0.5">
                          <LucideCoins className="h-3 w-3 text-[#FFB300]" />
                          {tx.total_price_coins.toFixed(1)} coins
                        </span>
                        <time className="block mt-1 font-semibold">{formatDate(tx.timestamp)}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default TransactionTimeline;
