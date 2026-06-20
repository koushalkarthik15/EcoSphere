"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { StatBadge } from "../../../components/ui/StatBadge";
import { LucideShieldAlert, LucideShieldCheck } from "lucide-react";

interface ComplianceStatusProps {
  scope1Status: string;
  scope2Status: string;
  className?: string;
}

export const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  scope1Status,
  scope2Status,
  className = ""
}) => {
  const isScope1Warning = scope1Status.toLowerCase().includes("warning") || scope1Status.toLowerCase().includes("critical");
  const isScope2Warning = scope2Status.toLowerCase().includes("warning") || scope2Status.toLowerCase().includes("critical");

  return (
    <Card title="🛡️ Corporate Scope Compliance" description="Scope-specific audit assessments and warning flags." className={className}>
      <div className="space-y-4">
        {/* Scope 1 Block */}
        <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Scope 1 (Direct Emissions)</span>
            <p className="text-xs text-text-deep font-semibold">Stubble burns, leak sources, and fossil fuel burn bounds.</p>
          </div>
          <div>
            <StatBadge
              label="Scope 1"
              value={scope1Status}
              type={isScope1Warning ? "error" : "success"}
            />
          </div>
        </div>

        {/* Scope 2 Block */}
        <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Scope 2 (Indirect Grid energy)</span>
            <p className="text-xs text-text-deep font-semibold">Electricity draw, cooling loss, heating grid carbon footprint.</p>
          </div>
          <div>
            <StatBadge
              label="Scope 2"
              value={scope2Status}
              type={isScope2Warning ? "error" : "success"}
            />
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed">
          Scope audits are normalized against regional climate parameters. High Scope 1 direct emissions are subject to local carbon taxes and regulatory exposure penalties.
        </p>
      </div>
    </Card>
  );
};

export default ComplianceStatus;
