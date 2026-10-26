import { NextResponse } from "next/server";
import { memoryStore } from "@/db";
import { evaluateBatchFreshness } from "@/lib/agents/sentinel";
import { calculateDynamicMarkdown } from "@/lib/agents/pricepulse";
import { generateCulinaryRescueBundle } from "@/lib/agents/chefrescue";
import { evaluateRestockNeed } from "@/lib/agents/supplysage";
import { generateCharityManifest } from "@/lib/agents/charityloop";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const agent = body.agent || "swarm"; // 'sentinel' | 'pricepulse' | 'chefrescue' | 'supplysage' | 'charityloop' | 'swarm'

    const logsCreated: Array<{
      id: string;
      agentId: string;
      agentName: string;
      actionType: string;
      severity: string;
      batchId?: string;
      message: string;
      reasoning: string;
      metricsDelta: string;
      timestamp: string;
    }> = [];

    const batches = memoryStore.getBatches();

    // 1. Sentinel Evaluation
    if (agent === "swarm" || agent === "sentinel") {
      batches.forEach((batch) => {
        const evalResult = evaluateBatchFreshness(batch);
        memoryStore.updateBatch(batch.id, {
          freshnessScore: evalResult.newScore,
          hoursRemaining: evalResult.hoursRemaining,
          decayRiskLevel: evalResult.decayRiskLevel,
          lastAgentEvaluation: new Date().toISOString(),
        });

        if (evalResult.tempViolation || evalResult.ethyleneSpike || evalResult.decayRiskLevel === "critical_decay") {
          const log = {
            id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            agentId: "sentinel-decay",
            agentName: "Sentinel Decay Agent",
            actionType: "decay_alert",
            severity: evalResult.decayRiskLevel === "critical_decay" ? "critical" : "warning",
            batchId: batch.id,
            message: `Evaluated ${batch.productName} (${batch.batchNumber}): ${evalResult.newScore}% Freshness (${evalResult.hoursRemaining}h remaining)`,
            reasoning: evalResult.reasoning,
            metricsDelta: JSON.stringify({
              freshnessScore: evalResult.newScore,
              hoursRemaining: evalResult.hoursRemaining,
              decayRiskLevel: evalResult.decayRiskLevel,
            }),
            timestamp: new Date().toISOString(),
          };
          memoryStore.addLog(log);
          logsCreated.push(log);
        }
      });
    }

    // 2. PricePulse Dynamic Markdowns
    if (agent === "swarm" || agent === "pricepulse") {
      const refreshedBatches = memoryStore.getBatches();
      refreshedBatches.forEach((batch) => {
        const decision = calculateDynamicMarkdown(batch);
        if (decision.actionRequired) {
          memoryStore.updateBatch(batch.id, {
            currentPrice: decision.newPrice.toFixed(2),
            status: "marked_down",
          });

          const log = {
            id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            agentId: "price-pulse",
            agentName: "PricePulse Dynamic Pricing",
            actionType: "price_slash",
            severity: "info",
            batchId: batch.id,
            message: `Markdown on ${batch.productName}: $${batch.currentPrice} -> $${decision.newPrice.toFixed(2)} (-${decision.discountPercent}%)`,
            reasoning: decision.reasoning,
            metricsDelta: JSON.stringify({
              oldPrice: decision.originalPrice,
              newPrice: decision.newPrice,
              discount: decision.discountPercent,
              expectedLift: decision.expectedVelocityLift,
            }),
            timestamp: new Date().toISOString(),
          };
          memoryStore.addLog(log);
          logsCreated.push(log);
        }
      });
    }

    // 3. ChefRescue Recipe Bundler
    if (agent === "swarm" || agent === "chefrescue") {
      const currentBatches = memoryStore.getBatches();
      const bundle = generateCulinaryRescueBundle(currentBatches);
      if (bundle) {
        const newBundle = {
          id: `bundle-${Date.now()}`,
          ...bundle,
          itemsIncluded: JSON.stringify(bundle.itemsIncluded),
          batchIds: JSON.stringify(bundle.batchIds),
          status: "active" as const,
        };
        memoryStore.addBundle(newBundle);

        // Mark corresponding batches as bundled
        bundle.batchIds.forEach((bId) => {
          memoryStore.updateBatch(bId, { status: "bundled" });
        });

        const log = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          agentId: "chef-rescue",
          agentName: "ChefRescue Recipe Agent",
          actionType: "recipe_bundle_created",
          severity: "success",
          batchId: newBundle.id,
          message: `Created meal rescue bundle: "${bundle.title}" ($${bundle.bundlePrice})`,
          reasoning: bundle.chefAgentReasoning,
          metricsDelta: JSON.stringify({
            bundlePrice: bundle.bundlePrice,
            discount: bundle.discountPercentage,
            mealsSaved: bundle.mealsSaved,
            co2SavedKg: bundle.co2SavedKg,
          }),
          timestamp: new Date().toISOString(),
        };
        memoryStore.addLog(log);
        logsCreated.push(log);
      }
    }

    // 4. SupplySage Replenishment Throttle
    if (agent === "swarm" || agent === "supplysage") {
      const sampleBatch = batches[Math.floor(Math.random() * batches.length)];
      const restockResult = evaluateRestockNeed(
        sampleBatch.productName,
        sampleBatch.category,
        sampleBatch.currentQuantity,
        "rain"
      );

      const log = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        agentId: "supply-sage",
        agentName: "SupplySage Demand Forecaster",
        actionType: "reorder_throttled",
        severity: "info",
        batchId: sampleBatch.id,
        message: `Restock PO optimized for ${restockResult.productName}: Reduced by ${restockResult.reductionPercentage}%`,
        reasoning: restockResult.reasoning,
        metricsDelta: JSON.stringify({
          regularOrder: restockResult.regularOrderUnits,
          adjustedOrder: restockResult.agentAdjustedUnits,
          preventedWasteUnits: restockResult.preventedWasteUnits,
        }),
        timestamp: new Date().toISOString(),
      };
      memoryStore.addLog(log);
      logsCreated.push(log);
    }

    // 5. CharityLoop Circular Donation Dispatch
    if (agent === "swarm" || agent === "charityloop") {
      const currentBatches = memoryStore.getBatches();
      const manifest = generateCharityManifest(currentBatches);
      if (manifest) {
        const newManifest = {
          id: `don-${Date.now()}`,
          manifestNumber: manifest.manifestNumber,
          charityPartner: manifest.charityPartner,
          charityPartnerType: manifest.charityPartnerType,
          pickupScheduledAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
          totalItemsCount: manifest.totalItemsCount,
          totalWeightKg: manifest.totalWeightKg,
          totalRetailValue: manifest.totalRetailValue,
          estimatedMealsCount: manifest.estimatedMealsCount,
          co2AvoidedKg: manifest.co2AvoidedKg,
          taxDeductionValue: manifest.taxDeductionValue,
          status: "pending_pickup" as const,
          agentReasoning: manifest.reasoning,
        };
        memoryStore.addDonation(newManifest);

        // Update batches
        manifest.batchesIncluded.forEach((bId) => {
          memoryStore.updateBatch(bId, { status: "donated" });
        });

        const log = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          agentId: "charity-loop",
          agentName: "CharityLoop Circular Dispatch",
          actionType: "donation_dispatched",
          severity: "success",
          batchId: newManifest.id,
          message: `Dispatched food bank manifest ${manifest.manifestNumber} to ${manifest.charityPartner}`,
          reasoning: manifest.reasoning,
          metricsDelta: JSON.stringify({
            meals: manifest.estimatedMealsCount,
            co2Avoided: manifest.co2AvoidedKg,
            taxValue: manifest.taxDeductionValue,
          }),
          timestamp: new Date().toISOString(),
        };
        memoryStore.addLog(log);
        logsCreated.push(log);
      }
    }

    return NextResponse.json({
      success: true,
      agentExecuted: agent,
      logsCreatedCount: logsCreated.length,
      logsCreated,
      batches: memoryStore.getBatches(),
      bundles: memoryStore.getBundles(),
      donations: memoryStore.getDonations(),
    });
  } catch (error) {
    console.error("Agent execution error:", error);
    return NextResponse.json({ success: false, error: "Failed to execute agent swarm" }, { status: 500 });
  }
}
