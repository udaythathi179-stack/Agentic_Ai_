"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { evaluationData, samplePlannerProposals, sampleAuditLogs } from "@/lib/scenarioData";
import { Download, FileSpreadsheet, Check, ArrowRight, BarChart3, Sparkles } from "lucide-react";

export default function EvaluationPage() {
  const [activePreset, setActivePreset] = useState<"demand_spike" | "excess_inventory">("demand_spike");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const currentData = evaluationData[activePreset] || evaluationData.demand_spike;

  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.map((val) => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportRecommendationsCSV = () => {
    const rows = [
      ["ID", "SKU", "Product", "Store", "Category", "Risk", "Qty", "DaysToExpiry", "Action", "Status", "ExpectedNetImpact"],
      ...samplePlannerProposals.map((p) => [
        p.id,
        p.sku,
        p.productName,
        p.storeId,
        p.category,
        p.riskLevel,
        p.quantity,
        p.daysToExpiry,
        p.actionLabel,
        p.status,
        p.expectedNetImpact,
      ]),
    ];
    downloadCSV("zerowaste_recommendations.csv", rows);
  };

  const exportScenariosCSV = () => {
    const rows = [
      ["Preset", "Metric", "Agentic", "FIFO", "FixedThreshold", "Winner"],
      [activePreset, "Waste (units)", currentData.wasteUnits.agentic, currentData.wasteUnits.fifo, currentData.wasteUnits.fixed, currentData.wasteUnits.winner],
      [activePreset, "Stockouts (units)", currentData.stockouts.agentic, currentData.stockouts.fifo, currentData.stockouts.fixed, currentData.stockouts.winner],
      [activePreset, "Net Margin ($)", currentData.netMarginUsd.agentic, currentData.netMarginUsd.fifo, currentData.netMarginUsd.fixed, currentData.netMarginUsd.winner],
      [activePreset, "Gross Revenue ($)", currentData.revenueUsd.agentic, currentData.revenueUsd.fifo, currentData.revenueUsd.fixed, currentData.revenueUsd.winner],
    ];
    downloadCSV("zerowaste_scenarios.csv", rows);
  };

  const exportAuditCSV = () => {
    const rows = [
      ["Timestamp", "Actor", "Action", "Entity", "Summary", "Status"],
      ...sampleAuditLogs.map((a) => [
        a.timestamp,
        a.actor,
        a.action,
        a.entity,
        JSON.stringify(a.summary),
        a.status,
      ]),
    ];
    downloadCSV("zerowaste_audit.csv", rows);
  };

  const maxScale = 60000;
  const getBarHeightPx = (val: number) => {
    return Math.max(10, Math.min(220, (val / maxScale) * 220));
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-3d-amber px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Policy Benchmarks
              </span>
              <span className="pill-3d-emerald px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                14-Day Horizon
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              Evaluation & Audit
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Cross-policy comparison: Agentic Multi-Agent vs. FIFO vs. Fixed-Threshold heuristics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportRecommendationsCSV}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV: recommendations</span>
            </button>

            <button
              onClick={exportScenariosCSV}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>CSV: scenarios</span>
            </button>

            <button
              onClick={exportAuditCSV}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>CSV: audit</span>
            </button>
          </div>
        </div>

        {/* Methodology Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-3">
          <h2 className="text-base font-bold text-white">
            Methodology & assumptions
          </h2>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              Identical demand/inventory/seeds per policy; 14-day horizon; waste
              units+cost, stockout, revenue (gross), service, runtime; mean+min-max over seeds.
            </p>
            <p>
              Synthetic data; elasticity 1.5; transfer $0.30/u; order fixed $2; donation
              recovery 40% cost; revenue is gross (pre-markdown); COGS = sold units ×
              unit cost; total_cost = ordering fees + waste + markdown give-away -
              donation recovery; net_margin = revenue - COGS - waste - markdown - ordering
              fees; agentic stockout counts include markdown-induced demand.
            </p>
            <p>
              Measurement: 14-day simulated horizon per scenario run; units = inventory
              units / USD; runtime = server compute ms (excluded from reproducibility checks).
            </p>
            <p className="text-white font-bold pt-1">
              Planner decisions: approve×1, reject×1 · Recommendations: executed×1,
              proposed×90, rejected×1, superseded×90
            </p>
          </div>
        </div>

        {/* Policy Matrix & 3D Bar Chart Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Policy matrix (latest stored run per preset)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Headline vs both baselines: agentic leads on Total cost ($); trails on
                Waste (units) (fifo), Stockouts (fixed-threshold), Service
                (fixed-threshold), Revenue ($) (fixed-threshold).
              </p>
            </div>

            {/* Preset Selector */}
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => setActivePreset("demand_spike")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === "demand_spike"
                    ? "btn-3d-emerald text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                demand_spike
              </button>
              <button
                type="button"
                onClick={() => setActivePreset("excess_inventory")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreset === "excess_inventory"
                    ? "btn-3d-cyan text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                excess_inventory
              </button>
            </div>
          </div>

          {/* 3D Bar Chart Viewport */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-inner">
            <div className="relative h-[260px] w-full flex items-end">
              {/* Y-Axis Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-500">
                <div className="border-b border-white/5 flex items-center justify-between pb-0.5">
                  <span>60000</span>
                </div>
                <div className="border-b border-white/5 flex items-center justify-between pb-0.5">
                  <span>45000</span>
                </div>
                <div className="border-b border-white/5 flex items-center justify-between pb-0.5">
                  <span>30000</span>
                </div>
                <div className="border-b border-white/5 flex items-center justify-between pb-0.5">
                  <span>15000</span>
                </div>
                <div className="border-b border-white/5 flex items-center justify-between pb-0.5">
                  <span>0</span>
                </div>
              </div>

              {/* 3D Gradient Bars */}
              <div className="relative z-10 w-full pl-12 grid grid-cols-4 gap-4 sm:gap-8 h-[225px] items-end">
                {/* 1. Waste (units) */}
                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="flex items-end gap-2">
                    <div
                      style={{ height: `${getBarHeightPx(currentData.wasteUnits.agentic)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-green-700 via-emerald-500 to-green-400 rounded-t-lg shadow-[0_0_18px_rgba(16,185,129,0.55)] transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.wasteUnits.fifo)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-indigo-600 via-slate-400 to-indigo-300 rounded-t-lg transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.wasteUnits.fixed)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-orange-600 via-amber-500 to-orange-400 rounded-t-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500 hover:brightness-125"
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-bold text-center">
                    Waste (units)
                  </span>
                </div>

                {/* 2. Stockouts */}
                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="flex items-end gap-2">
                    <div
                      style={{ height: `${getBarHeightPx(currentData.stockouts.agentic)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-green-700 via-emerald-500 to-green-400 rounded-t-lg shadow-[0_0_18px_rgba(16,185,129,0.55)] transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.stockouts.fifo)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-indigo-600 via-slate-400 to-indigo-300 rounded-t-lg transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.stockouts.fixed)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-orange-600 via-amber-500 to-orange-400 rounded-t-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500 hover:brightness-125"
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-bold text-center">
                    Stockouts
                  </span>
                </div>

                {/* 3. Net margin ($) */}
                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="flex items-end gap-2">
                    <div
                      style={{ height: `${getBarHeightPx(currentData.netMarginUsd.agentic)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-green-700 via-emerald-500 to-green-400 rounded-t-lg shadow-[0_0_18px_rgba(16,185,129,0.55)] transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.netMarginUsd.fifo)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-indigo-600 via-slate-400 to-indigo-300 rounded-t-lg transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.netMarginUsd.fixed)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-orange-600 via-amber-500 to-orange-400 rounded-t-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500 hover:brightness-125"
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-bold text-center">
                    Net margin ($)
                  </span>
                </div>

                {/* 4. Revenue ($) */}
                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="flex items-end gap-2">
                    <div
                      style={{ height: `${getBarHeightPx(currentData.revenueUsd.agentic)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-green-700 via-emerald-500 to-green-400 rounded-t-lg shadow-[0_0_18px_rgba(16,185,129,0.55)] transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.revenueUsd.fifo)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-indigo-600 via-slate-400 to-indigo-300 rounded-t-lg transition-all duration-500 hover:brightness-125"
                    />
                    <div
                      style={{ height: `${getBarHeightPx(currentData.revenueUsd.fixed)}px` }}
                      className="w-7 sm:w-11 bg-gradient-to-t from-orange-600 via-amber-500 to-orange-400 rounded-t-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500 hover:brightness-125"
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-bold text-center">
                    Revenue ($)
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-3 text-xs font-bold border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_8px_#34d399]" />
                <span className="text-emerald-400">agentic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-slate-300 to-indigo-500" />
                <span className="text-slate-300">fifo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-amber-400">fixed</span>
              </div>
            </div>
          </div>

          {/* Breakdown Badges */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span>Waste (units):</span>
              <span className="text-emerald-400 font-bold">agentic {currentData.wasteUnits.agentic}</span>
              <span>·</span>
              <span className="text-slate-300">fifo {currentData.wasteUnits.fifo}</span>
              <span>·</span>
              <span className="text-amber-400">fixed-threshold {currentData.wasteUnits.fixed}</span>
              <span>→</span>
              <span className="pill-3d-amber px-2.5 py-0.5 rounded text-[11px] font-sans font-bold">
                {currentData.wasteUnits.winner} wins
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span>Stockouts:</span>
              <span className="text-emerald-400 font-bold">agentic {currentData.stockouts.agentic}</span>
              <span>·</span>
              <span className="text-slate-300">fifo {currentData.stockouts.fifo}</span>
              <span>·</span>
              <span className="text-amber-400">fixed-threshold {currentData.stockouts.fixed}</span>
              <span>→</span>
              <span className="pill-3d-amber px-2.5 py-0.5 rounded text-[11px] font-sans font-bold">
                {currentData.stockouts.winner} wins
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
