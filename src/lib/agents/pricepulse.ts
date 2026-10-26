import { InitialBatch } from "@/db/initial-data";

export interface MarkdownDecision {
  batchId: string;
  originalPrice: number;
  newPrice: number;
  discountPercent: number;
  expectedVelocityLift: number;
  reasoning: string;
  actionRequired: boolean;
}

/**
 * PricePulse Agent: Dynamic Markdown & Elasticity Optimizer
 * Executes progressive decay discounts based on remaining hours and freshness index
 */
export function calculateDynamicMarkdown(batch: InitialBatch): MarkdownDecision {
  const basePrice = parseFloat(batch.basePrice);
  const currentPrice = parseFloat(batch.currentPrice);
  const hours = batch.hoursRemaining;
  const freshness = batch.freshnessScore;

  let targetDiscount = 0;
  let reason = "Pricing nominal. Full retail margin retained.";

  if (hours <= 8 || freshness <= 15) {
    // Flash clearance markdown
    targetDiscount = 65;
    reason = `Critical emergency clearance: ${hours}h left with ${freshness}% freshness. Slashing 65% to avert $${basePrice.toFixed(2)} total landfill write-off.`;
  } else if (hours <= 16 || freshness <= 30) {
    // Deep markdown
    targetDiscount = 45;
    reason = `High decay risk: ${hours}h remaining. Price reduced by 45% to stimulate 3.8x checkout velocity.`;
  } else if (hours <= 28 || freshness <= 50) {
    // Moderate markdown
    targetDiscount = 25;
    reason = `Preventive markdown: Shelf life at ${hours}h. Proactively offering 25% discount to capture conscious shoppers.`;
  } else if (hours <= 40 || freshness <= 65) {
    targetDiscount = 10;
    reason = `Early-cycle discount: 10% off to boost initial batch rotation.`;
  }

  const calculatedNewPrice = Number((basePrice * (1 - targetDiscount / 100)).toFixed(2));
  const isChanged = calculatedNewPrice !== currentPrice;
  const velocityLift = Number((1 + (targetDiscount / 100) * 3.2).toFixed(2));

  return {
    batchId: batch.id,
    originalPrice: basePrice,
    newPrice: calculatedNewPrice,
    discountPercent: targetDiscount,
    expectedVelocityLift: velocityLift,
    reasoning: reason,
    actionRequired: isChanged,
  };
}
