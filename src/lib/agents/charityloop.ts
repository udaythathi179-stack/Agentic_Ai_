import { InitialBatch } from "@/db/initial-data";

export interface CharityManifestResult {
  manifestNumber: string;
  charityPartner: string;
  charityPartnerType: "Food Bank" | "Shelter" | "Soup Kitchen";
  totalItemsCount: number;
  totalWeightKg: string;
  totalRetailValue: string;
  estimatedMealsCount: number;
  co2AvoidedKg: string;
  taxDeductionValue: string;
  batchesIncluded: string[];
  reasoning: string;
}

/**
 * CharityLoop Agent: Circular Food Rescue & Shelter Donation Dispatcher
 * Rescues unsold food safely before consumer threshold lapses
 */
export function generateCharityManifest(batches: InitialBatch[]): CharityManifestResult | null {
  const eligibleBatches = batches.filter(
    (b) => b.hoursRemaining <= 12 && b.freshnessScore <= 28 && b.status !== "donated" && b.status !== "disposed"
  );

  if (eligibleBatches.length === 0) return null;

  let totalWeight = 0;
  let totalRetail = 0;
  let totalItems = 0;
  const batchIds: string[] = [];

  eligibleBatches.forEach((b) => {
    totalItems += b.currentQuantity;
    totalRetail += parseFloat(b.currentPrice) * b.currentQuantity;
    totalWeight += (b.currentQuantity * 0.45); // average 450g per perishable unit
    batchIds.push(b.id);
  });

  const estimatedMeals = Math.round(totalWeight / 0.4); // ~400g per meal
  const co2Avoided = (totalWeight * 2.5).toFixed(2);
  const taxValue = (totalRetail * 0.5).toFixed(2); // Internal Revenue Code 170(e)(3) deduction

  const partners = [
    { name: "City Harvest Food Rescue", type: "Food Bank" as const },
    { name: "Bowery Mission Community Kitchen", type: "Soup Kitchen" as const },
    { name: "Metropolitan Family Shelter Network", type: "Shelter" as const },
  ];
  const partner = partners[Math.floor(Math.random() * partners.length)];

  return {
    manifestNumber: `MNF-AI-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
    charityPartner: partner.name,
    charityPartnerType: partner.type,
    totalItemsCount: totalItems,
    totalWeightKg: totalWeight.toFixed(2),
    totalRetailValue: totalRetail.toFixed(2),
    estimatedMealsCount: estimatedMeals,
    co2AvoidedKg: co2Avoided,
    taxDeductionValue: taxValue,
    batchesIncluded: batchIds,
    reasoning: `CharityLoop mobilized instant cold-chain dispatch for ${totalItems} perishable items with <12h shelf life. Averts ${co2Avoided} kg landfill greenhouse emissions and secures $${taxValue} verified tax deduction.`,
  };
}
