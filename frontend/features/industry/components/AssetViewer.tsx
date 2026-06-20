"use client";

import React from "react";
import { Card } from "../../../components/ui/Card";
import { LucideBuilding2, LucideWarehouse, LucideContainer, LucideWrench, LucideNavigation } from "lucide-react";

interface Asset {
  name: string;
  type: string; // "factory", "warehouse", "admin", "storage_tanks", "loading_bay"
  polygon: any[];
}

interface AssetViewerProps {
  assets: Asset[];
  className?: string;
}

export const AssetViewer: React.FC<AssetViewerProps> = ({
  assets,
  className = ""
}) => {
  const getAssetIcon = (type: string) => {
    switch (type) {
      case "factory":
        return <LucideWrench className="h-4 w-4 text-[#2E7D32]" />;
      case "warehouse":
        return <LucideWarehouse className="h-4 w-4 text-[#66BB6A]" />;
      case "admin":
        return <LucideBuilding2 className="h-4 w-4 text-text-deep" />;
      case "storage_tanks":
        return <LucideContainer className="h-4 w-4 text-telemetry-warning" />;
      default:
        return <LucideNavigation className="h-4 w-4 text-text-muted" />;
    }
  };

  return (
    <Card title="🏭 Facility Asset Inventory" description="Registered structures monitored by spatial polygon layers." className={className}>
      <div className="space-y-3">
        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-border">
          {assets.map((asset, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-[#F1F8E9]/50 border border-border rounded-xl hover:bg-white hover:shadow-sm transition-smooth cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-lg border border-border/80 shadow-xs">
                  {getAssetIcon(asset.type)}
                </div>
                <div>
                  <span className="text-xs font-bold text-text-deep block leading-tight">{asset.name}</span>
                  <span className="text-[9px] text-text-muted capitalize font-semibold">{asset.type.replace("_", " ")}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-text-muted bg-white border border-border/60 px-1.5 py-0.5 rounded shadow-2xs font-bold">
                  {asset.polygon.length} Vertices
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed font-medium">
          Note: Rooftop boundaries of all storage blocks are active candidates for solar panel ROI analysis overlay views.
        </p>
      </div>
    </Card>
  );
};

export default AssetViewer;
