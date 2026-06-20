"use client";

import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { useCarbon } from "../../../lib/providers/CarbonProvider";
import { LucideCheckCircle2, LucideCircle } from "lucide-react";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target_offset_kg: number;
  credits_reward: number;
  completed: boolean;
}

interface DailyChallengeCardProps {
  challenges: Challenge[];
  className?: string;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenges: initialChallenges,
  className = ""
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const { addToast } = useToasts();
  const { addCredits } = useCarbon();

  const handleComplete = (id: string, credits: number) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          if (!ch.completed) {
            addCredits(credits);
            addToast(`Eco Challenge completed! Earned +${credits} EcoCredits.`, "success", "Challenge Completed");
            return { ...ch, completed: true };
          }
        }
        return ch;
      })
    );
  };

  return (
    <Card title="⚡ Daily Eco Challenges" description="Complete active challenges to earn additional carbon offset credits." className={className}>
      <div className="space-y-3.5">
        {challenges.map((ch) => (
          <button
            key={ch.id}
            onClick={() => handleComplete(ch.id, ch.credits_reward)}
            disabled={ch.completed}
            className={`w-full text-left p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-smooth focus:outline-none focus:ring-2 focus:ring-text-deep/20 ${
              ch.completed
                ? "bg-[#DAEED2]/30 border-border/50 opacity-70 cursor-default"
                : "bg-white border-border hover:bg-[#F1F8E9] hover:border-text-deep/30 cursor-pointer"
            }`}
            aria-label={`Daily challenge: ${ch.title}. Reward: ${ch.credits_reward} credits. Status: ${ch.completed ? "Completed" : "Active, tap to complete."}`}
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-text-deep block">{ch.title}</span>
              <span className="text-[10px] text-text-muted mt-0.5 block leading-relaxed">{ch.description}</span>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-[10px] font-black text-telemetry-healthy bg-telemetry-healthy/10 px-2 py-0.5 rounded-full">
                +{ch.credits_reward} cr
              </span>
              {ch.completed ? (
                <LucideCheckCircle2 className="h-5 w-5 text-telemetry-healthy" />
              ) : (
                <LucideCircle className="h-5 w-5 text-text-muted hover:text-text-deep transition-smooth" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
export default DailyChallengeCard;
