"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  earned: boolean;
}

interface AchievementBadgeProps {
  achievements: Achievement[];
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievements,
  className = ""
}) => {
  return (
    <Card title="🏅 Unlock Achievements" description="Review earned badges indicating environmental intelligence milestone completions." className={className}>
      <div className="grid grid-cols-3 gap-4 text-center">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-3 border rounded-xl flex flex-col items-center justify-between gap-2 ${
              ach.earned
                ? "bg-[#DAEED2]/20 border-border"
                : "bg-gray-50/50 border-gray-100 opacity-40"
            }`}
            title={ach.description}
          >
            <span className="text-3xl filter drop-shadow-sm select-none" role="img" aria-label={ach.title}>
              {ach.badge_icon}
            </span>
            <div>
              <span className="text-[10px] font-black text-text-deep block leading-tight">{ach.title}</span>
              <span className="text-[8px] text-text-muted mt-0.5 block leading-relaxed">{ach.earned ? "Unlocked" : "Locked"}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default AchievementBadge;
