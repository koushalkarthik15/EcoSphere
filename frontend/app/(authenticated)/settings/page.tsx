"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { LucideUser, LucideShield, LucideBell, LucideDownload, LucideActivity, LucideInfo } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="⚙️ Platform Settings"
        description="Manage your account preferences and API integrations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="User Profile" description="Manage personal information.">
          <div className="flex items-center gap-3 mt-4 text-xs">
            <LucideUser className="h-5 w-5 text-text-muted" />
            <button className="bg-border hover:bg-border/80 px-4 py-2 rounded-lg font-semibold transition-smooth text-text-deep">
              Edit Profile (Coming Soon)
            </button>
          </div>
        </Card>

        <Card title="Account & Security" description="Manage passwords and 2FA.">
          <div className="flex items-center gap-3 mt-4 text-xs">
            <LucideShield className="h-5 w-5 text-text-muted" />
            <button className="bg-border hover:bg-border/80 px-4 py-2 rounded-lg font-semibold transition-smooth text-text-deep">
              Security Settings (Coming Soon)
            </button>
          </div>
        </Card>

        <Card title="Notifications" description="Configure alert preferences.">
          <div className="flex items-center gap-3 mt-4 text-xs">
            <LucideBell className="h-5 w-5 text-text-muted" />
            <button className="bg-border hover:bg-border/80 px-4 py-2 rounded-lg font-semibold transition-smooth text-text-deep">
              Notification Preferences (Coming Soon)
            </button>
          </div>
        </Card>

        <Card title="Export Data" description="Download all historical records.">
          <div className="flex items-center gap-3 mt-4 text-xs">
            <LucideDownload className="h-5 w-5 text-text-muted" />
            <button className="bg-border hover:bg-border/80 px-4 py-2 rounded-lg font-semibold transition-smooth text-text-deep">
              Request Archive (Coming Soon)
            </button>
          </div>
        </Card>

        <Card title="API Status" description="Review active API endpoints mapping.">
          <div className="space-y-3 mt-4 text-xs">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-semibold text-text-muted flex items-center gap-1.5"><LucideActivity className="h-3.5 w-3.5" /> Google Maps Client:</span>
              <span className="font-mono text-[10px] text-text-deep bg-[#DAEED2] px-2 py-0.5 rounded">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Loaded" : "Mocked Offline"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-semibold text-text-muted flex items-center gap-1.5"><LucideActivity className="h-3.5 w-3.5" /> Copernicus Sentinel Hub:</span>
              <span className="font-mono text-[10px] text-text-deep bg-[#DAEED2] px-2 py-0.5 rounded">Active Endpoint</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-text-muted flex items-center gap-1.5"><LucideActivity className="h-3.5 w-3.5" /> NASA FIRMS Services:</span>
              <span className="font-mono text-[10px] text-text-deep bg-[#DAEED2] px-2 py-0.5 rounded">Active Endpoint</span>
            </div>
          </div>
        </Card>

        <Card title="About EcoSphere" description="System information.">
          <div className="flex items-center gap-3 mt-4 text-xs">
            <LucideInfo className="h-5 w-5 text-text-muted" />
            <div className="text-text-muted">
              <p className="font-bold text-text-deep">Version 1.0.0 (Submission Ready)</p>
              <p>Designed for PromptWars.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
