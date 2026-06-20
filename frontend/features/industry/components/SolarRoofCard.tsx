"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideSun, LucideZap } from "lucide-react";
import { StatBadge } from "../../../components/ui/StatBadge";

interface SolarPotential {
  capacity_kw: number;
  install_cost_usd: number;
  annual_savings_usd: number;
  payback_period_months: number;
  esg_improvement_score: number;
}

interface SolarRoofCardProps {
  roofAreaSqMeters: number;
  solarPotential: SolarPotential;
  className?: string;
}

export const SolarRoofCard: React.FC<SolarRoofCardProps> = ({
  roofAreaSqMeters,
  solarPotential,
  className = ""
}) => {
  const {
    capacity_kw,
    install_cost_usd,
    annual_savings_usd,
    payback_period_months,
    esg_improvement_score
  } = solarPotential;

  return (
    <Card title="☀️ Solar Roof Opportunities" description="Rooftop area solar potential and ROI payback analysis." className={className}>
      <div className="space-y-4">
        {/* Top metrics grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Available Roof Area</span>
            <span className="font-bold text-text-deep block mt-0.5">{roofAreaSqMeters.toLocaleString()} m²</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">Estimated Solar Yield</span>
            <span className="font-bold text-text-deep block mt-0.5">{capacity_kw.toFixed(1)} kW DC</span>
          </div>
        </div>

        {/* Financial ROI box */}
        <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl space-y-2 text-xs">
          <div className="flex justify-between font-semibold border-b border-border/50 pb-1.5">
            <span className="text-text-muted">Installation Est Cost:</span>
            <span className="font-bold text-text-deep">${install_cost_usd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </div>
          <div className="flex justify-between font-semibold border-b border-border/50 pb-1.5">
            <span className="text-text-muted">Annual Energy Offset:</span>
            <span className="font-bold text-telemetry-healthy">+${annual_savings_usd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} / yr</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-text-muted">Capital Payback Period:</span>
            <span className="font-bold text-text-deep">{payback_period_months.toFixed(1)} Months</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex justify-between gap-2">
          <StatBadge label="Solar payback" value={`${(payback_period_months / 12.0).toFixed(1)} Years`} type="info" />
          <StatBadge label="ESG Improvement" value={`+${esg_improvement_score} Points`} type="success" />
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
          Installing rooftop photovoltaic arrays offsets Scope 2 indirect carbon balances and directly reduces the regulatory carbon tax load of the facility.
        </p>
      </div>
    </Card>
  );
};

export default SolarRoofCard;
