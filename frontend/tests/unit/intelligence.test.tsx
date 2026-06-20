import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { ConfidenceBadge } from "../../features/intelligence/components/ConfidenceBadge";
import { EnvironmentalScore } from "../../features/intelligence/components/EnvironmentalScore";
import { TelemetryTimeline } from "../../features/intelligence/components/TelemetryTimeline";
import { AnalyticsCard } from "../../features/intelligence/components/AnalyticsCard";
import { AIInsightCard } from "../../features/intelligence/components/AIInsightCard";
import { PredictionCard } from "../../features/intelligence/components/PredictionCard";
import { RecommendationPanel } from "../../features/intelligence/components/RecommendationPanel";

describe("Environmental Intelligence Frontend Components", () => {
  
  describe("ConfidenceBadge Component", () => {
    it("renders score and status dot indicator", () => {
      render(<ConfidenceBadge score={92.5} label="Precision" />);
      expect(screen.getByText("Precision:")).toBeInTheDocument();
      expect(screen.getByText("93%")).toBeInTheDocument();
    });
  });

  describe("EnvironmentalScore Dial Component", () => {
    it("renders radial gauge value and subtext correctly", () => {
      render(
        <EnvironmentalScore 
          score={84} 
          label="Ludhiana Sustainability" 
          subtext="High Vegetation Health Index" 
        />
      );
      expect(screen.getByText("Ludhiana Sustainability")).toBeInTheDocument();
      expect(screen.getByText("84")).toBeInTheDocument();
      expect(screen.getByText("High Vegetation Health Index")).toBeInTheDocument();
    });
  });

  describe("TelemetryTimeline Component", () => {
    it("renders vertical list timeline events with values", () => {
      const mockEvents = [
        {
          provider: "Google Earth Engine",
          measurement: "NDVI",
          timestamp: "2026-06-19T12:00:00Z",
          units: "index",
          quality_score: 95,
          metadata: {
            estimated_biomass_tons_per_hectare: 125,
            vegetation_health_status: "Healthy"
          }
        }
      ];

      render(<TelemetryTimeline events={mockEvents} />);
      expect(screen.getByText("🛰️ Telemetry Audit Trail")).toBeInTheDocument();
      expect(screen.getByText("Google Earth Engine - NDVI")).toBeInTheDocument();
      expect(screen.getByText(/125 tons\/ha/)).toBeInTheDocument();
      expect(screen.getByText("(Healthy Canopy)")).toBeInTheDocument();
    });
  });

  describe("AnalyticsCard Component", () => {
    it("renders progress bars and index values", () => {
      const mockMetrics = [
        {
          label: "Air Quality Index",
          value: 45,
          status: "healthy" as const,
          description: "Clean ambient air conditions.",
          icon: "🌤️"
        }
      ];

      render(<AnalyticsCard metrics={mockMetrics} />);
      expect(screen.getByText("📊 Environmental Indexes")).toBeInTheDocument();
      expect(screen.getByText("Air Quality Index")).toBeInTheDocument();
      expect(screen.getByText("45/100")).toBeInTheDocument();
      expect(screen.getByText("Clean ambient air conditions.")).toBeInTheDocument();
    });
  });

  describe("AIInsightCard Component", () => {
    it("renders AI-synthesized summaries and links", () => {
      render(
        <AIInsightCard 
          summary="Anomalies detected in soil moisture levels." 
          headline="Methane Outlines" 
        />
      );
      expect(screen.getByText("Methane Outlines")).toBeInTheDocument();
      expect(screen.getByText("Anomalies detected in soil moisture levels.")).toBeInTheDocument();
    });
  });

  describe("PredictionCard Component", () => {
    it("renders predictive future trend lists", () => {
      const mockPredictions = [
        {
          indicator: "Surface Heat Index",
          trend: "improving" as const,
          valueChange: "-2.4C reduction",
          timeline: "3 Months"
        }
      ];

      render(<PredictionCard predictions={mockPredictions} />);
      expect(screen.getByText("🔮 Future Trend Forecasts")).toBeInTheDocument();
      expect(screen.getByText("Surface Heat Index")).toBeInTheDocument();
      expect(screen.getByText("Expected change: -2.4C reduction")).toBeInTheDocument();
    });
  });

  describe("RecommendationPanel Component", () => {
    it("renders list and fires execute callbacks", () => {
      const mockRecs = [
        {
          id: "rec_1",
          type: "irrigation",
          title: "Optimize Valves",
          content: "Soil moisture is declining in field sector 4.",
          action_label: "Open Valves",
          impact_credits: 15
        }
      ];
      
      const handleExecute = jest.fn();
      render(<RecommendationPanel recommendations={mockRecs} onExecuteAction={handleExecute} />);

      expect(screen.getByText("Optimize Valves")).toBeInTheDocument();
      expect(screen.getByText("Soil moisture is declining in field sector 4.")).toBeInTheDocument();
      expect(screen.getByText("+15.0 Credits")).toBeInTheDocument();

      const btn = screen.getByText("Open Valves");
      fireEvent.click(btn);
      expect(handleExecute).toHaveBeenCalledWith("rec_1");
    });
  });

});
