"use client";

import React from "react";
import { Globe, Shield, Sparkles, TrendingUp } from "lucide-react";
import { LogoIcon } from "./LogoIcon";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-amber-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={36} />
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Tontine <span className="text-amber-500">bɔkun</span>
                </span>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Tontine 2.0 Africa
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              La plateforme intelligente qui digitalise, sécurise et simplifie la gestion des tontines en Afrique.
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <Shield className="w-3 h-3" /> Sécurisé
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                <Sparkles className="w-3 h-3" /> IA Vocale
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                <Globe className="w-3 h-3" /> 6 langues
              </span>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Langues & Régions
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>🇨🇮 Baoulé (Abidjan, Côte d&apos;Ivoire)</li>
              <li>🇧🇯 Fon (Cotonou, Abomey, Bénin)</li>
              <li>🇧🇯 Goun (Porto-Novo, Bénin)</li>
              <li>🇧🇯 Adja (Couffo, Bénin)</li>
              <li>🇫🇷 Français (Afrique Francophone)</li>
              <li>🇬🇧 English (Global)</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Fonctionnalités Clés
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Lecture Vocale (Français / Anglais)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Réputation inter-groupes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Pénalités automatiques</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Traduction automatique</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>© {new Date().getFullYear()} Tontine bɔkun. Tous droits réservés.</div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500">✦</span>
            <span className="font-semibold text-slate-500 dark:text-slate-400 italic">
              La tontine, réinventée pour l&apos;Afrique de demain.
            </span>
            <span className="text-emerald-500">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
