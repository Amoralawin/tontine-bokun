"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Footer } from "@/components/Footer";
import { DashboardView } from "@/components/DashboardView";
import { ReputationDashboard } from "@/components/ReputationDashboard";
import { AccountView } from "@/components/AccountView";
import { TTSVoiceReader } from "@/components/TTSVoiceReader";
import { useLanguage } from "@/lib/LanguageContext";
import { Sparkles, ArrowRight, Calendar, ShieldCheck, CheckCircle2, HeartHandshake, CreditCard, Users, HelpCircle } from "lucide-react";
import { GroupExploreView } from "@/components/GroupExploreView";
import { PaymentCheckoutModal } from "@/components/PaymentCheckoutModal";

export default function Home() {
  const { t, isAutoDetected, detectedRegionName } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [payTitle, setPayTitle] = useState("");
  const [payAmount, setPayAmount] = useState(0);

  const handleOpenPlanPayment = (title: string, amount: number) => {
    setPayTitle(title);
    setPayAmount(amount);
    setIsPaymentOpen(true);
  };

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

        {/* PRICING & FEATURES (Tarifs Adaptés aux Petits Budgets 50k-70k FCFA) */}
        {activeTab === "pricing" && (
          <section className="space-y-8 py-4 font-sans">
            
            {/* Header Tarifs */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-black uppercase tracking-wider">
                🏷️ Tarifs Adaptés & Accessibles à Tous
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("pricingTitle")}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Conçu spécialement pour les budgets modestes (salaire 50 000 - 70 000 FCFA). Gratuit pour les membres, très petit prix pour le responsable.
              </p>
            </div>

            {/* BANNIÈRE EXPLICATIVE : QUI PAIE ET COMMENT ? */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-2 border-amber-500/40 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm uppercase tracking-wider">
                <HelpCircle className="w-5 h-5" />
                <span>Comment fonctionne le paiement ? (Qui paie et comment ?)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>1. 100% GRATUIT pour les Membres</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Les membres qui s&apos;inscrivent à la tontine ne paient <strong>absolument rien</strong> pour utiliser l&apos;application. La création de compte membre et la participation sont entièrement gratuites.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-600 dark:text-amber-400 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2. Seul l&apos;Admin (Responsable) souscrit</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Seul l&apos;administrateur du groupe paie le petit forfait de <strong>500 FCFA / mois</strong>. L&apos;admin peut simplement prélever <strong>50 FCFA par membre sur le pot mensuel</strong> (ex: 300 FCFA sur une cagnotte de 60 000 FCFA), ce qui rend le coût totalement indolore !
                  </p>
                </div>
              </div>
            </div>

            {/* GRILLE TARIFAIRE (0 FCFA / 500 FCFA / 1500 FCFA) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* PLAN 1: GRATUIT */}
              <div className="p-6 rounded-3xl card-premium space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{t("planFree")}</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    0 FCFA <span className="text-xs font-normal text-slate-500">{t("perMonth")}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Idéal pour tester sa première petite tontine entre amis ou collègues.</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold">
                    <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">✓ 1 Groupe de tontine</li>
                    <li className="flex items-center gap-2">✓ Jusqu&apos;à 6 membres</li>
                    <li className="flex items-center gap-2">✓ Suivi des cotisations & Reçus</li>
                    <li className="flex items-center gap-2">✓ Traduction 6 Langues & Voix IA</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenPlanPayment("Activation Forfait Gratuit", 0)}
                  className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-4"
                >
                  {t("startFreeBtn")} (0 FCFA)
                </button>
              </div>

              {/* PLAN 2: STANDARD (POPULAIRE - 500 FCFA / MOIS) */}
              <div className="p-6 rounded-3xl card-premium border-2 border-amber-500 relative space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-md">
                    ⭐ Le Plus Choisi
                  </div>
                  <div className="text-xs font-black text-amber-500 uppercase tracking-wider">Standard (Responsable)</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    500 FCFA <span className="text-xs font-normal text-slate-500">{t("perMonth")}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Seulement 500 FCFA par mois (ou 5 000 FCFA/an), soit moins que le prix d&apos;un café !</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold">
                    <li className="flex items-center gap-2 text-amber-600 dark:text-amber-400">✓ 3 Groupes de tontine</li>
                    <li className="flex items-center gap-2">✓ Jusqu&apos;à 20 membres par groupe</li>
                    <li className="flex items-center gap-2">✓ Reçus visuels OK & Trophée du pot</li>
                    <li className="flex items-center gap-2">✓ Score de réputation & Anti-impayés</li>
                    <li className="flex items-center gap-2">✓ Prélèvement automatique sur pot disponible</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenPlanPayment("Abonnement Responsable Standard (500 FCFA)", 500)}
                  className="w-full py-3 rounded-2xl btn-mango-gold text-slate-950 font-black text-xs shadow-md mt-4 hover:scale-[1.02] transition-all"
                >
                  Souscrire par Wave / MoMo (500 FCFA)
                </button>
              </div>

              {/* PLAN 3: PRO (ASSOCIATIONS - 1 500 FCFA / MOIS) */}
              <div className="p-6 rounded-3xl card-premium space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Pro (Associations & ONG)</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    1 500 FCFA <span className="text-xs font-normal text-slate-500">{t("perMonth")}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Pour les grands responsables, marchés, syndicats et associations.</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold">
                    <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">✓ Groupes illimités</li>
                    <li className="flex items-center gap-2">✓ Membres illimités</li>
                    <li className="flex items-center gap-2">✓ Relances automatiques WhatsApp / SMS</li>
                    <li className="flex items-center gap-2">✓ Export PDF complet des cotisations</li>
                    <li className="flex items-center gap-2">✓ Badge de certification certifié</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenPlanPayment("Souscription Plan Pro (1 500 FCFA)", 1500)}
                  className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-4"
                >
                  Souscrire Plan Pro (1 500 FCFA)
                </button>
              </div>

            </div>
          </section>
        )}

        <Footer />

        {/* Modal de Paiement de Forfait */}
        <PaymentCheckoutModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          title={payTitle}
          baseAmount={payAmount}
          feeAmount={0}
        />
      </div>
    </AppLayout>
  );
}
