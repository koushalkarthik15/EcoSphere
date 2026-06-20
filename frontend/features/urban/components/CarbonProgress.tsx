"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { ProgressRing } from "../../../components/ui/ProgressRing";
import { LucideFlame, LucideAward } from "lucide-react";

interface CarbonProgressProps {
  streak: number;
  rank: string;
  carbonScore: number;
  className?: string;
}

export const CarbonProgress: React.FC<CarbonProgressProps> = ({
  streak,
  rank,
  carbonScore,
  className = ""
}) => {
  return (
    <Card title="🏆 Gamification Progress" description="Your carbon offsets contribution ranking and level streaking." className={className}>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        
        {/* Progress Circular ring */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing progress={carbonScore} radius={45} strokeWidth={6} color="text-text-deep" />
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Carbon Score</span>
        </div>

        {/* Level Stats */}
        <div className="flex-1 space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="bg-[#DAEED2] p-2 rounded-full text-text-deep">
              <LucideAward className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] text-text-muted block uppercase font-bold">Contribution Level</span>
              <span className="text-xs font-black text-text-deep block leading-tight">{rank}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#DAEED2] p-2 rounded-full text-text-deep">
              <LucideFlame className="h-5 w-5 text-telemetry-warning" />
            </div>
            <div>
              <span className="text-[9px] text-text-muted block uppercase font-bold">Daily Streak</span>
              <span className="text-xs font-black text-text-deep block leading-tight">{streak} Day Active Streak</span>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};
export default CarbonProgress;
