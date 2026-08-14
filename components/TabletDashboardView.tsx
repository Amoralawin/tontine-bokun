"use client";

import React, { useState } from "react";
import { useGroups } from "@/lib/GroupContext";
import { useUserRole } from "@/lib/UserRoleContext";
import { useLanguage } from "@/lib/LanguageContext";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { MOCK_REPUTATIONS, getOrCreateMemberReputation } from "@/lib/reputationSystem";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import {
  Trophy, Calendar, Users, Sparkles, Clock, CheckCircle2, AlertTriangle, Shield
} from "lucide-react";

export const TabletDashboardView: React.FC = () => {
  const { activeGroup: group, updateContributionStatus } = useGroups();
  const { canSeePenalties, isAdmin, role } = useUserRole();
  const { t } = useLanguage();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  if (!group) return null;

  const meeting = group.meetings[0];
  const paidCount = meeting ? meeting.contributions.filter((c) => c.status === "paid").length : 0;
  const lateCount = meeting ? meeting.contributions.filter((c) => c.status === "late").length : 0;
  const totalCollected = paidCount * group.contributionAmount;
  const totalPot = group.contributionAmount * group.members.length;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val);

  const handleStatusChange = (memberId: string, status: "paid" | "pending" | "late") => {
    updateContributionStatus(group.id, meeting.id, memberId, status);
  };

  return (
    <div className="w-full space-y-6 pb-12 text-slate-900 dark:text-slate-100 font-sans">

      {/* ── En-tête Tablette ───────────────────────────────────── */}
      <div className="p-6 rounded-3xl indigo-circle-banner text-white shadow-xl flex items-center justify-between gap-4 border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>{t("activeGroupLabel")} • {t("cycleLabel")} #{group.cycleNumber}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{group.name}</h1>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            {group.frequency} • {formatCurrency(group.contributionAmount)} {t("perMemberLabel")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(isAdmin || role === "owner") && (
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-4 py-2.5 rounded-xl btn-mango-gold text-slate-950 font-black text-xs shadow-md flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t("scheduleMeetingBtn")}</span>
            </button>
          )}
          <TTSVoiceReader
            textToRead={`${t("dashboard")} ${group.name}.`}
            variant="card"
            label="Écouter"
          />
        </div>
      </div>

      {/* ── Grille 2 Colonnes Tablette ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Colonne 1 : Gagnant & Paiements */}
        <div className="space-y-6">
          {/* Card Gagnant */}
          <div className="p-6 rounded-3xl card-premium border-2 border-amber-500/50 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{t("potBeneficiaryTitle")}</span>
              </div>
              <span className="text-xs font-bold text-slate-400">{t("meetings")} #{meeting?.meetingNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{meeting?.beneficiaryName}</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(totalPot)}
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg">
                🏆
              </div>
            </div>
          </div>

          {/* Card Paiements */}
          <div className="p-6 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{t("tabMeeting")} #{meeting?.meetingNumber}</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">{paidCount}/{group.members.length} {t("paid")}</span>
            </div>

            <div className="space-y-2.5">
              {meeting?.contributions.map((c) => {
                const member = group.members.find((m) => m.id === c.memberId);
                const reputation = member ? getOrCreateMemberReputation(member, group) : undefined;
                return (
                  <div
                    key={c.memberId}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{member?.avatar || "👤"}</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{c.memberName}</div>
                        {reputation && canSeePenalties && <MemberReputationBadge reputation={reputation} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-600 dark:text-amber-400">{formatCurrency(c.amount)}</span>
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => handleStatusChange(c.memberId, "paid")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === "paid" ? "bg-emerald-500 text-white" : "text-slate-400"
                          }`}
                        >
                          {t("paid")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "pending")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === "pending" ? "bg-amber-500 text-slate-950" : "text-slate-400"
                          }`}
                        >
                          {t("pending")}
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.memberId, "late")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === "late" ? "bg-red-500 text-white" : "text-slate-400"
                          }`}
                        >
                          {t("late")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne 2 : Stats & Membres */}
        <div className="space-y-6">
          {/* Card Stats */}
          <div className="p-6 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
              📊 {t("tabOverview")}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20">
                <div className="text-[10px] font-bold text-amber-500">{t("collectedStat")}</div>
                <div className="text-sm font-black text-amber-600">{formatCurrency(totalCollected)}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
                <div className="text-[10px] font-bold text-emerald-500">{t("paidStat")}</div>
                <div className="text-sm font-black text-emerald-600">{paidCount}/{group.members.length}</div>
              </div>
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-500/20">
                <div className="text-[10px] font-bold text-red-500">{t("lateStat")}</div>
                <div className="text-sm font-black text-red-600">{lateCount}</div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20">
                <div className="text-[10px] font-bold text-blue-500">{t("nextMeeting")}</div>
                <div className="text-xs font-black text-blue-600">{meeting?.date}</div>
              </div>
            </div>
          </div>

          {/* Card Membres */}
          <div className="p-6 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span>{t("groupMembersTitle")} ({group.members.length})</span>
            </h3>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {group.members.map((m) => {
                const rep = getOrCreateMemberReputation(m, group);
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{m.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                        {rep && canSeePenalties && <MemberReputationBadge reputation={rep} />}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-700 dark:text-slate-300">{t("turnLabel")} #{m.position}</div>
                      <div className="text-[10px] text-emerald-500">{m.paidCount}/4 {t("paid")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
