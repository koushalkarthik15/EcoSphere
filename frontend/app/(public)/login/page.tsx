"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { 
  LucideLeaf, 
  LucideLock, 
  LucideMail,
  LucideGlobe, 
  LucideFlame, 
  LucideActivity, 
  LucideArrowRight,
  LucideAlertCircle
} from "lucide-react";

export default function LoginPage() {
  const { login, loginDemo, loginLocal, isLoading } = useAuth();
  const router = useRouter();
  
  // Local login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Demo mode active selection
  const [demoRole, setDemoRole] = useState<"urban" | "farmer" | "industry">("urban");
  
  // Error handling
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if Google Client ID is configured
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = !!googleClientId && googleClientId !== "dummy_client_id" && googleClientId !== "";

  const handleDemoLogin = async () => {
    setAuthError(null);
    try {
      await loginDemo(demoRole);
      router.push("/dashboard");
    } catch (e: any) {
      setAuthError(e.message || "Failed to launch Demo Mode.");
    }
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }
    try {
      await loginLocal(email, password, rememberMe);
      router.push("/dashboard");
    } catch (e: any) {
      setAuthError(e.message || "Failed to authenticate. Verify credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      // Execute the existing mock or configured Google login flow
      await login("mock_google_id_token_karthik");
      router.push("/dashboard");
    } catch (e: any) {
      setAuthError(e.message || "Failed Google authentication.");
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

        {/* Right Side: Authentication Panel */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#DAEED2] p-1.5 rounded-lg text-text-deep">
                <LucideLeaf className="h-4.5 w-4.5 text-text-deep" />
              </div>
              <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">
                Carbon Intelligence Engine
              </span>
            </div>

            <h1 className="font-display font-black text-2xl lg:text-3xl text-text-deep leading-tight">
              Environmental Intelligence<br />for a Sustainable Future
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              AI-powered satellite intelligence, carbon monitoring, and environmental analytics.
            </p>
          </div>

          {/* Authentication Container */}
          <div className="my-6 space-y-6">
            
            {/* 1. PRIMARY: Explore Demo */}
            <div className="border border-[#DCEED2] bg-[#F6FAF4] rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#2E7D32] flex items-center gap-1.5">
                  <span>🚀 Primary: Explore Demo</span>
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">No registration required. Select a profile and explore immediately.</p>
              </div>

              {/* Demo Role Selectors */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "urban", label: "🏢 Urban", desc: "Citizen metrics" },
                  { id: "farmer", label: "🌾 Farmer", desc: "Soil & fire data" },
                  { id: "industry", label: "🏭 Industry", desc: "Gas emissions" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDemoRole(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-smooth focus:outline-none flex flex-col items-center justify-center cursor-pointer ${
                      demoRole === item.id 
                        ? "bg-white border-[#2E7D32] text-text-deep shadow-xs" 
                        : "bg-transparent border-[#E6EFE3] hover:bg-white/60 text-text-muted"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[8px] mt-0.5 opacity-80 block leading-tight">{item.desc}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Launch Demo Environment</span>
                <LucideArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#E6EFE3]"></div>
              <span className="flex-shrink mx-4 text-[9px] text-text-muted/60 font-black uppercase tracking-wider">Or continue with credentials</span>
              <div className="flex-grow border-t border-[#E6EFE3]"></div>
            </div>

            {/* 2. SECONDARY: EcoSphere Account Login */}
            <form onSubmit={handleLocalLogin} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <LucideMail className="h-4 w-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-text-deep" htmlFor="login-password">
                    Password
                  </label>
                  <a href="#" className="text-[10px] text-[#2E7D32] hover:underline font-bold" onClick={(e) => { e.preventDefault(); alert("Local password recovery is disabled in sandbox."); }}>
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <LucideLock className="h-4 w-4" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F6FAF4] border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-deep font-semibold">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#C8E6C9] text-[#2E7D32] focus:ring-[#2E7D32]/20 cursor-pointer w-4 h-4"
                  />
                  Remember Session
                </label>
                <Link href="/signup" className="text-[#2E7D32] hover:underline font-bold">
                  Create local account
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 border-2 border-[#2E7D32] hover:bg-[#F6FAF4] text-[#2E7D32] font-black text-xs rounded-full transition-smooth cursor-pointer disabled:opacity-50"
              >
                Sign In with EcoSphere Account
              </button>
            </form>

            {/* 3. TERTIARY: Google OAuth Fallback */}
            <div className="pt-2">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-3 py-3 px-4 border border-border text-text-deep font-bold rounded-full bg-white hover:bg-neutral-50 transition-smooth focus:outline-none cursor-pointer text-xs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google Login (Optional)</span>
              </button>

              {!isGoogleConfigured && (
                <div className="mt-2.5 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] rounded-xl flex items-start gap-2 leading-relaxed">
                  <LucideAlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Google Client ID is missing.</span> Standard OAuth triggers are offline, but application remains fully functional via simulated local/sandbox profiles.
                  </div>
                </div>
              )}
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] rounded-xl text-center font-bold">
                {authError}
              </div>
            )}

            {/* Audit Gateway Details */}
            <div className="bg-[#F6FAF4] p-3 rounded-2xl border border-[#E6EFE3] space-y-2">
              <span className="text-[9px] font-black uppercase text-text-muted tracking-wider block">
                Audited & Integrated Providers
              </span>
              <div className="flex flex-wrap items-center gap-3.5 text-[9px] font-black uppercase text-text-deep/80">
                <span className="flex items-center gap-1"><LucideGlobe className="h-3.5 w-3.5 text-[#2E7D32]" /> Google Earth Engine</span>
                <span className="flex items-center gap-1"><LucideFlame className="h-3.5 w-3.5 text-red-600" /> NASA FIRMS</span>
                <span className="flex items-center gap-1"><LucideActivity className="h-3.5 w-3.5 text-[#81D4FA]" /> Climate TRACE</span>
              </div>
            </div>

          </div>

          {/* Footer links */}
          <div className="border-t border-[#E6EFE3] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-text-muted font-bold uppercase tracking-wider">
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-text-deep transition-smooth">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-text-deep transition-smooth">Terms of Service</Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
