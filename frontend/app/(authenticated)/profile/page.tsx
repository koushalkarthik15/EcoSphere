"use client";

import React from "react";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { Card } from "../../../components/ui/Card";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { ProfileCard } from "../../../components/ui/ProfileCard";

export default function ProfilePage() {
  const { user, mode } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="👤 User Profile"
        description="Verify your authenticated identity and active roles settings."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <Card title="Account Credentials metadata" description="Minimum profile metadata stored securely. No passwords or credentials.">
            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-1 border-b border-border pb-3">
                <span className="font-semibold text-text-muted">Unique ID</span>
                <span className="font-mono text-text-deep">{user.id}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-border pb-3">
                <span className="font-semibold text-text-muted">Full Name</span>
                <span className="text-text-deep font-bold">{user.name}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-border pb-3">
                <span className="font-semibold text-text-muted">Email Address</span>
                <span className="text-text-deep font-semibold">{user.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text-muted">Authentication Mode</span>
                {mode === "google" && (
                  <span className="text-telemetry-healthy font-bold">✓ Verified via Google OAuth 2.0 Identity Token</span>
                )}
                {mode === "local" && (
                  <span className="text-[#2E7D32] font-bold">✓ Authenticated via EcoSphere Local Account</span>
                )}
                {mode === "demo" && (
                  <span className="text-amber-600 font-bold">⚠ Temporary Demo Mode Session</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
