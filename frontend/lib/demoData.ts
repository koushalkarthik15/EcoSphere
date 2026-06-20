// EcoSphere Dedicated High-Fidelity Demo Datasets
// Serves as the single source of truth for Demo Mode simulation

export const URBAN_DEMO_DATA = {
  telemetry: {
    air_quality: {
      no2_ppb: 14.2,
      status: "healthy",
      label: "Excellent",
      baseline_comparison: {
        historical_no2: 24.5,
        variance_percentage: -42.0
      }
    },
    surface_temperature: {
      landsat_surface_c: 24.8,
      ambient_air_c: 23.5,
      heat_island_intensity: "low"
    }
  },
  recommendations: [
    {
      id: "rec_1",
      title: "Optimize Bicycle Transit corridor",
      description: "Ludhiana Model Town green corridor reports clean air. Cycling avoids 1.5kg CO2 emissions compared to driving today.",
      impact: "High",
      type: "transit"
    },
    {
      id: "rec_2",
      title: "Peak Solar Window Active",
      description: "Atmospheric transparency model predicts peak solar PV yield. Recommend smart appliances cycle now.",
      impact: "Medium",
      type: "energy"
    }
  ],
  challenges: [
    {
      id: "ch_1",
      title: "🚆 Green Commute Pioneer",
      description: "Take public transit today for your daily commute.",
      target_offset_kg: 1.2,
      credits_reward: 2.5,
      completed: false
    },
    {
      id: "ch_2",
      title: "🚶 Clean Active Commute",
      description: "Walk or cycle for at least 2 kilometers to avoid local stack grid load.",
      target_offset_kg: 0.5,
      credits_reward: 1.5,
      completed: true
    },
    {
      id: "ch_3",
      title: "🔋 Peak Hours Displace",
      description: "Shut off non-critical home appliances between 6 PM and 8 PM.",
      target_offset_kg: 0.8,
      credits_reward: 2.0,
      completed: false
    }
  ],
  achievements: [
    {
      id: "ach_1",
      title: "Zero Emission Rookie",
      description: "Offset first 5kg of CO2 using carbon-neutral transit choices.",
      badge_icon: "🥉",
      earned: true
    },
    {
      id: "ach_2",
      title: "Heat Island Shield",
      description: "Walked 5 kilometers through designated green canopy zones.",
      badge_icon: "🛡️",
      earned: true
    },
    {
      id: "ach_3",
      title: "Atmospheric Guardian",
      description: "Log active coordinates AQI verification checks for 5 consecutive days.",
      badge_icon: "👑",
      earned: false
    }
  ],
  summary: {
    daily_streak: 6,
    ecocredits_rank: "Eco Champion (Lvl 5)",
    carbon_score: 94
  }
};

export const FARMER_DEMO_DATA = {
  summary: {
    fields: [
      {
        id: "field_demo_a",
        name: "Amritsar Field A (Zero-Till Wheat)",
        crop_type: "Wheat",
        practice: "conservation",
        acreage: 15.2,
        polygon: [
          { lat: 31.6380, lng: 74.8650 },
          { lat: 31.6420, lng: 74.8650 },
          { lat: 31.6420, lng: 74.8710 },
          { lat: 31.6380, lng: 74.8710 }
        ],
        mean_ndvi: 0.81,
        soil_moisture_pct: 48.6,
        days_active: 135
      },
      {
        id: "field_demo_b",
        name: "Amritsar Field B (Dry Cover Crop)",
        crop_type: "Legumes",
        practice: "conservation",
        acreage: 10.5,
        polygon: [
          { lat: 31.6300, lng: 74.8750 },
          { lat: 31.6350, lng: 74.8750 },
          { lat: 31.6350, lng: 74.8820 },
          { lat: 31.6300, lng: 74.8820 }
        ],
        mean_ndvi: 0.54,
        soil_moisture_pct: 32.1,
        days_active: 75
      }
    ],
    total_acreage: 25.7,
    total_verified_credits: 382.4,
    total_pending_credits: 18.5,
    sequestration_goal_pct: 91.2
  },
  satellite_analysis: {
    field_demo_a: {
      field_id: "field_demo_a",
      ndvi: 0.81,
      soil_moisture_pct: 48.6,
      biomass_score: 0.89,
      carbon_estimate_tons: 2.15,
      confidence_score: 94.8
    },
    field_demo_b: {
      field_id: "field_demo_b",
      ndvi: 0.54,
      soil_moisture_pct: 32.1,
      biomass_score: 0.62,
      carbon_estimate_tons: 1.12,
      confidence_score: 91.5
    }
  },
  fire_detection: {
    field_demo_a: {
      status: "SAFE",
      field_id: "field_demo_a",
      active_burns_detected: 0,
      severity: "NONE",
      affected_area_percentage: 0.0,
      estimated_carbon_loss_tons: 0.0,
      alert_timestamp: null
    },
    field_demo_b: {
      status: "WARNING",
      field_id: "field_demo_b",
      active_burns_detected: 0,
      severity: "LOW",
      affected_area_percentage: 0.0,
      estimated_carbon_loss_tons: 0.0,
      alert_timestamp: null
    }
  },
  carbon_ledger: {
    field_demo_a: {
      estimated_storage_tons: 685.2,
      sequestration_rate_annual_tons: 0.412,
      season_gain_tons: 2.15,
      annual_projection_tons: 5.84,
      soil_health_score: 92,
      biomass_trend: "Outstanding Growth",
      explanation: "Calculated for a 15.2-acre Amritsar Field A using conservation farming practices. Multi-band spectrometry reports dense vegetative cover with high-performance carbon sink absorption."
    },
    field_demo_b: {
      estimated_storage_tons: 420.5,
      sequestration_rate_annual_tons: 0.285,
      season_gain_tons: 1.12,
      annual_projection_tons: 3.25,
      soil_health_score: 76,
      biomass_trend: "Steady Regeneration",
      explanation: "Calculated for a 10.5-acre Amritsar Field B using crop rotation and zero tillage. Radar readings confirm moisture stability with moderate root carbon accumulation."
    }
  },
  credit_verification: {
    field_demo_a: {
      field_id: "field_demo_a",
      verification_status: "VERIFIED",
      details: {
        status: "VERIFIED",
        verified_credits: 2.15,
        pending_credits: 0.0,
        rejected_credits: 0.0,
        verification_reason: "Spectral signatures confirm compliance. Cover crop tillage verifies maximum soil-sink capacity. NASA FIRMS verifies zero stubble-burn activity."
      }
    },
    field_demo_b: {
      field_id: "field_demo_b",
      verification_status: "PENDING",
      details: {
        status: "PENDING",
        verified_credits: 0.0,
        pending_credits: 1.12,
        rejected_credits: 0.0,
        verification_reason: "Tillage boundary verified. Baseline validation pending upcoming Copernicus multi-spectral flyover schedule."
      }
    }
  },
  notifications: [
    {
      id: "notif_f_1",
      type: "fire_hazard",
      title: "🔥 External Burn Alert",
      message: "NASA FIRMS coordinates report fire thermal anomalies 3.2km west of Field A boundaries.",
      timestamp: "5 mins ago"
    },
    {
      id: "notif_f_2",
      type: "moisture_warning",
      title: "💧 Moisture Levels Optimal",
      message: "Sentinel-1 radar readings report steady 48.6% moisture in Field A. No irrigation required.",
      timestamp: "3 hours ago"
    }
  ]
};

export const INDUSTRY_DEMO_DATA = {
  summary: {
    facilities: [
      {
        id: "fac_demo_a",
        name: "Ludhiana Bio-Energy Refinery",
        registry_id: "IND-LDH-BIO-902",
        acreage: 22.4,
        roof_area_sq_meters: 8400.0,
        compliance_rating: "A",
        overall_esg_score: 91,
        scope_1_status: "Compliant",
        scope_2_status: "Compliant",
        marketplace_balance: 45000.0,
        lat: 30.9020,
        lng: 75.8520,
        baseline_co2_tons: 14200.0,
        boundaries: [
          { lat: 30.8980, lng: 75.8470 },
          { lat: 30.9060, lng: 75.8470 },
          { lat: 30.9060, lng: 75.8570 },
          { lat: 30.8980, lng: 75.8570 }
        ],
        assets: [
          { name: "Primary Biomass Reactor", polygon: [{ lat: 30.9010, lng: 75.8490 }, { lat: 30.9040, lng: 75.8490 }, { lat: 30.9040, lng: 75.8520 }, { lat: 30.9010, lng: 75.8520 }], type: "factory" },
          { name: "Feedstock Storage Canopy", polygon: [{ lat: 30.9020, lng: 75.8530 }, { lat: 30.9050, lng: 75.8530 }, { lat: 30.9050, lng: 75.8550 }, { lat: 30.9020, lng: 75.8550 }], type: "warehouse" },
          { name: "Greenhouse Admin HQ", polygon: [{ lat: 30.8990, lng: 75.8500 }, { lat: 30.9005, lng: 75.8500 }, { lat: 30.9005, lng: 75.8515 }, { lat: 30.8990, lng: 75.8515 }], type: "admin" }
        ]
      },
      {
        id: "fac_demo_b",
        name: "Ludhiana Heavy Castings",
        registry_id: "IND-LDH-MET-441",
        acreage: 18.6,
        roof_area_sq_meters: 11200.0,
        compliance_rating: "B-",
        overall_esg_score: 68,
        scope_1_status: "Warning (High CH4)",
        scope_2_status: "Exceeded Limit",
        marketplace_balance: 18200.0,
        lat: 30.8850,
        lng: 75.8200,
        baseline_co2_tons: 29800.0,
        boundaries: [
          { lat: 30.8800, lng: 75.8150 },
          { lat: 30.8900, lng: 75.8150 },
          { lat: 30.8900, lng: 75.8250 },
          { lat: 30.8800, lng: 75.8250 }
        ],
        assets: [
          { name: "Smelting Furnace 1", polygon: [{ lat: 30.8810, lng: 75.8160 }, { lat: 30.8840, lng: 75.8160 }, { lat: 30.8840, lng: 75.8190 }, { lat: 30.8810, lng: 75.8190 }], type: "factory" },
          { name: "Foundry Coke Block", polygon: [{ lat: 30.8850, lng: 75.8170 }, { lat: 30.8880, lng: 75.8170 }, { lat: 30.8880, lng: 75.8200 }, { lat: 30.8850, lng: 75.8200 }], type: "factory" },
          { name: "Coke Storage Silos", polygon: [{ lat: 30.8820, lng: 75.8210 }, { lat: 30.8840, lng: 75.8210 }, { lat: 30.8840, lng: 75.8235 }, { lat: 30.8820, lng: 75.8235 }], type: "storage_tanks" }
        ]
      }
    ]
  },
  emission_analysis: {
    fac_demo_a: {
      ghg_analysis: {
        methane_excess_ppb: 5.2,
        ch4_leak_tons_year: 0.04,
        so2_leak_tons_year: 0.01,
        ch4_co2e_tons_year: 1.12,
        scope_1_annual_co2e_tons: 14201.12,
        scope_2_annual_co2e_tons: 2420.0,
        total_annual_co2e_tons: 16621.12,
        monthly_co2e_tons: 1385.1,
        leak_severity: "LOW",
        annual_financial_loss_usd: 5400.0,
        regulatory_tax_exposure_usd: 415000.0
      }
    },
    fac_demo_b: {
      ghg_analysis: {
        methane_excess_ppb: 64.8,
        ch4_leak_tons_year: 0.52,
        so2_leak_tons_year: 0.09,
        ch4_co2e_tons_year: 14.56,
        scope_1_annual_co2e_tons: 29814.56,
        scope_2_annual_co2e_tons: 8400.0,
        total_annual_co2e_tons: 38214.56,
        monthly_co2e_tons: 3184.5,
        leak_severity: "HIGH",
        annual_financial_loss_usd: 71200.0,
        regulatory_tax_exposure_usd: 4775000.0
      }
    }
  },
  gas_detection: {
    fac_demo_a: {
      facility_id: "fac_demo_a",
      gases: {
        methane_ppb: 1855.2,
        sulfur_dioxide_ppb: 0.12,
        nitrogen_dioxide_ppb: 12.4,
        wind_direction_degrees: 280.0,
        wind_speed_mps: 5.2
      },
      telemetry_confidence: {
        score: 95.2,
        data_sources: ["Sentinel-5P Orbit L3", "Ludhiana IoT Spectrometers"]
      }
    },
    fac_demo_b: {
      facility_id: "fac_demo_b",
      gases: {
        methane_ppb: 1914.8,
        sulfur_dioxide_ppb: 1.84,
        nitrogen_dioxide_ppb: 38.6,
        wind_direction_degrees: 220.0,
        wind_speed_mps: 3.8
      },
      telemetry_confidence: {
        score: 89.4,
        data_sources: ["Sentinel-5P Orbit L3 Offline Cache"]
      }
    }
  },
  compliance: {
    fac_demo_a: {
      facility_id: "fac_demo_a",
      compliance_rating: "A",
      esg_score: 91,
      risk_summary: {
        risk_rating: "Low",
        risk_status: "healthy",
        active_leak_detected: false
      },
      compliance_checklist: [
        { rule: "Scope 1 emissions under carbon limits cap", passed: true },
        { rule: "No critical methane/SO₂ point leaks detected", passed: true },
        { rule: "Sentinel-5P telemetry confidence exceeds 85%", passed: true },
        { rule: "ESG audit file records up-to-date", passed: true }
      ],
      scope_1_status: "Compliant",
      scope_2_status: "Compliant"
    },
    fac_demo_b: {
      facility_id: "fac_demo_b",
      compliance_rating: "B-",
      esg_score: 68,
      risk_summary: {
        risk_rating: "Critical (Methane Plume)",
        risk_status: "critical",
        active_leak_detected: true
      },
      compliance_checklist: [
        { rule: "Scope 1 emissions under carbon limits cap", passed: true },
        { rule: "No critical methane/SO₂ point leaks detected", passed: false },
        { rule: "Sentinel-5P telemetry confidence exceeds 85%", passed: true },
        { rule: "ESG audit file records up-to-date", passed: true }
      ],
      scope_1_status: "Warning (High CH4)",
      scope_2_status: "Exceeded Limit"
    }
  },
  solar_potential: {
    fac_demo_a: {
      capacity_kw: 840.0,
      install_cost_usd: 980000.0,
      annual_savings_usd: 125000.0,
      payback_period_months: 94.0,
      esg_improvement_score: 18
    },
    fac_demo_b: {
      capacity_kw: 1120.0,
      install_cost_usd: 1340000.0,
      annual_savings_usd: 168000.0,
      payback_period_months: 95.0,
      esg_improvement_score: 15
    }
  },
  financial_report: {
    fac_demo_a: {
      carbon_tax_liability_usd: 415000.0,
      operational_waste_usd: 5400.0,
      leak_repair_savings_usd: 4860.0,
      annual_savings_total_usd: 129860.0
    },
    fac_demo_b: {
      carbon_tax_liability_usd: 4775000.0,
      operational_waste_usd: 71200.0,
      leak_repair_savings_usd: 64080.0,
      annual_savings_total_usd: 232080.0
    }
  },
  marketplace_recommendation: {
    fac_demo_a: {
      annual_emissions_tons: 16621.12,
      target_reduction_percentage: 50.0,
      credits_required_tons: 8310.0,
      estimated_purchase_cost_usd: 124650.0,
      estimated_purchase_cost_coins: 83100.0,
      carbon_neutrality_timeline: "12 months (Rapid Net-Zero)",
      neutrality_months: 12,
      recommended_projects: [
        { id: "proj_punjab_tillage", name: "🌾 Punjab Zero-Till Agri-Ledger", type: "Soil Sequestration", location: "Amritsar, Punjab", credits_available: 1240.0, price_per_ton_usd: 15.0 }
      ],
      budget_status: "SUFFICIENT"
    },
    fac_demo_b: {
      annual_emissions_tons: 38214.56,
      target_reduction_percentage: 50.0,
      credits_required_tons: 19107.0,
      estimated_purchase_cost_usd: 286605.0,
      estimated_purchase_cost_coins: 191070.0,
      carbon_neutrality_timeline: "24 months (Standard Net-Zero)",
      neutrality_months: 24,
      recommended_projects: [
        { id: "proj_punjab_tillage", name: "🌾 Punjab Zero-Till Agri-Ledger", type: "Soil Sequestration", location: "Amritsar, Punjab", credits_available: 1240.0, price_per_ton_usd: 15.0 },
        { id: "proj_rajasthan_solar", name: "☀️ Rajasthan Solar Sink", type: "Solar Energy", location: "Jodhpur, Rajasthan", credits_available: 5400.0, price_per_ton_usd: 12.0 }
      ],
      budget_status: "DEFICIT"
    }
  },
  historical_trends: {
    fac_demo_a: [
      { year: 2022, co2_equivalent_tons: 18200.0, methane_ppb: 1885.0 },
      { year: 2023, co2_equivalent_tons: 17400.0, methane_ppb: 1875.0 },
      { year: 2024, co2_equivalent_tons: 16900.0, methane_ppb: 1865.0 },
      { year: 2025, co2_equivalent_tons: 16750.0, methane_ppb: 1860.0 },
      { year: 2026, co2_equivalent_tons: 16621.1, methane_ppb: 1855.2 }
    ],
    fac_demo_b: [
      { year: 2022, co2_equivalent_tons: 42300.0, methane_ppb: 1940.0 },
      { year: 2023, co2_equivalent_tons: 41200.0, methane_ppb: 1935.0 },
      { year: 2024, co2_equivalent_tons: 39800.0, methane_ppb: 1928.0 },
      { year: 2025, co2_equivalent_tons: 38900.0, methane_ppb: 1920.0 },
      { year: 2026, co2_equivalent_tons: 38214.5, methane_ppb: 1914.8 }
    ]
  }
};

export const MARKETPLACE_DEMO_DATA = {
  summary: {
    live_price_coins: 15.0,
    suggested_price_coins: 15.5,
    credits_available_tons: 7490.0,
    verified_farms_count: 52,
    industrial_buyers_count: 24,
    recent_transactions_count: 4
  },
  projects: [
    {
      id: "proj_punjab_tillage",
      name: "🌾 Punjab Zero-Till Agri-Ledger",
      type: "Soil Sequestration",
      location: "Amritsar, Punjab",
      lat: 31.6360,
      lng: 74.8700,
      funding_status: "95%",
      credits_available: 1240.0,
      price_per_ton_coins: 15.0,
      vintage_year: 2026,
      description: "Aggregates smallholder Punjabi wheat farms utilizing cover crops and zero-till soil sequestration methodologies, audited via Sentinel-1 SAR radar imagery."
    },
    {
      id: "proj_rajasthan_solar",
      name: "☀️ Rajasthan Thar Desert Solar Sink",
      type: "Solar Energy",
      location: "Jodhpur, Rajasthan",
      lat: 26.2743,
      lng: 73.0243,
      funding_status: "84%",
      credits_available: 5400.0,
      price_per_ton_coins: 12.0,
      vintage_year: 2025,
      description: "Multi-megawatt solar arrays in Rajasthan Thar Desert offsetting local utility grid dependencies, with visual validation via Landsat thermal bands."
    },
    {
      id: "proj_himalayan_forests",
      name: "🌲 Himalayan Foothills Reforestation",
      type: "Afforestation",
      location: "Dehradun, Uttarakhand",
      lat: 30.3165,
      lng: 78.0322,
      funding_status: "100%",
      credits_available: 850.0,
      price_per_ton_coins: 18.0,
      vintage_year: 2026,
      description: "Protected montane forest canopies absorbing atmospheric carbon dioxide while preserving fragile biodiversity in Northern India hills."
    }
  ],
  listings: [
    {
      id: "list_demo_1",
      project_id: "proj_punjab_tillage",
      seller_id: "farmer_punjab_demo",
      seller_name: "Punjab Field A (Wheat)",
      volume_tons: 120.0,
      price_per_ton_coins: 15.0,
      status: "AVAILABLE",
      quality_grade: "A+",
      vintage_year: 2026,
      verification_confidence: 94.8
    },
    {
      id: "list_demo_2",
      project_id: "proj_rajasthan_solar",
      seller_id: "solar_thar_demo",
      seller_name: "Thar Solar Block C",
      volume_tons: 350.0,
      price_per_ton_coins: 12.0,
      status: "AVAILABLE",
      quality_grade: "A-",
      vintage_year: 2025,
      verification_confidence: 95.0
    },
    {
      id: "list_demo_3",
      project_id: "proj_himalayan_forests",
      seller_id: "forest_himalaya_demo",
      seller_name: "Dehradun Canopy Registry",
      volume_tons: 50.0,
      price_per_ton_coins: 18.0,
      status: "AVAILABLE",
      quality_grade: "A++",
      vintage_year: 2026,
      verification_confidence: 91.2
    }
  ],
  wallet: {
    eco_credits_tons: 120.5,
    eco_coins: 2500,
    purchased_credits_tons: 45.0,
    verified_credits_tons: 12.5,
    ncm_balance_usd: 15000.0,
    ledger_history: [
      { id: "ledger_d_0", type: "challenge_reward", amount: 150, desc: "Completed challenge: Clean Active Commute", timestamp: "2026-06-20T11:00:00Z" },
      { id: "ledger_d_1", type: "credits_conversion", amount: 300, desc: "Converted 3.0 EcoCredits into EcoCoins", timestamp: "2026-06-19T09:15:00Z" }
    ]
  },
  transactions: [
    {
      id: "tx_demo_01",
      listing_id: "list_demo_1",
      buyer_id: "industry_demo_buyer",
      seller_id: "farmer_punjab_demo",
      volume_tons: 10.0,
      total_price_coins: 150.0,
      timestamp: "2026-06-20T08:30:00Z",
      status: "COMPLETED"
    },
    {
      id: "tx_demo_02",
      listing_id: "list_demo_2",
      buyer_id: "industry_demo_buyer",
      seller_id: "solar_thar_demo",
      volume_tons: 25.0,
      total_price_coins: 300.0,
      timestamp: "2026-06-19T14:45:00Z",
      status: "COMPLETED"
    }
  ],
  priceHistory: [
    { week: "W18", index_price_coins: 13.2 },
    { week: "W19", index_price_coins: 13.5 },
    { week: "W20", index_price_coins: 14.0 },
    { week: "W21", index_price_coins: 14.2 },
    { week: "W22", index_price_coins: 14.8 },
    { week: "W23", index_price_coins: 15.0 }
  ],
  notifications: [
    { id: "notif_m_1", type: "success", title: "🌱 Credits Audited", message: "Punjab Field A tillage offset credits package successfully passed GEE and NASA FIRMS check.", timestamp: "12 mins ago" },
    { id: "notif_m_2", type: "info", title: "📈 Index Update", message: "EcoSphere Carbon Credits pricing index increased to 15.0 coins/ton.", timestamp: "2 hours ago" }
  ]
};
