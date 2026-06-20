"use client";

import React from "react";
import Link from "next/link";
import { LucideLeaf, LucideChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white border border-border p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Brand identity header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <Link href="/login" className="flex items-center gap-2 text-text-deep font-bold hover:opacity-80 transition-smooth">
            <LucideChevronLeft className="h-4 w-4" />
            <span className="text-xs uppercase font-black">Back to login</span>
          </Link>
          <div className="flex items-center gap-2 text-text-deep font-bold text-sm">
            <LucideLeaf className="h-4 w-4" />
            <span className="font-display font-black">EcoSphere</span>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-text-deep">
          <h1 className="font-display text-2xl font-extrabold tracking-tight border-b border-border/40 pb-2">
            Privacy Policy
          </h1>
          <p className="font-semibold text-text-muted">Last Updated: June 20, 2026</p>
          
          <p>
            At EcoSphere, we take your environmental telemetry data privacy very seriously. This privacy policy describes what telemetry coordinate indexes, Landsat thermal sensors data, and zero-till cover crop validation photo logs we collect and how we process them.
          </p>

          <h3 className="font-display font-bold text-sm uppercase pt-2">1. Telemetry Data Collection</h3>
          <p>
            We collect localized coordinates (Latitude, Longitude) when you query specific satellite imagery or submit stubble burning status updates. This telemetry is anonymized and never shared with unauthorized registries.
          </p>

          <h3 className="font-display font-bold text-sm uppercase pt-2">2. Google OAuth Integration</h3>
          <p>
            We authenticate user sessions via Google OAuth API. We do not store your credentials. Google provides name, email address, and avatar indicators to render active view templates.
          </p>
        </div>

      </div>

      {/* Standalone Footer */}
      <div className="text-center text-[10px] text-text-muted uppercase tracking-widest mt-6">
        Powered by Google Earth Engine &bull; NASA FIRMS &bull; Climate TRACE
      </div>
    </div>
  );
}
