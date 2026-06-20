"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideTrendingDown, LucideTrendingUp, LucideCircleDollarSign } from "lucide-react";

interface FinancialImpactCardProps {
  carbonTaxLiability: number;
  operationalWaste: number;
  leakRepairSavings: number;
  annualSavingsTotal: number;
  className?: string;
}

export const FinancialImpactCard: React.FC<FinancialImpactCardProps> = ({
  carbonTaxLiability,
  operationalWaste,
  leakRepairSavings,
  annualSavingsTotal,
  className = ""
}) => {
  return (
    <Card title="📊 Operational Financial Audit" description="Review carbon tax liability and operational savings opportunities." className={className}>
      <div className="space-y-4">
        
        {/* Core numbers grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-[9px] text-red-700 block font-bold uppercase leading-tight">Carbon Tax Liability</span>
            <div className="flex items-baseline gap-0.5 mt-1 text-red-700">
              <span className="text-lg font-black">${carbonTaxLiability.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
            <span className="text-[8px] text-text-muted block mt-1 font-semibold">Annual exposure under $125/t</span>
          </div>

          <div className="p-3 bg-[#F1F8E9] border border-[#DCEED2] rounded-xl">
            <span className="text-[9px] text-[#2E7D32] block font-bold uppercase leading-tight font-display">Est Leak Repair Savings</span>
            <div className="flex items-baseline gap-0.5 mt-1 text-[#2E7D32]">
              <span className="text-lg font-black">+${leakRepairSavings.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
            <span className="text-[8px] text-text-muted block mt-1 font-semibold">90% recoverable waste</span>
          </div>
        </div>

        {/* Detailed accounts */}
        <div className="p-3.5 bg-white border border-border rounded-xl space-y-2.5 text-xs">
          <div className="flex justify-between font-semibold border-b border-border/40 pb-1.5">
            <span className="text-text-muted flex items-center gap-1.5">
              <LucideTrendingDown className="h-4 w-4 text-telemetry-critical" />
              Operational Gas Waste:
            </span>
            <span className="font-bold text-text-deep">${operationalWaste.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} / yr</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-text-muted flex items-center gap-1.5">
              <LucideTrendingUp className="h-4 w-4 text-telemetry-healthy animate-bounce" />
              Annual Savings Opportunity:
            </span>
            <span className="font-bold text-telemetry-healthy">${annualSavingsTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} / yr</span>
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
          Reducing fugitive emissions lowers Scope 1 taxes while scaling solar offsets reduces Scope 2 grid utility costs.
        </p>

      </div>
    </Card>
  );
};

export default FinancialImpactCard;
