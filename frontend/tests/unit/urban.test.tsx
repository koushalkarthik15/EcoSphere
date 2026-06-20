import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AirQualityCard } from "../../features/urban/components/AirQualityCard";
import { LayerToggle, MapLayersState } from "../../features/urban/components/LayerToggle";

describe("AirQualityCard Component", () => {
  it("renders NO2 value and status indicator tag", () => {
    render(
      <AirQualityCard
        no2Ppb={25.4}
        status="neutral"
        label="Moderate"
        historicalNo2={22.1}
        variancePercentage={14.9}
      />
    );

    expect(screen.getByText("25.4")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Historical Baseline")).toBeInTheDocument();
    expect(screen.getByText("22.1 ppb")).toBeInTheDocument();
  });
});

describe("LayerToggle Component", () => {
  const initialLayers: MapLayersState = {
    heatIsland: false,
    airQuality: true,
    traffic: false,
    transit: false,
    greenZones: false,
    savingRoutes: false
  };

  it("should trigger layer toggle onChange callback", () => {
    const handleChange = jest.fn();
    render(<LayerToggle layers={initialLayers} onChange={handleChange} />);

    const trafficCheckbox = screen.getByLabelText("🚗 Traffic Flow") as HTMLInputElement;
    expect(trafficCheckbox.checked).toBe(false);

    fireEvent.click(trafficCheckbox);
    expect(handleChange).toHaveBeenCalledWith("traffic", true);
  });
});
