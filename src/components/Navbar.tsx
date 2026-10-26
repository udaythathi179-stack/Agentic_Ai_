"use client";

import React from "react";
import { Sparkles, Database, Play, Pause, RefreshCw, Radio, ShieldCheck, Leaf } from "lucide-react";

interface NavbarProps {
  isAutopilot: boolean;
  setIsAutopilot: (val: boolean) => void;
  onTriggerSwarm: () => void;
  onOpenDbModal: () => void;
  onResetData: () => void;
  isRunning: boolean;
  dbMode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAutopilot,
  setIsAutopilot,
  onTriggerSwarm,
  onOpenDbModal,
  onResetData,
  isRunning,
  dbMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
                FreshCycle AI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                Zero-Waste OS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Agentic Perishable Demand & Biological Shelf-Life Intelligence
            </p>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Swarm Status:</span>
            <span className="font-semibold text-emerald-400">5 Agents Active</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <div className="text-slate-400">
            Store: <span className="text-slate-200 font-medium">NYC Flagship #104</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Autopilot toggle */}
          <button
            onClick={() => setIsAutopilot(!isAutopilot)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
              isAutopilot
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Auto-trigger agent decision loops periodically"
          >
            {isAutopilot ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autopilot ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Autopilot</span>
              </>
            )}
          </button>

          {/* Trigger Swarm Button */}
          <button
            onClick={onTriggerSwarm}
            disabled={isRunning}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Run Swarm</span>
            <span className="sm:hidden">Run</span>
          </button>

          {/* Database & Supabase Modal Trigger */}
          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Supabase / Drizzle</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetData}
            title="Reset data to initial state"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
