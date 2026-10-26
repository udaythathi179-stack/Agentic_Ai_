"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { UtensilsCrossed, Sparkles, Clock, Leaf, ShoppingBag, CheckCircle, ChefHat, ArrowUpRight } from "lucide-react";

interface BundleItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  recipeName: string;
  recipeDifficulty: string;
  prepTimeMinutes: number;
  culinaryInstructions: string;
  bundlePrice: string;
  originalTotalPrice: string;
  discountPercentage: number;
  itemsIncluded: string;
  chefAgentReasoning: string;
  status: string;
  mealsSaved: number;
  co2SavedKg: string;
}

interface ZeroWasteBundlesSectionProps {
  bundles: BundleItem[];
  onPurchaseBundle: (bundleId: string) => void;
  onGenerateBundle: () => void;
}

export const ZeroWasteBundlesSection: React.FC<ZeroWasteBundlesSectionProps> = ({
  bundles,
  onPurchaseBundle,
  onGenerateBundle,
}) => {
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<BundleItem | null>(null);

  const handleBuy = (bundle: BundleItem) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#84cc16", "#06b6d4"],
    });

    setPurchasedIds([...purchasedIds, bundle.id]);
    onPurchaseBundle(bundle.id);
  };

  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
              <ChefHat className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              ChefRescue™ Zero-Waste Meal Kits
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous culinary pairing engine synthesizes expiring perishables into high-margin, recipe-ready kits
          </p>
        </div>

        <button
          onClick={onGenerateBundle}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesize New Recipe Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {bundles.map((bundle) => {
          const isSold = bundle.status === "sold_out" || purchasedIds.includes(bundle.id);
          let parsedIngredients: Array<{ name: string; qty: string; note: string }> = [];
          try {
            parsedIngredients = JSON.parse(bundle.itemsIncluded);
          } catch (e) {
            parsedIngredients = [];
          }

          return (
            <div
              key={bundle.id}
              className={`glass-panel rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isSold
                  ? "border-emerald-500/30 bg-emerald-950/10 opacity-90"
                  : "border-slate-800 hover:border-lime-500/40"
              }`}
            >
              {isSold && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Rescued & Purchased!</span>
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                    {bundle.recipeDifficulty} • {bundle.prepTimeMinutes} mins
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    {bundle.co2SavedKg} kg CO₂ Saved
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    -{bundle.discountPercentage}% OFF
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-100 mb-1">
                  {bundle.title}
                </h3>
                <p className="text-xs font-semibold text-lime-400 mb-2">
                  Recipe: {bundle.recipeName}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {bundle.description}
                </p>

                {/* Included Ingredients */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Perishables Rescued in Kit
                  </div>
                  <div className="space-y-1.5">
                    {parsedIngredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">
                          • {ing.name} <span className="text-slate-500">({ing.qty})</span>
                        </span>
                        <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {ing.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chef Reasoning */}
                <div className="text-[11px] text-slate-400/90 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 mb-4">
                  <span className="font-semibold text-slate-300 not-italic">Chef Agent Logic: </span>
                  {bundle.chefAgentReasoning}
                </div>
              </div>

              {/* Bottom Actions & Price */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-lime-400">
                    ${bundle.bundlePrice}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ${bundle.originalTotalPrice}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">
                    ({bundle.mealsSaved} hearty meals)
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedRecipe(bundle)}
                    className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                  >
                    View Recipe
                  </button>

                  <button
                    onClick={() => handleBuy(bundle)}
                    disabled={isSold}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 transition-all shadow-md shadow-lime-500/20 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isSold ? "Claimed" : "Rescue & Order"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-lime-400" />
                <h3 className="font-bold text-slate-100 text-base">
                  {selectedRecipe.recipeName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <span>Prep Time: {selectedRecipe.prepTimeMinutes} mins</span>
              <span>•</span>
              <span>Difficulty: {selectedRecipe.recipeDifficulty}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line mb-6">
              {selectedRecipe.culinaryInstructions}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-slate-950 font-bold"
              >
                Close Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
