"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Bell, Trophy, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { INITIAL_GROUPS, TontineGroup } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { MOCK_REPUTATIONS } from "@/lib/reputationSystem";
import { useUserRole } from "@/lib/UserRoleContext";
import { useGroups } from "@/lib/GroupContext";
import { toast } from "sonner";

import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { Calendar } from "lucide-react";
import { MobileDashboardView } from "./MobileDashboardView";
import { TabletDashboardView } from "./TabletDashboardView";

export const DashboardView: React.FC = () => {
  const { t } = useLanguage();
  const { canSeePenalties, isAdmin } = useUserRole();
  const { activeGroup: group } = useGroups();
  const [activeTab, setActiveTab] = useState<"overview" | "meeting" | "dues">("overview");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const meeting = group.meetings[0] || {
    id: "m-1",
    meetingNumber: 1,
    date: "Aujourd'hui",
    beneficiaryName: group.members[0]?.name || "Membre",
    contributions: [],
  };

  const handleStatusChange = (memberId: string, newStatus: "paid" | "pending" | "late") => {
    const updatedContributions = meeting.contributions.map((c) => {
      if (c.memberId === memberId) {
        return {
          ...c,
          status: newStatus,
          paidAt: newStatus === "paid" ? new Date().toLocaleDateString("fr-FR") : undefined,
        };
      }
      return c;
    });
    toast.success(t("statusUpdatedToast"));
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
                  const reputation = MOCK_REPUTATIONS.find((r) => r.memberId === c.memberId);
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
                  const rep = MOCK_REPUTATIONS.find((r) => r.memberId === m.id);
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
              const reputation = MOCK_REPUTATIONS.find((r) => r.memberId === c.memberId);
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
                      <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
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
                  const rep = MOCK_REPUTATIONS.find((r) => r.memberId === m.id);
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
      </div>
    </>
  );
};
