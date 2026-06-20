import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FacilitySelector } from "../../features/industry/components/FacilitySelector";
import { ComplianceStatus } from "../../features/industry/components/ComplianceStatus";
import { EmissionCard } from "../../features/industry/components/EmissionCard";
import { SolarRoofCard } from "../../features/industry/components/SolarRoofCard";
import { RiskCard } from "../../features/industry/components/RiskCard";
import { FinancialImpactCard } from "../../features/industry/components/FinancialImpactCard";

describe("FacilitySelector Component", () => {
  const mockFacilities = [
    { id: "facility_a", name: "Ludhiana Metal Works", registry_id: "IND-LDH-A" },
    { id: "facility_b", name: "Mandi Gobindgarh Foundries", registry_id: "IND-MND-B" }
  ];

  it("renders selector options and triggers select change callback", () => {
    const handleSelect = jest.fn();
    render(
      <FacilitySelector
        facilities={mockFacilities}
        selectedId="facility_a"
        onSelect={handleSelect}
      />
    );

    const selectEl = screen.getByLabelText("Active Facility Site") as HTMLSelectElement;
    expect(selectEl.value).toBe("facility_a");
    expect(screen.getByText("Ludhiana Metal Works (IND-LDH-A)")).toBeInTheDocument();

    fireEvent.change(selectEl, { target: { value: "facility_b" } });
    expect(handleSelect).toHaveBeenCalledWith("facility_b");
  });
});

describe("ComplianceStatus Component", () => {
  it("renders Scope 1 and Scope 2 compliance tags correctly", () => {
    render(
      <ComplianceStatus
        scope1Status="Warning (High CH4)"
        scope2Status="Compliant"
      />
    );

    expect(screen.getByText("Warning (High CH4)")).toBeInTheDocument();
    expect(screen.getByText("Compliant")).toBeInTheDocument();
  });
});

describe("EmissionCard Component", () => {
  it("renders methane, SO₂ and NO₂ spectrometry values", () => {
    render(
      <EmissionCard
        methanePpb={1895.0}
        so2Ppb={1.5}
        no2Ppb={25.4}
        leakSeverity="MEDIUM"
      />
    );

    expect(screen.getByText("1895.0")).toBeInTheDocument();
    expect(screen.getByText("1.50")).toBeInTheDocument();
    expect(screen.getByText("25.4 ppb")).toBeInTheDocument();
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
    expect(screen.getByText("⚠️ Excess leak detected")).toBeInTheDocument();
  });
});

describe("SolarRoofCard Component", () => {
  const mockPotential = {
    capacity_kw: 640.0,
    install_cost_usd: 768000.0,
    annual_savings_usd: 96000.0,
    payback_period_months: 96.0,
    esg_improvement_score: 12
  };

  it("renders roof area, install costs and payback timeline stats", () => {
    render(
      <SolarRoofCard
        roofAreaSqMeters={6400}
        solarPotential={mockPotential}
      />
    );

    expect(screen.getByText("6,400 m²")).toBeInTheDocument();
    expect(screen.getByText("640.0 kW DC")).toBeInTheDocument();
    expect(screen.getByText("$7,68,000.00")).toBeInTheDocument();
    expect(screen.getByText("+$96,000.00 / yr")).toBeInTheDocument();
    expect(screen.getByText("96.0 Months")).toBeInTheDocument();
    expect(screen.getByText("8.0 Years")).toBeInTheDocument();
  });
});

describe("RiskCard Component", () => {
  it("renders active danger alerts and carbon tax exposures", () => {
    render(
      <RiskCard
        riskRating="High"
        riskStatus="critical"
        activeLeakDetected={true}
        regulatoryExposure={2999350.0}
      />
    );

    expect(screen.getByText("HIGH RISK")).toBeInTheDocument();
    expect(screen.getByText("FAIL (Active Leak)")).toBeInTheDocument();
    expect(screen.getByText("EXCEEDED LIMIT")).toBeInTheDocument();
    expect(screen.getByText("$29,99,350.00")).toBeInTheDocument();
  });
});

describe("FinancialImpactCard Component", () => {
  it("renders carbon liabilities, waste values, and savings balances", () => {
    render(
      <FinancialImpactCard
        carbonTaxLiability={2999350.0}
        operationalWaste={47172.5}
        leakRepairSavings={42455.25}
        annualSavingsTotal={138455.25}
      />
    );

    expect(screen.getByText("$29,99,350.00")).toBeInTheDocument();
    expect(screen.getByText("$47,172.50 / yr")).toBeInTheDocument();
    expect(screen.getByText("+$42,455.25")).toBeInTheDocument();
    expect(screen.getByText("$1,38,455.25 / yr")).toBeInTheDocument();
  });
});
