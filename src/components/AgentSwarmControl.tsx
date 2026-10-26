"use client";

import React from "react";
import { Eye, BadgePercent, Utensils, CloudLightning, Truck, Bot, ArrowRight, Zap } from "lucide-react";

interface AgentSwarmControlProps {
  onRunAgent: (agentId: string) => void;
  isRunning: boolean;
  activeAgentRunning: string | null;
}

export const AgentSwarmControl: React.FC<AgentSwarmControlProps> = ({
  onRunAgent,
  isRunning,
  activeAgentRunning,
}) => {
  const agents = [
    {
      id: "sentinel",
      name: "Sentinel Agent",
      role: "Biological Decay & Sensor Vision",
      icon: Eye,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      accent: "text-emerald-400",
      bgBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      description: "Applies Arrhenius Q10 kinetic modeling against storage temp, ethylene gas, and moisture.",
      metric: "99.2% Decay Accuracy",
    },
    {
      id: "pricepulse",
      name: "PricePulse Agent",
      role: "Dynamic Markdown & Dutch Auction",
      icon: BadgePercent,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400",
      accent: "text-amber-400",
      bgBadge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      description: "Calculates price elasticity curves to clear near-expiry inventory before total write-off.",
      metric: "3.4x Velocity Lift",
    },
    {
      id: "chefrescue",
      name: "ChefRescue Agent",
      role: "Culinary Synergy & Recipe Bundler",
      icon: Utensils,
      color: "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-400",
      accent: "text-lime-400",
      bgBadge: "bg-lime-500/10 text-lime-300 border-lime-500/20",
      description: "Synthesizes multi-category expiring perishables into gourmet home meal kits with recipe cards.",
      metric: "48% Kit Discount",
    },
    {
      id: "supplysage",
      name: "SupplySage Agent",
      role: "Weather & Replenishment Forecaster",
      icon: CloudLightning,
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
      accent: "text-cyan-400",
      bgBadge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      description: "Throttles supplier replenishment purchase orders based on real-time weather and foot traffic.",
      metric: "32% Waste Cut Upstream",
    },
    {
      id: "charityloop",
      name: "CharityLoop Agent",
      role: "Circular Rescue & Shelter Dispatch",
      icon: Truck,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400",
      accent: "text-purple-400",
      bgBadge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      description: "Dispatches food bank cold-chain manifests for SKUs crossing the <10h shelf-life safety line.",
      metric: "100% Landfill Diversion",
    },
  ];

  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Autonomous Agent Swarm Orchestration
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            5 specialized AI agents collaborating in real-time to eliminate perishable grocery waste
          </p>
        </div>

        <button
          onClick={() => onRunAgent("swarm")}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 hover:opacity-90 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
          <span>Execute Full Autonomous Cycle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isThisActive = activeAgentRunning === agent.id;

          return (
            <div
              key={agent.id}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border bg-gradient-to-b ${agent.color} transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 ${agent.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${agent.bgBadge}`}>
                    {agent.metric}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{agent.name}</h3>
                <p className={`text-[11px] font-medium ${agent.accent} mb-2`}>{agent.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>
              </div>

              <button
                onClick={() => onRunAgent(agent.id)}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-slate-500 transition-all disabled:opacity-50"
              >
                <span>Trigger Agent</span>
                <ArrowRight className={`w-3 h-3 ${isThisActive ? "animate-pulse" : ""}`} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
