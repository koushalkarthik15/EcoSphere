"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/providers/AuthProvider";
import { useRole, UserRole } from "../../lib/providers/RoleProvider";
import { useCarbon } from "../../lib/providers/CarbonProvider";
import { 
  LucideLeaf, 
  LucideCoins, 
  LucideBell, 
  LucideChevronDown, 
  LucideSettings, 
  LucideLogOut,
  LucideUser
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { role, switchRole } = useRole();
  const { carbonBalance, marketplaceBalance } = useCarbon();
  const router = useRouter();
  const pathname = usePathname();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case "urban": return "🏢 Urban";
      case "farmer": return "🌾 Farmer";
      case "industry": return "🏭 Industry";
    }
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 w-full h-[72px] glassmorphism border-b border-border px-6 flex items-center justify-between transition-smooth select-none">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-text-deep font-bold text-lg focus:ring-2 focus:ring-text-deep/20 rounded px-1"
        >
          <LucideLeaf className="h-5 w-5 text-text-deep animate-pulse-slow" />
          <span className="font-display tracking-tight text-lg font-black">EcoSphere</span>
        </Link>
        <span className="hidden xl:inline text-[9px] text-text-muted border-l border-border pl-3 uppercase tracking-widest font-black">
          Carbon Intelligence Engine
        </span>
      </div>

      {/* Center: Switcher & Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
        {/* Segmented switcher */}
        <div className="flex items-center bg-[#DAEED2]/50 p-1 rounded-full border border-border">
          {(["urban", "farmer", "industry"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-smooth focus:outline-none focus:ring-1 focus:ring-text-deep/30 ${
                role === r
                  ? "bg-white text-text-deep shadow-sm"
                  : "text-text-muted hover:text-text-deep hover:bg-white/40"
              }`}
              aria-label={`Switch viewport to ${r} perspective`}
            >
              {getRoleLabel(r)}
            </button>
          ))}
        </div>


      </div>

      {/* Right: Weather, Notifications & Info */}
      <div className="flex items-center gap-4">




        {/* Credits & Coins */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1 bg-[#DAEED2]/40 border border-border px-2.5 py-1 rounded-full text-text-deep">
            <LucideLeaf className="h-3 w-3 text-telemetry-healthy" />
            <span>{carbonBalance.toFixed(1)} t</span>
          </div>

          <div className="flex items-center gap-1 bg-[#DAEED2]/40 border border-border px-2.5 py-1 rounded-full text-text-deep">
            <LucideCoins className="h-3 w-3 text-telemetry-warning" />
            <span>{marketplaceBalance}</span>
          </div>
        </div>

        <Link
          href="/marketplace"
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-smooth ${
            pathname === "/marketplace"
              ? "bg-text-deep text-white border-text-deep"
              : "border-text-deep text-text-deep hover:bg-text-deep hover:text-white"
          }`}
        >
          Marketplace
        </Link>

        {/* User profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1 bg-[#F6FAF4] hover:bg-white p-1 rounded-full border border-border transition-smooth focus:ring-2 focus:ring-text-deep/20"
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
            aria-label="User settings dropdown"
          >
            <img
              src={user.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=EcoUser"}
              alt=""
              className="w-6.5 h-6.5 rounded-full bg-border object-cover"
            />
            <LucideChevronDown className="h-3.5 w-3.5 text-text-muted pr-1" />
          </button>

          {profileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setProfileDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border rounded-xl shadow-xl py-1 z-40 animate-fade-in text-xs font-semibold">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-[10px] text-text-muted font-bold uppercase">Logged in as</p>
                  <p className="text-text-deep font-bold truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#F6FAF4] text-text-deep"
                >
                  <LucideUser className="h-3.5 w-3.5 text-text-muted" />
                  <span>My Profile</span>
                </Link>
                <hr className="border-border my-1" />
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-telemetry-critical hover:bg-red-50 text-left transition-smooth cursor-pointer"
                >
                  <LucideLogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
