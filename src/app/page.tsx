"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ThreeDHeroBanner } from "@/components/ThreeDHeroBanner";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Leaf,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  BarChart3,
  MessageSquare,
  Bot,
  Zap,
  TrendingDown,
  AlertTriangle,
  Package,
} from "lucide-react";

export default function Home() {
  const [metrics] = useState({
    totalInventoryUnits: 3420,
    criticalCount: 14,
    moderateCount: 38,
    totalValueAtRisk: "2,840.50",
    co2PreventedKg: "1,240.8",
    mealsSavedTotal: 840,
    activeBundlesCount: 12,
    donationsDispatched: 28,
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Interactive 3D Real-Time Hero Banner */}
        <ThreeDHeroBanner />

        {/* 3D Colorful Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Value At Risk (Rose/Red) */}
          <div className="card-3d-realistic p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                Value At Risk
              </span>
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black font-mono text-white tracking-tight drop-shadow">
                ${metrics.totalValueAtRisk}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono text-rose-400">
                <span className="pill-3d-rose px-2 py-0.5 rounded text-[10px] font-bold">
                  {metrics.criticalCount} Critical
                </span>
                <span>(&lt;24h shelf remaining)</span>
              </div>
            </div>
          </div>

          {/* Card 2: CO2 Prevented (Emerald) */}
          <div className="card-3d-realistic p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                CO2 Prevented
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black font-mono text-white tracking-tight drop-shadow">
                {metrics.co2PreventedKg} <span className="text-lg text-emerald-400">kg</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono text-emerald-300">
                <span className="pill-3d-emerald px-2 py-0.5 rounded text-[10px] font-bold">
                  {metrics.mealsSavedTotal} Meals
                </span>
                <span>rescued from landfill</span>
              </div>
            </div>
          </div>

          {/* Card 3: Managed Stock (Cyan) */}
          <div className="card-3d-realistic p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                Network Stock
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black font-mono text-white tracking-tight drop-shadow">
                {metrics.totalInventoryUnits.toLocaleString()}{" "}
                <span className="text-lg text-cyan-400">u</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono text-cyan-300">
                <span className="pill-3d-cyan px-2 py-0.5 rounded text-[10px] font-bold">
                  5 Stores
                </span>
                <span>live biological telemetry</span>
              </div>
            </div>
          </div>

          {/* Card 4: Dispatches (Purple) */}
          <div className="card-3d-realistic p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                Autonomous Rescues
              </span>
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black font-mono text-white tracking-tight drop-shadow">
                {metrics.donationsDispatched}{" "}
                <span className="text-lg text-purple-400">batches</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono text-purple-300">
                <span className="pill-3d-purple px-2 py-0.5 rounded text-[10px] font-bold">
                  100% Tax Deductible
                </span>
                <span>zero landfill trace</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Colorful Deep-Dive Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tile 1: 3D Shelves Simulation */}
          <Link
            href="/shelves"
            className="card-3d-realistic p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Photorealistic 3D Shelves
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Step inside the 3D supermarket aisle. Real-time biological decay
                auras, Three.js shaders, lighting, and accelerated 24h decay time-lapses.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mt-6 group-hover:translate-x-1 transition-transform">
              <span>Inspect 3D Grocery Aisles</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Tile 2: AI Agent Pipeline */}
          <Link
            href="/agents"
            className="card-3d-realistic p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                AI Agent Control Swarm
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Deterministic 5-stage pipeline: Demand Forecaster, Spoilage Estimator,
                Stock Analyst, Options Pricer, and Coordinator with live JSON replay.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mt-6 group-hover:translate-x-1 transition-transform">
              <span>View Agent Control Center</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Tile 3: Planner Review */}
          <Link
            href="/planner"
            className="card-3d-realistic p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-fuchsia-600 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Planner Review & Approval
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                90 pending perishable action proposals. Human-in-the-loop review,
                dynamic pricing rationale, mathematical breakdowns, and bulk execution.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-bold mt-6 group-hover:translate-x-1 transition-transform">
              <span>Review 90 Action Proposals</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
