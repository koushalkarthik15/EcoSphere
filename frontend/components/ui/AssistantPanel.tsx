"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "../../lib/providers/RoleProvider";
import { useTelemetry } from "../../lib/providers/TelemetryProvider";
import { useCarbon } from "../../lib/providers/CarbonProvider";
import { useToasts } from "../../lib/providers/ToastProvider";
import { useAppLayout } from "./AppLayout";
import { 
  LucideSparkles, 
  LucideChevronRight, 
  LucideChevronLeft,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideCompass,
  LucideCoins,
  LucideTrendingDown,
  LucideTrophy,
  LucideHistory,
  LucideArrowUpRight
} from "lucide-react";
import { API_BASE_URL } from "../../lib/apiClient";

export const AssistantPanel: React.FC = () => {
  const { role } = useRole();
  const { currentLocation } = useTelemetry();
  const { addCredits, spendCoins, carbonBalance, marketplaceBalance } = useCarbon();
  const { addToast } = useToasts();
  const { isAssistantOpen, toggleAssistant } = useAppLayout();

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);

  // Fetch recommendations from API or local fallback
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/v1/intelligence/recommendations?role=${role}&lat=${currentLocation.lat}&lng=${currentLocation.lng}`;
      const res = await fetch(url);
      if (res.ok) {
        setRecommendations(await res.json());
      } else {
        throw new Error("Failed fetching recommendations");
      }
    } catch (e) {
      // Fallback mocks
      if (role === "urban") {
        setRecommendations([
          { id: "urban_commute_active", type: "commute", title: "🚲 Active Commute: Safe to Cycle", content: "The air quality index is healthy (45). Walk or cycle to offset 100% of commute emissions.", action_label: "Log Cycle Route", impact_credits: 5.0 },
          { id: "urban_cooling_efficiency", type: "energy", title: "🔌 Peak Grid Load Optimization", content: "Local Land Surface Temp is high (32°C). Shift high-energy appliance usage past peak hours.", action_label: "Displace Load", impact_credits: 4.5 }
        ]);
      } else if (role === "farmer") {
        setRecommendations([
          { id: "farmer_irrigation_critical", type: "irrigation", title: "💦 Precision Irrigation Trigger", content: "Soil moisture is low (28%). Target watering tomorrow morning to prevent root stress.", action_label: "Open Valves", impact_credits: 10.0 },
          { id: "farmer_burn_prevention", type: "burn_prevention", title: "⚠️ Extreme Stubble Fire Risk", content: "Burning stubble will trigger penalty logs. Mulch residue into soil registry instead.", action_label: "Log Mulching", impact_credits: 25.0 }
        ]);
      } else {
        setRecommendations([
          { id: "industry_leak_warning", type: "leak_prevention", title: "🚨 Spectrometry Seal Anomaly", content: "Methane spectrometer anomalies detected. Inspect piping seals in sector 4.", action_label: "Seal Leak", impact_credits: 50.0 },
          { id: "industry_solar_transition", type: "solar_adoption", title: "☀️ Transition Roof Space to Solar", content: "Log planned clean energy switch. Displace 400 tons CO2e annually.", action_label: "View Quotes", impact_credits: 40.0 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [role, currentLocation]);

  const handleActionClick = async (rec: any) => {
    setExecutingId(rec.id);
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
      if (rec.impact_credits > 0) {
        addCredits(rec.impact_credits * 0.1);
        spendCoins(-Math.round(rec.impact_credits * 5)); // rewarding coins
      }
      addToast(`Action "${rec.title}" logged. Earned EcoCoins!`, "success", "AI Assistant");
      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="flex relative z-30 select-none">
      {/* Floating Toggle Button (Pushed down slightly to account for fixed 72px Navbar) */}
      <div className="absolute top-24 -left-7">
        <button
          onClick={toggleAssistant}
          className="p-1.5 rounded-l-xl border border-r-0 border-border bg-white text-text-deep hover:bg-[#F6FAF4] transition-smooth shadow-md cursor-pointer"
          aria-label={isAssistantOpen ? "Hide AI Assistant Panel" : "Show AI Assistant Panel"}
        >
          {isAssistantOpen ? <LucideChevronRight className="h-4.5 w-4.5" /> : <LucideChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>

      <AnimatePresence>
        {isAssistantOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white border-l border-border h-[calc(100vh-72px)] flex flex-col overflow-hidden w-[340px] sticky top-[72px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-[#F1F8E9]/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <LucideSparkles className="h-4.5 w-4.5 text-text-deep animate-pulse-slow" />
                <h2 className="font-display text-xs font-black text-text-deep uppercase tracking-wider">
                  AI Intelligence Deck
                </h2>
              </div>
              <span className="text-[9px] bg-[#2E7D32] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Console Active
              </span>
            </div>

            {/* Scrollable Content Deck holding the 7 Required Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* SECTION 1: TODAY'S SUMMARY */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  1. Today's Summary
                </span>
                <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-text-muted">Role Perspective:</span>
                    <span className="text-text-deep uppercase">{role}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-text-muted">EcoCredits Balance:</span>
                    <span className="text-text-deep">{carbonBalance.toFixed(2)} t</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-text-muted">Accumulated EcoCoins:</span>
                    <span className="text-telemetry-warning font-black">{marketplaceBalance}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ENVIRONMENTAL ALERTS */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  2. Environmental Alerts
                </span>
                <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl flex items-start gap-2.5 text-xs text-red-900 leading-relaxed font-bold">
                  <LucideAlertTriangle className="h-4.5 w-4.5 text-telemetry-critical flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-xs font-black">Regional Sensor Anomaly</h4>
                    <p className="text-[10px] text-red-700 mt-0.5">
                      {role === "farmer" 
                        ? "NASA FIRMS registers crop thermal indices spikes in Amritsar sector B." 
                        : role === "industry" 
                        ? "Air density spectrometry registers localized gas offsets variance." 
                        : "High heat island indexes logged in immediate urban coordinates."}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: AI RECOMMENDATIONS */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  3. AI Recommendations
                </span>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-[11px] text-text-muted animate-pulse py-2">Loading data...</div>
                  ) : recommendations.length === 0 ? (
                    <div className="p-3 border border-border border-dashed rounded-xl text-center text-[10px] text-text-muted font-bold">
                      All recommendations addressed!
                    </div>
                  ) : (
                    recommendations.map((rec) => (
                      <div key={rec.id} className="p-3 border border-border/80 rounded-xl space-y-2 bg-[#F6FAF4]/40 hover:shadow-xs transition-smooth border-l-4 border-l-[#2E7D32]">
                        <h4 className="text-[11px] font-bold text-text-deep">{rec.title}</h4>
                        <p className="text-[10px] text-text-muted leading-relaxed">{rec.content}</p>
                        <div className="flex justify-between items-center pt-1.5 border-t border-border/40">
                          <span className="text-[9px] font-black text-[#2E7D32]">+{rec.impact_credits} Credits</span>
                          <button
                            onClick={() => handleActionClick(rec)}
                            disabled={executingId !== null}
                            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded cursor-pointer disabled:opacity-40"
                          >
                            {executingId === rec.id ? "Logging..." : rec.action_label}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 4: MARKETPLACE OPPORTUNITIES */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  4. Marketplace Opportunities
                </span>
                <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                    <div>
                      <h4 className="font-bold text-text-deep truncate max-w-[170px]">🌾 Punjab Zero-Till Offset</h4>
                      <p className="text-[9px] text-text-muted">A+ Grade &bull; 15.0 Coins/ton</p>
                    </div>
                    <Link href="/marketplace" className="text-[9px] text-[#2E7D32] hover:text-[#1B5E20] flex items-center font-black uppercase gap-0.5">
                      Trade <LucideArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-text-deep truncate max-w-[170px]">☀️ Rajasthan Thar Solar</h4>
                      <p className="text-[9px] text-text-muted">A- Grade &bull; 12.0 Coins/ton</p>
                    </div>
                    <Link href="/marketplace" className="text-[9px] text-[#2E7D32] hover:text-[#1B5E20] flex items-center font-black uppercase gap-0.5">
                      Trade <LucideArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SECTION 5: GOALS */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  5. Goals
                </span>
                <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border space-y-2.5 text-xs font-bold text-text-deep">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Monthly Carbon Reduction:</span>
                      <span>64% reached</span>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2E7D32] h-full" style={{ width: "64%" }} />
                    </div>
                  </div>
                  <div className="space-y-1 border-t border-border/60 pt-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Accumulate EcoCoins:</span>
                      <span>85% reached</span>
                    </div>
                    <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                      <div className="bg-telemetry-warning h-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: CHALLENGES */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  6. Daily Challenges
                </span>
                <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border space-y-2.5 text-xs font-bold text-text-deep">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="chal_1" 
                      defaultChecked 
                      className="rounded text-[#2E7D32] focus:ring-[#2E7D32]" 
                      onClick={() => addToast("Completed Challenge: Verify active coordinates.", "success")}
                    />
                    <label htmlFor="chal_1" className="text-text-deep hover:text-text-muted cursor-pointer truncate">
                      Verify current coordinates
                    </label>
                  </div>
                  <div className="flex items-center gap-2 border-t border-border/40 pt-2">
                    <input 
                      type="checkbox" 
                      id="chal_2" 
                      className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                      onClick={() => addToast("Completed Challenge: Upgrade seals spectrometry.", "success")}
                    />
                    <label htmlFor="chal_2" className="text-text-deep hover:text-text-muted cursor-pointer truncate">
                      Audit sensor connectivity
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 7: RECENT ACTIVITY */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-text-muted tracking-widest block">
                  7. Recent Activity
                </span>
                <div className="p-3 bg-[#F6FAF4] rounded-xl border border-border space-y-2.5 text-xs text-text-deep font-semibold">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-text-muted">Google OAuth Session Checked</span>
                    <span className="text-[10px] text-text-deep font-bold">10m ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">EcoCoins rewards minted</span>
                    <span className="text-[10px] text-[#2E7D32] font-bold">+50 Coins</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Panel Status */}
            <div className="p-3.5 bg-background border-t border-border flex items-center justify-between text-[10px] font-semibold text-text-muted flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-telemetry-healthy animate-pulse" />
                Pipeline Active
              </span>
              <span>v1.2.0</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssistantPanel;
