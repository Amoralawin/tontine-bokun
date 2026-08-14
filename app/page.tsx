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
import { OwnerDashboardView } from "@/components/OwnerDashboardView";

// Dictionnaire local pour la traduction de la section des tarifs
const PRICING_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    tag: "🏷️ Tarifs Adaptés & Accessibles à Tous",
    sub: "Conçu spécialement pour les budgets modestes (salaire 50 000 - 70 000 FCFA). Gratuit pour les membres, très petit prix pour le responsable.",
    howItWorks: "Comment fonctionne le paiement ? (Qui paie et comment ?)",
    freeTitle: "1. 100% GRATUIT pour les Membres",
    freeDesc: "Les membres qui s'inscrivent à la tontine ne paient absolument rien pour utiliser l'application. La création de compte membre et la participation sont entièrement gratuites.",
    adminTitle: "2. Seul l'Admin (Responsable) souscrit",
    adminDesc: "Seul l'administrateur du groupe paie le petit forfait de 500 FCFA / mois. L'admin peut simplement prélever 50 FCFA par membre sur le pot mensuel (ex: 300 FCFA sur une cagnotte de 60 000 FCFA), ce qui rend le coût totalement indolore !",
    popular: "⭐ Le Plus Choisi",
    standardTitle: "Standard (Responsable)",
    standardDesc: "Seulement 500 FCFA par mois (ou 5 000 FCFA/an), soit moins que le prix d'un café !",
    stdF1: "✓ 3 Groupes de tontine",
    stdF2: "✓ Jusqu'à 20 membres par groupe",
    stdF3: "✓ Reçus visuels OK & Trophée du pot",
    stdF4: "✓ Score de réputation & Anti-impayés",
    stdF5: "✓ Prélèvement automatique sur pot disponible",
    stdBtn: "Souscrire par Wave / MoMo (500 FCFA)",
    proTitle: "Pro (Associations & ONG)",
    proDesc: "Pour les grands responsables, marchés, syndicats et associations.",
    proF1: "✓ Groupes illimités",
    proF2: "✓ Membres illimités",
    proF3: "✓ Relances WhatsApp / SMS",
    proF4: "✓ Export PDF complet des cotisations",
    proF5: "✓ Badge de certification certifié",
    proBtn: "Souscrire Plan Pro (1 500 FCFA)"
  },
  en: {
    tag: "🏷️ Affordable & Accessible Pricing for All",
    sub: "Specifically designed for low budgets (salary 50,000 - 70,000 FCFA). Free for members, tiny price for the manager.",
    howItWorks: "How does payment work? (Who pays and how?)",
    freeTitle: "1. 100% FREE for Members",
    freeDesc: "Members who sign up pay absolutely nothing to use the app. Member account creation and participation are completely free.",
    adminTitle: "2. Only the Admin (Manager) pays",
    adminDesc: "Only the group administrator pays the small 500 FCFA / month subscription. The admin can easily deduct 50 FCFA per member from the monthly pot (e.g. 300 FCFA from a 60,000 FCFA pot), making the cost completely painless!",
    popular: "⭐ Most Popular",
    standardTitle: "Standard (Manager)",
    standardDesc: "Only 500 FCFA per month (or 5,000 FCFA/year), less than the price of a cup of coffee!",
    stdF1: "✓ 3 Tontine groups",
    stdF2: "✓ Up to 20 members per group",
    stdF3: "✓ Visual receipts & Pot trophy",
    stdF4: "✓ Hint score & Anti-unpaid",
    stdF5: "✓ Automatic pot deduction available",
    stdBtn: "Subscribe via Wave / MoMo (500 FCFA)",
    proTitle: "Pro (Associations & NGOs)",
    proDesc: "For large managers, markets, unions and associations.",
    proF1: "✓ Unlimited groups",
    proF2: "✓ Unlimited members",
    proF3: "✓ WhatsApp / SMS reminders",
    proF4: "✓ Complete PDF Export",
    proF5: "✓ Certified certification badge",
    proBtn: "Subscribe Pro Plan (1,500 FCFA)"
  },
  bci: {
    tag: "🏷️ Sika fuan bo sran kplo",
    sub: "Awyɛn felefle bo sran sika fiɛ. Gratuit man sran mun, sika kan man admin.",
    howItWorks: "Wafa bo sika di akwɛ lɔ? (Mwan fa sika?)",
    freeTitle: "1. 100% GRATUIT man members mun",
    freeDesc: "Sran bo o ko wlu nun be nun nyan sika fatɔ afɛ fiɛ. Awyɛn felefle kpli kwan.",
    adminTitle: "2. Admin kun kpa ya di sika",
    adminDesc: "Admin bo o yi akpasua o ko yi sika kan 500 FCFA sub. O ko fa sika kan 50 FCFA nian sran wun kpa.",
    popular: "⭐ Nian kpa",
    standardTitle: "Standard (Admin)",
    standardDesc: "500 FCFA su kun bo o ko fa di.",
    stdF1: "✓ Akpasua 3",
    stdF2: "✓ Sran 20 be nun",
    stdF3: "✓ Sika foto & Trophy",
    stdF4: "✓ Reputation kpa",
    stdF5: "✓ Sika bo o yi mɔyo",
    stdBtn: "Wave / MoMo sub (500 FCFA)",
    proTitle: "Pro (Associations & NGO)",
    proDesc: "Man akpasua kpli mun.",
    proF1: "✓ Akpasua kpɛlɛ",
    proF2: "✓ Sran mun kpɛlɛ",
    proF3: "✓ WhatsApp / SMS ndɛ",
    proF4: "✓ PDF fite",
    proF5: "✓ Badge kpa",
    proBtn: "Subscribe Pro (1 500 FCFA)"
  },
  fon: {
    tag: "🏷️ Axɔ̀ he sɔgbe bi",
    sub: "Bɛ̌ azɔ̌ kpo sika kpɛwún kpo. Mɛ lɛ bi wɛ sixu yi fa.",
    howItWorks: "Nɛ̌ wɛ e nɔ su akwɛ gbɔ? (Mɛ̌ nɔ su?)",
    freeTitle: "1. 100% Fǎ nú gbɛtɔ́ lɛ",
    freeDesc: "Gbɛtɔ́ e byɔ azɔ̌ mɛ lɛ bi towe fǎ bi. Mɛɖé su akwɛ bubú ɖě lǎ.",
    adminTitle: "2. Gán ɖókpó wɛ nɔ su axɔ̀",
    adminDesc: "Gán towe nɔ su akwɛ kpɛwún 500 FCFA / sun. E sixu ɖe akwɛ sun tɔn 50 FCFA nú mɛ ɖókpó ɖókpó.",
    popular: "⭐ E e e jló mɛ bi é",
    standardTitle: "Standard (Gán)",
    standardDesc: "500 FCFA/sun kpɛwún.",
    stdF1: "✓ Gbɛ́tán 3",
    stdF2: "✓ Mɛ 20 sun mɛ",
    stdF3: "✓ Akwɛ yiyi wema & Trophée",
    stdF4: "✓ Kplé ɖagbe tɔn",
    stdF5: "✓ Akwɛ deɖe mɛ",
    stdBtn: "Su kpo Wave / MoMo kpo (500 FCFA)",
    proTitle: "Pro (Associations & NGO)",
    proDesc: "Nú gbɛ́tán lě gege.",
    proF1: "✓ Gbɛ́tán fɛɛ",
    proF2: "✓ Gbɛtɔ́ lɛ fɛɛ",
    proF3: "✓ WhatsApp / SMS gbe",
    proF4: "✓ PDF wema fite",
    proF5: "✓ Badge ɖagbe",
    proBtn: "Su Pro Plan (1 500 FCFA)"
  },
  gux: {
    tag: "🏷️ Axɔ̀ he sɔgbe bi",
    sub: "Bɛ̌ azɔ̌ kpo sika kpɛwún kpo. Mɛ lɛ bi wɛ sixu yi fa.",
    howItWorks: "Nɛ̌ wɛ e nɔ su akwɛ gbɔ? (Mɛ̌ nɔ su?)",
    freeTitle: "1. 100% Fǎ nú gbɛtɔ́ lɛ",
    freeDesc: "Gbɛtɔ́ e byɔ azɔ̌ mɛ lɛ bi towe fǎ bi. Mɛɖé su akwɛ bubú ɖě lǎ.",
    adminTitle: "2. Gán ɖókpó wɛ nɔ su axɔ̀",
    adminDesc: "Gán towe nɔ su akwɛ kpɛwún 500 FCFA / sun. E sixu ɖe akwɛ sun tɔn 50 FCFA nú mɛ ɖókpó ɖókpó.",
    popular: "⭐ E e e jló mɛ bi é",
    standardTitle: "Standard (Gán)",
    standardDesc: "500 FCFA/sun kpɛwún.",
    stdF1: "✓ Gbɛ́tɔ́n 3",
    stdF2: "✓ Mɛ 20 sun mɛ",
    stdF3: "✓ Akwɛ yiyi wema & Trophée",
    stdF4: "✓ Kplé xomɛsi tɔn",
    stdF5: "✓ Akwɛ lilẹ do base",
    stdBtn: "Su kpo Wave / MoMo (500 FCFA)",
    proTitle: "Pro (Associations & NGO)",
    proDesc: "Gbɛ́tɔ́n kpli lɛ.",
    proF1: "✓ Gbɛ́tɔ́n bi",
    proF2: "✓ Gbɛtɔ́ bi",
    proF3: "✓ WhatsApp / SMS",
    proF4: "✓ PDF wema fite",
    proF5: "✓ Badge mɛ",
    proBtn: "Su Pro Plan (1 500 FCFA)"
  },
  ajg: {
    tag: "🏷️ Ho ciwo sɔgbɛ do enu bi",
    sub: "Agbetan lɛ bi cu enu gbeɖewhe o, gán ɖoɖo yí acu ho kpɛvi.",
    howItWorks: "Nukagbe ho lɔ nɔ cu do? (Mɛcu ho?)",
    freeTitle: "1. 100% GRATUIT nɔ agbetan lɛ",
    freeDesc: "Agbetan ciwo yí wlan nyikɔ cu ho gbeɖe o. E bi yi te gbeɖewhe.",
    adminTitle: "2. Gán ɖoɖo yí acu ho lɔ",
    adminDesc: "Gán lɔ acu ho kpɛvi 500 FCFA / sun. E sixu ɖe ho lɔ kpɛvi do agbetan lɛ bi si.",
    popular: "⭐ Mɛbi sɔ́",
    standardTitle: "Standard (Gán)",
    standardDesc: "500 FCFA/sun kpɛwún.",
    stdF1: "✓ Gbɛ́ 3",
    stdF2: "✓ Agbetan 20 bi",
    stdF3: "✓ Ho wema & Trophée",
    stdF4: "✓ Nɔnɔmɛ kpa",
    stdF5: "✓ Ho ɖeɖe kodo base",
    stdBtn: "Su kodo Wave / MoMo (500 FCFA)",
    proTitle: "Pro (Associations & NGO)",
    proDesc: "Man gbɛ́ kpli ciwo yí sugbɛ.",
    proF1: "✓ Gbɛ́ bi",
    proF2: "✓ Agbetan bi",
    proF3: "✓ WhatsApp / SMS",
    proF4: "✓ PDF wema",
    proF5: "✓ Badge certifié",
    proBtn: "Su Pro Plan (1 500 FCFA)"
  }
};



export default function Home() {
  const { t, language, isAutoDetected, detectedRegionName } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [payTitle, setPayTitle] = useState("");
  const [payAmount, setPayAmount] = useState(0);

  const pt = (key: string): string => {
    const dict = PRICING_TRANSLATIONS[language] || PRICING_TRANSLATIONS.fr;
    return dict[key] || PRICING_TRANSLATIONS.fr[key] || key;
  };

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

        {/* OWNER & REVENUE TAB */}
        {activeTab === "owner" && <OwnerDashboardView onClose={() => setActiveTab("dashboard")} />}

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
                {pt("tag")}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("pricingTitle")}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                {pt("sub")}
              </p>
            </div>

            {/* BANNIÈRE EXPLICATIVE : QUI PAIE ET COMMENT ? */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-2 border-amber-500/40 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm uppercase tracking-wider">
                <HelpCircle className="w-5 h-5" />
                <span>{pt("howItWorks")}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{pt("freeTitle")}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pt("freeDesc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-600 dark:text-amber-400 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{pt("adminTitle")}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pt("adminDesc")}
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
                    <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">{pt("stdF1").replace("3", "1")}</li>
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
                    {pt("popular")}
                  </div>
                  <div className="text-xs font-black text-amber-500 uppercase tracking-wider">{pt("standardTitle")}</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    500 FCFA <span className="text-xs font-normal text-slate-500">{t("perMonth")}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{pt("standardDesc")}</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold">
                    <li className="flex items-center gap-2 text-amber-600 dark:text-amber-400">{pt("stdF1")}</li>
                    <li className="flex items-center gap-2">{pt("stdF2")}</li>
                    <li className="flex items-center gap-2">{pt("stdF3")}</li>
                    <li className="flex items-center gap-2">{pt("stdF4")}</li>
                    <li className="flex items-center gap-2">{pt("stdF5")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenPlanPayment("Abonnement Responsable Standard (500 FCFA)", 500)}
                  className="w-full py-3 rounded-2xl btn-mango-gold text-slate-950 font-black text-xs shadow-md mt-4 hover:scale-[1.02] transition-all"
                >
                  {pt("stdBtn")}
                </button>
              </div>

              {/* PLAN 3: PRO (ASSOCIATIONS - 1 500 FCFA / MOIS) */}
              <div className="p-6 rounded-3xl card-premium space-y-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">{pt("proTitle")}</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    1 500 FCFA <span className="text-xs font-normal text-slate-500">{t("perMonth")}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{pt("proDesc")}</p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold">
                    <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400">{pt("proF1")}</li>
                    <li className="flex items-center gap-2">{pt("proF2")}</li>
                    <li className="flex items-center gap-2">{pt("proF3")}</li>
                    <li className="flex items-center gap-2">{pt("proF4")}</li>
                    <li className="flex items-center gap-2">{pt("proF5")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleOpenPlanPayment("Souscription Plan Pro (1 500 FCFA)", 1500)}
                  className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-4"
                >
                  {pt("proBtn")}
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
