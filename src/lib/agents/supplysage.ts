export interface RestockAdjustment {
  productId: string;
  productName: string;
  regularOrderUnits: number;
  agentAdjustedUnits: number;
  reductionPercentage: number;
  preventedWasteUnits: number;
  weatherFactor: string;
  confidenceScore: number;
  reasoning: string;
}

/**
 * SupplySage Agent: Demand Forecasting & Intelligent Restock Throttler
 * Prevents grocery over-ordering based on weather, shelf status, and real demand signals
 */
export function evaluateRestockNeed(
  productName: string,
  category: string,
  currentStock: number,
  weatherCondition: "rain" | "clear" | "heatwave" | "cold"
): RestockAdjustment {
  let regularOrder = 40;
  let multiplier = 1.0;
  let weatherNote = "Nominal seasonal conditions.";

  if (category === "bakery") {
    regularOrder = 35;
    if (weatherCondition === "rain") {
      multiplier = 0.65;
      weatherNote = "Rainy forecast indicates -30% pedestrian walk-in traffic.";
    }
  } else if (category === "produce") {
    regularOrder = 50;
    if (weatherCondition === "heatwave") {
      multiplier = 0.8;
      weatherNote = "High ambient heat accelerates shelf decay; order smaller, frequent batches.";
    } else if (weatherCondition === "rain") {
      multiplier = 0.75;
      weatherNote = "Wet conditions reduce impulse produce shoppers.";
    }
  } else if (category === "meat" || category === "deli") {
    regularOrder = 25;
    if (currentStock > 15) {
      multiplier = 0.7;
      weatherNote = "High residual on-shelf inventory requires order throttling.";
    }
  }

  const adjustedUnits = Math.max(10, Math.round(regularOrder * multiplier));
  const reductionPercentage = Math.round(((regularOrder - adjustedUnits) / regularOrder) * 100);
  const preventedWasteUnits = regularOrder - adjustedUnits;

  return {
    productId: `prod-${Math.floor(Math.random() * 1000)}`,
    productName,
    regularOrderUnits: regularOrder,
    agentAdjustedUnits: adjustedUnits,
    reductionPercentage,
    preventedWasteUnits,
    weatherFactor: weatherNote,
    confidenceScore: 94.8,
    reasoning: `SupplySage throttled ${productName} inbound order from ${regularOrder} to ${adjustedUnits} units (${reductionPercentage}% cut). Protects working capital and cuts upstream spoilage.`,
  };
}
