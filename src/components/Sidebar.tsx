"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  TrendingUp,
  ShieldAlert,
  Bot,
  MessageSquare,
  Sliders,
  BarChart3,
  FileText,
  Sparkles,
  Leaf,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/", icon: Home, color: "text-cyan-400", glow: "rgba(6, 182, 212, 0.4)" },
  { name: "Shelves 3D", href: "/shelves", icon: Layers, color: "text-emerald-400", glow: "rgba(16, 185, 129, 0.4)" },
  { name: "Forecast", href: "/forecast", icon: TrendingUp, color: "text-blue-400", glow: "rgba(59, 130, 246, 0.4)" },
  { name: "Risk", href: "/risk", icon: ShieldAlert, color: "text-rose-400", glow: "rgba(244, 63, 94, 0.4)" },
  { name: "Agents", href: "/agents", icon: Bot, color: "text-purple-400", glow: "rgba(168, 85, 247, 0.4)" },
  { name: "Planner", href: "/planner", icon: MessageSquare, color: "text-fuchsia-400", glow: "rgba(217, 70, 239, 0.4)" },
  { name: "Scenarios", href: "/scenarios", icon: Sliders, color: "text-teal-400", glow: "rgba(20, 184, 166, 0.4)" },
  { name: "Evaluation", href: "/evaluation", icon: BarChart3, color: "text-amber-400", glow: "rgba(245, 158, 11, 0.4)" },
  { name: "Audit", href: "/audit", icon: FileText, color: "text-orange-400", glow: "rgba(249, 115, 22, 0.4)" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isVibrantMode, setIsVibrantMode] = useState(true);

  return (
    <aside className="w-64 min-w-64 flex flex-col gap-3.5 p-4 select-none shrink-0 z-30">
      {/* Brand Logo Card with 3D Glossy Elevation */}
      <div className="card-3d-realistic p-4 flex items-center gap-3.5 group cursor-pointer relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/20 transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
          <Leaf className="w-6 h-6 text-white drop-shadow-md" />
        </div>

        <div className="flex flex-col">
          <span className="font-extrabold text-white text-[16px] tracking-tight flex items-center gap-1.5">
            ZeroWaste <span className="text-emerald-400">AI</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            SMARTER GROCERY 3D
          </span>
        </div>
      </div>

      {/* Main Navigation Card */}
      <div className="card-3d-realistic p-2.5 flex-1 flex flex-col gap-1.5 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-white/12 via-white/8 to-transparent border border-white/20 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Left active colorful glowing indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full"
                  style={{
                    backgroundColor: item.color.replace("text-", "").includes("cyan")
                      ? "#06b6d4"
                      : item.color.replace("text-", "").includes("emerald")
                      ? "#10b981"
                      : item.color.replace("text-", "").includes("purple")
                      ? "#a855f7"
                      : item.color.replace("text-", "").includes("rose")
                      ? "#f43f5e"
                      : "#38bdf8",
                    boxShadow: `0 0 12px ${item.glow}`,
                  }}
                />
              )}

              <div
                className={`p-1.5 rounded-lg bg-black/40 border border-white/5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "border-white/20" : ""
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>

              <span className="tracking-wide text-xs">{item.name}</span>

              {isActive && (
                <div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: item.color.replace("text-", "").includes("cyan")
                      ? "#06b6d4"
                      : "#10b981",
                    boxShadow: `0 0 10px ${item.glow}`,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info Card with 3D Status Badges */}
      <div className="card-3d-realistic p-3.5 flex flex-col gap-2.5 text-xs shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="pill-3d-emerald px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase">
              LIVE 3D
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              2026-10-05
            </span>
          </div>

          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed">
          Synthetic seed=42 · 3D multi-agent integrations online.
        </p>

        <button
          onClick={() => setIsVibrantMode(!isVibrantMode)}
          type="button"
          className="btn-3d-glass flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer w-full mt-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isVibrantMode ? "3D Cyber Palette" : "Standard Palette"}</span>
        </button>
      </div>
    </aside>
  );
}
