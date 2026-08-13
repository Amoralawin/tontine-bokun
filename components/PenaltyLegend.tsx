"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { getReputationConfig } from "@/lib/reputationSystem";

const LEVELS = [
  { level: "excellent" as const, range: "90–100", icon: "🟢", desc: "Accès libre à tous les groupes. Paiements toujours à temps." },
  { level: "good"      as const, range: "70–89",  icon: "🔵", desc: "Bon historique. Dépôt de garantie suggéré à l'entrée." },
  { level: "warning"   as const, range: "50–69",  icon: "🟡", desc: "Retards fréquents. L'admin du groupe reçoit une alerte." },
  { level: "restricted"as const, range: "30–49",  icon: "🟠", desc: "Mauvais payeur. Approbation de l'admin requise pour rejoindre." },
  { level: "blocked"   as const, range: "0–29",   icon: "🔴", desc: "Bloqué. Ne peut rejoindre aucun groupe avant paiement de ses dettes." },
];

const PENALTIES = [
  { days: "1 – 7 jours",  rate: "5%",  color: "bg-amber-500",  example: "+7 500 FCFA sur 150 000" },
  { days: "8 – 15 jours", rate: "7%",  color: "bg-orange-500", example: "+10 500 FCFA sur 150 000" },
  { days: "16+ jours",    rate: "10%", color: "bg-red-600",    example: "+15 000 FCFA sur 150 000" },
];

export const PenaltyLegend: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 transition-all"
      >
        <Info className="w-3.5 h-3.5" />
        <span>Légende des couleurs</span>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/20 animate-fade-up">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Signification des badges</h4>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Reputation levels */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Score de réputation</div>
              {LEVELS.map(({ level, range, icon, desc }) => {
                const config = getReputationConfig(level);
                return (
                  <div key={level} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${config.bg} border ${config.border}`}>
                    <span className="text-base leading-none mt-0.5">{icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${config.color}`}>
                        {config.label} <span className="font-normal opacity-70">({range} pts)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Penalty tiers */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Taux de pénalités</div>
              {PENALTIES.map((p) => (
                <div key={p.days} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.color} shrink-0`} />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.rate} </span>
                    <span className="text-xs text-slate-500">({p.days})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{p.example}</div>
                </div>
              ))}
              <p className="text-[10px] text-center text-amber-600 dark:text-amber-400 font-medium pt-1">
                ✅ 100% des pénalités vous sont versées
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
