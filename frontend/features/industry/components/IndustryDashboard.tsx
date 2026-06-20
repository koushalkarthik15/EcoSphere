"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "../../../lib/providers/TelemetryProvider";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { useCarbon } from "../../../lib/providers/CarbonProvider";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { StatBadge } from "../../../components/ui/StatBadge";
import { Card } from "../../../components/ui/Card";
import { FacilitySelector } from "./FacilitySelector";
import { ComplianceStatus } from "./ComplianceStatus";
import { ComplianceGauge } from "./ComplianceGauge";
import { AssetViewer } from "./AssetViewer";
import { EmissionCard } from "./EmissionCard";
import { SolarRoofCard } from "./SolarRoofCard";
import { RiskCard } from "./RiskCard";
import { FinancialImpactCard } from "./FinancialImpactCard";
import { EmissionTimeline } from "./EmissionTimeline";
import { IndustrySuggestionDock } from "./IndustrySuggestionDock";
import { IndustryGoogleMap, IndustryLayersState } from "./IndustryGoogleMap";
import { LucideCreditCard, LucideTrendingUp, LucideInfo } from "lucide-react";
import { HeroSection } from "../../../components/ui/HeroSection";
import { useAuth } from "../../../lib/providers/AuthProvider";
import { INDUSTRY_DEMO_DATA } from "../../../lib/demoData";

export const IndustryDashboard: React.FC = () => {
  const { currentLocation } = useTelemetry();
  const { mode } = useAuth();
  const { addToast } = useToasts();
  const { purchaseCredits, marketplaceBalance } = useCarbon();

  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [historicalTrends, setHistoricalTrends] = useState<any[]>([]);

  // Detailed endpoints state
  const [emissionData, setEmissionData] = useState<any>(null);
  const [gasData, setGasData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);
  const [solarData, setSolarData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [offsetRecommendation, setOffsetRecommendation] = useState<any>(null);

  // Map overlays state
  const [mapLayers, setMapLayers] = useState<IndustryLayersState>({
    methanePlumes: true,
    so2Plumes: false,
    facilityAssets: true,
    solarRoof: false,
    windVector: true,
    complianceZones: true,
    riskZones: false
  });

  // Google Pay Checkout Modal State
  const [gPayOpen, setGPayOpen] = useState(false);
  const [gPayCreditsAmount, setGPayCreditsAmount] = useState(100.0);
  const [gPayCostUsd, setGPayCostUsd] = useState(2450.0);
  const [gPayProcessing, setGPayProcessing] = useState(false);

  // Fetch initial summary lists
  const fetchSummary = async () => {
    setLoading(true);
    if (mode === "demo") {
      setFacilities(INDUSTRY_DEMO_DATA.summary.facilities || []);
      if (INDUSTRY_DEMO_DATA.summary.facilities && INDUSTRY_DEMO_DATA.summary.facilities.length > 0) {
        setSelectedId(INDUSTRY_DEMO_DATA.summary.facilities[0].id);
      }
      setLoading(false);
      return;
    }
    
    try {
      const summaryRes = await fetch("http://localhost:8000/api/v1/industry/summary", {
        credentials: "include"
      });
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setFacilities(data.facilities || []);
        if (data.facilities && data.facilities.length > 0) {
          setSelectedId(data.facilities[0].id);
        }
      } else {
        throw new Error("Summary endpoint return code error");
      }
    } catch (e) {
      console.warn("Failed fetching initial industry dashboard, loading offline fallback assets:", e);
      // Fallback registered corporate facilities
      const mockFacilities = [
        {
          id: "facility_a",
          name: "Ludhiana Metal Works",
          registry_id: "IND-LDH-9872-A",
          acreage: 15.4,
          roof_area_sq_meters: 6400.0,
          compliance_rating: "B+",
          overall_esg_score: 74,
          scope_1_status: "Warning (High CH4)",
          scope_2_status: "Compliant",
          marketplace_balance: 15200.0,
          lat: 30.9000,
          lng: 75.8500,
          baseline_co2_tons: 18450.0,
          boundaries: [
            { lat: 30.8980, lng: 75.8470 },
            { lat: 30.9020, lng: 75.8470 },
            { lat: 30.9020, lng: 75.8530 },
            { lat: 30.8980, lng: 75.8530 }
          ],
          assets: [
            { name: "Factory Block Alpha", polygon: [{ lat: 30.8990, lng: 75.8480 }, { lat: 30.9010, lng: 75.8480 }, { lat: 30.9010, lng: 75.8500 }, { lat: 30.8990, lng: 75.8500 }], type: "factory" },
            { name: "Warehouse Beta", polygon: [{ lat: 30.8995, lng: 75.8510 }, { lat: 30.9015, lng: 75.8510 }, { lat: 30.9015, lng: 75.8525 }, { lat: 30.8995, lng: 75.8525 }], type: "warehouse" },
            { name: "Admin Building", polygon: [{ lat: 30.9012, lng: 75.8492 }, { lat: 30.9018, lng: 75.8492 }, { lat: 30.9018, lng: 75.8502 }, { lat: 30.9012, lng: 75.8502 }], type: "admin" },
            { name: "Storage Tanks Gamma", polygon: [{ lat: 30.8982, lng: 75.8505 }, { lat: 30.8988, lng: 75.8505 }, { lat: 30.8988, lng: 75.8515 }, { lat: 30.8982, lng: 75.8515 }], type: "storage_tanks" },
            { name: "Loading Bays", polygon: [{ lat: 30.8985, lng: 75.8475 }, { lat: 30.8992, lng: 75.8475 }, { lat: 30.8992, lng: 75.8485 }, { lat: 30.8985, lng: 75.8485 }], type: "loading_bay" }
          ]
        },
        {
          id: "facility_b",
          name: "Mandi Gobindgarh Foundries",
          registry_id: "IND-MND-4420-B",
          acreage: 9.5,
          roof_area_sq_meters: 4200.0,
          compliance_rating: "A-",
          overall_esg_score: 83,
          scope_1_status: "Compliant",
          scope_2_status: "Warning (High Grid)",
          marketplace_balance: 8400.0,
          lat: 30.6628,
          lng: 76.3005,
          baseline_co2_tons: 9800.0,
          boundaries: [
            { lat: 30.6610, lng: 76.2980 },
            { lat: 30.6645, lng: 76.2980 },
            { lat: 30.6645, lng: 76.3030 },
            { lat: 30.6610, lng: 76.3030 }
          ],
          assets: [
            { name: "Main Smelter Block", polygon: [{ lat: 30.6615, lng: 76.2990 }, { lat: 30.6630, lng: 76.2990 }, { lat: 30.6630, lng: 76.3010 }, { lat: 30.6615, lng: 76.3010 }], type: "factory" },
            { name: "Distribution Yard", polygon: [{ lat: 30.6618, lng: 76.3015 }, { lat: 30.6628, lng: 76.3015 }, { lat: 30.6628, lng: 76.3025 }, { lat: 30.6618, lng: 76.3025 }], type: "warehouse" },
            { name: "HQ Office Suite", polygon: [{ lat: 30.6635, lng: 76.3000 }, { lat: 30.6642, lng: 76.3000 }, { lat: 30.6642, lng: 76.3012 }, { lat: 30.6635, lng: 76.3012 }], type: "admin" }
          ]
        }
      ];
      setFacilities(mockFacilities);
      setSelectedId(mockFacilities[0].id);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all endpoints parameters for selected facility
  const fetchFacilityData = async (facilityId: string) => {
    if (!facilityId) return;
    if (mode === "demo") {
      const key = facilityId === "fac_demo_a" ? "fac_demo_a" : "fac_demo_b";
      setEmissionData(INDUSTRY_DEMO_DATA.emission_analysis[key]?.ghg_analysis || null);
      setGasData(INDUSTRY_DEMO_DATA.gas_detection[key] || null);
      setComplianceData(INDUSTRY_DEMO_DATA.compliance[key] || null);
      setSolarData(INDUSTRY_DEMO_DATA.solar_potential[key] || null);
      setFinancialData(INDUSTRY_DEMO_DATA.financial_report[key] || null);
      setOffsetRecommendation(INDUSTRY_DEMO_DATA.marketplace_recommendation[key]);
      setHistoricalTrends(INDUSTRY_DEMO_DATA.historical_trends[key] || []);
      return;
    }

    try {
      const payload = { facility_id: facilityId };

      // 1. Emission Analysis
      const emRes = await fetch("http://localhost:8000/api/v1/industry/emission-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (emRes.ok) {
        const em = await emRes.json();
        setEmissionData(em.ghg_analysis);
      }

      // 2. Gas Detection
      const gasRes = await fetch("http://localhost:8000/api/v1/industry/gas-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (gasRes.ok) {
        setGasData(await gasRes.json());
      }

      // 3. Compliance checks
      const compRes = await fetch("http://localhost:8000/api/v1/industry/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (compRes.ok) {
        setComplianceData(await compRes.json());
      }

      // 4. Solar potential
      const solarRes = await fetch("http://localhost:8000/api/v1/industry/solar-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (solarRes.ok) {
        const sol = await solarRes.json();
        setSolarData(sol.solar_potential);
      }

      // 5. Financial report
      const finRes = await fetch("http://localhost:8000/api/v1/industry/financial-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (finRes.ok) {
        const fin = await finRes.json();
        setFinancialData(fin.financial_audit);
      }

      // 6. Marketplace Recommendation
      const recRes = await fetch("http://localhost:8000/api/v1/industry/marketplace-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: facilityId,
          target_reduction_pct: 50.0,
          corporate_budget_usd: 120000.0
        }),
        credentials: "include"
      });
      if (recRes.ok) {
        const rec = await recRes.json();
        setOffsetRecommendation(rec.recommendation);
      }

      // 7. Historical decadal trends
      const histRes = await fetch(`http://localhost:8000/api/v1/industry/historical-trends?facility_id=${facilityId}`, {
        credentials: "include"
      });
      if (histRes.ok) {
        setHistoricalTrends(await histRes.json());
      }

    } catch (err) {
      console.warn(`Failed fetching API logs for facility ${facilityId}, generating offline mock metrics:`, err);
      // Construct fallback values
      const isFacilityA = facilityId === "facility_a";
      const baseCO2 = isFacilityA ? 18450.0 : 9800.0;
      
      const mockGHG = {
        methane_excess_ppb: isFacilityA ? 45.0 : 0.0,
        ch4_leak_tons_year: isFacilityA ? 0.35 : 0.0,
        so2_leak_tons_year: isFacilityA ? 0.04 : 0.0,
        ch4_co2e_tons_year: isFacilityA ? 9.8 : 0.0,
        scope_1_annual_co2e_tons: isFacilityA ? 18459.8 : 9800.0,
        scope_2_annual_co2e_tons: isFacilityA ? 5535.0 : 2940.0,
        total_annual_co2e_tons: isFacilityA ? 23994.8 : 12740.0,
        monthly_co2e_tons: isFacilityA ? 1999.6 : 1061.7,
        leak_severity: isFacilityA ? "MEDIUM" : "LOW",
        annual_financial_loss_usd: isFacilityA ? 47172.5 : 24990.0,
        regulatory_tax_exposure_usd: isFacilityA ? 2999350.0 : 1592500.0
      };

      const mockGas = {
        facility_id: facilityId,
        gases: {
          methane_ppb: isFacilityA ? 1895.0 : 1850.0,
          sulfur_dioxide_ppb: isFacilityA ? 1.5 : 1.0,
          nitrogen_dioxide_ppb: isFacilityA ? 25.4 : 14.8,
          wind_direction_degrees: 240.0,
          wind_speed_mps: 4.8
        },
        telemetry_confidence: {
          score: 87.0,
          data_sources: ["Sentinel-5P TROPOMI Offline", "Climate TRACE Cache"]
        }
      };

      const mockComp = {
        facility_id: facilityId,
        compliance_rating: isFacilityA ? "B+" : "A-",
        esg_score: isFacilityA ? 74 : 83,
        risk_summary: {
          risk_rating: isFacilityA ? "Medium" : "Low",
          risk_status: isFacilityA ? "warning" : "healthy",
          active_leak_detected: isFacilityA
        },
        compliance_checklist: [
          { rule: "Scope 1 emissions under carbon limits cap", passed: true },
          { rule: "No critical methane/SO₂ point leaks detected", passed: !isFacilityA },
          { rule: "Sentinel-5P telemetry confidence exceeds 85%", passed: true },
          { rule: "ESG audit file records up-to-date", passed: true }
        ],
        scope_1_status: isFacilityA ? "Warning (High CH4)" : "Compliant",
        scope_2_status: isFacilityA ? "Compliant" : "Warning (High Grid)"
      };

      const mockSolar = {
        capacity_kw: isFacilityA ? 640.0 : 420.0,
        install_cost_usd: isFacilityA ? 768000.0 : 504000.0,
        annual_savings_usd: isFacilityA ? 96000.0 : 63000.0,
        payback_period_months: 96.0,
        esg_improvement_score: 12
      };

      const mockFin = {
        carbon_tax_liability_usd: isFacilityA ? 2999350.0 : 1592500.0,
        operational_waste_usd: isFacilityA ? 47172.5 : 24990.0,
        leak_repair_savings_usd: isFacilityA ? 42455.25 : 12495.0,
        solar_roi: mockSolar,
        annual_savings_total_usd: isFacilityA ? 138455.25 : 75495.0
      };

      const mockRec = {
        annual_emissions_tons: isFacilityA ? 23994.8 : 12740.0,
        target_reduction_percentage: 50.0,
        credits_required_tons: isFacilityA ? 11997.4 : 6370.0,
        estimated_purchase_cost_usd: isFacilityA ? 293936.3 : 156065.0,
        estimated_purchase_cost_coins: isFacilityA ? 179961.0 : 95550.0,
        carbon_neutrality_timeline: "Standard (Net-Zero in 18 months)",
        neutrality_months: 18,
        recommended_projects: [
          { id: "proj_punjab_tillage", name: "🌾 Punjab Zero-Till Agri-Ledger", type: "Agriculture Sequestration", location: "Amritsar, Punjab", credits_available: 1240.0, price_per_ton_usd: 22.0 },
          { id: "proj_rajasthan_solar", name: "☀️ Rajasthan Thar Desert Solar Sink", type: "Renewable Energy", location: "Jodhpur, Rajasthan", credits_available: 5400.0, price_per_ton_usd: 18.50 },
          { id: "proj_himalayan_forests", name: "🌲 Himalayan Foothills Reforestation", type: "Afforestation", location: "Dehradun, Uttarakhand", credits_available: 850.0, price_per_ton_usd: 28.0 }
        ],
        budget_status: "DEFICIT"
      };

      const mockHist = [
        { year: 2017, "co2_equivalent_tons": roundVal(baseCO2 * 1.25), "methane_ppb": 1960.0 },
        { year: 2018, "co2_equivalent_tons": roundVal(baseCO2 * 1.20), "methane_ppb": 1940.0 },
        { year: 2019, "co2_equivalent_tons": roundVal(baseCO2 * 1.15), "methane_ppb": 1920.0 },
        { year: 2020, "co2_equivalent_tons": roundVal(baseCO2 * 1.05), "methane_ppb": 1880.0 },
        { year: 2021, "co2_equivalent_tons": roundVal(baseCO2 * 1.12), "methane_ppb": 1900.0 },
        { year: 2022, "co2_equivalent_tons": roundVal(baseCO2 * 1.10), "methane_ppb": 1895.0 },
        { year: 2023, "co2_equivalent_tons": roundVal(baseCO2 * 1.08), "methane_ppb": 1890.0 },
        { year: 2024, "co2_equivalent_tons": roundVal(baseCO2 * 1.05), "methane_ppb": 1885.0 },
        { year: 2025, "co2_equivalent_tons": roundVal(baseCO2 * 1.02), "methane_ppb": 1880.0 },
        { year: 2026, "co2_equivalent_tons": roundVal(baseCO2 * 1.00), "methane_ppb": 1875.0 }
      ];

      setEmissionData(mockGHG);
      setGasData(mockGas);
      setComplianceData(mockComp);
      setSolarData(mockSolar);
      setFinancialData(mockFin);
      setOffsetRecommendation(mockRec);
      setHistoricalTrends(mockHist);
    }
  };

  const roundVal = (v: number) => Math.round(v * 10) / 10;

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchFacilityData(selectedId);
    }
  }, [selectedId]);

  const handleFacilityChange = (id: string) => {
    setSelectedId(id);
    const item = facilities.find(f => f.id === id);
    if (item) {
      addToast(`Swapped view to: ${item.name}. Fetching atmospheric column density models.`, "success");
    }
  };

  const handleLayerChange = (key: keyof IndustryLayersState, val: boolean) => {
    setMapLayers(prev => ({ ...prev, [key]: val }));
    addToast(`Overlay layer: ${key.replace(/([A-Z])/g, " $1")} ${val ? "enabled" : "disabled"}.`, "info");
  };

  // Google Pay Checkout Logic
  const handleOpenGPay = (amountTons: number, costCoins: number) => {
    setGPayCreditsAmount(amountTons);
    setGPayCostUsd(costCoins * 24.50); // Simulating cost in dollars equivalent
    setGPayOpen(true);
  };

  const handleExecuteGPayPayment = async () => {
    setGPayProcessing(true);
    try {
      // Execute the purchase credits transaction using Carbon Context
      const coinCost = Math.round(gPayCreditsAmount * 15.0); // Cost factor matching API recommendation
      
      // Simulate Google Pay Sandbox API latency delay
      await new Promise(resolve => setTimeout(resolve, 1800));

      const success = await purchaseCredits(gPayCreditsAmount, coinCost);
      if (success) {
        addToast(`Google Pay Sandbox checkout verified. Completed ESG credits settlement.`, "success", "Payment Approved");
        setGPayOpen(false);
      }
    } catch (err) {
      addToast("Failed executing Google Pay transaction.", "error");
    } finally {
      setGPayProcessing(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Aggregating atmospheric gas spectrometry datasets..." />;
  }

  const activeFacility = facilities.find(f => f.id === selectedId) || facilities[0];

  // Safeguards
  const overallESGScore = complianceData?.esg_score ?? 70;
  const ratingGrade = complianceData?.compliance_rating ?? "B";
  const scope1Status = complianceData?.scope_1_status ?? "N/A";
  const scope2Status = complianceData?.scope_2_status ?? "N/A";

  const methanePpb = gasData?.gases?.methane_ppb ?? 1850.0;
  const so2Ppb = gasData?.gases?.sulfur_dioxide_ppb ?? 1.0;
  const no2Ppb = gasData?.gases?.nitrogen_dioxide_ppb ?? 15.0;
  const windAngle = gasData?.gases?.wind_direction_degrees ?? 240.0;
  const windSpeed = gasData?.gases?.wind_speed_mps ?? 4.0;

  const leakSeverity = emissionData?.leak_severity ?? "LOW";
  const totalAnnualCO2e = emissionData?.total_annual_co2e_tons ?? 15000.0;
  const taxExposure = emissionData?.regulatory_tax_exposure_usd ?? 1875000.0;

  const carbonTaxLiability = financialData?.carbon_tax_liability_usd ?? 0.0;
  const operationalWaste = financialData?.operational_waste_usd ?? 0.0;
  const leakRepairSavings = financialData?.leak_repair_savings_usd ?? 0.0;
  const annualSavingsTotal = financialData?.annual_savings_total_usd ?? 0.0;

  const recommendedCredits = offsetRecommendation?.credits_required_tons ?? 500.0;
  const recommendedCostUsd = offsetRecommendation?.estimated_purchase_cost_usd ?? 12250.0;
  const recommendedCostCoins = offsetRecommendation?.estimated_purchase_cost_coins ?? 7500.0;
  const recommendedTimeline = offsetRecommendation?.carbon_neutrality_timeline ?? "18 months";
  const regionalProjects = offsetRecommendation?.recommended_projects ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <HeroSection
        title="InduTrack Industrial ESG Auditor Workspace"
        description="Monitor greenhouse gas stack outputs, locate Methane (CH4) fugitive gas plume anomalies, calculate solar rooftop ROI potentials, and manage regulatory carbon compliance."
        primaryActionLabel="Review Financial Audit"
        secondaryActionLabel="Check Methane Plumes"
        onPrimaryClick={() => addToast("ESG financial reports compiled for current quarter.", "success")}
        onSecondaryClick={() => addToast("Methane (CH4) spectrometer layers loaded on active canvas.", "info")}
      />

      {/* Selector controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-border rounded-2xl shadow-sm">
        <div className="space-y-0.5">
          <h3 className="font-display text-xs font-black uppercase text-text-deep">Selected Industrial Facility</h3>
          <p className="text-[10px] text-text-muted font-semibold">Switch active corporate production plant boundaries</p>
        </div>
        <div className="min-w-[240px] bg-[#DAEED2]/30 p-1 border border-border rounded-xl">
          <FacilitySelector
            facilities={facilities}
            selectedId={selectedId}
            onSelect={handleFacilityChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Hero section: compliance summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ComplianceGauge score={overallESGScore} rating={ratingGrade} />
        <ComplianceStatus scope1Status={scope1Status} scope2Status={scope2Status} />
        
        {/* Carbon liability card */}
        <Card title="⚖️ ESG Balance Summary" description="Overall industrial corporate footprint metadata." className="flex flex-col justify-between">
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted font-semibold">Corporate Registry ID:</span>
              <span className="font-mono font-bold text-text-deep">{activeFacility?.registry_id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted font-semibold">Annual Carbon Footprint:</span>
              <span className="font-bold text-text-deep">{totalAnnualCO2e.toLocaleString()} t CO₂e</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted font-semibold">Audited tax liability:</span>
              <span className="font-bold text-telemetry-critical">
                ${carbonTaxLiability.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
              </span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-text-muted font-semibold">
            <span className="flex items-center gap-1">
              <LucideInfo className="h-3.5 w-3.5 text-telemetry-healthy" />
              NCM Balance:
            </span>
            <span className="font-mono font-bold text-text-deep">
              ${activeFacility?.marketplace_balance?.toLocaleString()} USD
            </span>
          </div>
        </Card>
      </div>

      {/* Large interactive map center area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Spatial spectrometry canvas
          </span>
          <IndustryGoogleMap
            facility={activeFacility}
            layers={mapLayers}
            onLayerChange={handleLayerChange}
            windAngle={windAngle}
            windSpeed={windSpeed}
            height="450px"
          />
        </div>

        {/* Infrastructure components list */}
        <div className="flex flex-col">
          <AssetViewer assets={activeFacility?.assets || []} className="h-full" />
        </div>
      </div>

      {/* AI Assistant panel indicators */}
      <div className="bg-[#F1F8E9] border border-[#DCEED2] p-4 rounded-2xl text-xs text-text-deep flex items-center justify-between gap-3 shadow-xs">
        <span>💡 Fugitive stack leaks, solar ROI payback timelines, and offset recommendations are active for {activeFacility.name}. Review suggestions inside the right-side Assistant drawer.</span>
        <button 
          onClick={() => addToast("Industrial compliance indicators are docked in your right Assistant panel drawer.", "info")}
          className="underline font-bold text-text-deep hover:text-text-muted cursor-pointer uppercase tracking-wider text-[10px]"
        >
          Check Suggestions
        </button>
      </div>

      {/* Gas indexes and solar potential */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmissionCard
          methanePpb={methanePpb}
          so2Ppb={so2Ppb}
          no2Ppb={no2Ppb}
          leakSeverity={leakSeverity}
        />
        <SolarRoofCard
          roofAreaSqMeters={activeFacility?.roof_area_sq_meters ?? 0}
          solarPotential={solarData || { capacity_kw: 0, install_cost_usd: 0, annual_savings_usd: 0, payback_period_months: 0, esg_improvement_score: 0 }}
        />
        <RiskCard
          riskRating={complianceData?.risk_summary?.risk_rating ?? "Low"}
          riskStatus={complianceData?.risk_summary?.risk_status ?? "healthy"}
          activeLeakDetected={complianceData?.risk_summary?.active_leak_detected ?? false}
          regulatoryExposure={taxExposure}
        />
      </div>

      {/* Financial impact and offset purchasing recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialImpactCard
          carbonTaxLiability={carbonTaxLiability}
          operationalWaste={operationalWaste}
          leakRepairSavings={leakRepairSavings}
          annualSavingsTotal={annualSavingsTotal}
        />

        {/* Offset credits recommendation with Sandbox checkout button */}
        <Card title="🌱 Audited Carbon Offsets Recommendation" description="Purchase verified Farmer offsets through Google Pay sandbox integrations.">
          <div className="space-y-4">
            <div className="p-3.5 bg-[#F1F8E9] border border-border rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Target offsets required:</span>
                <span className="font-bold text-text-deep">{recommendedCredits.toLocaleString()} Tons CO₂e</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Offset cost evaluation:</span>
                <span className="font-bold text-text-deep">${recommendedCostUsd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Timeline to Net-Zero:</span>
                <span className="font-bold text-telemetry-healthy">{recommendedTimeline}</span>
              </div>
            </div>

            <p className="text-[10px] text-text-muted leading-relaxed font-semibold">
              This recommendation is backed by active Punjabi zero-till cover crop land parcel registries. Hitting targets fulfills corporate ESG certification standards.
            </p>

            <button
              onClick={() => handleOpenGPay(recommendedCredits, recommendedCostCoins)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-text-deep text-white hover:bg-text-deep/90 font-bold text-xs rounded-full shadow-sm hover:shadow transition-smooth cursor-pointer"
            >
              <LucideCreditCard className="h-4 w-4 animate-pulse" />
              Purchase Offsets via Google Pay Sandbox
            </button>
          </div>
        </Card>
      </div>

      {/* Historical Decadal Emissions Chart */}
      <div className="grid grid-cols-1">
        <EmissionTimeline data={historicalTrends} />
      </div>

      {/* Google Pay Sandbox Simulation Modal */}
      {gPayOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <img 
                  src="https://api.dicebear.com/7.x/identicon/svg?seed=gpay" 
                  alt="gpay logo" 
                  className="w-5 h-5 rounded-md"
                />
                <span className="font-display font-black text-sm text-[#3C4043] tracking-tight">
                  Google Pay <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold">SANDBOX</span>
                </span>
              </div>
              <button 
                onClick={() => setGPayOpen(false)}
                className="text-text-muted hover:text-text-deep font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Transaction specs */}
            <div className="space-y-3.5 text-xs bg-[#F1F8E9]/60 p-4 rounded-xl border border-border">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-muted font-semibold">Corporate Buyer:</span>
                <span className="font-bold text-text-deep">{activeFacility.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-muted font-semibold">Offsets credits:</span>
                <span className="font-bold text-text-deep">{gPayCreditsAmount.toLocaleString()} Tons CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-semibold">Simulated price:</span>
                <span className="font-bold text-text-deep">${gPayCostUsd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} USD</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[9px] leading-relaxed font-semibold">
              ⚠️ Simulated payment mode. Approving this transaction will immediately mint the credits in your local EcoSphere ledger account and adjust your balances.
            </div>

            <button
              onClick={handleExecuteGPayPayment}
              disabled={gPayProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-black hover:bg-neutral-900 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-smooth cursor-pointer shadow-sm"
            >
              {gPayProcessing ? (
                <span>Verifying sandbox transaction details...</span>
              ) : (
                <>
                  <LucideCreditCard className="h-4 w-4" />
                  <span>Authorize & Pay with Google Pay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryDashboard;
