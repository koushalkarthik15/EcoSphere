"use client";

import React from "react";
import { HeroSection } from "../../../components/ui/HeroSection";
import { Card } from "../../../components/ui/Card";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { LucideUsers, LucideMessageSquare, LucideAward, LucideCalendar } from "lucide-react";

export default function CommunityPage() {
  const { addToast } = useToasts();

  const leaders = [
    { name: "Ludhiana Green Co-Op", role: "Farmer Group", impact: "480 t CO₂e Offset", rank: "1st" },
    { name: "Urban Cycle Pioneers", role: "Citizen Group", impact: "120 t CO₂e Offset", rank: "2nd" },
    { name: "Amritsar Organic Soil Sink", role: "Farmer Group", impact: "98 t CO₂e Offset", rank: "3rd" }
  ];

  return (
    <div className="space-y-6">
      <HeroSection
        title="EcoSphere Community Network"
        description="Collaborate with regional farm collectives and urban citizen groups. View global impact leaderboards and participate in local stubble burn prevention workshops."
        primaryActionLabel="Join Local Workshop"
        secondaryActionLabel="Submit Group Project"
        onPrimaryClick={() => addToast("Successfully registered for upcoming stubble mulching seminar.", "success")}
        onSecondaryClick={() => addToast("Opening group registration form...", "info")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leaderboard Card */}
        <div className="md:col-span-2">
          <Card title="🏆 Impact Leaders" description="Top regional offset contributors for this billing quarter.">
            <div className="space-y-3 pt-2">
              {leaders.map((leader, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F6FAF4] rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#2E7D32] text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {leader.rank}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-deep">{leader.name}</h4>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">{leader.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#2E7D32]">{leader.impact}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick widgets */}
        <div className="flex flex-col gap-6">
          <Card title="📅 Community Events" description="Upcoming eco challenges.">
            <div className="space-y-3.5 text-xs font-bold pt-2">
              <div className="flex gap-2 border-b border-border/60 pb-2">
                <LucideCalendar className="h-4 w-4 text-text-muted flex-shrink-0" />
                <div>
                  <h5 className="text-text-deep">Zero-Till Field Tour</h5>
                  <p className="text-[9px] text-text-muted">June 25, 2026 - Amritsar</p>
                </div>
              </div>
              <div className="flex gap-2">
                <LucideCalendar className="h-4 w-4 text-text-muted flex-shrink-0" />
                <div>
                  <h5 className="text-text-deep">Urban Solar Offset Drive</h5>
                  <p className="text-[9px] text-text-muted">July 02, 2026 - Ludhiana</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="💬 Discussion Boards" description="Popular topics today.">
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-[#F6FAF4] rounded-lg border border-border">
                <span className="font-semibold text-text-deep truncate max-w-[150px]">Soil carbon minting rates</span>
                <span className="text-[9px] bg-[#DAEED2] px-1.5 py-0.5 rounded font-black">28 posts</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
