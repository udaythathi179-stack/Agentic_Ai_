"use client";

import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { sampleAuditLogs, AuditRecord } from "@/lib/scenarioData";
import {
  Download,
  Search,
  ChevronDown,
  Code2,
  X,
  Copy,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";

export default function AuditPage() {
  const [logs] = useState<AuditRecord[]>(sampleAuditLogs);
  const [selectedActor, setSelectedActor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJsonRecord, setActiveJsonRecord] = useState<AuditRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedActor !== "all" && log.actor !== selectedActor) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          log.entity.toLowerCase().includes(query) ||
          log.actor.toLowerCase().includes(query) ||
          JSON.stringify(log.summary).toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [logs, selectedActor, searchQuery]);

  const handleCopyJson = (record: AuditRecord) => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = (type: string) => {
    const rows = [
      ["Timestamp", "Actor", "Action", "Entity", "Summary", "Status"],
      ...filteredLogs.map((l) => [
        l.timestamp,
        l.actor,
        l.action,
        l.entity,
        JSON.stringify(l.summary),
        l.status,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.map((val) => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zerowaste_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Immutable Ledger
              </span>
              <span className="pill-3d-purple px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Real-Time Swarm Traces
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              Audit logs · agent runs · system events
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Verifiable execution logs, agent decision parameters, and coordinator endorsements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadCSV("recommendations")}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV: recommendations</span>
            </button>

            <button
              onClick={() => downloadCSV("scenarios")}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>CSV: scenarios</span>
            </button>

            <button
              onClick={() => downloadCSV("audit")}
              className="btn-3d-glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>CSV: audit</span>
            </button>
          </div>
        </div>

        {/* Audit Log Table Card */}
        <div className="card-3d-realistic p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">
                Planner/system audit (93 events)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedActor}
                  onChange={(e) => setSelectedActor(e.target.value)}
                  className="appearance-none bg-black/40 border border-white/10 text-xs font-bold text-white px-4 py-2 pr-9 rounded-xl cursor-pointer"
                >
                  <option value="all" className="bg-[#0b1411]">All actors</option>
                  <option value="coordinator" className="bg-[#0b1411]">coordinator</option>
                  <option value="options_pricer" className="bg-[#0b1411]">options_pricer</option>
                  <option value="stock_analyst" className="bg-[#0b1411]">stock_analyst</option>
                  <option value="spoilage_estimator" className="bg-[#0b1411]">spoilage_estimator</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-white/10 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-black/50 text-slate-400 font-mono uppercase text-[11px] tracking-wider border-b border-white/10">
                  <th className="py-3.5 px-4">TIME</th>
                  <th className="py-3.5 px-4">ACTOR</th>
                  <th className="py-3.5 px-4">ACTION</th>
                  <th className="py-3.5 px-4">ENTITY</th>
                  <th className="py-3.5 px-4">SUMMARY</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold">
                      <span className="pill-3d-cyan px-2 py-0.5 rounded text-[11px]">
                        {log.actor}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-sans font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-purple-300 font-bold">
                      {log.entity}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono max-w-md truncate">
                      {JSON.stringify(log.summary)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {log.status}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveJsonRecord(log)}
                        className="btn-3d-glass px-3 py-1 rounded-lg text-xs font-mono font-bold text-cyan-300 hover:text-white cursor-pointer"
                      >
                        JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      {activeJsonRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-realistic w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  Audit Payload: {activeJsonRecord.entity}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyJson(activeJsonRecord)}
                  className="btn-3d-glass px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveJsonRecord(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(activeJsonRecord, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
