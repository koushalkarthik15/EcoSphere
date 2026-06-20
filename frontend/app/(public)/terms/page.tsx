"use client";

import React from "react";
import Link from "next/link";
import { LucideLeaf, LucideChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white border border-border p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Brand identity header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <Link href="/login" className="flex items-center gap-2 text-text-deep font-bold hover:opacity-80 transition-smooth">
            <LucideChevronLeft className="h-4 w-4" />
            <span className="text-xs uppercase font-black">Back </span>
          </Link>
          <div className="flex items-center gap-2 text-text-deep font-bold text-sm">
            <LucideLeaf className="h-4 w-4" />
            <span className="font-display font-black">EcoSphere</span>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-text-deep">
          <h1 className="font-display text-2xl font-extrabold tracking-tight border-b border-border/40 pb-2">
            Terms of Service
          </h1>
          <p className="font-semibold text-text-muted">Last Updated: June 20, 2026</p>
          
          <p>
            Welcome to the EcoSphere platform. By accessing or trading environmental credits on our carbon marketplace, you agree to comply with and be bound by the following terms of service.
          </p>

          <h3 className="font-display font-bold text-sm uppercase pt-2">1. Authenticity of Credits</h3>
          <p>
            Every farmer carbon listing published is subjected to telemetry analysis using Google Earth Engine, NASA FIRMS fire markers, and Climate TRACE models. Any submission containing falsified zero-till statements will trigger lock protocols on coin rewards.
          </p>

          <h3 className="font-display font-bold text-sm uppercase pt-2">2. Google Pay Sandbox</h3>
          <p>
            All marketplace trades operate in Google Pay Sandbox simulator. Real funds are never exchanged. EcoCoins and EcoCredits accumulate dynamically on mock database ledgers.
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
