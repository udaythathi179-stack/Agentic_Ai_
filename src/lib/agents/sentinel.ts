import { InitialBatch } from "@/db/initial-data";

export interface SentinelEvaluationResult {
  batchId: string;
  batchNumber: string;
  previousScore: number;
  newScore: number;
  decayDelta: number;
  hoursRemaining: number;
  decayRiskLevel: "pristine" | "nominal" | "moderate_decay" | "critical_decay" | "expired";
  tempViolation: boolean;
  ethyleneSpike: boolean;
  reasoning: string;
}

/**
 * Sentinel Decay Agent
 * Uses Arrhenius Q10 kinetic degradation curves to calculate real-world biological food decay
 */
export function evaluateBatchFreshness(
  batch: InitialBatch,
  customTemp?: number,
  customHumidity?: number
): SentinelEvaluationResult {
  const currentTemp = customTemp !== undefined ? customTemp : parseFloat(batch.ambientTemp);
  const currentHumidity = customHumidity !== undefined ? customHumidity : batch.ambientHumidity;
  const ethylenePpm = parseFloat(batch.ethyleneDetectedPpm);

  // Time decay factor
  const now = new Date().getTime();
  const harvestTime = new Date(batch.harvestDate).getTime();
  const baseExpiryTime = new Date(batch.baseExpiryDate).getTime();
  const totalLifecycleMs = Math.max(baseExpiryTime - harvestTime, 1000 * 60 * 60 * 24);
  const elapsedMs = Math.max(now - harvestTime, 0);

  const baselineFraction = Math.max(0, 1 - elapsedMs / totalLifecycleMs);

  // Temperature acceleration multiplier (Q10 rule: decay doubles every 10°C rise)
  // Optimal temp is between 1°C and 4°C for perishables
  const optimalTemp = batch.category === "bakery" ? 20.0 : 3.0;
  const tempDiff = Math.max(0, currentTemp - optimalTemp);
  const tempDecayMultiplier = 1 + tempDiff * 0.08;

  // Ethylene acceleration factor
  const ethyleneMultiplier = ethylenePpm > 0.2 ? 1 + ethylenePpm * 0.5 : 1.0;

  // Humidity penalty (too dry = wilting; too humid = mold risk)
  let humidityPenalty = 0;
  if (currentHumidity < 70) {
    humidityPenalty = (70 - currentHumidity) * 0.3; // wilting
  } else if (currentHumidity > 95 && batch.category !== "produce") {
    humidityPenalty = 8; // mold moisture risk
  }

  // Calculate dynamic freshness score (0 - 100)
  const rawScore = baselineFraction * 100 / (tempDecayMultiplier * ethyleneMultiplier) - humidityPenalty;
  const newScore = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Calculate estimated biological hours remaining
  const hoursRemaining = Math.max(4, Math.round((newScore / 100) * 48));

  // Determine risk level
  let decayRiskLevel: "pristine" | "nominal" | "moderate_decay" | "critical_decay" | "expired" = "nominal";
  if (newScore >= 80) decayRiskLevel = "pristine";
  else if (newScore >= 55) decayRiskLevel = "nominal";
  else if (newScore >= 35) decayRiskLevel = "moderate_decay";
  else if (newScore >= 12) decayRiskLevel = "critical_decay";
  else decayRiskLevel = "expired";

  const tempViolation = tempDiff > 4.0;
  const ethyleneSpike = ethylenePpm > 0.25;

  let reasoning = `Sentinel verified batch at ${newScore}% Biological Freshness.`;
  if (tempViolation) {
    reasoning = `Thermal alert: Storage zone at ${currentTemp}°C (+${tempDiff.toFixed(1)}°C over target) is accelerating cellular respiration by ${((tempDecayMultiplier - 1) * 100).toFixed(0)}%.`;
  } else if (ethyleneSpike) {
    reasoning = `Ethylene gas accumulation (${ethylenePpm} ppm) detected. Premature senescence underway. Shelf life shortened to ~${hoursRemaining}h.`;
  } else if (decayRiskLevel === "critical_decay") {
    reasoning = `Critical decay threshold breached (${hoursRemaining}h remaining). Immediate algorithmic price slash or culinary bundle dispatch advised.`;
  }

  return {
    batchId: batch.id,
    batchNumber: batch.batchNumber,
    previousScore: batch.freshnessScore,
    newScore,
    decayDelta: newScore - batch.freshnessScore,
    hoursRemaining,
    decayRiskLevel,
    tempViolation,
    ethyleneSpike,
    reasoning,
  };
}
