"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { 
  LucideLeaf, 
  LucideLock, 
  LucideMail,
  LucideUser,
  LucideGlobe, 
  LucideFlame, 
  LucideActivity, 
  LucideArrowRight,
  LucideCheckCircle
} from "lucide-react";

export default function SignupPage() {
  const { registerLocal, isLoading } = useAuth();
  const router = useRouter();
  
  // Fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredRole, setPreferredRole] = useState<"urban" | "farmer" | "industry">("urban");

  // Error/Success state
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setAuthError("Please fill in all details.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    try {
      await registerLocal(name, email, password, preferredRole);
      setSuccessMsg("Account successfully registered! Redirecting to login...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (e: any) {
      setAuthError(e.message || "Failed to register local account.");
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 relative overflow-hidden select-none bg-[#F6FAF4] min-h-screen">
      
      {/* Subtle organic background gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#2E7D32]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-[#81D4FA]/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Responsive Card */}
      <div className="w-full max-w-6xl bg-white border border-[#E6EFE3] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-[640px]">
        
        {/* Left Side: Illustration & Editorial Branding */}
        <div className="w-full lg:w-1/2 bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[350px] lg:min-h-full">
          {/* Abstract SVG overlay grid */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <LucideLeaf className="h-6 w-6 text-[#81D4FA] animate-pulse-slow" />
            <span className="font-display font-black tracking-tight text-lg">EcoSphere</span>
          </div>

          {/* Premium illustration SVG */}
          <div className="relative z-10 py-6 flex justify-center items-center">
            <svg viewBox="0 0 400 300" className="w-full max-w-[320px] drop-shadow-2xl" aria-hidden="true">
              <circle cx="200" cy="150" r="85" fill="#81D4FA" opacity="0.85" />
              <path d="M150,110 Q190,140 180,180 T250,220 Q285,150 250,115 Z" fill="#66BB6A" opacity="0.9" />
              <path d="M130,160 Q170,180 160,205 T200,225" fill="none" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" />
              
              <polygon points="120,235 170,135 220,235" fill="#1B5E20" opacity="0.85" />
              <polygon points="175,235 225,120 275,235" fill="#2E7D32" opacity="0.9" />
              
              <polygon points="152,170 170,135 188,170 178,162 170,170 162,162" fill="white" />
              <polygon points="207,160 225,120 243,160 234,152 225,160 216,152" fill="white" />

              <polygon points="100,235 115,200 130,235" fill="#1B5E20" />
              <polygon points="108,235 120,190 132,235" fill="#2E7D32" />
              <polygon points="265,235 280,195 295,235" fill="#1B5E20" />
              <polygon points="278,235 290,185 302,235" fill="#2E7D32" />

              <ellipse cx="200" cy="150" rx="140" ry="50" fill="none" stroke="#81D4FA" strokeWidth="2" strokeDasharray="6,4" className="animate-spin-slow" style={{ transformOrigin: "200px 150px" }} />
              <g transform="translate(320, 125)">
                <rect x="-12" y="-6" width="24" height="12" rx="2" fill="#FFFFFF" />
                <line x1="-18" y1="0" x2="-12" y2="0" stroke="white" strokeWidth="2" />
                <line x1="12" y1="0" x2="18" y2="0" stroke="white" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#81D4FA" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#81D4FA] block">
              Google Earth Engine Telemetry Layer
            </span>
            <p className="text-xs text-[#E6EFE3] leading-relaxed max-w-sm">
              Secured satellite intelligence monitoring stubble carbon burns, crop heat stress, and industrial spectrometer gas audits.
            </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#DAEED2] p-1.5 rounded-lg text-text-deep">
                <LucideLeaf className="h-4.5 w-4.5 text-text-deep" />
              </div>
              <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">
                Carbon Registration
              </span>
            </div>

            <h1 className="font-display font-black text-2xl lg:text-3xl text-text-deep leading-tight">
              Create Local Account
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Register a secure profile to track emissions, verify offsets, and trade carbon credits locally.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="my-6 space-y-4">
            
            {/* Preferred Role Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-text-deep">
                Preferred Workspace Role
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "urban", label: "🏢 Urban Citizen" },
                  { id: "farmer", label: "🌾 Farmer" },
                  { id: "industry", label: "🏭 Industry" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferredRole(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-smooth focus:outline-none flex flex-col items-center justify-center cursor-pointer ${
                      preferredRole === item.id 
                        ? "bg-[#F6FAF4] border-[#2E7D32] text-text-deep shadow-xs font-bold" 
                        : "bg-white border-[#E6EFE3] hover:bg-neutral-50 text-text-muted"
                    }`}
                  >
                    <span className="text-[11px] block">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="reg-name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <LucideUser className="h-4 w-4" />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <LucideMail className="h-4 w-4" />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="reg-password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <LucideLock className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <LucideLock className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                  />
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] rounded-xl text-center font-bold">
                {authError}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-[#2E7D32] text-[11px] rounded-xl text-center font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <LucideCheckCircle className="h-4 w-4 text-[#2E7D32]" />
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Create Account</span>
              <LucideArrowRight className="h-3.5 w-3.5" />
            </button>
            
            <div className="text-center text-xs font-bold text-text-muted pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2E7D32] hover:underline">
                Sign In
              </Link>
            </div>
          </form>

          {/* Footer links */}
          <div className="border-t border-[#E6EFE3] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-text-muted font-bold uppercase tracking-wider">
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-text-deep transition-smooth">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-text-deep transition-smooth">Terms of Service</Link>
            </div>
            <a 
              href="https://promptwars.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[9px] text-[#2E7D32] bg-[#DAEED2] px-2 py-0.5 rounded-full"
            >
              PromptWars Challenge
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
