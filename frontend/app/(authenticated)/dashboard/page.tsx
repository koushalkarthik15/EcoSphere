"use client";

import React from "react";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { useRole } from "../../../lib/providers/RoleProvider";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { GoogleMapContainer } from "../../../components/ui/GoogleMapContainer";
import { Card } from "../../../components/ui/Card";
import { MetricCard } from "../../../components/ui/MetricCard";
import { StatBadge } from "../../../components/ui/StatBadge";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { UrbanDashboard } from "../../../features/urban/components/UrbanDashboard";
import { FarmerDashboard } from "../../../features/farmer/components/FarmerDashboard";
import { IndustryDashboard } from "../../../features/industry/components/IndustryDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const { currentLocation, mapBounds } = useTelemetry();

  const renderDashboardView = () => {
    switch (role) {
      case "urban":
        return <UrbanDashboard />;
      case "farmer":
        return <FarmerDashboard />;
      case "industry":
        return <IndustryDashboard />;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome metadata bar */}
      <div className="bg-[#DAEED2]/30 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={user.avatar} className="w-10 h-10 rounded-full border border-border" alt="" />
          <div>
            <h2 className="text-sm font-bold text-text-deep">Hello, {user.name}!</h2>
            <p className="text-[10px] text-text-muted">EcoSphere account ID: {user.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatBadge label="Role" value={role.toUpperCase()} type="info" />
          <StatBadge label="Coordinates" value={`${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`} type="success" />
        </div>
      </div>

      {renderDashboardView()}
    </div>
  );
}
