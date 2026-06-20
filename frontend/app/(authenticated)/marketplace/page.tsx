"use client";
import { useAuth } from "../../../lib/providers/AuthProvider";
import React, { useState, useEffect } from "react";
import { useCarbon } from "../../../lib/providers/CarbonProvider";
import { useRole } from "../../../lib/providers/RoleProvider";
import { useToasts } from "../../../lib/providers/ToastProvider";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Card } from "../../../components/ui/Card";
import { MarketplaceHeader } from "../../../features/marketplace/components/MarketplaceHeader";
import { MarketplaceStatistics } from "../../../features/marketplace/components/MarketplaceStatistics";
import { CreditCard, CreditListing } from "../../../features/marketplace/components/CreditCard";
import { ProjectCard, ProjectInfo } from "../../../features/marketplace/components/ProjectCard";
import { ProjectDetails } from "../../../features/marketplace/components/ProjectDetails";
import { ProjectMap } from "../../../features/marketplace/components/ProjectMap";
import { MarketplaceFilters } from "../../../features/marketplace/components/MarketplaceFilters";
import { PriceChart } from "../../../features/marketplace/components/PriceChart";
import { TransactionTimeline } from "../../../features/marketplace/components/TransactionTimeline";
import { WalletCard } from "../../../features/marketplace/components/WalletCard";
import { NotificationCenter, MarketplaceNotification } from "../../../features/marketplace/components/NotificationCenter";
import { LucideCreditCard, LucideCoins, LucideInfo, LucideCheckCircle } from "lucide-react";
import { HeroSection } from "../../../components/ui/HeroSection";

import { MARKETPLACE_DEMO_DATA } from "../../../lib/demoData";
import { API_BASE_URL } from "../../../lib/apiClient";

export default function MarketplacePage() {
  const { carbonBalance, marketplaceBalance, addCredits, spendCoins, purchaseCredits } = useCarbon();
  const { role } = useRole();
  const { addToast } = useToasts();
  const { mode } = useAuth();

  const [loading, setLoading] = useState(true);
  
  // Market states
  const [summary, setSummary] = useState<any>(null);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [listings, setListings] = useState<CreditListing[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("proj_punjab_tillage");
  const [activeDossier, setActiveDossier] = useState<ProjectInfo | null>(null);

  // Buy Sandbox Modal State
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [buyVolume, setBuyVolume] = useState(10.0);
  const [buyProcessing, setBuyProcessing] = useState(false);

  // Sell Panel State (Farmer Specific)
  const [sellProjectId, setSellProjectId] = useState("proj_punjab_tillage");
  const [sellVolume, setSellVolume] = useState(15.0);
  const [sellPrice, setSellPrice] = useState(15.0);
  const [selling, setSelling] = useState(false);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    if (mode === "demo") {
      setSummary(MARKETPLACE_DEMO_DATA.summary);
      setProjects(MARKETPLACE_DEMO_DATA.projects);
      setListings(MARKETPLACE_DEMO_DATA.listings);
      
      const mockWallet = {
        ...MARKETPLACE_DEMO_DATA.wallet,
        eco_credits_tons: carbonBalance,
        eco_coins: marketplaceBalance,
      };
      setWallet(mockWallet);
      setTransactions(MARKETPLACE_DEMO_DATA.transactions);
      setPriceHistory(MARKETPLACE_DEMO_DATA.priceHistory);
      setNotifications(MARKETPLACE_DEMO_DATA.notifications);
      setLoading(false);
      return;
    }
    
    try {
      // 1. Fetch summary
      const sumRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/summary`, {
        credentials: "include"
      });
      if (sumRes.ok) {
        setSummary(await sumRes.json());
      }
      
      // 2. Fetch projects
      const projRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/projects`, {
        credentials: "include"
      });
      if (projRes.ok) {
        setProjects(await projRes.json());
      }

      // 3. Fetch listings
      const listRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/listings`, {
        credentials: "include"
      });
      if (listRes.ok) {
        setListings(await listRes.json());
      }

      // 4. Fetch wallet metadata
      const walRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/wallet`, {
        credentials: "include"
      });
      if (walRes.ok) {
        setWallet(await walRes.json());
      }

      // 5. Fetch transactions history
      const txRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/transactions`, {
        credentials: "include"
      });
      if (txRes.ok) {
        setTransactions(await txRes.json());
      }

      // 6. Fetch price history
      const priceRes = await fetch(`${API_BASE_URL}/api/v1/marketplace/price-history`, {
        credentials: "include"
      });
      if (priceRes.ok) {
        setPriceHistory(await priceRes.json());
      }

      // Load initial mock notification alerts feed
      setNotifications([
        { id: "notif_1", type: "success", title: "🌱 Credits Listing Verified", message: "Punjab Field A tillage offset credit package has passed NASA FIRMS audits.", timestamp: "20 minutes ago" },
        { id: "notif_2", type: "info", title: "📈 Marketplace Index Change", message: "Verified carbon credit pricing index increased to 15.2 coins/ton.", timestamp: "1 hour ago" }
      ]);

    } catch (e) {
      console.warn("Failed connecting to marketplace APIs, loading full offline sandbox mocks:", e);
      // Fallback variables
      const mockProjects = [
        { id: "proj_punjab_tillage", name: "🌾 Punjab Zero-Till Agri-Ledger", type: "Soil Sequestration", location: "Amritsar, Punjab", lat: 31.6360, lng: 74.8700, funding_status: "92%", credits_available: 1240.0, price_per_ton_coins: 15.0, vintage_year: 2026, description: "Aggregates smallholder Punjabi wheat farms utilizing cover crops and zero-till methods." },
        { id: "proj_rajasthan_solar", name: "☀️ Rajasthan Thar Desert Solar Sink", type: "Solar Energy", location: "Jodhpur, Rajasthan", lat: 26.2743, lng: 73.0243, funding_status: "78%", credits_available: 5400.0, price_per_ton_coins: 12.0, vintage_year: 2025, description: "Multi-megawatt solar arrays in Jodhpur offsetting conventional fossil energy imports." },
        { id: "proj_himalayan_forests", name: "🌲 Himalayan Foothills Reforestation", type: "Afforestation", location: "Dehradun, Uttarakhand", lat: 30.3165, lng: 78.0322, funding_status: "100%", credits_available: 850.0, price_per_ton_coins: 18.0, vintage_year: 2026, description: "Protected forest ecosystems sequestering carbon while guarding Himalayan local biodiversity." }
      ];

      const mockListings = [
        { id: "list_1", project_id: "proj_punjab_tillage", seller_id: "farmer_punjab", seller_name: "Punjab Field A (Wheat)", volume_tons: 120.0, price_per_ton_coins: 15.0, status: "AVAILABLE", quality_grade: "A+", vintage_year: 2026, verification_confidence: 92.5 },
        { id: "list_2", project_id: "proj_rajasthan_solar", seller_id: "solar_thar", seller_name: "Thar Solar Plant", volume_tons: 350.0, price_per_ton_coins: 12.0, status: "AVAILABLE", quality_grade: "A-", vintage_year: 2025, verification_confidence: 95.0 },
        { id: "list_3", project_id: "proj_himalayan_forests", seller_id: "forest_himalaya", seller_name: "Dehradun Forest Canopy", volume_tons: 50.0, price_per_ton_coins: 18.0, status: "AVAILABLE", quality_grade: "A++", vintage_year: 2026, verification_confidence: 88.0 }
      ];

      const mockWallet = {
        eco_credits_tons: carbonBalance,
        eco_coins: marketplaceBalance,
        purchased_credits_tons: 20.0,
        verified_credits_tons: 12.5,
        ncm_balance_usd: 15000.0,
        ledger_history: [
          { id: "ledger_0", type: "challenge_reward", amount: 100, desc: "Completed challenge: Green Commute Pioneer", timestamp: "2026-06-18T11:00:00Z" },
          { id: "ledger_1", type: "credits_conversion", amount: 500, desc: "Converted 5.0 EcoCredits into EcoCoins", timestamp: "2026-06-17T09:15:00Z" }
        ]
      };

      const mockTransactions = [
        { id: "tx_981a28", listing_id: "list_1", buyer_id: "industry_ludhiana", seller_id: "farmer_punjab", volume_tons: 15.0, total_price_coins: 225.0, timestamp: "2026-06-18T10:30:00Z", status: "COMPLETED" },
        { id: "tx_410b91", listing_id: "list_2", buyer_id: "industry_ludhiana", seller_id: "solar_thar", volume_tons: 5.0, total_price_coins: 60.0, timestamp: "2026-06-15T14:45:00Z", status: "COMPLETED" }
      ];

      const mockPriceHistory = [
        { week: "W16", index_price_coins: 13.5 },
        { week: "W17", index_price_coins: 13.8 },
        { week: "W18", index_price_coins: 14.2 },
        { week: "W19", index_price_coins: 14.0 },
        { week: "W20", index_price_coins: 14.5 },
        { week: "W21", index_price_coins: 14.8 },
        { week: "W22", index_price_coins: 15.0 },
        { week: "W23", index_price_coins: 15.2 },
        { week: "W24", index_price_coins: 15.5 }
      ];

      const mockSummary = {
        live_price_coins: 15.2,
        suggested_price_coins: 16.0,
        credits_available_tons: 520.0,
        verified_farms_count: 48,
        industrial_buyers_count: 18,
        recent_transactions_count: 2
      };

      setSummary(mockSummary);
      setProjects(mockProjects);
      setListings(mockListings);
      setWallet(mockWallet);
      setTransactions(mockTransactions);
      setPriceHistory(mockPriceHistory);
      setNotifications([
        { id: "notif_1", type: "success", title: "🌱 Credits Listing Verified", message: "Punjab Field A tillage offset credit package has passed NASA FIRMS audits.", timestamp: "20 minutes ago" },
        { id: "notif_2", type: "info", title: "📈 Marketplace Index Change", message: "Verified carbon credit pricing index increased to 15.2 coins/ton.", timestamp: "1 hour ago" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [carbonBalance, marketplaceBalance]);

  // Open Google Pay Sandbox checkout modal
  const handleOpenCheckout = (listing: CreditListing) => {
    setSelectedListing(listing);
    setBuyVolume(Math.min(10.0, listing.volume_tons));
    setBuyModalOpen(true);
  };

  // Dossier dossier card purchase trigger
  const handleBuyFromDossier = (vol: number) => {
    if (!activeDossier) return;
    const matchingListing = listings.find(l => l.project_id === activeDossier.id);
    if (matchingListing) {
      setSelectedListing(matchingListing);
      setBuyVolume(vol);
      setBuyModalOpen(true);
    } else {
      addToast(`No active listings matching project: "${activeDossier.name}"`, "error");
    }
  };

  const handleExecuteSandboxCheckout = async () => {
    if (!selectedListing) return;
    setBuyProcessing(true);
    
    if (mode === "demo") {
      const costCoins = buyVolume * selectedListing.price_per_ton_coins;
      const coinFactor = Math.round(costCoins);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = await purchaseCredits(buyVolume, coinFactor);
      if (success) {
        addToast(`Offsets purchased via mock Google Pay Sandbox.`, "success", "Sandbox Authorized");
        
        const newNotif = {
          id: `notif_${Date.now()}`,
          type: "success",
          title: "🛍️ Offset Purchase Successful",
          message: `Purchased ${buyVolume} tons offsets from ${selectedListing.seller_name}.`,
          timestamp: "Just now"
        };
        setNotifications(prev => [newNotif, ...prev]);

        const newTx = {
          id: `tx_${Math.random().toString(36).substr(2, 6)}`,
          listing_id: selectedListing.id,
          buyer_id: "demo_buyer",
          seller_id: selectedListing.project_id,
          volume_tons: buyVolume,
          total_price_coins: costCoins,
          timestamp: new Date().toISOString(),
          status: "COMPLETED"
        };
        setTransactions(prev => [newTx, ...prev]);
        setBuyModalOpen(false);
      }
      setBuyProcessing(false);
      return;
    }
    try {
      const costCoins = buyVolume * selectedListing.price_per_ton_coins;
      
      // Simulate Sandbox transaction latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      const payload = {
        listing_id: selectedListing.id,
        amount_tons: buyVolume
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/marketplace/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (res.ok) {
        // Triggers credits/coins updates in CarbonProvider context
        const costFactor = Math.round(costCoins);
        const success = await purchaseCredits(buyVolume, costFactor);
        if (success) {
          addToast(`Offsets successfully purchased via Google Pay Sandbox.`, "success", "Checkout Verified");
          setBuyModalOpen(false);
          fetchMarketplaceData();
        }
      } else {
        throw new Error("Sandbox payment failure return code");
      }
    } catch (e) {
      // Fallback local updates if offline
      const costCoins = buyVolume * selectedListing.price_per_ton_coins;
      const coinFactor = Math.round(costCoins);
      const success = await purchaseCredits(buyVolume, coinFactor);
      if (success) {
        addToast(`Offsets purchased via mock Google Pay Sandbox.`, "success", "Sandbox Authorized");
        
        // Append a notification locally
        const newNotif: MarketplaceNotification = {
          id: `notif_${Date.now()}`,
          type: "success",
          title: "🛍️ Offset Purchase Successful",
          message: `Purchased ${buyVolume} tons offsets from ${selectedListing.seller_name}.`,
          timestamp: "Just now"
        };
        setNotifications(prev => [newNotif, ...prev]);

        // Log transaction locally
        const newTx = {
          id: `tx_${Math.random().toString(36).substr(2, 6)}`,
          listing_id: selectedListing.id,
          buyer_id: "default_user",
          seller_id: selectedListing.project_id,
          volume_tons: buyVolume,
          total_price_coins: costCoins,
          timestamp: new Date().toISOString(),
          status: "COMPLETED"
        };
        setTransactions(prev => [newTx, ...prev]);

        setBuyModalOpen(false);
      }
    } finally {
      setBuyProcessing(false);
    }
  };

  // Sell credits handler (Farmer perspective)
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelling(true);
    
    if (mode === "demo") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast(`Credits list published on mock marketplace.`, "success", "Listing Created");
      
      const newListing = {
        id: `list_demo_${listings.length + 1}`,
        project_id: sellProjectId,
        seller_name: "Amritsar Field A (Zero-Till Wheat)",
        volume_tons: sellVolume,
        price_per_ton_coins: sellPrice,
        quality_grade: "A+",
        vintage_year: 2026,
        verification_confidence: 94.0
      };
      setListings(prev => [newListing, ...prev]);

      addCredits(-sellVolume);
      spendCoins(-Math.round(sellVolume * sellPrice));

      const newNotif = {
        id: `notif_${Date.now()}`,
        type: "info",
        title: "🌾 Listings Published",
        message: `Farmer listed ${sellVolume} verified credits for sale at ${sellPrice} coins/ton.`,
        timestamp: "Just now"
      };
      setNotifications(prev => [newNotif, ...prev]);
      setSelling(false);
      return;
    }
    try {
      const selectedProject = projects.find(p => p.id === sellProjectId);
      const projName = selectedProject ? selectedProject.name.split(" ")[1] : "Punjab Field";

      const payload = {
        project_id: sellProjectId,
        seller_name: `Punjab Field A (${projName})`,
        volume_tons: sellVolume,
        listing_price_coins: sellPrice
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/marketplace/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (res.ok) {
        addToast(`Verified credits published on marketplace listings.`, "success", "Listing Created");
        fetchMarketplaceData();
      } else {
        throw new Error("Create listing backend error");
      }
    } catch (err) {
      console.warn("Failed creating listing via API router, using offline fallback updates:", err);
      // Simulate local changes
      addToast(`Credits list published on mock marketplace.`, "success", "Listing Created");
      
      const newListing: CreditListing = {
        id: `list_${listings.length + 1}`,
        project_id: sellProjectId,
        seller_name: "Punjab Field A (Wheat Tillage)",
        volume_tons: sellVolume,
        price_per_ton_coins: sellPrice,
        quality_grade: "A+",
        vintage_year: 2026,
        verification_confidence: 94.0
      };
      setListings(prev => [newListing, ...prev]);

      // Deduct verified credits from balance, add coins
      addCredits(-sellVolume);
      spendCoins(-Math.round(sellVolume * sellPrice)); // add coins balance (negative spend)

      // Add notification
      const newNotif: MarketplaceNotification = {
        id: `notif_${Date.now()}`,
        type: "info",
        title: "🌾 Listings Published",
        message: `Farmer listed ${sellVolume} verified credits for sale at ${sellPrice} coins/ton.`,
        timestamp: "Just now"
      };
      setNotifications(prev => [newNotif, ...prev]);
    } finally {
      setSelling(false);
    }
  };

  // Convert rewards handler (Urban perspective)
  const handleConvertCredits = async (amount: number) => {
    if (mode === "demo") {
      addToast(`Converted ${amount} EcoCredits offsets to ${Math.round(amount * 100)} EcoCoins rewards.`, "success", "Conversion Successful");
      addCredits(-amount);
      spendCoins(-Math.round(amount * 100));
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/marketplace/convert-rewards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits_amount: amount }),
        credentials: "include"
      });
      if (res.ok) {
        addToast(`Successfully converted ${amount} EcoCredits to spendable EcoCoins.`, "success");
        fetchMarketplaceData();
      } else {
        throw new Error("Convert credits return failure");
      }
    } catch (e) {
      // Offline fallback
      addToast(`Converted ${amount} EcoCredits offsets to ${Math.round(amount * 100)} EcoCoins rewards.`, "success", "Conversion Successful");
      
      // Update Carbon Provider context
      addCredits(-amount);
      spendCoins(-Math.round(amount * 100)); // add coins balance (negative spend)
    }
  };

  // Select project marker on map
  const handleProjectSelect = (proj: ProjectInfo) => {
    setSelectedProjectId(proj.id);
    setActiveDossier(proj);
    addToast(`Opened project profile dossier: "${proj.name}".`, "info");
  };

  // Search/Filters filters
  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.seller_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedType ? l.project_id.includes(selectedType) : true;
    const matchesGrade = selectedRating ? l.quality_grade === selectedRating : true;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedType ? p.type.toLowerCase().includes(selectedType.toLowerCase()) : true;
    return matchesSearch && matchesCategory;
  });

  const clearNotifications = () => {
    setNotifications([]);
    addToast("Alerts history cleared.", "info");
  };

  if (loading) {
    return <LoadingScreen message="Loading EcoSphere Carbon Marketplace..." />;
  }

  const livePrice = summary?.live_price_coins ?? 15.0;
  const creditsAvailable = summary?.credits_available_tons ?? 500.0;
  const verifiedFarms = summary?.verified_farms_count ?? 40;
  const industrialBuyers = summary?.industrial_buyers_count ?? 15;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <HeroSection
        title="EcoSphere Carbon Credits Marketplace"
        description="Trade verified agriculture soil-sequestration, desert solar grids, and reforestation carbon credits. Audited pricing indices guarantee full compliance backing."
        primaryActionLabel="Audit Active Listings"
        secondaryActionLabel="Check Conversions Rate"
        onPrimaryClick={() => addToast("Active marketplace listings filtered to zero-till cover crops.", "info")}
        onSecondaryClick={() => addToast("1.0 Carbon Credit converts to 100 EcoCoins.", "info")}
      />

      {/* Header and balances widget */}
      <MarketplaceHeader
        carbonBalance={carbonBalance}
        marketplaceBalance={marketplaceBalance}
      />

      {/* Primary Market Indicators */}
      <MarketplaceStatistics
        livePriceCoins={livePrice}
        creditsAvailableTons={creditsAvailable}
        verifiedFarmsCount={verifiedFarms}
        industrialBuyersCount={industrialBuyers}
      />

      {/* Project Maps and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: map & list */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Regional Offset Projects Map
            </span>
            <ProjectMap
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={handleProjectSelect}
              height="400px"
            />
          </div>

          {/* Search/Filters */}
          <MarketplaceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
          />

          {/* Listings Grid */}
          <div className="space-y-4">
            <h3 className="font-display font-black text-sm text-text-deep uppercase block">
              Active Offsets Listings ({filteredListings.length})
            </h3>
            
            {filteredListings.length === 0 ? (
              <div className="bg-white border border-border p-8 rounded-2xl text-center text-xs text-text-muted font-bold">
                No active listings match your selected search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <CreditCard
                    key={listing.id}
                    listing={listing}
                    onBuyClick={handleOpenCheckout}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-black text-sm text-text-deep uppercase block">
              Registered Carbon Offset Projects ({filteredProjects.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onViewDetails={handleProjectSelect}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right column: wallet, trends, timeline, alerts */}
        <div className="flex flex-col gap-6">
          
          {/* User Wallet Card */}
          <WalletCard
            ecoCredits={carbonBalance}
            ecoCoins={marketplaceBalance}
            purchasedCredits={wallet?.purchased_credits_tons ?? 20.0}
            verifiedCredits={wallet?.verified_credits_tons ?? 0.0}
            ledgerHistory={wallet?.ledger_history || []}
            onConvertCredits={handleConvertCredits}
          />

          {/* Farmer Sell Panel (Dynamic context role check) */}
          {role === "farmer" && (
            <Card title="🌾 Farmer Listing Publisher" description="Publish your verified carbon credits onto the marketplace." className="border-2 border-[#1B5E20]/30 shadow">
              <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sell-project-select" className="font-bold text-text-deep uppercase text-[9px]">Select Mapped Field Registry</label>
                  <select
                    id="sell-project-select"
                    value={sellProjectId}
                    onChange={(e) => setSellProjectId(e.target.value)}
                    className="w-full bg-white border border-border px-3 py-2 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="sell-volume-input" className="font-bold text-text-deep uppercase text-[9px]">Volume (Tons)</label>
                    <input
                      id="sell-volume-input"
                      type="number"
                      min="1.0"
                      step="0.5"
                      value={sellVolume}
                      onChange={(e) => setSellVolume(Math.max(1.0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white border border-border px-3 py-2 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="sell-price-input" className="font-bold text-text-deep uppercase text-[9px]">Price per Ton (Coins)</label>
                    <input
                      id="sell-price-input"
                      type="number"
                      min="5.0"
                      step="0.5"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Math.max(5.0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white border border-border px-3 py-2 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F1F8E9] border border-border rounded-xl flex justify-between font-semibold">
                  <span className="text-text-muted">Expected Revenue:</span>
                  <span className="font-black text-[#2E7D32]">
                    {(sellVolume * sellPrice).toLocaleString()} coins
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={selling}
                  className="w-full py-3 bg-[#2E7D32] hover:bg-[#2E7D32]/95 text-white font-bold text-xs rounded-full shadow-xs hover:shadow transition-smooth cursor-pointer disabled:opacity-40"
                >
                  {selling ? "Publishing listing details..." : "Publish Credits to Marketplace"}
                </button>
              </form>
            </Card>
          )}

          {/* Pricing Chart */}
          <PriceChart trend={priceHistory} />

          {/* Notifications Alerts Panel */}
          <NotificationCenter
            notifications={notifications}
            onClear={clearNotifications}
          />

          {/* Transaction Ledger Timelines */}
          <TransactionTimeline transactions={transactions} />

        </div>

      </div>

      {/* Selected Project Dossier details drawer */}
      {activeDossier && (
        <ProjectDetails
          project={activeDossier}
          onClose={() => setActiveDossier(null)}
          onBuyClick={handleBuyFromDossier}
        />
      )}

      {/* Google Pay Sandbox checkout Modal */}
      {buyModalOpen && selectedListing && (
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
                onClick={() => setBuyModalOpen(false)}
                className="text-text-muted hover:text-text-deep font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Inputs volume */}
            <div className="space-y-3.5 text-xs bg-[#F1F8E9]/60 p-4 rounded-xl border border-border">
              <div className="flex justify-between border-b border-border/40 pb-2 items-center">
                <label htmlFor="buy-volume-input" className="text-text-muted font-semibold">Tons of Offsets (CO₂e):</label>
                <input
                  id="buy-volume-input"
                  type="number"
                  min="1"
                  max={selectedListing.volume_tons}
                  value={buyVolume}
                  onChange={(e) => setBuyVolume(Math.max(1, Math.min(selectedListing.volume_tons, parseFloat(e.target.value) || 0)))}
                  className="bg-white border border-border px-2 py-1 rounded w-20 text-right font-bold text-text-deep"
                />
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-text-muted font-semibold">Selected Listing:</span>
                <span className="font-bold text-text-deep truncate max-w-[180px]">{selectedListing.seller_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-semibold">Simulated Cost:</span>
                <span className="font-bold text-[#2E7D32]">{(buyVolume * selectedListing.price_per_ton_coins).toLocaleString()} EcoCoins</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-neutral-500 rounded-lg text-[9px] leading-relaxed font-semibold">
              ℹ️ Google Pay Sandbox integration is temporarily disabled for the PromptWars build.
            </div>

            <div className="relative group w-full">
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-200 text-neutral-400 font-bold text-xs rounded-lg transition-smooth cursor-not-allowed shadow-sm"
              >
                <LucideCreditCard className="h-4 w-4" />
                <span>Google Pay (Coming Soon)</span>
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block w-full text-center">
                <span className="bg-black text-white text-[10px] px-2 py-1 rounded opacity-90">
                  Payments are disabled in the demo.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
