"use client";

import React from "react";
import Link from "next/link";
import { LucideLeaf } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-border py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <LucideLeaf className="h-5 w-5 text-text-deep" />
          <span className="font-display tracking-tight text-md font-bold text-text-deep">EcoSphere</span>
          <span className="text-xs text-text-muted">© 2026 EcoSphere. All rights reserved.</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-text-muted">
          <Link href="/dashboard" className="hover:text-text-deep transition-smooth">Dashboard</Link>
          <Link href="/marketplace" className="hover:text-text-deep transition-smooth">Marketplace</Link>
          <Link href="/settings" className="hover:text-text-deep transition-smooth">Settings</Link>
          <Link href="/privacy" className="hover:text-text-deep transition-smooth">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-text-deep transition-smooth">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
