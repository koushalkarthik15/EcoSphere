"use client";

import React from "react";
import { HeroSection } from "../../../components/ui/HeroSection";
import { Card } from "../../../components/ui/Card";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { LucideTrendingUp, LucideFileBarChart, LucideGauge, LucideShieldAlert } from "lucide-react";

export default function AnalyticsPage() {
  const { addToast } = useToasts();

  return (
    <div className="space-y-6">
      <HeroSection
        title="Compliance & Footprint Analytics"
        description="Verify your long-term environmental footprint. Run audit reports on regional stubble logs, gas spectrometer leakage anomalies, and green credit balances."
        primaryActionLabel="Generate Audit PDF"
        secondaryActionLabel="Refilter Dataset"
        onPrimaryClick={() => addToast("Compliance report generated. Check local logs directory.", "success")}
        onSecondaryClick={() => addToast("Data points set to last 90 days.", "info")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="📈 Offset Yield Rate" description="Progress tracker for environmental credits accumulation.">
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <LucideTrendingUp className="h-12 w-12 text-telemetry-healthy animate-pulse" />
            <span className="text-2xl font-black text-text-deep font-display">+18.4%</span>
            <p className="text-[10px] text-text-muted uppercase font-bold text-center">Net Offset Vector (Q2)</p>
          </div>
        </Card>

        <Card title="📑 Compliancy Index" description="Audit score relative to environmental baseline standards.">
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <LucideShieldAlert className="h-12 w-12 text-telemetry-warning" />
            <span className="text-2xl font-black text-text-deep font-display">94.2 / 100</span>
            <p className="text-[10px] text-text-muted uppercase font-bold text-center">High Trust Compliance Grade</p>
          </div>
        </Card>

        <Card title="📊 Active Telemetry Sensor Links" description="Active satellite node telemetry status checks.">
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <LucideGauge className="h-12 w-12 text-telemetry-neutral" />
            <span className="text-2xl font-black text-text-deep font-display">12 / 12 Online</span>
            <p className="text-[10px] text-text-muted uppercase font-bold text-center">Sentinel / NASA FIRMS Nodes</p>
          </div>
        </Card>
      </div>

      <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <LucideFileBarChart className="h-5 w-5 text-text-deep" />
          <h3 className="font-display text-sm font-black uppercase text-text-deep">Geospatial Telemetry Logs</h3>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Historical records of Landsat surface temperature, Sentinel-5P ozone concentrations, and stubble fire markers are aggregated here for auditing. Select any date range to generate standard offline compliance reports.
        </p>
      </div>
    </div>
  );
}
