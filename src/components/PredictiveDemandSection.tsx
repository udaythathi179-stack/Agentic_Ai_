"use client";

import React from "react";
import { CloudSun, TrendingDown, ArrowDownRight, ShieldCheck, ShoppingCart, Zap } from "lucide-react";

interface ForecastItem {
  id: string;
  productId: string;
  productName: string;
  forecastDate: string;
  weatherCondition: string;
  temperatureForecast: string;
  footTrafficIndex: number;
  forecastedUnits: number;
  regularOrderUnits: number;
  agentAdjustedOrderUnits: number;
  wastePreventionConfidence: string;
  recommendationNotes: string;
}

interface PredictiveDemandSectionProps {
  forecasts: ForecastItem[];
}

export const PredictiveDemandSection: React.FC<PredictiveDemandSectionProps> = ({ forecasts }) => {
  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <CloudSun className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              SupplySage™ Predictive Demand & Restock Throttling
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Eliminates food waste before it reaches the supermarket floor by synchronizing weather & foot-traffic telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Weather Sync: NYC Metro Area</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecasts.map((fc) => {
          const cutPct = Math.round(
            ((fc.regularOrderUnits - fc.agentAdjustedOrderUnits) / fc.regularOrderUnits) * 100
          );
          const savedUnits = fc.regularOrderUnits - fc.agentAdjustedOrderUnits;

          return (
            <div
              key={fc.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
                    {fc.weatherCondition}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Foot Traffic: <span className="text-slate-200">{fc.footTrafficIndex}%</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm mb-2">{fc.productName}</h3>

                {/* Comparison Card */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Standard ERP Order
                    </span>
                    <span className="text-base font-bold text-slate-400 line-through">
                      {fc.regularOrderUnits} units
                    </span>
                  </div>

                  <div>
                    <span className="text-cyan-400 block text-[10px] uppercase font-bold">
                      SupplySage AI Order
                    </span>
                    <span className="text-base font-extrabold text-cyan-300">
                      {fc.agentAdjustedOrderUnits} units
                    </span>
                  </div>
                </div>

                {/* Throttled Savings Pill */}
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
                  <span className="flex items-center gap-1 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    Throttled by {cutPct}%
                  </span>
                  <span className="font-bold">+{savedUnits} units saved from spoilage</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {fc.recommendationNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  Confidence: {fc.wastePreventionConfidence}%
                </span>
                <span className="font-mono text-slate-500">Cycle: {fc.forecastDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
