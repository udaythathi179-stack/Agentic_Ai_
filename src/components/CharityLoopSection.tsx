"use client";

import React from "react";
import { Truck, HeartHandshake, FileCheck, CheckCircle2, Shield, Calendar, QrCode } from "lucide-react";

interface DonationManifestItem {
  id: string;
  manifestNumber: string;
  charityPartner: string;
  charityPartnerType: string;
  pickupScheduledAt: string;
  totalItemsCount: number;
  totalWeightKg: string;
  totalRetailValue: string;
  estimatedMealsCount: number;
  co2AvoidedKg: string;
  taxDeductionValue: string;
  status: string;
  agentReasoning: string;
}

interface CharityLoopSectionProps {
  donations: DonationManifestItem[];
  onConfirmPickup: (id: string) => void;
}

export const CharityLoopSection: React.FC<CharityLoopSectionProps> = ({
  donations,
  onConfirmPickup,
}) => {
  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              CharityLoop™ Circular Food Rescue & Shelter Dispatch
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated food bank dispatch for items within &lt;12h shelf life to prevent consumer disappointment and claim 170(e)(3) tax incentives
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Zero Landfill Protocol Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {donations.map((item) => {
          const isConfirmed = item.status === "confirmed_receipt";

          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all ${
                isConfirmed
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-slate-800 hover:border-purple-500/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-md">
                    {item.manifestNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                      isConfirmed
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse"
                    }`}
                  >
                    {isConfirmed ? "Delivered to Shelter" : "Pickup Scheduled"}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100 mb-1">
                  Recipient: {item.charityPartner}
                </h3>
                <p className="text-xs text-purple-400 font-semibold mb-4">
                  Partner Class: {item.charityPartnerType}
                </p>

                {/* Stat Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Nutritious Meals
                    </span>
                    <span className="text-base font-black text-purple-300">
                      {item.estimatedMealsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Rescued Weight
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {item.totalWeightKg} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      IRS Tax Credit
                    </span>
                    <span className="text-base font-black text-cyan-300">
                      ${item.taxDeductionValue}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed mb-4">
                  <span className="font-semibold text-slate-300">Dispatch Rationale: </span>
                  {item.agentReasoning}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scheduled: {new Date(item.pickupScheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {!isConfirmed ? (
                  <button
                    onClick={() => onConfirmPickup(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Shelter Handoff</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Digital Receipt Issued</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
