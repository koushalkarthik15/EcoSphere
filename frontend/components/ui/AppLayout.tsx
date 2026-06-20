"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { AssistantPanel } from "./AssistantPanel";
import { Footer } from "./Footer";
import { useAuth } from "../../lib/providers/AuthProvider";
import { useRole, UserRole } from "../../lib/providers/RoleProvider";
import { LucideAlertTriangle, LucideLogOut, LucideUserCheck } from "lucide-react";

interface AppLayoutContextType {
  isSidebarCollapsed: boolean;
  isAssistantOpen: boolean;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
}

const AppLayoutContext = createContext<AppLayoutContextType | undefined>(undefined);

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const { mode, logout } = useAuth();
  const { role, switchRole } = useRole();

  // Responsive defaults: collapse panels on smaller screens
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsAssistantOpen(false);
          setIsSidebarCollapsed(true);
        } else {
          setIsAssistantOpen(true);
          setIsSidebarCollapsed(false);
        }
      };
      
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleAssistant = () => setIsAssistantOpen((prev) => !prev);

  return (
    <AppLayoutContext.Provider
      value={{
        isSidebarCollapsed,
        isAssistantOpen,
        toggleSidebar,
        toggleAssistant,
        setAssistantOpen: setIsAssistantOpen
      }}
    >
      <div className="min-h-screen flex flex-col bg-background text-text-deep">
        {/* Sticky Header */}
        <Navbar />

        {/* Master Shell container offset by 72px navbar */}
        <div className="flex-1 flex flex-col w-full relative pt-[72px]">
          
          {/* Demo Mode Sticky Warning Sub-Banner */}
          {mode === "demo" && (
            <div className="w-full bg-[#E8F5E9] border-b border-[#C8E6C9] py-2 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2E7D32] font-semibold z-35 animate-fade-in">
              <div className="flex items-center gap-2">
                <LucideAlertTriangle className="h-4 w-4 text-[#2E7D32] animate-bounce-slow" />
                <span>
                  <strong className="font-extrabold uppercase tracking-wide text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded mr-2">
                    Demo Mode
                  </strong>
                  Environmental telemetry displayed is simulated for demonstration purposes.
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Switch Role Quick Dropdown */}
                <div className="flex items-center gap-1.5 bg-white border border-[#C8E6C9] rounded-lg px-2.5 py-1">
                  <LucideUserCheck className="h-3.5 w-3.5" />
                  <label htmlFor="demo-role-select" className="text-[10px] uppercase font-bold text-text-muted">Role:</label>
                  <select
                    id="demo-role-select"
                    value={role || "urban"}
                    onChange={(e) => switchRole(e.target.value as UserRole)}
                    className="bg-transparent font-bold border-none outline-none text-[#2E7D32] text-xs cursor-pointer"
                  >
                    <option value="urban">🏢 Urban Citizen</option>
                    <option value="farmer">🌾 Farmer</option>
                    <option value="industry">🏭 Industry</option>
                  </select>
                </div>

                {/* Exit Demo Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-smooth cursor-pointer shadow-xs"
                >
                  <LucideLogOut className="h-3 w-3" />
                  <span>Exit Demo</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex w-full relative">
            {/* Collapsible Left Sidebar */}
            <Sidebar />

            {/* Center viewport */}
            <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
              <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col gap-6 overflow-x-hidden">
                {children}
              </main>
              
              <Footer />
            </div>

            {/* Right intelligent AI Assistant panel */}
            <AssistantPanel />
          </div>
        </div>
      </div>
    </AppLayoutContext.Provider>
  );
};

export const useAppLayout = () => {
  const context = useContext(AppLayoutContext);
  if (!context) {
    throw new Error("useAppLayout must be used within an AppLayout provider");
  }
  return context;
};
