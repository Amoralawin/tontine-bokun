"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Bell, Trophy, Users, TrendingUp, Camera, Image as ImageIcon, X, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { INITIAL_GROUPS, TontineGroup } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { MOCK_REPUTATIONS, getOrCreateMemberReputation } from "@/lib/reputationSystem";
import { useUserRole } from "@/lib/UserRoleContext";
import { useGroups } from "@/lib/GroupContext";
import { toast } from "sonner";

import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { MobileDashboardView } from "./MobileDashboardView";
import { TabletDashboardView } from "./TabletDashboardView";

const WELCOME_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    title: "Bienvenue sur Tontine bɔkun !",
    desc: "Vous n'êtes membre d'aucun groupe pour le moment. Vous pouvez créer votre propre groupe ou demander à en rejoindre un existant depuis l'onglet \"Groupes\".",
    notice: "💡 La base de données en ligne est connectée ! Tous les groupes que vous créerez maintenant seront réels et enregistrés de manière sécurisée sur Supabase."
  },
  en: {
    title: "Welcome to Tontine bɔkun!",
    desc: "You are not a member of any group at the moment. You can create your own group or request to join an existing one from the \"Groups\" tab.",
    notice: "💡 The online database is connected! All groups you create now will be real and securely saved on Supabase."
  },
  bci: {
    title: "Mo wuo ba Tontine bɔkun!",
    desc: "A nun fin akpasua fiɛ nun fine. A ko yi akpasua wun, o ko wlu nun akpasua kun lɔ.",
    notice: "💡 Database su kpli wun fine! Akpasua mɔyo mun bo a ko yi o ko siesie kpa su Supabase."
  },
  fon: {
    title: "Mǐ ɖo azɔ̌ Tontine bɔkun mɛ!",
    desc: "A ko byɔ gbɛ́tán ɖě mɛ azɔ̌ lɔ mɛ lǎ. A sixu blo gbɛ́tán towe alɔyi.",
    notice: "💡 Akwɛ jije towe sugan bi! Gbɛ́tán e blo towe ganji mɛ sugan bi Supabase."
  },
  gux: {
    title: "Mǐ ɖo azɔ̌ Tontine bɔkun mɛ!",
    desc: "A ko byɔ gbɛ́tán ɖě mɛ azɔ̌ lɔ mɛ lǎ. A sixu blo gbɛ́tán towe alɔyi.",
    notice: "💡 Akwɛ jije towe sugan bi! Gbɛ́tán e blo towe ganji mɛ sugan bi Supabase."
  },
  ajg: {
    title: "Wuleva ba Tontine bɔkun!",
    desc: "Agbetan ma wlu gbɛ́ ɖe mɛ o. A wawa gbɛ́ yɔyɔ́ alokan si.",
    notice: "💡 Ho kodo base bi te bi! Gbɛ́ ciwo yí a wawa wlán do Supabase."
  }
};

export const DashboardView: React.FC = () => {
  const { t, language } = useLanguage();
  const { canSeePenalties, isAdmin } = useUserRole();
  const { activeGroup: group, updateContributionStatus, updateMeetingPotProof } = useGroups();
  const [activeTab, setActiveTab] = useState<"overview" | "meeting" | "dues">("overview");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [previewProofModal, setPreviewProofModal] = useState<{ isOpen: boolean; imageUrl: string; title: string } | null>(null);

  const wt = (key: string) => {
    const dict = WELCOME_TRANSLATIONS[language] || WELCOME_TRANSLATIONS.fr;
    return dict[key] || WELCOME_TRANSLATIONS.fr[key];
  };

  if (!group) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-md">
        <div className="text-5xl">👋🏿</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{wt("title")}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {wt("desc")}
        </p>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
          {wt("notice")}
        </div>
      </div>
    );
  }

  const meeting = group.meetings?.[0] || {
    id: "m-1",
    meetingNumber: 1,
    date: "Aujourd'hui",
    beneficiaryName: group.members?.[0]?.name || "Membre",
    contributions: [],
  };

  const handleStatusChange = (memberId: string, newStatus: "paid" | "pending" | "late", proofUrl?: string) => {
    updateContributionStatus(group.id, meeting.id, memberId, newStatus, proofUrl);
  };

  const handleUploadProof = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        updateContributionStatus(group.id, meeting.id, memberId, "paid", url);
        toast.success("Reçu enregistré et paiement validé !");
      };
      reader.readAsDataURL(file);
    }
  };

  const paidCount = meeting.contributions.filter((c) => c.status === "paid").length;
  const lateCount = meeting.contributions.filter((c) => c.status === "late").length;
  const totalCollected = paidCount * group.contributionAmount;

  return (
    <>
      {/* Mobile Dedicated Native View (< 640px) */}
      <div className="block sm:hidden">
        <MobileDashboardView />
      </div>

      {/* Tablet Dedicated View (640px - 1024px) */}
      <div className="hidden sm:block lg:hidden">
        <TabletDashboardView />
      </div>

      {/* Desktop Bento Grid Layout (> 1024px) */}
      <div className="hidden lg:block space-y-8 pb-12">

      {/* ── Header Card Blue Tie-Dye ──────────────────────────── */}
      <div className="p-6 rounded-2xl indigo-circle-banner text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{t("activeGroupLabel")} • {t("cycleLabel")} #{group.cycleNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{group.name}</h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              {group.frequency} • {formatCurrency(group.contributionAmount)} {t("perMemberLabel")}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin && (
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-mango-gold text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("scheduleMeetingBtn")}</span>
              </button>
            )}
            <TTSVoiceReader
              textToRead={`Menu principal de la ${group.name}. Cotisation : ${group.contributionAmount} FCFA.`}
              frenchText={`Menu principal de la ${group.name}. Cotisation : ${group.contributionAmount} FCFA.`}
              variant="card"
              label="Écouter le résumé"
            />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 sm:p-4 rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-500/20">
          <div className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1 truncate">{t("collectedStat")}</div>
          <div className="text-sm sm:text-lg font-black text-amber-700 dark:text-amber-400 leading-snug">{formatCurrency(totalCollected)}</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1 truncate">{t("paidStat")}</div>
          <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">{paidCount}/{group.members.length}</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-950/20">
          <div className="text-[11px] sm:text-xs text-red-700 dark:text-red-400 font-semibold mb-1 truncate">{t("lateStat")}</div>
          <div className="text-base sm:text-lg font-black text-red-700 dark:text-red-400">{lateCount}</div>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border border-blue-500/20 bg-blue-50 dark:bg-blue-950/20">
          <div className="text-[11px] sm:text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1 truncate">{t("meetingStat")}</div>
          <div className="text-xs sm:text-sm font-black text-blue-700 dark:text-blue-400 truncate">{meeting.date}</div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1">
        {(["overview", "meeting", "dues"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {tab === "overview" && t("tabOverview")}
            {tab === "meeting" && `${t("tabMeeting")} #${meeting.meetingNumber}`}
            {tab === "dues" && t("tabDues")}
          </button>
        ))}
      </div>

      {/* ── Overview Tab (Bento Box Grid Layout) ───────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column Bento (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bento Tile A: Pot Beneficiary Feature Card */}
            <div className="p-6 rounded-2xl card-premium border-2 border-amber-500/40 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg">
                    🏆
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                      {t("potBeneficiaryTitle")} — {t("meetings")} #{meeting.meetingNumber}
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{meeting.beneficiaryName}</div>
                    <div className="text-sm text-amber-500 font-extrabold mt-0.5">
                      {formatCurrency(group.contributionAmount * group.members.length)} {t("totalPotAmount")}
                    </div>
                  </div>
                </div>
                <TTSVoiceReader
                  textToRead={`Le bénéficiaire est ${meeting.beneficiaryName}.`}
                  variant="mini"
                />
              </div>

              {/* Preuve de versement du pot au gagnant */}
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/80 flex-wrap">
                {meeting.potProofUrl ? (
                  <button
                    onClick={() => setPreviewProofModal({ isOpen: true, imageUrl: meeting.potProofUrl!, title: `Preuve de versement du pot à ${meeting.beneficiaryName}` })}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/20 transition-all"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                    <span>Voir la preuve de versement du pot</span>
                  </button>
                ) : (
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-all">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>Joindre la preuve de virement du pot (Reçu)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateMeetingPotProof(group.id, meeting.id, reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Bento Tile B: Active Meeting Payment Check */}
            <div className="p-6 rounded-2xl card-premium space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t("tabMeeting")} #{meeting.meetingNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                    {meeting.date}
                  </span>
                </h3>
              </div>

              {/* Contributions Payment Toggles */}
              <div className="space-y-2.5">
                {meeting.contributions.slice(0, 4).map((c) => {
                  const member = group.members.find((m) => m.id === c.memberId);
                  const reputation = member ? getOrCreateMemberReputation(member, group) : undefined;
                  return (
                    <div
                      key={c.memberId}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{member?.avatar || "👤"}</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            {c.memberName}
                            {reputation && canSeePenalties && <MemberReputationBadge reputation={reputation} />}
                          </div>
                          <div className="text-[10px] text-slate-400">{formatCurrency(c.amount)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                        {c.proofUrl && (
                          <button
                            onClick={() => setPreviewProofModal({ isOpen: true, imageUrl: c.proofUrl!, title: `Reçu de versement — ${c.memberName}` })}
                            className="p-1 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            title="Voir la capture d'écran du reçu"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <label className="cursor-pointer p-1 rounded text-slate-500 hover:text-amber-500" title="Ajouter / modifier la capture du reçu">
                          <Camera className="w-3.5 h-3.5" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadProof(c.memberId, e)} />
                        </label>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "paid")}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.status === "paid" ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-emerald-500"
                          }`}
                        >
                          {t("paid")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "pending")}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.status === "pending" ? "bg-amber-500 text-slate-950" : "text-slate-500 hover:text-amber-500"
                          }`}
                        >
                          {t("pending")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "late")}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.status === "late" ? "bg-red-500 text-white" : "text-slate-500 hover:text-red-500"
                          }`}
                        >
                          {t("late")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column Bento (Span 1) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bento Tile C: Members Roster & Turns */}
            <div className="p-6 rounded-2xl card-premium space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                {t("groupMembersTitle")}
              </h3>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {group.members.map((m) => {
                  const rep = getOrCreateMemberReputation(m, group);
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{m.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            {m.name}
                            {m.role === "admin" && (
                              <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1 py-0.2 rounded font-bold">Admin</span>
                            )}
                          </div>
                          {rep && canSeePenalties && <MemberReputationBadge reputation={rep} />}
                        </div>
                      </div>
                      <div className="text-right text-[11px]">
                        <div className="font-bold text-slate-700 dark:text-slate-300">{t("turnLabel")} #{m.position}</div>
                        <div className="text-[10px] text-slate-400">{m.paidCount}/4 {t("paid")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Meeting Tab ─────────────────────────────────────────── */}
      {activeTab === "meeting" && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("meetings")} #{meeting.meetingNumber} — {meeting.date}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                paidCount === group.members.length
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
              }`}>
                {paidCount === group.members.length ? "✅ Réunion complète" : `⏳ ${paidCount}/${group.members.length} ${t("paid")}`}
              </div>
            </div>
          </div>

          {/* Contributions List */}
          <div className="space-y-3">
            {meeting.contributions.map((c) => {
              const member = group.members.find((m) => m.id === c.memberId);
              const reputation = member ? getOrCreateMemberReputation(member, group) : undefined;
              return (
                <div
                  key={c.memberId}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{member?.avatar || "👤"}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          {c.memberName}
                          {member?.role === "admin" && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-medium">{t("adminLabel")}</span>
                          )}
                          {reputation && canSeePenalties && <MemberReputationBadge reputation={reputation} />}
                        </div>
                        <div className="text-xs text-slate-500">{member?.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {formatCurrency(c.amount)}
                      </span>
                      <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                        {c.proofUrl && (
                          <button
                            onClick={() => setPreviewProofModal({ isOpen: true, imageUrl: c.proofUrl!, title: `Reçu de versement — ${c.memberName}` })}
                            className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1"
                            title="Voir la capture d'écran du reçu"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Preuve</span>
                          </button>
                        )}
                        <label className="cursor-pointer p-1.5 rounded text-slate-500 hover:text-amber-500" title="Ajouter / modifier la capture du reçu">
                          <Camera className="w-3.5 h-3.5" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadProof(c.memberId, e)} />
                        </label>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "paid")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                            c.status === "paid"
                              ? "bg-emerald-500 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                          }`}
                        >
                          {t("paid")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "pending")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                            c.status === "pending"
                              ? "bg-amber-500 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                          }`}
                        >
                          {t("pending")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "late")}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                            c.status === "late"
                              ? "bg-red-500 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-red-600"
                          }`}
                        >
                          {t("late")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Dues Tab ────────────────────────────────────────────── */}
      {activeTab === "dues" && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("dues")}</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">{t("membersLabel")}</th>
                  <th className="py-3 px-2">{t("reputationTab")}</th>
                  <th className="py-3 px-2">{t("contributions")}</th>
                  <th className="py-3 px-2">{t("totalDueLabel")}</th>
                  <th className="py-3 px-2">{t("penaltiesLabel")}</th>
                  <th className="py-3 px-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {group.members.map((m) => {
                  const rep = getOrCreateMemberReputation(m, group);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{m.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">{m.name}</div>
                            <div className="text-[10px] text-slate-400">{t("turnLabel")} #{m.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        {canSeePenalties
                          ? (rep ? <MemberReputationBadge reputation={rep} /> : <span className="text-xs text-slate-400">—</span>)
                          : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        {m.paidCount}/4
                      </td>
                      <td className="py-3.5 px-2 font-bold text-xs text-slate-900 dark:text-white">
                        {formatCurrency(m.totalDue)}
                      </td>
                      <td className="py-3.5 px-2 text-xs">
                        {canSeePenalties ? (
                          rep && rep.totalPenaltiesOwed > 0 ? (
                            <span className="font-bold text-red-600 dark:text-red-400">
                              +{rep.totalPenaltiesOwed.toLocaleString("fr-FR")} FCFA
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium">0 FCFA</span>
                          )
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        {m.totalDue === 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> {t("upToDateBadge")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-semibold border border-red-500/20">
                            <AlertCircle className="w-3 h-3" /> {t("mustPayBadge")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />

      {/* Proof Lightbox Modal */}
      {previewProofModal && previewProofModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-up">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                {previewProofModal.title}
              </h3>
              <button
                onClick={() => setPreviewProofModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[400px] flex items-center justify-center bg-slate-950">
              <img
                src={previewProofModal.imageUrl}
                alt="Capture d'écran du reçu"
                className="w-full h-auto max-h-[380px] object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>✅ Preuve certifiée par le membre / admin</span>
              <button
                onClick={() => setPreviewProofModal(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
