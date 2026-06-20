"use client";

import React from "react";
import { useRole, UserRole } from "../../lib/providers/RoleProvider";

interface RoleSwitcherProps {
  className?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ className = "" }) => {
  const { role, switchRole } = useRole();

  const options: { value: UserRole; label: string }[] = [
    { value: "urban", label: "🏢 Urban Citizen" },
    { value: "farmer", label: "🌾 Farmer" },
    { value: "industry", label: "🏭 Industry" },
  ];

  return (
    <div className={`flex flex-col sm:flex-row gap-2 bg-[#DAEED2]/30 p-2 rounded-xl border border-border ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => switchRole(opt.value)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-smooth text-center focus:outline-none focus:ring-2 focus:ring-text-deep/20 ${
            role === opt.value
              ? "bg-white text-text-deep shadow-sm border border-border"
              : "text-text-muted hover:text-text-deep hover:bg-white/50"
          }`}
          aria-label={`Switch active profile to ${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
export default RoleSwitcher;
