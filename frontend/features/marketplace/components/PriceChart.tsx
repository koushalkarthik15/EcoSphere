"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideTrendingUp } from "lucide-react";

export interface PriceTrend {
  week: string;
  index_price_coins: number;
}

interface PriceChartProps {
  trend: PriceTrend[];
  className?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  trend = [],
  className = ""
}) => {
  const prices = trend.map(t => t.index_price_coins);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 20.0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 10.0;
  const priceRange = maxPrice - minPrice || 1.0;

  return (
    <Card title="📈 Carbon Credit Index Trend" description="Weekly live marketplace pricing indices logs (W16 - W24)." className={className}>
      <div className="space-y-6">
        
        {/* Graphical Representation */}
        <div className="h-40 flex items-end justify-between gap-3 pt-6 border-b border-border/80 pb-2 select-none relative">
          
          {/* Vertical axis indicators grid lines */}
          <div className="absolute inset-x-0 bottom-2 border-b border-border/20" />
          <div className="absolute inset-x-0 bottom-1/2 border-b border-border/20" />
          <div className="absolute inset-x-0 top-6 border-b border-border/20" />

          {trend.map((t, idx) => {
            // Calculate relative height percentage
            const pct = ((t.index_price_coins - minPrice) / priceRange) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative z-10">
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-text-deep text-white text-[8px] font-mono font-black px-1.5 py-0.5 rounded shadow -translate-y-12 pointer-events-none z-20">
                  {t.index_price_coins.toFixed(2)} coins
                </div>

                {/* Dot */}
                <div 
                  style={{ marginBottom: `${pct * 0.7}px` }}
                  className={`w-3.5 h-3.5 rounded-full border-2 border-white transition-all shadow-sm ${
                    idx === trend.length - 1 
                      ? "bg-text-deep ring-4 ring-text-deep/20 scale-110" 
                      : "bg-[#66BB6A] group-hover:bg-[#2E7D32]"
                  }`}
                />

                {/* Week Label */}
                <span className="text-[9px] font-black text-text-muted font-mono">{t.week}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-[9px] font-bold text-text-muted">
          <span className="flex items-center gap-1.5">
            <LucideTrendingUp className="h-4 w-4 text-telemetry-healthy animate-bounce" />
            Pricing matches quality grading premiums.
          </span>
          <span className="font-mono font-bold text-text-deep">
            Min: {minPrice.toFixed(1)} coins • Max: {maxPrice.toFixed(1)} coins
          </span>
        </div>

      </div>
    </Card>
  );
};

export default PriceChart;
