import { NextResponse } from "next/server";
import { memoryStore } from "@/db";

export async function GET() {
  const batches = memoryStore.getBatches();
  const products = memoryStore.getProducts();

  // Compute live high-level dashboard metrics
  const totalItems = batches.reduce((acc, b) => acc + b.currentQuantity, 0);
  const criticalCount = batches.filter((b) => b.decayRiskLevel === "critical_decay").length;
  const moderateCount = batches.filter((b) => b.decayRiskLevel === "moderate_decay").length;

  const totalValueAtRisk = batches
    .filter((b) => b.decayRiskLevel === "critical_decay" || b.decayRiskLevel === "moderate_decay")
    .reduce((acc, b) => acc + parseFloat(b.currentPrice) * b.currentQuantity, 0);

  const bundles = memoryStore.getBundles();
  const donations = memoryStore.getDonations();

  const co2PreventedKg = (
    bundles.reduce((acc, b) => acc + parseFloat(b.co2SavedKg), 0) +
    donations.reduce((acc, d) => acc + parseFloat(d.co2AvoidedKg), 0)
  ).toFixed(1);

  const mealsSavedTotal =
    bundles.reduce((acc, b) => acc + b.mealsSaved, 0) +
    donations.reduce((acc, d) => acc + d.estimatedMealsCount, 0);

  return NextResponse.json({
    success: true,
    batches,
    products,
    metrics: {
      totalItems,
      criticalCount,
      moderateCount,
      totalValueAtRisk: totalValueAtRisk.toFixed(2),
      co2PreventedKg,
      mealsSavedTotal,
      activeBundlesCount: bundles.length,
      donationsDispatched: donations.length,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { batchId, ambientTemp, ambientHumidity, ethyleneDetectedPpm } = body;

    if (!batchId) {
      return NextResponse.json({ success: false, error: "batchId is required" }, { status: 400 });
    }

    const updated = memoryStore.updateBatch(batchId, {
      ...(ambientTemp !== undefined && { ambientTemp: String(ambientTemp) }),
      ...(ambientHumidity !== undefined && { ambientHumidity: Number(ambientHumidity) }),
      ...(ethyleneDetectedPpm !== undefined && { ethyleneDetectedPpm: String(ethyleneDetectedPpm) }),
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, batch: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update batch telemetry" }, { status: 500 });
  }
}
