"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppLayout } from "./AppLayout";
import { 
  LucideLayoutDashboard, 
  LucideMap, 
  LucideCoins, 
  LucideLineChart, 
  LucideUsers, 
  LucideSparkles, 
  LucideSettings,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCheckSquare,
  LucideFileText,
  LucideActivity
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAppLayout();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
    { label: "Live Map", href: "/map", icon: LucideMap },
    { label: "Marketplace", href: "/marketplace", icon: LucideCoins },
    { label: "Analytics", href: "/analytics", icon: LucideLineChart },
    { label: "Community", href: "/community", icon: LucideUsers },
    { label: "Settings", href: "/settings", icon: LucideSettings }
  ];

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col bg-white border-r border-border min-h-screen relative overflow-hidden select-none"
      role="navigation"
      aria-label="Sidebar Navigation Menu"
    >
      {/* Sidebar Navigation Items */}
      <div className="flex-1 py-6 flex flex-col gap-1.5 px-3">
        {menuItems.map((item, index) => {
          // Check if active
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-smooth group ${
                isActive
                  ? "bg-[#DAEED2] text-text-deep border-l-4 border-text-deep"
                  : "text-text-muted hover:text-text-deep hover:bg-background/80"
              }`}
              aria-label={item.label}
            >
              <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
              
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.05 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Trigger Button */}
      <div className="p-4 border-t border-border flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg border border-border bg-background hover:bg-white text-text-muted hover:text-text-deep transition-smooth shadow-sm cursor-pointer"
          aria-label={isSidebarCollapsed ? "Expand sidebar Menu" : "Collapse sidebar Menu"}
        >
          {isSidebarCollapsed ? (
            <LucideChevronRight className="h-4 w-4" />
          ) : (
            <LucideChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
