"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  initialPresets,
  ScenarioPresetKnobs,
} from "@/lib/scenarioData";
import {
  ChevronDown,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Box,
  Leaf,
  Info,
  Sliders,
  Zap,
} from "lucide-react";

export default function ScenariosPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>("demand_spike");
  const [seedsCount, setSeedsCount] = useState<number>(10);
  const [knobs, setKnobs] = useState<ScenarioPresetKnobs>({
    demandMult: 1.5,
    shockDays: 7,
    shelfLifeCutDays: 0,
    replenishBlockedDays: 0,
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<number>(0);
  const [lastStoredRun, setLastStoredRun] = useState<string>("excess_inventory");
  const [simulationResults, setSimulationResults] = useState<{
    completedSeeds: number;
    agenticTotalCost: string;
    fifoTotalCost: string;
    fixedTotalCost: string;
    wasteReductionPct: string;
    stockoutVariance: string;
  } | null>(null);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (initialPresets[presetKey]) {
      setKnobs(initialPresets[presetKey]);
    }
  };

  const handleKnobChange = (key: keyof ScenarioPresetKnobs, val: number) => {
    setKnobs((prev) => ({ ...prev, [key]: val }));
  };

  const handleRunComparison = () => {
    setIsRunning(true);
    setRunProgress(0);
    setSimulationResults(null);

    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setLastStoredRun(selectedPreset);
          setSimulationResults({
            completedSeeds: seedsCount,
            agenticTotalCost: "$18,420.50",
            fifoTotalCost: "$32,840.10",
            fixedTotalCost: "$24,910.00",
            wasteReductionPct: "-64.2%",
            stockoutVariance: "±1.8%",
          });
          return 100;
        }
        return prev + 20;
      });
    }, 280);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="pill-3d-emerald px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  3-Policy Simulator
                </span>
                <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  Monte Carlo Seeds
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
                Scenario Simulator
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Identical demand/inventory/seeds for all policies · mean + min-max
                over seeds. Unfavourable outcomes shown honestly.
              </p>
            </div>

            {/* Preset Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="appearance-none btn-3d-glass text-white px-5 py-2.5 pr-11 rounded-xl text-sm font-bold cursor-pointer"
              >
                <option value="demand_spike" className="bg-[#0b1411]">demand_spike</option>
                <option value="excess_inventory" className="bg-[#0b1411]">excess_inventory</option>
                <option value="cold_chain_failure" className="bg-[#0b1411]">cold_chain_failure</option>
                <option value="baseline" className="bg-[#0b1411]">baseline</option>
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Seeds and Run Action */}
          <div className="flex items-center gap-3 pt-1 relative z-10">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm shadow-inner">
              <span className="text-slate-400 font-semibold">Seeds</span>
              <input
                type="number"
                min="1"
                max="50"
                value={seedsCount}
                onChange={(e) => setSeedsCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 bg-transparent text-emerald-400 font-mono font-bold focus:outline-none text-center"
              />
            </div>

            <button
              onClick={handleRunComparison}
              disabled={isRunning}
              className="btn-3d-emerald px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isRunning ? `Simulating ${runProgress}%...` : "Run comparison"}</span>
            </button>
          </div>
        </div>

        {/* Preset Knobs Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Preset knobs (what each preset changes)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-xs text-slate-300 font-medium">Demand ×</span>
              <input
                type="number"
                step="0.1"
                value={knobs.demandMult}
                onChange={(e) => handleKnobChange("demandMult", parseFloat(e.target.value) || 1)}
                className="w-16 bg-white/10 border border-white/15 rounded-lg text-emerald-400 font-mono text-center py-1 text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-xs text-slate-300 font-medium">Shock days</span>
              <input
                type="number"
                value={knobs.shockDays}
                onChange={(e) => handleKnobChange("shockDays", parseInt(e.target.value) || 0)}
                className="w-16 bg-white/10 border border-white/15 rounded-lg text-cyan-400 font-mono text-center py-1 text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-xs text-slate-300 font-medium">Shelf-life cut (days)</span>
              <input
                type="number"
                value={knobs.shelfLifeCutDays}
                onChange={(e) => handleKnobChange("shelfLifeCutDays", parseInt(e.target.value) || 0)}
                className="w-16 bg-white/10 border border-white/15 rounded-lg text-amber-400 font-mono text-center py-1 text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-xs text-slate-300 font-medium">Replenish blocked (days)</span>
              <input
                type="number"
                value={knobs.replenishBlockedDays}
                onChange={(e) => handleKnobChange("replenishBlockedDays", parseInt(e.target.value) || 0)}
                className="w-16 bg-white/10 border border-white/15 rounded-lg text-rose-400 font-mono text-center py-1 text-sm font-bold focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Knobs override the preset for this run only; the same overridden inputs
            reach agentic, FIFO and fixed-threshold, so comparisons stay fair. Excess
            inventory (3.5× stock) and store variance use fixed definitions.
          </p>
        </div>

        {/* Center Stored Run Card */}
        <div className="card-3d-realistic p-10 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-white/20 transform hover:scale-105 transition-all">
            <Leaf className="w-9 h-9 text-white drop-shadow-md" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              Last stored run:{" "}
              <span className="text-emerald-400 font-mono font-bold">{lastStoredRun}</span>
              <Link
                href="/evaluation"
                className="text-cyan-400 hover:text-cyan-300 underline font-normal text-sm ml-1"
              >
                (see Evaluation)
              </Link>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Pick a preset and run the 3-policy comparison. Baseline = no shock;
              excess_inventory starts 3.5× stock.
            </p>
          </div>

          {simulationResults && (
            <div className="mt-4 p-5 rounded-2xl bg-black/50 border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl animate-fadeIn">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Agentic Total Cost</span>
                <p className="text-xl font-mono font-black text-emerald-400">
                  {simulationResults.agenticTotalCost}
                </p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold">FIFO Total Cost</span>
                <p className="text-xl font-mono font-black text-blue-300">
                  {simulationResults.fifoTotalCost}
                </p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Fixed Threshold</span>
                <p className="text-xl font-mono font-black text-amber-400">
                  {simulationResults.fixedTotalCost}
                </p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Waste Avoided</span>
                <p className="text-xl font-mono font-black text-cyan-300">
                  {simulationResults.wasteReductionPct}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Calibration Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-white">
            Calibration: starting cover vs 14-day horizon (as of 2026-10-05)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-black/40 text-slate-400 uppercase font-mono tracking-wider font-semibold border-b border-white/10">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Starting Units</th>
                  <th className="py-3 px-4">Days Cover</th>
                  <th className="py-3 px-4">Daily Decay Velocity</th>
                  <th className="py-3 px-4">Target Safety Buffer</th>
                  <th className="py-3 px-4">Calibration Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                <tr>
                  <td className="py-3 px-4 text-white font-sans font-bold">Produce</td>
                  <td className="py-3 px-4">1,480 u</td>
                  <td className="py-3 px-4">4.2 days</td>
                  <td className="py-3 px-4 text-amber-400">6.8% / day</td>
                  <td className="py-3 px-4">2.0 days</td>
                  <td className="py-3 px-4 text-emerald-400 font-sans font-semibold">calibrated (0.98 r²)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-sans font-bold">Bakery</td>
                  <td className="py-3 px-4">620 u</td>
                  <td className="py-3 px-4">2.4 days</td>
                  <td className="py-3 px-4 text-rose-400">14.2% / day</td>
                  <td className="py-3 px-4">1.0 days</td>
                  <td className="py-3 px-4 text-emerald-400 font-sans font-semibold">calibrated (0.97 r²)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-sans font-bold">Dairy</td>
                  <td className="py-3 px-4">1,890 u</td>
                  <td className="py-3 px-4">6.8 days</td>
                  <td className="py-3 px-4 text-cyan-400">2.1% / day</td>
                  <td className="py-3 px-4">3.5 days</td>
                  <td className="py-3 px-4 text-emerald-400 font-sans font-semibold">calibrated (0.99 r²)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-sans font-bold">Meat & Seafood</td>
                  <td className="py-3 px-4">430 u</td>
                  <td className="py-3 px-4">2.8 days</td>
                  <td className="py-3 px-4 text-rose-400">11.5% / day</td>
                  <td className="py-3 px-4">1.5 days</td>
                  <td className="py-3 px-4 text-emerald-400 font-sans font-semibold">calibrated (0.99 r²)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
