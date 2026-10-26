"use client";

import React, { useState } from "react";
import { Database, Check, Copy, ExternalLink, ShieldCheck, Terminal, Server, Layers } from "lucide-react";

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbInfo: {
    isPostgresConfigured: boolean;
    isSupabaseConfigured: boolean;
    drizzleConnected: boolean;
    mode: string;
    batchesCount: number;
    productsCount: number;
    bundlesCount: number;
    donationsCount: number;
    logsCount: number;
  };
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({
  isOpen,
  onClose,
  dbInfo,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copySqlSnippet = () => {
    const sqlText = `-- Supabase / PostgreSQL Schema for Zero Waste Grocery
-- Available in file: supabase-schema.sql
-- Run in your Supabase SQL Editor:
-- 1. Create tables: products, inventory_batches, price_markdowns, zero_waste_bundles, donation_manifests, agent_logs, demand_forecasts
-- 2. Configure DATABASE_URL in .env.local
-- 3. Run: npm run build or drizzle-kit push`;

    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Supabase & Drizzle ORM Architecture
              </h3>
              <p className="text-xs text-slate-400">
                PostgreSQL schema, database connector & hybrid storage runtime
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Connection Status Pill */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200">Current Storage Runtime</span>
            </div>
            <p className="text-sm font-extrabold text-emerald-400">{dbInfo.mode}</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div>
              Batches: <span className="font-mono text-slate-200 font-bold">{dbInfo.batchesCount}</span>
            </div>
            <span>•</span>
            <div>
              Bundles: <span className="font-mono text-slate-200 font-bold">{dbInfo.bundlesCount}</span>
            </div>
            <span>•</span>
            <div>
              Logs: <span className="font-mono text-slate-200 font-bold">{dbInfo.logsCount}</span>
            </div>
          </div>
        </div>

        {/* Architecture details */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              1. Configured Tables & Drizzle Schema
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              The project comes fully configured with typed Drizzle ORM models in{" "}
              <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded">src/db/schema.ts</code>:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• products</span>
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• inventory_batches</span>
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• price_markdowns</span>
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• zero_waste_bundles</span>
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• donation_manifests</span>
              <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">• agent_logs</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              2. Connecting Your Personal Supabase Project
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              To connect your live Supabase cloud database, simply add your credentials to{" "}
              <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded">.env.local</code>:
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
              <div className="text-slate-500"># Direct PostgreSQL Connection for Drizzle ORM</div>
              <div className="text-cyan-300">DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres</div>
              <div className="text-slate-500 mt-2"># Supabase Web Client</div>
              <div className="text-emerald-300">NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co</div>
              <div className="text-emerald-300">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
            </div>
          </div>
        </div>

        {/* SQL Script Quick Copy */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            SQL DDL file available at <span className="text-slate-200 font-mono">./supabase-schema.sql</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copySqlSnippet}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied SQL DDL" : "Copy Schema Instructions"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
