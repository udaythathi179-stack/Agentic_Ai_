"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-7 overflow-y-auto max-h-screen">
        <div className="max-w-[1550px] mx-auto pb-20">{children}</div>
      </main>
    </div>
  );
}
