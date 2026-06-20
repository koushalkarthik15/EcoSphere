import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FarmSelector } from "../../features/farmer/components/FarmSelector";
import { FieldCard } from "../../features/farmer/components/FieldCard";
import { NDVICard } from "../../features/farmer/components/NDVICard";
import { MoistureCard } from "../../features/farmer/components/MoistureCard";
import { FireAlertCard } from "../../features/farmer/components/FireAlertCard";

describe("FarmSelector Component", () => {
  const mockFields = [
    { id: "field_a", name: "Punjab Field A", crop_type: "Wheat", acreage: 12.5 },
    { id: "field_b", name: "Punjab Field B", crop_type: "Rice", acreage: 8.0 }
  ];

  it("renders select input options and fires select change events", () => {
    const handleSelect = jest.fn();
    render(
      <FarmSelector
        fields={mockFields}
        selectedId="field_a"
        onSelect={handleSelect}
      />
    );

    const selectEl = screen.getByLabelText("Active Land Parcel") as HTMLSelectElement;
    expect(selectEl.value).toBe("field_a");
    expect(screen.getByText("Punjab Field A (12.5 acres)")).toBeInTheDocument();
    expect(screen.getByText("Punjab Field B (8 acres)")).toBeInTheDocument();

    fireEvent.change(selectEl, { target: { value: "field_b" } });
    expect(handleSelect).toHaveBeenCalledWith("field_b");
  });
});

describe("FieldCard Component", () => {
  it("renders registered field details correctly", () => {
    render(
      <FieldCard
        name="Punjabi Field A"
        cropType="Wheat"
        practice="conservation"
        acreage={12.5}
        daysActive={120}
      />
    );

    expect(screen.getByText("Punjabi Field A")).toBeInTheDocument();
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(screen.getByText("conservation")).toBeInTheDocument();
    expect(screen.getByText("12.5 Acres")).toBeInTheDocument();
    expect(screen.getByText("120 Days")).toBeInTheDocument();
  });
});

describe("NDVICard Component", () => {
  it("renders NDVI scores and category indicators", () => {
    render(
      <NDVICard ndviValue={0.72} biomassScore={0.83} confidenceScore={92.5} />
    );

    expect(screen.getByText("0.72")).toBeInTheDocument();
    expect(screen.getByText("0.83")).toBeInTheDocument();
    expect(screen.getByText("Excellent Canopy")).toBeInTheDocument();
    expect(screen.getByText("92.5%")).toBeInTheDocument();
  });
});

describe("MoistureCard Component", () => {
  it("renders moisture values and warnings", () => {
    render(<MoistureCard moisturePct={28.5} />);

    expect(screen.getByText("28.5")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Watering recommended")).toBeInTheDocument();
  });

  it("renders drought alerts for critical dry soil", () => {
    render(<MoistureCard moisturePct={18.0} />);

    expect(screen.getByText("Drought Alert")).toBeInTheDocument();
  });
});

describe("FireAlertCard Component", () => {
  it("renders active burn danger details when fire is detected", () => {
    render(
      <FireAlertCard
        status="DANGER"
        burnsDetected={2}
        severity="HIGH"
        affectedAreaPct={25.0}
        carbonLossTons={9.0}
      />
    );

    expect(screen.getByText("🔥 active fire")).toBeInTheDocument();
    expect(screen.getByText("2 Points")).toBeInTheDocument();
    expect(screen.getByText("-9.0 Tons CO₂e released")).toBeInTheDocument();
  });

  it("renders clean status card when no active stubble burns are active", () => {
    render(
      <FireAlertCard
        status="SAFE"
        burnsDetected={0}
        severity="NONE"
        affectedAreaPct={0.0}
        carbonLossTons={0.0}
      />
    );

    expect(screen.getByText("✓ safe")).toBeInTheDocument();
    expect(screen.getByText("0 Anomaly warnings")).toBeInTheDocument();
  });
});
