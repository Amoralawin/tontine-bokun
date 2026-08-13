"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Footer } from "@/components/Footer";
import { DashboardView } from "@/components/DashboardView";
import { ReputationDashboard } from "@/components/ReputationDashboard";
import { AccountView } from "@/components/AccountView";
import { TTSVoiceReader } from "@/components/TTSVoiceReader";
import { useLanguage } from "@/lib/LanguageContext";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";
import { GroupExploreView } from "@/components/GroupExploreView";

export default function Home() {
  const { t, isAutoDetected, detectedRegionName } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-6">

        {/* Auto-detected Region Banner */}
        {isAutoDetected && (
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl py-2 px-4 text-center text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("autoLanguagePrompt")} : <strong>{detectedRegionName}</strong></span>
          </div>
        )}

        {/* GROUPS EXPLORE & JOIN TAB */}
        {activeTab === "groups" && <GroupExploreView />}

        {/* DASHBOARD TAB DIRECT VIEW (BENTO BOX GRID) */}
        {activeTab === "dashboard" && <DashboardView />}

        {/* REPUTATION TAB */}
        {activeTab === "reputation" && <ReputationDashboard />}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && <AccountView />}

        {/* PRICING & FEATURES */}
        {activeTab === "pricing" && (
          <section className="space-y-8 py-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {t("pricingTitle")}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("pricingSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl card-premium space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase">{t("planFree")}</div>
                <div className="text-3xl font-black">0 FCFA <span className="text-xs font-normal text-slate-400">{t("perMonth")}</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>✓ {t("planFreeF1")}</li>
                  <li>✓ {t("planFreeF2")}</li>
                  <li>✓ {t("planFreeF3")}</li>
                  <li>✓ {t("planFreeF4")}</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs">
                  {t("startFreeBtn")}
                </button>
              </div>

              <div className="p-6 rounded-2xl card-premium border-2 border-amber-500 relative space-y-4 shadow-xl">
                <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase rounded-full">
                  {t("planPopular")}
                </div>
                <div className="text-xs font-bold text-amber-500 uppercase">Pro</div>
                <div className="text-3xl font-black">2 500 FCFA <span className="text-xs font-normal text-slate-400">{t("perMonth")}</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>✓ {t("planProF1")}</li>
                  <li>✓ {t("planProF2")}</li>
                  <li>✓ {t("planProF3")}</li>
                  <li>✓ {t("planProF4")}</li>
                  <li>✓ {t("planProF5")}</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl btn-mango-gold text-xs shadow-md">
                  {t("tryProBtn")}
                </button>
              </div>

              <div className="p-6 rounded-2xl card-premium space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase">Business</div>
                <div className="text-3xl font-black">9 900 FCFA <span className="text-xs font-normal text-slate-400">{t("perMonth")}</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>✓ {t("planBizF1")}</li>
                  <li>✓ {t("planBizF2")}</li>
                  <li>✓ {t("planBizF3")}</li>
                  <li>✓ {t("planBizF4")}</li>
                </ul>
                <button className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs">
                  {t("contactTeamBtn")}
                </button>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </AppLayout>
  );
}
