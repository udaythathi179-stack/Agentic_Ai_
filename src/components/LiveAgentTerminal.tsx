"use client";

import React, { useState } from "react";
import { Terminal, Bot, Sparkles, Filter, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export interface LogItem {
  id: string;
  agentId: string;
  agentName: string;
  actionType: string;
  severity: string;
  message: string;
  reasoning: string;
  metricsDelta?: string;
  timestamp: string;
}

interface LiveAgentTerminalProps {
  logs: LogItem[];
}

export const LiveAgentTerminal: React.FC<LiveAgentTerminalProps> = ({ logs }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    if (filterSeverity === "all") return true;
    return log.severity === filterSeverity;
  });

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case "critical":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Agentic Thought Trace & Telemetry Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of multi-agent evaluations, dynamic markdowns, and rescue interventions
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {["all", "critical", "warning", "success", "info"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                filterSeverity === sev
                  ? "bg-slate-800 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-4 sm:p-5 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-semibold text-slate-400">agent-orchestrator://stream.log</span>
          </div>
          <span>{filteredLogs.length} events logged</span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No logs for this filter</div>
          ) : (
            filteredLogs.map((log) => {
              let parsedDelta = null;
              if (log.metricsDelta) {
                try {
                  parsedDelta = JSON.parse(log.metricsDelta);
                } catch (e) {
                  // ignore
                }
              }

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      <span className="font-bold text-slate-200">{log.agentName}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[10px] uppercase font-bold rounded border ${getSeverityBadge(
                          log.severity
                        )}`}
                      >
                        {log.actionType}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-slate-300 font-sans text-xs mb-1.5 leading-relaxed">
                    {log.message}
                  </p>

                  <div className="text-[11px] text-slate-400/90 font-sans italic bg-black/30 p-2 rounded-lg border border-slate-800/50 mb-2">
                    <span className="font-semibold text-emerald-400 not-italic">Reasoning Trace: </span>
                    {log.reasoning}
                  </div>

                  {parsedDelta && (
                    <div className="text-[10px] text-emerald-400/80 bg-slate-950 p-1.5 rounded font-mono overflow-x-auto">
                      <span className="text-slate-500">metrics_delta: </span>
                      {JSON.stringify(parsedDelta)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
