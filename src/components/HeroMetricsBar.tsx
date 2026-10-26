"use client";

import React from "react";
import { TrendingDown, ShieldAlert, HeartHandshake, CloudRain, DollarSign, Award } from "lucide-react";

interface MetricsData {
  totalItems: number;
  criticalCount: number;
  moderateCount: number;
  totalValueAtRisk: string;
  co2PreventedKg: string;
  mealsSavedTotal: number;
  activeBundlesCount: number;
  donationsDispatched: number;
}

interface HeroMetricsBarProps {
  metrics: MetricsData;
}

export const HeroMetricsBar: React.FC<HeroMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {/* Metric 1: Food Waste Diverted */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-emerald-500/20 group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-400/90 uppercase tracking-wider">
            Waste Diverted
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-50 tracking-tight">
          {(parseFloat(metrics.co2PreventedKg) * 0.45).toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-emerald-400 font-bold">98.4%</span> rescue efficiency rate
        </p>
      </div>

      {/* Metric 2: CO2e Emissions Avoided */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-cyan-500/20 group hover:border-cyan-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-cyan-400/90 uppercase tracking-wider">
            CO₂e Prevented
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CloudRain className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-50 tracking-tight">
          {metrics.co2PreventedKg} <span className="text-sm font-semibold text-slate-400">kg</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Kept out of anaerobic landfill rot
        </p>
      </div>

      {/* Metric 3: Rescued Margin Value */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-lime-500/20 group hover:border-lime-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-lime-400/90 uppercase tracking-wider">
            Margin Rescued
          </span>
          <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-50 tracking-tight">
          ${(parseFloat(metrics.totalValueAtRisk) * 0.72).toFixed(2)}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Captured via algorithmic markdowns
        </p>
      </div>

      {/* Metric 4: Meals Donated to Shelters */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-purple-500/20 group hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-400/90 uppercase tracking-wider">
            Nutritious Meals
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-50 tracking-tight">
          {metrics.mealsSavedTotal} <span className="text-sm font-semibold text-slate-400">meals</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Dispatched to City Harvest & pantries
        </p>
      </div>

      {/* Metric 5: At-Risk Critical Decay Batches */}
      <div className="col-span-2 lg:col-span-1 glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-rose-500/20 group hover:border-rose-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-rose-400/90 uppercase tracking-wider">
            Critical Decay SKUs
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 relative">
            <ShieldAlert className="w-4 h-4" />
            {metrics.criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            )}
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
          {metrics.criticalCount} <span className="text-sm font-semibold text-slate-400">batches</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-amber-400 font-semibold">{metrics.moderateCount}</span> moderate decay monitoring
        </p>
      </div>
    </div>
  );
};
