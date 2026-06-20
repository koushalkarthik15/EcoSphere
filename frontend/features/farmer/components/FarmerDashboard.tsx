"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { FarmSelector } from "./FarmSelector";
import { FieldCard } from "./FieldCard";
import { ParcelStatistics } from "./ParcelStatistics";
import { NDVICard } from "./NDVICard";
import { MoistureCard } from "./MoistureCard";
import { FireAlertCard } from "./FireAlertCard";
import { CarbonLedgerCard } from "./CarbonLedgerCard";
import { VerificationCard } from "./VerificationCard";
import { SoilHealthGauge } from "./SoilHealthGauge";
import { TelemetryTimeline } from "./TelemetryTimeline";
import { CreditProgressCard } from "./CreditProgressCard";
import { LedgerDock } from "./LedgerDock";
import dynamic from "next/dynamic";
const FarmerGoogleMap = dynamic(() => import("./FarmerGoogleMap").then(mod => mod.FarmerGoogleMap), { 
  ssr: false, 
  loading: () => <div className="w-full h-[450px] flex items-center justify-center bg-[#F6FAF4] text-text-muted text-xs font-bold uppercase tracking-wider animate-pulse rounded-xl border border-border">Loading Live Map Engine...</div> 
});
import type { SatelliteLayer } from "./FarmerGoogleMap";
import { HeroSection } from "../../../components/ui/HeroSection";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { FARMER_DEMO_DATA } from "../../../lib/demoData";
import { downloadCSV, downloadJSON, downloadPDF } from "../../../lib/exportUtils";

export const FarmerDashboard: React.FC = () => {
  const { currentLocation } = useTelemetry();
  const { mode } = useAuth();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeLayer, setActiveLayer] = useState<SatelliteLayer>("ndvi");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);

  // Field specific state
  const [satelliteData, setSatelliteData] = useState<any>(null);
  const [fireData, setFireData] = useState<any>(null);
  const [carbonLedger, setCarbonLedger] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>(null);

  // Main Dashboard Data Fetching (Summary + Notifications)
  const fetchInitialData = async () => {
    setLoading(true);
    if (mode === "demo") {
      setSummaryData(FARMER_DEMO_DATA.summary);
      setFields(FARMER_DEMO_DATA.summary.fields || []);
      if (FARMER_DEMO_DATA.summary.fields && FARMER_DEMO_DATA.summary.fields.length > 0) {
        setSelectedId(FARMER_DEMO_DATA.summary.fields[0].id);
      }
      setNotifications(FARMER_DEMO_DATA.notifications);
      setLoading(false);
      return;
    }
    
    try {
      // 1. Fetch Farmer Summary
      const summaryRes = await fetch("http://localhost:8000/api/v1/farmer/summary", {
        credentials: "include"
      });
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummaryData(data);
        setFields(data.fields || []);
        if (data.fields && data.fields.length > 0) {
          setSelectedId(data.fields[0].id);
        }
      } else {
        throw new Error("Summary API error");
      }

      // 2. Fetch Notifications
      const notifRes = await fetch("http://localhost:8000/api/v1/farmer/notifications", {
        credentials: "include"
      });
      if (notifRes.ok) {
        const notifs = await notifRes.json();
        setNotifications(notifs);
      }
    } catch (err) {
      console.warn("Failed to fetch initial farmer dashboard data, using offline fallback:", err);
      // Fallback fields and summary data
      const mockFields = [
        {
          id: "field_a",
          name: "Punjab Field A (Wheat crop)",
          crop_type: "Wheat",
          practice: "conservation",
          acreage: 12.5,
          polygon: [
            { lat: 31.6380, lng: 74.8650 },
            { lat: 31.6420, lng: 74.8650 },
            { lat: 31.6420, lng: 74.8710 },
            { lat: 31.6380, lng: 74.8710 }
          ],
          mean_ndvi: 0.72,
          soil_moisture_pct: 45.2,
          days_active: 120
        },
        {
          id: "field_b",
          name: "Punjab Field B (Rice paddies)",
          crop_type: "Rice",
          practice: "conventional",
          acreage: 8.0,
          polygon: [
            { lat: 31.6300, lng: 74.8750 },
            { lat: 31.6350, lng: 74.8750 },
            { lat: 31.6350, lng: 74.8820 },
            { lat: 31.6300, lng: 74.8820 }
          ],
          mean_ndvi: 0.38,
          soil_moisture_pct: 28.5,
          days_active: 90
        }
      ];

      const mockSummary = {
        fields: mockFields,
        total_acreage: 20.5,
        total_verified_credits: 240.5,
        total_pending_credits: 12.0,
        sequestration_goal_pct: 82.5
      };

      const mockNotifs = [
        {
          id: "notif_1",
          type: "fire_hazard",
          title: "🔥 Stubble Burn Risk Alert",
          message: "NASA FIRMS coordinates report fire thermal anomalies 1.5km south-east of Field A boundary.",
          timestamp: "10 minutes ago"
        },
        {
          id: "notif_2",
          type: "moisture_warning",
          title: "💧 Low Soil Moisture Warn",
          message: "Sentinel-1 moisture indexes for Field B dropped below 30%. Irrigation recommended.",
          timestamp: "1 hour ago"
        }
      ];

      setSummaryData(mockSummary);
      setFields(mockFields);
      setSelectedId(mockFields[0].id);
      setNotifications(mockNotifs);
    } finally {
      setLoading(false);
    }
  };

  // Field Specific Data Fetching
  const fetchFieldData = async (fieldId: string) => {
    if (!fieldId) return;
    if (mode === "demo") {
      const key = fieldId === "field_demo_a" ? "field_demo_a" : "field_demo_b";
      setSatelliteData(FARMER_DEMO_DATA.satellite_analysis[key] || null);
      setFireData(FARMER_DEMO_DATA.fire_detection[key] || null);
      setCarbonLedger(FARMER_DEMO_DATA.carbon_ledger[key] || null);
      setVerificationData(FARMER_DEMO_DATA.credit_verification[key] || null);
      return;
    }

    try {
      const payload = { field_id: fieldId };

      // 1. Fetch satellite analysis
      const satRes = await fetch("http://localhost:8000/api/v1/farmer/satellite-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (satRes.ok) {
        setSatelliteData(await satRes.json());
      }

      // 2. Fetch fire detection
      const fireRes = await fetch("http://localhost:8000/api/v1/farmer/fire-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (fireRes.ok) {
        setFireData(await fireRes.json());
      }

      // 3. Fetch carbon calculations ledger
      const ledgerRes = await fetch("http://localhost:8000/api/v1/farmer/carbon-ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (ledgerRes.ok) {
        setCarbonLedger(await ledgerRes.json());
      }

      // 4. Fetch credits eligibility
      const creditRes = await fetch("http://localhost:8000/api/v1/farmer/credit-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (creditRes.ok) {
        setVerificationData(await creditRes.json());
      }
    } catch (err) {
      console.warn(`Failed to fetch field telemetry for ${fieldId}, loading mock offline metrics:`, err);
      // Construct fallback values
      const isFieldA = fieldId === "field_a";
      
      const mockSat = {
        field_id: fieldId,
        ndvi: isFieldA ? 0.72 : 0.38,
        soil_moisture_pct: isFieldA ? 45.2 : 28.5,
        biomass_score: isFieldA ? 0.83 : 0.44,
        carbon_estimate_tons: isFieldA ? 1.54 : 0.08,
        confidence_score: isFieldA ? 92.5 : 88.0
      };

      const mockFire = {
        status: "SAFE",
        field_id: fieldId,
        active_burns_detected: 0,
        severity: "NONE",
        affected_area_percentage: 0.0,
        estimated_carbon_loss_tons: 0.0,
        alert_timestamp: null
      };

      const mockLedger = {
        estimated_storage_tons: isFieldA ? 562.5 : 360.0,
        sequestration_rate_annual_tons: isFieldA ? 0.375 : 0.04,
        season_gain_tons: isFieldA ? 1.54 : 0.08,
        annual_projection_tons: isFieldA ? 4.69 : 0.32,
        soil_health_score: isFieldA ? 85 : 42,
        biomass_trend: isFieldA ? "Robust Growth" : "Sparse Canopy",
        explanation: isFieldA
          ? "Calculated for a 12.5-acre Punjab Field A using conservation farming practices. Seasonal sequestration rate factors optimized due to dense vegetation cover and active irrigation management."
          : "Calculated for a 8.0-acre Punjab Field B using conventional farming practices. Base sequestration factors reduced due to dry topsoil conditions and stubble residue harvesting."
      };

      const mockVerify = {
        field_id: fieldId,
        verification_status: isFieldA ? "VERIFIED" : "PENDING",
        details: {
          status: isFieldA ? "VERIFIED" : "PENDING",
          verified_credits: isFieldA ? 1.54 : 0.0,
          pending_credits: isFieldA ? 0.0 : 0.08,
          rejected_credits: 0.0,
          verification_reason: isFieldA
            ? "All telemetry and conservation practice criteria satisfied. Carbon credits verified for ledger inclusion."
            : "Conventional farming practices detected. Soil credit auditing requires satellite soil tillage validation."
        }
      };

      setSatelliteData(mockSat);
      setFireData(mockFire);
      setCarbonLedger(mockLedger);
      setVerificationData(mockVerify);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchFieldData(selectedId);
    }
  }, [selectedId]);

  const handleExportLedger = async (format: "csv" | "json" | "pdf" = "csv"): Promise<any> => {
    try {
      const exportData = fields.map(f => ({
        "Field ID": f.id,
        "Name": f.name,
        "Crop Type": f.crop_type,
        "Practice": f.practice,
        "Acreage": f.acreage,
        "Mean NDVI": f.mean_ndvi,
        "Soil Moisture %": f.soil_moisture_pct,
        "Timestamp": new Date().toISOString()
      }));

      const title = "EcoSphere_Farmer_Ledger";

      if (format === "csv") downloadCSV(exportData, title);
      else if (format === "json") downloadJSON(exportData, title);
      else if (format === "pdf") downloadPDF(exportData, title);

      return { success: true };
    } catch (err) {
      console.warn("Export failed:", err);
      return { success: false };
    }
  };

  const handleFieldChange = (id: string) => {
    setSelectedId(id);
    const chosenField = fields.find((f) => f.id === id);
    if (chosenField) {
      addToast(`Selected field parcel: ${chosenField.name}. Loading radar and telemetry data.`, "success");
    }
  };

  const handleLayerChange = (layer: SatelliteLayer) => {
    setActiveLayer(layer);
    addToast(`Satellite view layer: ${layer.toUpperCase()} visual overlay loaded.`, "info");
  };

  if (loading) {
    return <LoadingScreen message="Loading EcoSphere AgriCarbon & Soil-Sink Ledger..." />;
  }

  // Get active field info
  const activeField = fields.find((f) => f.id === selectedId) || fields[0];

  // Default values to prevent rendering crashes
  const verifiedCreditsTotal = summaryData?.total_verified_credits ?? 240.5;
  const pendingCreditsTotal = summaryData?.total_pending_credits ?? 12.0;
  const goalProgress = summaryData?.sequestration_goal_pct ?? 82.5;

  const currentNDVI = satelliteData?.ndvi ?? 0.50;
  const currentBiomass = satelliteData?.biomass_score ?? 0.50;
  const currentConfidence = satelliteData?.confidence_score ?? 90.0;
  const currentMoisture = satelliteData?.soil_moisture_pct ?? 30.0;

  const fireStatus = fireData?.status ?? "SAFE";
  const burnsDetected = fireData?.active_burns_detected ?? 0;
  const fireSeverity = fireData?.severity ?? "NONE";
  const fireAffectedPct = fireData?.affected_area_percentage ?? 0.0;
  const fireLoss = fireData?.estimated_carbon_loss_tons ?? 0.0;

  const carbonStorage = carbonLedger?.estimated_storage_tons ?? 400.0;
  const sequestrationRate = carbonLedger?.sequestration_rate_annual_tons ?? 0.15;
  const seasonGain = carbonLedger?.season_gain_tons ?? 1.0;
  const annualProjection = carbonLedger?.annual_projection_tons ?? 3.0;
  const explanation = carbonLedger?.explanation ?? "Farming soil data details.";
  const healthScore = carbonLedger?.soil_health_score ?? 60;

  const verificationStatus = verificationData?.verification_status ?? "PENDING";
  const verifiedCredits = verificationData?.details?.verified_credits ?? 0.0;
  const pendingCredits = verificationData?.details?.pending_credits ?? 0.0;
  const rejectedCredits = verificationData?.details?.rejected_credits ?? 0.0;
  const verificationReason = verificationData?.details?.verification_reason ?? "Audit checklist validation in progress.";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <HeroSection
        title="AgriCarbon & Soil-Sink Ledger Portal"
        description="Analyze active soil-carbon sink yields, review radar NDVI vegetation indexes, check active stubble fires warnings, and publish validated environmental audit reports."
        primaryActionLabel="Export Ledger Sheets"
        secondaryActionLabel="Mint Carbon Credits"
        onPrimaryClick={async () => {
          const res = await handleExportLedger("csv");
          if (res.success) {
            addToast(`Ledger exported successfully.`, "success");
          }
        }}
        onSecondaryClick={() => addToast("AgriCarbon credit verified validation triggers activated.", "info")}
      />

      {/* Selector controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-border rounded-2xl shadow-sm">
        <div className="space-y-0.5">
          <h3 className="font-display text-xs font-black uppercase text-text-deep">Selected Farm Field Registry</h3>
          <p className="text-[10px] text-text-muted font-semibold">Toggle active parcel boundary coordinate grids</p>
        </div>
        <div className="min-w-[240px] bg-[#DAEED2]/30 p-1 border border-border rounded-xl">
          <FarmSelector
            fields={fields}
            selectedId={selectedId}
            onSelect={handleFieldChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreditProgressCard
          verifiedCredits={verifiedCreditsTotal}
          pendingCredits={pendingCreditsTotal}
          goalProgressPct={goalProgress}
        />
        <SoilHealthGauge score={healthScore} />
        <FieldCard
          name={activeField?.name || " पंजाबी Parcel"}
          cropType={activeField?.crop_type || "N/A"}
          practice={activeField?.practice || "N/A"}
          acreage={activeField?.acreage || 0}
          daysActive={activeField?.days_active || 0}
        />
      </div>

      {/* Main Map Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Map overlay canvas */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Satellite Telemetry Map
          </span>
          <FarmerGoogleMap
            parcels={fields}
            selectedId={selectedId}
            onSelectField={handleFieldChange}
            activeLayer={activeLayer}
            onLayerChange={handleLayerChange}
            height="450px"
          />
        </div>

        {/* Spatial Stats Column */}
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <ParcelStatistics polygon={activeField?.polygon || []} className="h-full" />
          </div>
        </div>
      </div>

      {/* AI Assistant panel indicators */}
      <div className="bg-[#F1F8E9] border border-[#DCEED2] p-4 rounded-2xl text-xs text-text-deep flex items-center justify-between gap-3 shadow-xs">
        <span>💡 Precision irrigation and stubble burn alerts are active for Punjabi field cells. Review suggestions inside the right-side Assistant drawer.</span>
        <button 
          onClick={() => addToast("Farming compliance tips are docked in your right Assistant panel drawer.", "info")}
          className="underline font-bold text-text-deep hover:text-text-muted cursor-pointer uppercase tracking-wider text-[10px]"
        >
          Check Diagnostics
        </button>
      </div>

      {/* Core Telemetry Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NDVICard
          ndviValue={currentNDVI}
          biomassScore={currentBiomass}
          confidenceScore={currentConfidence}
        />
        <MoistureCard moisturePct={currentMoisture} />
        <FireAlertCard
          status={fireStatus}
          burnsDetected={burnsDetected}
          severity={fireSeverity}
          affectedAreaPct={fireAffectedPct}
          carbonLossTons={fireLoss}
        />
      </div>

      {/* Credit Verification checklist and ledger accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarbonLedgerCard
          estimatedStorageTons={carbonStorage}
          sequestrationRateAnnualTons={sequestrationRate}
          seasonGainTons={seasonGain}
          annualProjectionTons={annualProjection}
          practice={activeField?.practice || "conventional"}
          explanation={explanation}
        />
        <VerificationCard
          status={verificationStatus}
          verifiedCredits={verifiedCredits}
          pendingCredits={pendingCredits}
          rejectedCredits={rejectedCredits}
          reason={verificationReason}
          onExport={handleExportLedger}
        />
      </div>

      {/* Orbit checking timelines logs */}
      <div className="grid grid-cols-1">
        <TelemetryTimeline />
      </div>
    </div>
  );
};

export default FarmerDashboard;
