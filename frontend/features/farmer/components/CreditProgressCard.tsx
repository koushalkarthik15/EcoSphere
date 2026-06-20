"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { ProgressRing } from "../../../components/ui/ProgressRing";
import { LucideAward, LucideCoins } from "lucide-react";

interface CreditProgressCardProps {
  verifiedCredits: number;
  pendingCredits: number;
  goalProgressPct: number;
  className?: string;
}

export const CreditProgressCard: React.FC<CreditProgressCardProps> = ({
  verifiedCredits,
  pendingCredits,
  goalProgressPct,
  className = ""
}) => {
  return (
    <Card title="🏆 Carbon Sequestration Goal" description="Your seasonal carbon credits verification progress." className={className}>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        
        {/* Progress Ring */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing progress={goalProgressPct} radius={45} strokeWidth={6} color="text-text-deep" />
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Goal Progress</span>
        </div>

        {/* Details stats */}
        <div className="flex-1 space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="bg-[#DAEED2] p-2 rounded-full text-text-deep">
              <LucideAward className="h-5 w-5 text-telemetry-healthy" />
            </div>
            <div>
              <span className="text-[9px] text-text-muted block uppercase font-bold">Verified Credits</span>
              <span className="text-xs font-black text-text-deep block leading-tight">{verifiedCredits.toFixed(1)} t CO₂e</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#DAEED2] p-2 rounded-full text-text-deep">
              <LucideCoins className="h-5 w-5 text-telemetry-warning" />
            </div>
            <div>
              <span className="text-[9px] text-text-muted block uppercase font-bold">Pending Verification</span>
              <span className="text-xs font-black text-text-deep block leading-tight">{pendingCredits.toFixed(1)} t CO₂e</span>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};
export default CreditProgressCard;
