"use client";

import React from "react";
import { useAuth } from "../../lib/providers/AuthProvider";

export const ProfileCard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-4 transition-smooth hover:shadow-md">
      <img
        src={user.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=EcoUser"}
        alt={`${user.name}'s Profile avatar`}
        className="w-20 h-20 rounded-full border border-border shadow-inner"
      />
      <div>
        <h3 className="font-display text-lg font-black text-text-deep tracking-tight">{user.name}</h3>
        <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
      </div>
      <div className="w-full bg-[#F1F8E9] px-4 py-2.5 rounded-lg border border-border text-center">
        <span className="text-[10px] uppercase font-bold text-text-muted block">Active Persona Role</span>
        <span className="text-xs font-black text-text-deep uppercase mt-0.5 block">{user.selectedRole}</span>
      </div>
    </div>
  );
};
export default ProfileCard;
