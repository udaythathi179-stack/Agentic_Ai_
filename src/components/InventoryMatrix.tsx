"use client";

import React, { useState } from "react";
import { InitialBatch } from "@/db/initial-data";
import {
  Thermometer,
  Droplets,
  Clock,
  Sparkles,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Zap,
} from "lucide-react";

interface InventoryMatrixProps {
  batches: InitialBatch[];
  onUpdateSensor: (batchId: string, temp: number, humidity: number) => void;
  onApplyMarkdown: (batchId: string) => void;
  onTriggerSentinel: (batchId: string) => void;
}

export const InventoryMatrix: React.FC<InventoryMatrixProps> = ({
  batches,
  onUpdateSensor,
  onApplyMarkdown,
  onTriggerSentinel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingSensorBatch, setEditingSensorBatch] = useState<InitialBatch | null>(null);
  const [tempInput, setTempInput] = useState<number>(4.0);
  const [humidityInput, setHumidityInput] = useState<number>(85);

  const categories = ["all", "produce", "dairy", "bakery", "meat", "deli"];

  const filteredBatches = batches.filter((b) => {
    const matchesCat = selectedCategory === "all" || b.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getFreshnessColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 stroke-emerald-400";
    if (score >= 50) return "text-lime-400 stroke-lime-400";
    if (score >= 30) return "text-amber-400 stroke-amber-400";
    return "text-rose-400 stroke-rose-400";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "pristine":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pristine Peak</span>;
      case "nominal":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">Nominal Fresh</span>;
      case "moderate_decay":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Moderate Decay</span>;
      case "critical_decay":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">Critical Risk</span>;
      case "expired":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700 text-slate-300">Expired</span>;
      default:
        return null;
    }
  };

  const handleOpenSensorModal = (batch: InitialBatch) => {
    setEditingSensorBatch(batch);
    setTempInput(parseFloat(batch.ambientTemp));
    setHumidityInput(batch.ambientHumidity);
  };

  const handleSaveSensor = () => {
    if (editingSensorBatch) {
      onUpdateSensor(editingSensorBatch.id, tempInput, humidityInput);
      setEditingSensorBatch(null);
    }
  };

  return (
    <section className="my-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Perishable Inventory & Shelf-Life Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time batch freshness tracking powered by Sentinel biological decay kinetics & IoT sensors
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search SKU or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBatches.map((batch) => {
          const discountPct = Math.round(
            ((parseFloat(batch.basePrice) - parseFloat(batch.currentPrice)) /
              parseFloat(batch.basePrice)) *
              100
          );

          return (
            <div
              key={batch.id}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border transition-all duration-300 hover:border-slate-600 ${
                batch.decayRiskLevel === "critical_decay"
                  ? "border-rose-500/40 bg-rose-950/10"
                  : "border-slate-800"
              }`}
            >
              {/* Top: Category & Risk */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-slate-800/80">
                    {batch.category}
                  </span>
                  {getRiskBadge(batch.decayRiskLevel)}
                </div>

                <h3 className="font-bold text-slate-100 text-sm line-clamp-1 mb-0.5">
                  {batch.productName}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mb-3">
                  {batch.batchNumber} • Qty: {batch.currentQuantity} units
                </p>

                {/* Freshness Gauge Indicator */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 font-medium">Biological Freshness</span>
                    <span className={`text-sm font-black ${getFreshnessColor(batch.freshnessScore)}`}>
                      {batch.freshnessScore}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        batch.freshnessScore >= 70
                          ? "bg-emerald-500"
                          : batch.freshnessScore >= 45
                          ? "bg-lime-500"
                          : batch.freshnessScore >= 25
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.max(5, batch.freshnessScore)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1 font-mono text-amber-400">
                      <Clock className="w-3 h-3" />
                      {batch.hoursRemaining}h remaining
                    </span>
                    <span className="text-slate-500">{batch.storageZone}</span>
                  </div>
                </div>

                {/* Ambient Sensors */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      <span>Temp</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-200">
                      {batch.ambientTemp}°C
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Humidity</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-200">
                      {batch.ambientHumidity}%
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between mb-3 px-1">
                  <div>
                    <span className="text-xs text-slate-500">Current Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-emerald-400">
                        ${batch.currentPrice}
                      </span>
                      {discountPct > 0 && (
                        <span className="text-xs text-slate-500 line-through">
                          ${batch.basePrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {discountPct > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      -{discountPct}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleOpenSensorModal(batch)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                  title="Simulate ambient refrigerator fluctuation"
                >
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>Sensors</span>
                </button>

                <button
                  onClick={() => onApplyMarkdown(batch.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <DollarSign className="w-3 h-3" />
                  <span>Markdown</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Simulation Modal */}
      {editingSensorBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  Simulate Storage Sensor Telemetry
                </h3>
              </div>
              <button
                onClick={() => setEditingSensorBatch(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Simulate temperature spikes or humidity failure on{" "}
              <span className="text-slate-200 font-semibold">{editingSensorBatch.productName}</span> to watch
              the Sentinel Agent autonomously recalibrate decay velocity.
            </p>

            {/* Temperature Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Ambient Temperature</span>
                <span className="font-mono text-emerald-400 font-bold">{tempInput}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={tempInput}
                onChange={(e) => setTempInput(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">
                Recommended optimal: 2.0°C - 5.0°C. High temps trigger Arrhenius acceleration.
              </span>
            </div>

            {/* Humidity Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Ambient Relative Humidity</span>
                <span className="font-mono text-cyan-400 font-bold">{humidityInput}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={humidityInput}
                onChange={(e) => setHumidityInput(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500">
                Low humidity cause moisture evaporation and wilting; high humidity risks mold.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingSensorBatch(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSensor}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
              >
                Simulate & Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
