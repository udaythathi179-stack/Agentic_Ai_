"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  TrendingUp,
  Calendar,
  CloudRain,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";

interface SkuForecast {
  sku: string;
  name: string;
  category: string;
  store: string;
  history7d: number[];
  forecast7d: number[];
  confLower: number[];
  confUpper: number[];
  totalExpected7d: number;
  varianceNote: string;
}

const forecasts: SkuForecast[] = [
  {
    sku: "BAN-1KG",
    name: "Bananas 1kg",
    category: "produce",
    store: "store_003",
    history7d: [24, 26, 28, 25, 27, 29, 26],
    forecast7d: [27, 28, 26, 25, 26, 25, 26],
    confLower: [22, 23, 21, 20, 21, 20, 21],
    confUpper: [32, 33, 31, 30, 31, 30, 31],
    totalExpected7d: 182.8,
    varianceNote: "80% confidence interval shown. Daily mean ~26.1 units/day.",
  },
  {
    sku: "BREAD-WH",
    name: "Whole Wheat Bread",
    category: "bakery",
    store: "store_001",
    history7d: [18, 21, 19, 22, 20, 24, 23],
    forecast7d: [21, 22, 21, 20, 21, 21, 21],
    confLower: [17, 18, 17, 16, 17, 17, 17],
    confUpper: [25, 26, 25, 24, 25, 25, 25],
    totalExpected7d: 147.0,
    varianceNote: "Steady breakfast consumption pattern with minor weekend lift.",
  },
  {
    sku: "MILK-1L",
    name: "Whole Milk 1L",
    category: "dairy",
    store: "store_001",
    history7d: [20, 22, 23, 21, 22, 25, 22],
    forecast7d: [22, 23, 22, 21, 23, 22, 22],
    confLower: [19, 20, 19, 18, 20, 19, 19],
    confUpper: [26, 27, 26, 25, 27, 26, 26],
    totalExpected7d: 155.0,
    varianceNote: "High baseline demand. Low forecast error (MAE 0.08).",
  },
  {
    sku: "AVOC-2PK",
    name: "Organic Hass Avocados",
    category: "produce",
    store: "store_002",
    history7d: [12, 14, 11, 13, 14, 16, 12],
    forecast7d: [13, 14, 13, 12, 14, 13, 13],
    confLower: [9, 10, 9, 8, 10, 9, 9],
    confUpper: [17, 18, 17, 16, 18, 17, 17],
    totalExpected7d: 92.0,
    varianceNote: "Weather-adjusted: rain forecast weekend may suppress foot traffic by 12%.",
  },
];

export default function ForecastPage() {
  const [selectedSku, setSelectedSku] = useState<string>("BAN-1KG");
  const activeForecast =
    forecasts.find((f) => f.sku === selectedSku) || forecasts[0];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Bayesian Ensemble
              </span>
              <span className="pill-3d-purple px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Weather Regressors
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              Bayesian Demand Forecaster
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Ensemble modeling with weather regressors, seasonality, and
              historical sales velocity to prevent over-ordering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="appearance-none btn-3d-glass text-white px-5 py-2.5 pr-11 rounded-xl text-sm font-bold cursor-pointer"
              >
                {forecasts.map((f) => (
                  <option key={f.sku} value={f.sku} className="bg-[#0b1411]">
                    {f.name} ({f.sku})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Forecast Chart Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                7-Day Projected Burn Curve · {activeForecast.name}
              </h2>
              <span className="text-xs text-slate-300">
                Store: <span className="text-cyan-400 font-bold">{activeForecast.store}</span> · Expected 7d total:{" "}
                <strong className="text-emerald-400 text-sm">
                  {activeForecast.totalExpected7d} units
                </strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {activeForecast.varianceNote}
            </p>
          </div>

          {/* Interactive Visual Trend Curve */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Day 1 (Tomorrow)</span>
              <span>Day 3</span>
              <span>Day 5</span>
              <span>Day 7</span>
            </div>

            <div className="grid grid-cols-7 gap-3 h-52 items-end pt-6">
              {activeForecast.forecast7d.map((val, idx) => {
                const lower = activeForecast.confLower[idx];
                const upper = activeForecast.confUpper[idx];
                const heightPct = (val / 35) * 100;
                const upperPct = (upper / 35) * 100;

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-end h-full relative group"
                  >
                    <div
                      style={{ height: `${upperPct}%` }}
                      className="absolute bottom-0 w-full bg-cyan-500/10 border-t border-cyan-500/30 rounded-t-xl transition-all"
                    />

                    <div
                      style={{ height: `${heightPct}%` }}
                      className="relative z-10 w-9 sm:w-14 bg-gradient-to-t from-cyan-600 via-teal-500 to-emerald-400 rounded-t-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:brightness-125 transition-all"
                    />

                    <span className="text-xs font-mono font-bold text-white mt-2 group-hover:text-cyan-300">
                      {val}u
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      d+{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 pt-3 text-xs border-t border-white/10 font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_#06b6d4]" />
                <span className="text-cyan-300">Expected Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 border border-cyan-500/40" />
                <span className="text-slate-400">80% Bayesian Credible Interval</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
