export interface ScenarioPresetKnobs {
  demandMult: number;
  shockDays: number;
  shelfLifeCutDays: number;
  replenishBlockedDays: number;
}

export interface TraceStep {
  name: string;
  status: "ok" | "warn" | "error";
  durationMs: number;
  input: any;
  output: any;
}

export interface SkuTrace {
  id: string;
  storeId: string;
  sku: string;
  productName: string;
  steps: {
    coordinator: TraceStep;
    optionsPricer: TraceStep;
    stockAnalyst: TraceStep;
    spoilageEstimator: TraceStep;
    demandForecaster: TraceStep;
  };
}

export interface PlannerProposal {
  id: string;
  sku: string;
  productName: string;
  storeId: string;
  category: "produce" | "bakery" | "dairy" | "meat" | "deli";
  riskLevel: "high" | "medium" | "low";
  quantity: number;
  daysToExpiry: number;
  forecast7d: number;
  action: "donate" | "markdown" | "transfer" | "replenish" | "no_action";
  actionLabel: string;
  status: "proposed" | "approved" | "rejected" | "executed" | "superseded";
  expectedNetImpact: number;
  narrative: string;
  mathematicalBreakdown: {
    unsoldProjectedQty: number;
    totalStock: number;
    percentAtRisk: number;
    dailyDemand: number;
    salvageRecovery: number;
    handlingCost: number;
    optionsEvaluated: number;
    co2KgSaved: number;
  };
}

export interface PolicyMetricComparison {
  preset: string;
  wasteUnits: { agentic: number; fifo: number; fixed: number; winner: string };
  stockouts: { agentic: number; fifo: number; fixed: number; winner: string };
  netMarginUsd: { agentic: number; fifo: number; fixed: number; winner: string };
  revenueUsd: { agentic: number; fifo: number; fixed: number; winner: string };
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  summary: any;
  status: string;
}

export const initialPresets: Record<string, ScenarioPresetKnobs> = {
  demand_spike: {
    demandMult: 1.5,
    shockDays: 7,
    shelfLifeCutDays: 0,
    replenishBlockedDays: 0,
  },
  excess_inventory: {
    demandMult: 1.0,
    shockDays: 5,
    shelfLifeCutDays: 0,
    replenishBlockedDays: 2,
  },
  cold_chain_failure: {
    demandMult: 0.9,
    shockDays: 4,
    shelfLifeCutDays: 3,
    replenishBlockedDays: 1,
  },
  baseline: {
    demandMult: 1.0,
    shockDays: 0,
    shelfLifeCutDays: 0,
    replenishBlockedDays: 0,
  },
};

export const samplePlannerProposals: PlannerProposal[] = [
  {
    id: "prop-69f59e",
    sku: "BAN-1KG",
    productName: "Bananas 1kg",
    storeId: "store_003",
    category: "produce",
    riskLevel: "high",
    quantity: 108,
    daysToExpiry: 3,
    forecast7d: 182.8,
    action: "donate",
    actionLabel: "donate ×108",
    status: "proposed",
    expectedNetImpact: -20.52,
    narrative:
      "Bananas 1kg at store_003: 108 of 290 units projected unsold before expiry (37%). First batch expires in 3 day(s). Forecast daily demand ~26.1/day cannot clear stock in time. Forecast ~183 units /7d (80% interval shown). Recommended: donate x108 — Donate 108u with >=1d shelf left; recovery $25.92, handling $5.40 (lowest expected loss $-20.52 among 6 feasible options).",
    mathematicalBreakdown: {
      unsoldProjectedQty: 108,
      totalStock: 290,
      percentAtRisk: 37,
      dailyDemand: 26.1,
      salvageRecovery: 25.92,
      handlingCost: 5.4,
      optionsEvaluated: 6,
      co2KgSaved: 86.4,
    },
  },
  {
    id: "prop-a81a11",
    sku: "BREAD-WH",
    productName: "Whole Wheat Bread",
    storeId: "store_001",
    category: "bakery",
    riskLevel: "high",
    quantity: 44,
    daysToExpiry: 2,
    forecast7d: 147.0,
    action: "donate",
    actionLabel: "donate ×44",
    status: "proposed",
    expectedNetImpact: -11.88,
    narrative:
      "Whole Wheat Bread at store_001: 44 of 149 units at risk (30%). First batch expires in 2 day(s). Monitor; markdown or transfer may avoid waste. Forecast ~147 units /7d (80% interval shown). Recommended: donate x44 — Donate 44u with >=1d shelf left; recovery $14.08, handling $2.20 (lowest expected loss $-11.88 among 6 feasible options).",
    mathematicalBreakdown: {
      unsoldProjectedQty: 44,
      totalStock: 149,
      percentAtRisk: 30,
      dailyDemand: 21.0,
      salvageRecovery: 14.08,
      handlingCost: 2.2,
      optionsEvaluated: 6,
      co2KgSaved: 22.0,
    },
  },
  {
    id: "prop-3c2afc",
    sku: "MILK-1L",
    productName: "Whole Milk 1L",
    storeId: "store_001",
    category: "dairy",
    riskLevel: "medium",
    quantity: 29,
    daysToExpiry: 3,
    forecast7d: 155.0,
    action: "donate",
    actionLabel: "donate ×29",
    status: "proposed",
    expectedNetImpact: -8.99,
    narrative:
      "Whole Milk 1L at store_001: 29 of 182 units at risk (16%). First batch expires in 3 day(s). Monitor; markdown or transfer may avoid waste. Forecast ~155 units /7d. Recommended: donate x29 with food rescue partner dispatch.",
    mathematicalBreakdown: {
      unsoldProjectedQty: 29,
      totalStock: 182,
      percentAtRisk: 16,
      dailyDemand: 22.1,
      salvageRecovery: 9.86,
      handlingCost: 1.45,
      optionsEvaluated: 5,
      co2KgSaved: 34.8,
    },
  },
  {
    id: "prop-4c4f30",
    sku: "BREAD-WH",
    productName: "Whole Wheat Bread",
    storeId: "store_004",
    category: "bakery",
    riskLevel: "medium",
    quantity: 22,
    daysToExpiry: 2,
    forecast7d: 114.7,
    action: "donate",
    actionLabel: "donate ×22",
    status: "proposed",
    expectedNetImpact: -5.94,
    narrative:
      "Whole Wheat Bread at store_004: 22 of 102 units at risk (22%). First batch expires in 2 day(s). Recommended: donate x22 (lowest expected loss $-5.94 among 6 feasible options).",
    mathematicalBreakdown: {
      unsoldProjectedQty: 22,
      totalStock: 102,
      percentAtRisk: 22,
      dailyDemand: 16.4,
      salvageRecovery: 7.04,
      handlingCost: 1.1,
      optionsEvaluated: 6,
      co2KgSaved: 11.0,
    },
  },
  {
    id: "prop-a1daa8",
    sku: "AVOC-2PK",
    productName: "Organic Hass Avocados",
    storeId: "store_002",
    category: "produce",
    riskLevel: "high",
    quantity: 65,
    daysToExpiry: 1,
    forecast7d: 92.0,
    action: "markdown",
    actionLabel: "markdown -40%",
    status: "proposed",
    expectedNetImpact: 38.45,
    narrative:
      "Organic Hass Avocados at store_002: 65 units entering final peak ripeness within 24h. Dynamic markdown of 40% will accelerate sales velocity by 2.6x, capturing $117.00 gross revenue rather than full discard loss.",
    mathematicalBreakdown: {
      unsoldProjectedQty: 65,
      totalStock: 120,
      percentAtRisk: 54,
      dailyDemand: 13.1,
      salvageRecovery: 117.0,
      handlingCost: 0,
      optionsEvaluated: 4,
      co2KgSaved: 84.5,
    },
  },
  {
    id: "prop-edf773",
    sku: "SALM-300G",
    productName: "Atlantic Fresh Salmon Fillet",
    storeId: "store_005",
    category: "meat",
    riskLevel: "high",
    quantity: 18,
    daysToExpiry: 1,
    forecast7d: 38.0,
    action: "markdown",
    actionLabel: "markdown -35%",
    status: "proposed",
    expectedNetImpact: 52.8,
    narrative:
      "Atlantic Fresh Salmon Fillet at store_005: 18 units reaching critical cold-chain window. Recommended 35% discount triggers push notification to verified app shoppers, expected 95% sell-through before 8 PM.",
    mathematicalBreakdown: {
      unsoldProjectedQty: 18,
      totalStock: 25,
      percentAtRisk: 72,
      dailyDemand: 5.4,
      salvageRecovery: 105.3,
      handlingCost: 0,
      optionsEvaluated: 4,
      co2KgSaved: 72.0,
    },
  },
  {
    id: "prop-2d0096",
    sku: "YOG-500G",
    productName: "Greek Yogurt 500g",
    storeId: "store_005",
    category: "dairy",
    riskLevel: "low",
    quantity: 35,
    daysToExpiry: 6,
    forecast7d: 210.0,
    action: "replenish",
    actionLabel: "replenish +48",
    status: "proposed",
    expectedNetImpact: 84.2,
    narrative:
      "Greek Yogurt 500g at store_005: Safe buffer inventory, high sales velocity requires restocking next morning to avoid expected Sunday stockout.",
    mathematicalBreakdown: {
      unsoldProjectedQty: 0,
      totalStock: 35,
      percentAtRisk: 0,
      dailyDemand: 30.0,
      salvageRecovery: 0,
      handlingCost: 4.5,
      optionsEvaluated: 3,
      co2KgSaved: 0,
    },
  },
  {
    id: "prop-5c5bed",
    sku: "SPIN-200G",
    productName: "Baby Spinach 200g",
    storeId: "store_005",
    category: "produce",
    riskLevel: "medium",
    quantity: 52,
    daysToExpiry: 2,
    forecast7d: 85.0,
    action: "transfer",
    actionLabel: "transfer to store_002",
    status: "proposed",
    expectedNetImpact: 21.6,
    narrative:
      "Baby Spinach at store_005: excess stock vs local velocity. Transferring 30 units to store_002 where weekend salad demand is surging clears inventory with 0 waste.",
    mathematicalBreakdown: {
      unsoldProjectedQty: 30,
      totalStock: 52,
      percentAtRisk: 58,
      dailyDemand: 12.1,
      salvageRecovery: 39.0,
      handlingCost: 9.0,
      optionsEvaluated: 5,
      co2KgSaved: 18.0,
    },
  },
];

export const sampleTraces: SkuTrace[] = [
  {
    id: "trace-1",
    storeId: "store_005",
    sku: "YOG-500G",
    productName: "Greek Yogurt 500g",
    steps: {
      coordinator: {
        name: "Coordinator",
        status: "ok",
        durationMs: 0,
        input: { proposal: "no_action", confidence: 0.99 },
        output: { action: "verified", reason: "Within safe buffer capacity" },
      },
      optionsPricer: {
        name: "Options Pricer",
        status: "ok",
        durationMs: 0,
        input: { candidates: ["markdown", "donate", "no_action"] },
        output: { selected: "no_action", expectedRoi: 1.0 },
      },
      stockAnalyst: {
        name: "Stock Analyst",
        status: "ok",
        durationMs: 11,
        input: { currentStock: 74, safetyCoverDays: 4.2 },
        output: { status: "nominal", stockoutRisk: 0.04 },
      },
      spoilageEstimator: {
        name: "Spoilage Estimator",
        status: "ok",
        durationMs: 1,
        input: { batchExpiries: ["2026-10-18", "2026-10-22"] },
        output: { riskBand: "pristine", projectedDecayUnits: 0 },
      },
      demandForecaster: {
        name: "Demand Forecaster",
        status: "ok",
        durationMs: 1,
        input: { sku: "YOG-500G", lookbackDays: 28 },
        output: { meanDailyDemand: 22.4, confidence80: [19.2, 25.8] },
      },
    },
  },
  {
    id: "trace-2",
    storeId: "store_005",
    sku: "VEG-BIRY",
    productName: "Fresh Veg Biryani",
    steps: {
      coordinator: {
        name: "Coordinator",
        status: "ok",
        durationMs: 0,
        input: { proposal: "markdown_30", qty: 14 },
        output: { action: "approved", label: "Dynamic Flash Markdown" },
      },
      optionsPricer: {
        name: "Options Pricer",
        status: "ok",
        durationMs: 0,
        input: { basePrice: 6.99, hoursToExpiry: 14 },
        output: { recommendedDiscount: 0.3, netMargin: "+$4.89/u" },
      },
      stockAnalyst: {
        name: "Stock Analyst",
        status: "ok",
        durationMs: 11,
        input: { onHand: 18, hourlyRate: 1.1 },
        output: { expectedUnsoldAtEOD: 12 },
      },
      spoilageEstimator: {
        name: "Spoilage Estimator",
        status: "ok",
        durationMs: 3,
        input: { tempCelsius: 4.8, maxSafeTemp: 5.0 },
        output: { riskBand: "critical_decay", hoursRemaining: 14 },
      },
      demandForecaster: {
        name: "Demand Forecaster",
        status: "ok",
        durationMs: 1,
        input: { sku: "VEG-BIRY", lunchRushFactor: 1.8 },
        output: { meanDailyDemand: 8.5, confidence80: [6.1, 11.2] },
      },
    },
  },
  {
    id: "trace-3",
    storeId: "store_005",
    sku: "TOM-500G",
    productName: "Roma Tomatoes 500g",
    steps: {
      coordinator: {
        name: "Coordinator",
        status: "ok",
        durationMs: 0,
        input: { proposal: "donate_partner", target: "CityFoodBank" },
        output: { status: "queued_dispatch", recovery: "$18.20" },
      },
      optionsPricer: {
        name: "Options Pricer",
        status: "ok",
        durationMs: 0,
        input: { retailLoss: "$24.00", taxRecovery: "$18.20" },
        output: { selected: "donate", optimalHour: "14:00" },
      },
      stockAnalyst: {
        name: "Stock Analyst",
        status: "ok",
        durationMs: 14,
        input: { inventoryUnits: 62, projectedSurplus: 40 },
        output: { excessRatio: 1.9 },
      },
      spoilageEstimator: {
        name: "Spoilage Estimator",
        status: "ok",
        durationMs: 3,
        input: { ethylenePpm: 0.08, skinFirmness: 68 },
        output: { riskBand: "moderate_decay", daysLeft: 2 },
      },
      demandForecaster: {
        name: "Demand Forecaster",
        status: "ok",
        durationMs: 2,
        input: { sku: "TOM-500G", weatherForecast: "Rainy" },
        output: { meanDailyDemand: 11.0, confidence80: [8.5, 13.9] },
      },
    },
  },
  {
    id: "trace-4",
    storeId: "store_005",
    sku: "SPIN-200G",
    productName: "Spinach 200g Pack",
    steps: {
      coordinator: {
        name: "Coordinator",
        status: "ok",
        durationMs: 0,
        input: { proposal: "transfer_store_002" },
        output: { status: "manifest_ready" },
      },
      optionsPricer: {
        name: "Options Pricer",
        status: "ok",
        durationMs: 0,
        input: { transferFeePerUnit: 0.3, retailDelta: 1.2 },
        output: { selected: "transfer", roi: 2.4 },
      },
      stockAnalyst: {
        name: "Stock Analyst",
        status: "ok",
        durationMs: 15,
        input: { store005Stock: 52, store002Deficit: 35 },
        output: { pairMatch: true, transferQty: 30 },
      },
      spoilageEstimator: {
        name: "Spoilage Estimator",
        status: "ok",
        durationMs: 1,
        input: { humidity: 91, daysToYellowing: 3 },
        output: { riskBand: "nominal", daysLeft: 3 },
      },
      demandForecaster: {
        name: "Demand Forecaster",
        status: "ok",
        durationMs: 2,
        input: { sku: "SPIN-200G", seasonIndex: 1.1 },
        output: { meanDailyDemand: 14.5, confidence80: [11.8, 17.2] },
      },
    },
  },
];

export const evaluationData: Record<string, PolicyMetricComparison> = {
  demand_spike: {
    preset: "demand_spike",
    wasteUnits: {
      agentic: 409.33,
      fifo: 22.0,
      fixed: 1251.0,
      winner: "fifo",
    },
    stockouts: {
      agentic: 1927.33,
      fifo: 12380.33,
      fixed: 23.33,
      winner: "fixed-threshold",
    },
    netMarginUsd: {
      agentic: 24190.45,
      fifo: 7210.0,
      fixed: 24420.1,
      winner: "fixed-threshold",
    },
    revenueUsd: {
      agentic: 49820.0,
      fifo: 15100.0,
      fixed: 54900.0,
      winner: "fixed-threshold",
    },
  },
  excess_inventory: {
    preset: "excess_inventory",
    wasteUnits: {
      agentic: 284.1,
      fifo: 890.5,
      fixed: 1640.2,
      winner: "agentic",
    },
    stockouts: {
      agentic: 140.0,
      fifo: 1820.0,
      fixed: 85.0,
      winner: "fixed-threshold",
    },
    netMarginUsd: {
      agentic: 31400.0,
      fifo: 18900.0,
      fixed: 27150.0,
      winner: "agentic",
    },
    revenueUsd: {
      agentic: 58200.0,
      fifo: 39100.0,
      fixed: 51900.0,
      winner: "agentic",
    },
  },
};

export const sampleAuditLogs: AuditRecord[] = [
  {
    id: "aud-001",
    timestamp: "10-09 21:21:13",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 69f59e",
    summary: {
      store_id: "store_001",
      sku: "YOG-500G",
      primary: { action: "no_action", confidence: 0.99 },
    },
    status: "—",
  },
  {
    id: "aud-002",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation a81a11",
    summary: {
      store_id: "store_001",
      sku: "MILK-1L",
      primary: { action: "donate", qty: 29 },
    },
    status: "—",
  },
  {
    id: "aud-003",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 3c2afc",
    summary: {
      store_id: "store_005",
      sku: "FRUIT-CUP",
      primary: { action: "markdown", discount: "30%" },
    },
    status: "—",
  },
  {
    id: "aud-004",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 4c4f30",
    summary: {
      store_id: "store_005",
      sku: "CHKN-WRAP",
      primary: { action: "donate", qty: 12 },
    },
    status: "—",
  },
  {
    id: "aud-005",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation a1daa8",
    summary: {
      store_id: "store_005",
      sku: "VEG-BIRY",
      primary: { action: "markdown", discount: "40%" },
    },
    status: "—",
  },
  {
    id: "aud-006",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation edf773",
    summary: {
      store_id: "store_005",
      sku: "FISH-400G",
      primary: { action: "rescue_bundle" },
    },
    status: "—",
  },
  {
    id: "aud-007",
    timestamp: "10-09 21:21:12",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 2d0096",
    summary: {
      store_id: "store_005",
      sku: "SALM-300G",
      primary: { action: "markdown", discount: "35%" },
    },
    status: "—",
  },
  {
    id: "aud-008",
    timestamp: "10-09 21:21:11",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 5c5bed",
    summary: {
      store_id: "store_005",
      sku: "CHKN-500G",
      primary: { action: "dispatch_charity" },
    },
    status: "—",
  },
  {
    id: "aud-009",
    timestamp: "10-09 21:21:11",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation aa8ac9",
    summary: {
      store_id: "store_005",
      sku: "AVOC-2PK",
      primary: { action: "markdown", discount: "40%" },
    },
    status: "—",
  },
  {
    id: "aud-010",
    timestamp: "10-09 21:21:11",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation af1bc8",
    summary: {
      store_id: "store_005",
      sku: "BAN-1KG",
      primary: { action: "donate", qty: 108 },
    },
    status: "—",
  },
  {
    id: "aud-011",
    timestamp: "10-09 21:21:11",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 8227ed",
    summary: {
      store_id: "store_005",
      sku: "SPIN-200G",
      primary: { action: "transfer", target: "store_002" },
    },
    status: "—",
  },
  {
    id: "aud-012",
    timestamp: "10-09 21:21:11",
    actor: "coordinator",
    action: "propose",
    entity: "recommendation 91f0ce",
    summary: {
      store_id: "store_005",
      sku: "TOM-500G",
      primary: { action: "markdown", discount: "25%" },
    },
    status: "—",
  },
];
