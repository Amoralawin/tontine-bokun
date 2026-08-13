"use client";

import React, { useState } from "react";
import { Globe, ChevronDown, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, isAutoDetected, detectedRegionName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        {isAutoDetected && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>{detectedRegionName}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm hover:border-amber-500/50 transition-all"
        >
          <span className="text-base">{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 py-2 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Langues & Regions (Traduction)
            </div>

            <div className="max-h-72 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-amber-500/10 dark:hover:bg-amber-400/10 transition-colors ${
                      isSelected ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold" : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-medium">{lang.nativeName}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{lang.region}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
