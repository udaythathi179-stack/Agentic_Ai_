import { InitialBatch } from "@/db/initial-data";

export interface BundleSuggestion {
  title: string;
  slug: string;
  description: string;
  recipeName: string;
  recipeDifficulty: "Easy" | "Medium" | "Quick";
  prepTimeMinutes: number;
  culinaryInstructions: string;
  bundlePrice: string;
  originalTotalPrice: string;
  discountPercentage: number;
  itemsIncluded: Array<{ name: string; qty: string; note: string }>;
  batchIds: string[];
  chefAgentReasoning: string;
  mealsSaved: number;
  co2SavedKg: string;
}

/**
 * ChefRescue Agent: Autonomous Culinary Pairing & Meal Bundler
 * Synthesizes expiring inventory into chef-crafted zero-waste meal kits
 */
export function generateCulinaryRescueBundle(batches: InitialBatch[]): BundleSuggestion | null {
  // Find items that need culinary rescue (freshness <= 55 or hoursRemaining <= 30)
  const urgentBatches = batches.filter(
    (b) => (b.freshnessScore <= 55 || b.hoursRemaining <= 30) && b.status !== "donated" && b.status !== "disposed"
  );

  if (urgentBatches.length < 2) return null;

  // Check for Produce + Bakery combo
  const hasProduce = urgentBatches.find((b) => b.category === "produce");
  const hasBakery = urgentBatches.find((b) => b.category === "bakery");
  const hasDeliOrMeat = urgentBatches.find((b) => b.category === "deli" || b.category === "meat");
  const hasGreens = urgentBatches.find((b) => b.productName.toLowerCase().includes("spinach"));

  if (hasProduce && hasBakery) {
    const origSum = parseFloat(hasProduce.basePrice) + parseFloat(hasBakery.basePrice);
    const bundlePrice = (origSum * 0.6).toFixed(2);
    return {
      title: `Zero-Waste Artisan Panini & Bistro Salad Kit`,
      slug: `bistro-panini-kit-${Date.now()}`,
      description: `ChefRescue paired ${hasProduce.productName} and ${hasBakery.productName} into a gourmet 15-minute home bistro experience.`,
      recipeName: `Crispy Panini Melt with Sun-Ripened Salad`,
      recipeDifficulty: "Easy",
      prepTimeMinutes: 15,
      culinaryInstructions: `1. Slice ${hasBakery.productName} into hearty sandwich slices. 2. Layer with thinly sliced ${hasProduce.productName}, fresh olive oil, and herbs. 3. Pan-sear on a cast-iron skillet with a weight on top until golden brown and crusty. 4. Serve immediately.`,
      bundlePrice,
      originalTotalPrice: origSum.toFixed(2),
      discountPercentage: 40,
      itemsIncluded: [
        { name: hasProduce.productName, qty: "1 unit", note: `${hasProduce.hoursRemaining}h remaining` },
        { name: hasBakery.productName, qty: "1 loaf", note: `${hasBakery.hoursRemaining}h remaining` },
      ],
      batchIds: [hasProduce.id, hasBakery.id],
      chefAgentReasoning: `Combines fast-decaying bread with peak-ripe produce. Solves 2 inventory bottlenecks simultaneously and averts 2.6kg food waste.`,
      mealsSaved: 2,
      co2SavedKg: "3.40",
    };
  }

  if (hasProduce && hasDeliOrMeat) {
    const origSum = parseFloat(hasProduce.basePrice) + parseFloat(hasDeliOrMeat.basePrice);
    const bundlePrice = (origSum * 0.65).toFixed(2);
    return {
      title: `Chef's Skillet Sizzle: ${hasDeliOrMeat.productName} & Garden Fresh`,
      slug: `skillet-sizzle-${Date.now()}`,
      description: `Premium pairing crafted to rescue ${hasDeliOrMeat.productName} before cold-chain cutoff.`,
      recipeName: `Seared Protein Medallions with Glazed ${hasProduce.productName}`,
      recipeDifficulty: "Medium",
      prepTimeMinutes: 22,
      culinaryInstructions: `1. Heat butter and garlic in a skillet. 2. Sear ${hasDeliOrMeat.productName} until caramelized. 3. Sauté ${hasProduce.productName} alongside with lemon juice and cracked black pepper. 4. Garnish with sea salt.`,
      bundlePrice,
      originalTotalPrice: origSum.toFixed(2),
      discountPercentage: 35,
      itemsIncluded: [
        { name: hasDeliOrMeat.productName, qty: "1 pack", note: "Urgent culinary rescue" },
        { name: hasProduce.productName, qty: "1 pack", note: "Ripe and flavorful" },
      ],
      batchIds: [hasDeliOrMeat.id, hasProduce.id],
      chefAgentReasoning: `High retail value rescue preserving grocer margin and converting perishable meat/deli into a high-satisfaction gourmet dinner.`,
      mealsSaved: 2,
      co2SavedKg: "6.20",
    };
  }

  // Fallback 2 urgent batches combo
  const [b1, b2] = urgentBatches;
  const origSum = parseFloat(b1.basePrice) + parseFloat(b2.basePrice);
  return {
    title: `Zero-Waste Harvest Stew & Medley Duo`,
    slug: `harvest-medley-duo-${Date.now()}`,
    description: `ChefRescue matched ${b1.productName} and ${b2.productName} to maximize nutritional retention.`,
    recipeName: `Rustic Slow-Simmer Harvest Stew`,
    recipeDifficulty: "Easy",
    prepTimeMinutes: 20,
    culinaryInstructions: `1. Chop ingredients uniformly. 2. Sauté with olive oil and aromatic herbs for 5 minutes. 3. Simmer in rich vegetable or bone broth until tender. 4. Enjoy with crusty bread.`,
    bundlePrice: (origSum * 0.6).toFixed(2),
    originalTotalPrice: origSum.toFixed(2),
    discountPercentage: 40,
    itemsIncluded: [
      { name: b1.productName, qty: "1 unit", note: `${b1.hoursRemaining}h to expiry` },
      { name: b2.productName, qty: "1 unit", note: `${b2.hoursRemaining}h to expiry` },
    ],
    batchIds: [b1.id, b2.id],
    chefAgentReasoning: `Averts ${b1.batchNumber} and ${b2.batchNumber} write-down by promoting rapid home consumption.`,
    mealsSaved: 2,
    co2SavedKg: "4.10",
  };
}
