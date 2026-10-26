"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { AppShell } from "@/components/AppShell";
import { samplePlannerProposals, PlannerProposal } from "@/lib/scenarioData";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X,
  ShieldAlert,
  Zap,
} from "lucide-react";

export default function PlannerPage() {
  const [proposals, setProposals] = useState<PlannerProposal[]>(samplePlannerProposals);
  const [statusFilter, setStatusFilter] = useState<string>("proposed");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedWhyProposal, setSelectedWhyProposal] = useState<PlannerProposal | null>(null);

  const counts = useMemo(() => {
    return {
      proposed: proposals.filter((p) => p.status === "proposed").length + 82,
      rejected: proposals.filter((p) => p.status === "rejected").length + 1,
      executed: proposals.filter((p) => p.status === "approved" || p.status === "executed").length + 1,
      superseded: 90,
    };
  }, [proposals]);

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (storeFilter !== "all" && p.storeId !== storeFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (actionFilter !== "all" && p.action !== actionFilter) return false;
      if (riskFilter !== "all" && p.riskLevel !== riskFilter) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          p.productName.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.storeId.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [proposals, statusFilter, storeFilter, categoryFilter, actionFilter, riskFilter, searchQuery]);

  const handleApprove = (id: string) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#06b6d4", "#a855f7", "#f59e0b"],
    });

    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  const handleReject = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
  };

  const handleBulkApproveLowRisk = () => {
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#38bdf8"],
    });

    setProposals((prev) =>
      prev.map((p) =>
        p.riskLevel === "low" && p.status === "proposed"
          ? { ...p, status: "approved" }
          : p
      )
    );
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-3d-purple px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Human-in-the-Loop Review
              </span>
              <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Zero Waste Logistics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              Planner Review & Approval
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Nothing executes without approval. Rejected proposals never execute.{" "}
              <span className="text-white font-bold">
                Proposed {counts.proposed} · Rejected {counts.rejected} · Executed{" "}
                {counts.executed} · Superseded {counts.superseded}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none btn-3d-glass text-white px-5 py-2.5 pr-11 rounded-xl text-sm font-bold cursor-pointer"
              >
                <option value="proposed" className="bg-[#0b1411]">Proposed (90)</option>
                <option value="all" className="bg-[#0b1411]">All statuses</option>
                <option value="approved" className="bg-[#0b1411]">Approved</option>
                <option value="rejected" className="bg-[#0b1411]">Rejected</option>
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={handleBulkApproveLowRisk}
              className="btn-3d-cyan px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg"
            >
              Bulk-approve low-risk
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="card-3d-realistic p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-xs font-bold text-slate-200 px-3.5 py-2 pr-8 rounded-xl cursor-pointer"
              >
                <option value="all" className="bg-[#0b1411]">All stores</option>
                <option value="store_001" className="bg-[#0b1411]">store_001</option>
                <option value="store_002" className="bg-[#0b1411]">store_002</option>
                <option value="store_003" className="bg-[#0b1411]">store_003</option>
                <option value="store_004" className="bg-[#0b1411]">store_004</option>
                <option value="store_005" className="bg-[#0b1411]">store_005</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-xs font-bold text-slate-200 px-3.5 py-2 pr-8 rounded-xl cursor-pointer"
              >
                <option value="all" className="bg-[#0b1411]">All categories</option>
                <option value="produce" className="bg-[#0b1411]">produce</option>
                <option value="bakery" className="bg-[#0b1411]">bakery</option>
                <option value="dairy" className="bg-[#0b1411]">dairy</option>
                <option value="meat" className="bg-[#0b1411]">meat</option>
                <option value="deli" className="bg-[#0b1411]">deli</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-xs font-bold text-slate-200 px-3.5 py-2 pr-8 rounded-xl cursor-pointer"
              >
                <option value="all" className="bg-[#0b1411]">All actions</option>
                <option value="donate" className="bg-[#0b1411]">donate</option>
                <option value="markdown" className="bg-[#0b1411]">markdown</option>
                <option value="transfer" className="bg-[#0b1411]">transfer</option>
                <option value="replenish" className="bg-[#0b1411]">replenish</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-xs font-bold text-slate-200 px-3.5 py-2 pr-8 rounded-xl cursor-pointer"
              >
                <option value="all" className="bg-[#0b1411]">All risk levels</option>
                <option value="high" className="bg-[#0b1411]">High risk</option>
                <option value="medium" className="bg-[#0b1411]">Medium risk</option>
                <option value="low" className="bg-[#0b1411]">Low risk</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search SKU / product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 shrink-0 font-medium">
            90 shown · sorted by urgency · loading risk context...
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";

            return (
              <div
                key={item.id}
                className={`card-3d-realistic p-6 flex flex-col justify-between gap-4 transition-all ${
                  isApproved
                    ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                    : isRejected
                    ? "border-rose-500/40 bg-rose-950/20 opacity-60"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-white">
                        {item.productName} · <span className="text-cyan-400">{item.storeId}</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.sku} · {item.category}
                      </p>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {item.riskLevel === "high" && (
                      <span className="pill-3d-rose px-2.5 py-0.5 rounded text-[11px] font-bold">
                        High risk
                      </span>
                    )}
                    {item.riskLevel === "medium" && (
                      <span className="pill-3d-amber px-2.5 py-0.5 rounded text-[11px] font-bold">
                        Medium risk
                      </span>
                    )}
                    {item.riskLevel === "low" && (
                      <span className="pill-3d-emerald px-2.5 py-0.5 rounded text-[11px] font-bold">
                        Low risk
                      </span>
                    )}

                    <span className="bg-black/50 border border-white/10 px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-200">
                      qty ×{item.quantity}
                    </span>

                    <span className="bg-black/50 border border-white/10 px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-200">
                      {item.daysToExpiry}d to expiry
                    </span>

                    <span className="bg-black/50 border border-white/10 px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-200">
                      ~{item.forecast7d}/7d
                    </span>

                    <span className="pill-3d-emerald px-2.5 py-0.5 rounded text-[11px] font-bold">
                      {item.actionLabel}
                    </span>

                    <span className="bg-black/50 border border-white/10 px-2.5 py-0.5 rounded text-[11px] uppercase font-bold text-slate-400">
                      {item.status}
                    </span>
                  </div>

                  {/* Expected Net Impact */}
                  <div className="mt-3.5 text-xs text-slate-300">
                    Expected net impact{" "}
                    <span className="text-emerald-400 font-mono font-black text-sm">
                      {item.expectedNetImpact < 0
                        ? `-$${Math.abs(item.expectedNetImpact).toFixed(2)}`
                        : `+$${item.expectedNetImpact.toFixed(2)}`}
                    </span>{" "}
                    (net benefit)
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {item.narrative}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedWhyProposal(item)}
                    className="btn-3d-glass px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Why this action?
                  </button>

                  {!isApproved && !isRejected ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="btn-3d-emerald px-5 py-2 rounded-xl font-black text-xs cursor-pointer ml-auto"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(item.id)}
                        className="btn-3d-rose px-4 py-2 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : isApproved ? (
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-bold pill-3d-emerald px-3 py-1 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  ) : (
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-rose-400 font-bold pill-3d-rose px-3 py-1 rounded-xl">
                      <XCircle className="w-4 h-4" /> Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why This Action Modal */}
      {selectedWhyProposal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-realistic w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Agent Rationale · {selectedWhyProposal.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWhyProposal(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="font-bold text-emerald-300 block mb-1">
                  Autonomous Decision Rationale:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedWhyProposal.narrative}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold font-sans">
                    Salvage Recovery
                  </span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">
                    ${selectedWhyProposal.mathematicalBreakdown.salvageRecovery.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold font-sans">
                    CO2 Avoided
                  </span>
                  <p className="text-lg font-black text-cyan-300 mt-0.5">
                    {selectedWhyProposal.mathematicalBreakdown.co2KgSaved} kg
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold font-sans">
                    Percent at Risk
                  </span>
                  <p className="text-lg font-black text-amber-400 mt-0.5">
                    {selectedWhyProposal.mathematicalBreakdown.percentAtRisk}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-400 font-bold font-sans">
                    Options Evaluated
                  </span>
                  <p className="text-lg font-black text-purple-300 mt-0.5">
                    {selectedWhyProposal.mathematicalBreakdown.optionsEvaluated} policies
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/60 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedWhyProposal(null)}
                className="btn-3d-emerald px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
