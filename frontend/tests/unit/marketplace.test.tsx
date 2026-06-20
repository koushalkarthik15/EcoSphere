import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketplaceHeader } from "../../features/marketplace/components/MarketplaceHeader";
import { MarketplaceStatistics } from "../../features/marketplace/components/MarketplaceStatistics";
import { CreditCard } from "../../features/marketplace/components/CreditCard";
import { ProjectCard } from "../../features/marketplace/components/ProjectCard";
import { WalletCard } from "../../features/marketplace/components/WalletCard";
import { NotificationCenter } from "../../features/marketplace/components/NotificationCenter";

describe("MarketplaceHeader Component", () => {
  it("renders user EcoCredits and EcoCoins balances correctly", () => {
    render(
      <MarketplaceHeader
        carbonBalance={120.5}
        marketplaceBalance={2500}
      />
    );

    expect(screen.getByText("120.5 Tons")).toBeInTheDocument();
    expect(screen.getByText("2,500 Coins")).toBeInTheDocument();
  });
});

describe("MarketplaceStatistics Component", () => {
  it("renders live indexes, participants totals, and supply credits", () => {
    render(
      <MarketplaceStatistics
        livePriceCoins={15.20}
        creditsAvailableTons={520.0}
        verifiedFarmsCount={48}
        industrialBuyersCount={18}
      />
    );

    expect(screen.getByText("15.20 Coins/t")).toBeInTheDocument();
    expect(screen.getByText("520 t CO₂e")).toBeInTheDocument();
    expect(screen.getByText("48 Farmers")).toBeInTheDocument();
    expect(screen.getByText("18 Corporates")).toBeInTheDocument();
  });
});

describe("CreditCard Component", () => {
  const mockListing = {
    id: "list_1",
    project_id: "proj_punjab_tillage",
    seller_name: "Punjab Field A (Wheat)",
    volume_tons: 120.0,
    price_per_ton_coins: 15.0,
    quality_grade: "A+",
    vintage_year: 2026,
    verification_confidence: 92.5
  };

  it("renders credits listing volume and fires checkout trigger", () => {
    const handleBuyClick = jest.fn();
    render(
      <CreditCard
        listing={mockListing}
        onBuyClick={handleBuyClick}
      />
    );

    expect(screen.getByText("Punjab Field A (Wheat)")).toBeInTheDocument();
    expect(screen.getByText("120.0 Tons")).toBeInTheDocument();
    expect(screen.getByText("92.5%")).toBeInTheDocument();
    expect(screen.getByText("15.0 coins/t")).toBeInTheDocument();
    expect(screen.getByText("1,800 coins")).toBeInTheDocument();

    const buyBtn = screen.getByText("Buy Offsets Credits");
    fireEvent.click(buyBtn);
    expect(handleBuyClick).toHaveBeenCalledWith(mockListing);
  });
});

describe("ProjectCard Component", () => {
  const mockProject = {
    id: "proj_punjab_tillage",
    name: "Punjab Zero-Till Agri-Ledger",
    type: "Soil Sequestration",
    location: "Amritsar, Punjab",
    funding_status: "92%",
    credits_available: 1240.0,
    price_per_ton_coins: 15.0,
    vintage_year: 2026,
    description: "Punjab agricultural zero-till project details."
  };

  it("renders project location and details dossier action triggers", () => {
    const handleViewDetails = jest.fn();
    render(
      <ProjectCard
        project={mockProject}
        onViewDetails={handleViewDetails}
      />
    );

    expect(screen.getByText("Punjab Zero-Till Agri-Ledger")).toBeInTheDocument();
    expect(screen.getByText("Amritsar, Punjab")).toBeInTheDocument();
    expect(screen.getByText("1,240 t")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();

    const detailsBtn = screen.getByText("Details");
    fireEvent.click(detailsBtn);
    expect(handleViewDetails).toHaveBeenCalledWith(mockProject);
  });
});

describe("WalletCard Component", () => {
  const mockLedger = [
    { id: "ledger_0", type: "challenge_reward", amount: 100, desc: "Completed challenge: Green Commute Pioneer", timestamp: "2026-06-18T11:00:00Z" }
  ];

  it("fires credits conversion callbacks with inputs amount", async () => {
    const handleConvert = jest.fn();
    render(
      <WalletCard
        ecoCredits={25.5}
        ecoCoins={1200}
        purchasedCredits={10.0}
        verifiedCredits={0.0}
        ledgerHistory={mockLedger}
        onConvertCredits={handleConvert}
      />
    );

    expect(screen.getByText("25.5")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("Completed challenge: Green Commute Pioneer")).toBeInTheDocument();

    const convertBtn = screen.getByText("Convert EcoCredits Rewards");
    fireEvent.click(convertBtn);
    expect(handleConvert).toHaveBeenCalledWith(5.0); // default amount is 5.0
  });
});

describe("NotificationCenter Component", () => {
  it("renders notifications list correctly", () => {
    const mockNotifs = [
      { id: "notif_1", type: "success", title: "🌱 Credits listing verified", message: "Punjab Field A tillage offset credits package verified.", timestamp: "20m ago" }
    ];
    const handleClear = jest.fn();

    render(
      <NotificationCenter
        notifications={mockNotifs}
        onClear={handleClear}
      />
    );

    expect(screen.getByText("🌱 Credits listing verified")).toBeInTheDocument();
    expect(screen.getByText("Punjab Field A tillage offset credits package verified.")).toBeInTheDocument();
    
    const clearBtn = screen.getByText("Clear Alerts History");
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });
});
