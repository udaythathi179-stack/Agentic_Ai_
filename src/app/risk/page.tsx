"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ShieldAlert,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface RiskBatch {
  id: string;
  sku: string;
  name: string;
  category: string;
  units: number;
  decayRisk: "critical" | "moderate" | "nominal" | "pristine";
  hoursRemaining: number;
  temp: string;
  humidity: number;
  ethylenePpm: string;
  burnRateVsForecast: string;
}

const riskBatches: RiskBatch[] = [
  {
    id: "batch-101",
    sku: "BAN-1KG",
    name: "Bananas 1kg",
    category: "produce",
    units: 108,
    decayRisk: "critical",
    hoursRemaining: 24,
    temp: "18.5°C",
    humidity: 78,
    ethylenePpm: "0.14",
    burnRateVsForecast: "+38% surplus unsold by expiry",
  },
  {
    id: "batch-102",
    sku: "BREAD-WH",
    name: "Whole Wheat Bread",
    category: "bakery",
    units: 44,
    decayRisk: "critical",
    hoursRemaining: 18,
    temp: "21.0°C",
    humidity: 55,
    ethylenePpm: "0.01",
    burnRateVsForecast: "+30% surplus unsold by expiry",
  },
  {
    id: "batch-103",
    sku: "SALM-300G",
    name: "Atlantic Fresh Salmon",
    category: "meat",
    units: 18,
    decayRisk: "critical",
    hoursRemaining: 14,
    temp: "3.8°C",
    humidity: 88,
    ethylenePpm: "0.00",
    burnRateVsForecast: "+72% surplus unsold by expiry",
  },
  {
    id: "batch-104",
    sku: "MILK-1L",
    name: "Whole Milk 1L",
    category: "dairy",
    units: 29,
    decayRisk: "moderate",
    hoursRemaining: 48,
    temp: "4.1°C",
    humidity: 86,
    ethylenePpm: "0.00",
    burnRateVsForecast: "+16% surplus unsold by expiry",
  },
  {
    id: "batch-105",
    sku: "SPIN-200G",
    name: "Baby Spinach 200g",
    category: "produce",
    units: 52,
    decayRisk: "moderate",
    hoursRemaining: 52,
    temp: "4.2°C",
    humidity: 92,
    ethylenePpm: "0.05",
    burnRateVsForecast: "+24% surplus unsold by expiry",
  },
  {
    id: "batch-106",
    sku: "YOG-500G",
    name: "Greek Yogurt 500g",
    category: "dairy",
    units: 74,
    decayRisk: "pristine",
    hoursRemaining: 160,
    temp: "3.9°C",
    humidity: 85,
    ethylenePpm: "0.00",
    burnRateVsForecast: "Optimal inventory cover",
  },
];

export default function RiskPage() {
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const filtered = riskBatches.filter((b) =>
    filterRisk === "all" ? true : b.decayRisk === filterRisk
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="bg-[#0b1411] border border-[#162720] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Spoilage Risk & FIFO Burn-Down
            </h1>
            <p className="text-sm text-[#8ca097] mt-1.5 leading-relaxed">
              Real-time biological decay bands derived from cold-chain telemetry,
              ethylene detection, and FIFO queue consumption.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "critical", "moderate", "pristine"].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterRisk(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all ${
                  filterRisk === tier
                    ? "bg-[#10b981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "bg-[#13221c] text-[#8ca097] hover:text-white border border-[#1d352a]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((batch) => (
            <div
              key={batch.id}
              className={`bg-[#0b1411] border rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-3 ${
                batch.decayRisk === "critical"
                  ? "border-[#ef444433] bg-[#120d0f]"
                  : batch.decayRisk === "moderate"
                  ? "border-[#f59e0b33] bg-[#14120e]"
                  : "border-[#162720]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{batch.name}</h3>
                    <span className="text-[11px] font-mono text-[#6e857b]">
                      {batch.sku} · {batch.category}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      batch.decayRisk === "critical"
                        ? "bg-[#351216] text-[#f87171] border border-[#ef444444]"
                        : batch.decayRisk === "moderate"
                        ? "bg-[#332210] text-[#fbbf24] border border-[#f59e0b44]"
                        : "bg-[#0f241a] text-[#34d399] border border-[#10b98144]"
                    }`}
                  >
                    {batch.decayRisk}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
                  <div className="bg-[#0e1814] p-2 rounded-xl border border-[#182a22]">
                    <span className="text-[10px] text-[#6e857b] flex items-center gap-1">
                      <Thermometer className="w-3 h-3" /> Temp
                    </span>
                    <p className="font-bold text-white mt-0.5">{batch.temp}</p>
                  </div>
                  <div className="bg-[#0e1814] p-2 rounded-xl border border-[#182a22]">
                    <span className="text-[10px] text-[#6e857b] flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Humidity
                    </span>
                    <p className="font-bold text-white mt-0.5">{batch.humidity}%</p>
                  </div>
                  <div className="bg-[#0e1814] p-2 rounded-xl border border-[#182a22]">
                    <span className="text-[10px] text-[#6e857b] flex items-center gap-1">
                      <Wind className="w-3 h-3" /> C2H4
                    </span>
                    <p className="font-bold text-white mt-0.5">{batch.ethylenePpm} ppm</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#8ca097] leading-relaxed">
                  <strong className="text-[#c2d1cb] font-semibold">
                    {batch.units} units
                  </strong>{" "}
                  with {batch.hoursRemaining}h remaining. {batch.burnRateVsForecast}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
