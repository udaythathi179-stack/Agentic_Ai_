import { NextResponse } from "next/server";
import { memoryStore } from "@/db";

export async function GET() {
  const bundles = memoryStore.getBundles();
  return NextResponse.json({ success: true, bundles });
}

export async function POST(req: Request) {
  try {
    const { bundleId } = await req.json();
    const bundles = memoryStore.getBundles();
    const bundle = bundles.find((b) => b.id === bundleId);

    if (!bundle) {
      return NextResponse.json({ success: false, error: "Bundle not found" }, { status: 404 });
    }

    // Mark bundle as sold
    bundle.status = "sold_out";

    // Add log
    const log = {
      id: `log-${Date.now()}`,
      agentId: "chef-rescue",
      agentName: "ChefRescue Recipe Agent",
      actionType: "recipe_bundle_created",
      severity: "success",
      batchId: bundle.id,
      message: `Consumer purchased Zero-Waste Bundle: "${bundle.title}"! Diverted ${bundle.co2SavedKg}kg CO2`,
      reasoning: `Perishable items successfully consumed by conscious customer at $${bundle.bundlePrice}. Full waste prevention achieved.`,
      metricsDelta: JSON.stringify({ revenue: bundle.bundlePrice, co2Prevented: bundle.co2SavedKg }),
      timestamp: new Date().toISOString(),
    };
    memoryStore.addLog(log);

    return NextResponse.json({ success: true, message: "Bundle purchased!", bundle });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process bundle" }, { status: 500 });
  }
}
