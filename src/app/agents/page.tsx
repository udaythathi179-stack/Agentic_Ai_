"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { sampleTraces, SkuTrace } from "@/lib/scenarioData";
import {
  Play,
  RefreshCw,
  X,
  Copy,
  Check,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AgentsPage() {
  const [traces, setTraces] = useState<SkuTrace[]>(sampleTraces);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [replayingCounterfactual, setReplayingCounterfactual] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<{
    title: string;
    step: string;
    input: any;
    output: any;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const pipelineSteps = [
    {
      step: "STEP 1",
      name: "Demand Forecaster",
      desc: "Predicts units/day from sales history",
      stats: "ok · 1ms · 182 runs",
      accent: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-500/30",
      tagColor: "pill-3d-cyan",
      input: {
        model: "Bayesian-Prophet-Ensemble",
        lookback_window_days: 28,
        features: ["dow", "seasonality", "weather_rain_index", "payday_cycle"],
        sku_coverage: 182,
      },
      output: {
        forecast_horizon_days: 7,
        mean_absolute_error: 0.12,
        confidence_intervals: "80%",
        status: "converged",
      },
    },
    {
      step: "STEP 2",
      name: "Spoilage Estimator",
      desc: "FIFO burn-down against forecast → risk band",
      stats: "ok · 1ms · 182 runs",
      accent: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      tagColor: "pill-3d-amber",
      input: {
        sensor_telemetry: {
          ethylene_ppm: 0.04,
          temp_celsius: 4.2,
          humidity_pct: 88,
        },
        batch_queue: "FIFO",
      },
      output: {
        projected_decay_units: 42,
        risk_bands: { critical: 12, moderate: 30, nominal: 140 },
        shelf_life_burn_rate: "nominal",
      },
    },
    {
      step: "STEP 3",
      name: "Stock Analyst",
      desc: "Finds excess, shortages, transfer pairs",
      stats: "ok · 11ms · 182 runs",
      accent: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      tagColor: "pill-3d-emerald",
      input: {
        network_stores: ["store_001", "store_002", "store_003", "store_005"],
        transfer_cost_per_unit: 0.3,
      },
      output: {
        excess_units_detected: 184,
        shortage_risk_skus: 4,
        viable_transfer_pairs: 6,
      },
    },
    {
      step: "STEP 4",
      name: "Options Pricer",
      desc: "Scores markdown/donate/transfer/replenish/no-action",
      stats: "ok · 0ms · 182 runs",
      accent: "from-purple-500/20 to-fuchsia-500/10",
      borderColor: "border-purple-500/30",
      tagColor: "pill-3d-purple",
      input: {
        action_space: ["markdown", "bundle", "donate", "transfer", "no_action"],
        elasticity_factor: 1.5,
        food_bank_salvage_rate: 0.4,
      },
      output: {
        highest_roi_action: "donate",
        evaluated_scenarios: 6,
        expected_net_recovery: "$25.92",
      },
    },
    {
      step: "STEP 5",
      name: "Coordinator",
      desc: "Validates, enforces rules, picks one proposal",
      stats: "ok · 0ms · 182 runs",
      accent: "from-rose-500/20 to-pink-500/10",
      borderColor: "border-rose-500/30",
      tagColor: "pill-3d-rose",
      input: {
        guardrails: ["never_markdown_expired", "prioritize_community_charity", "max_markdown_50pct"],
        candidate_count: 5,
      },
      output: {
        decision: "proposal_approved",
        requires_human_approval: true,
        audit_checksum: "sha256:7f49a1...",
      },
    },
  ];

  const handleRunAllAgents = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      setIsRunningAll(false);
      setTraces((prev) =>
        prev.map((t) => ({
          ...t,
          steps: {
            ...t.steps,
            stockAnalyst: {
              ...t.steps.stockAnalyst,
              durationMs: Math.floor(Math.random() * 8) + 8,
            },
            spoilageEstimator: {
              ...t.steps.spoilageEstimator,
              durationMs: Math.floor(Math.random() * 3) + 1,
            },
            demandForecaster: {
              ...t.steps.demandForecaster,
              durationMs: Math.floor(Math.random() * 2) + 1,
            },
          },
        }))
      );
    }, 1200);
  };

  const handleCounterfactual = () => {
    setReplayingCounterfactual(true);
    setTimeout(() => {
      setReplayingCounterfactual(false);
    }, 1500);
  };

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-3d-purple px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Deterministic Agent Swarm
              </span>
              <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                JSON Replay
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              AI Agent Control Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Deterministic engine · Gemini only explains · every run stored as
              JSON for replay.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAllAgents}
              disabled={isRunningAll}
              className="btn-3d-emerald px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 fill-white ${isRunningAll ? "animate-spin" : ""}`} />
              <span>{isRunningAll ? "Executing swarm..." : "Run all agents"}</span>
            </button>

            <button
              onClick={handleCounterfactual}
              disabled={replayingCounterfactual}
              className="btn-3d-glass px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
            >
              <span>
                {replayingCounterfactual
                  ? "Replaying 5%/20%..."
                  : "Counterfactual replay (5%/20%)"}
              </span>
            </button>
          </div>
        </div>

        {/* Pipeline Diagram Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Pipeline (click a node for its latest structured input/output)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Live deterministic execution
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {pipelineSteps.map((node, idx) => (
              <div key={node.step} className="flex flex-col relative group">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedNodeData({
                      title: node.name,
                      step: node.step,
                      input: node.input,
                      output: node.output,
                    })
                  }
                  className={`bg-gradient-to-b ${node.accent} bg-black/40 border ${node.borderColor} rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]`}
                >
                  <div>
                    <span className={`${node.tagColor} px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase inline-block`}>
                      {node.step}
                    </span>
                    <h3 className="text-sm font-black text-white mt-2 group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-mono text-emerald-400 font-bold border-t border-white/10">
                    {node.stats}
                  </div>
                </button>

                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-400 drop-shadow">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Latest traces by store x SKU Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-4">
          <h2 className="text-base font-bold text-white">
            Latest traces by store × SKU (click any run for JSON)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traces.map((trace) => (
              <div
                key={trace.id}
                className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono font-black text-cyan-300 tracking-wide">
                    {trace.storeId} | {trace.sku}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {trace.productName}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-xs">
                  {Object.entries(trace.steps).map(([key, step]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setSelectedNodeData({
                          title: `${trace.storeId} | ${trace.sku} - ${step.name}`,
                          step: key,
                          input: step.input,
                          output: step.output,
                        })
                      }
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer text-left group"
                    >
                      <span className="text-slate-200 group-hover:text-white font-sans text-xs font-semibold">
                        {step.name}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 font-bold">
                        {step.status} · {step.durationMs}ms
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedNodeData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-realistic w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  {selectedNodeData.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyJson({
                      input: selectedNodeData.input,
                      output: selectedNodeData.output,
                    })
                  }
                  className="btn-3d-glass px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNodeData(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div>
                <span className="pill-3d-cyan px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                  Structured Input
                </span>
                <pre className="mt-2 p-3.5 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedNodeData.input, null, 2)}
                </pre>
              </div>

              <div>
                <span className="pill-3d-emerald px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                  Structured Output
                </span>
                <pre className="mt-2 p-3.5 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedNodeData.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
