"use client";

import React, { useState } from "react";
import { useGroups } from "@/lib/GroupContext";
import { useUserRole } from "@/lib/UserRoleContext";
import { useLanguage } from "@/lib/LanguageContext";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { MOCK_REPUTATIONS } from "@/lib/reputationSystem";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { PaymentCheckoutModal } from "./PaymentCheckoutModal";
import {
  Trophy, Calendar, Users, Sparkles, CheckCircle2, Clock,
  AlertTriangle, DollarSign, ChevronRight, Volume2, Shield, CreditCard
} from "lucide-react";

export const MobileDashboardView: React.FC = () => {
  const { activeGroup: group, updateContributionStatus } = useGroups();
  const { canSeePenalties, isAdmin, role } = useUserRole();
  const { t } = useLanguage();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedMemberForPay, setSelectedMemberForPay] = useState<string | null>(null);

  if (!group) return null;

  const meeting = group.meetings[0];
  const paidCount = meeting ? meeting.contributions.filter((c) => c.status === "paid").length : 0;
  const lateCount = meeting ? meeting.contributions.filter((c) => c.status === "late").length : 0;
  const totalCollected = paidCount * group.contributionAmount;
  const grossPot = group.contributionAmount * group.members.length;
  const ownerCommission = grossPot * 0.05; // 5% commission pour le propriétaire
  const netPotWinner = grossPot - ownerCommission; // 95% net pour le gagnant

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val);

  const handleStatusChange = (memberId: string, status: "paid" | "pending" | "late") => {
    if (status === "paid") {
      setSelectedMemberForPay(memberId);
      setIsPaymentOpen(true);
    } else {
      updateContributionStatus(group.id, meeting.id, memberId, status);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedMemberForPay && meeting) {
      updateContributionStatus(group.id, meeting.id, selectedMemberForPay, "paid");
      setSelectedMemberForPay(null);
    }
  };

  return (
    <div className="w-full space-y-5 pb-12 text-slate-900 dark:text-slate-100 font-sans">

      {/* ── CARD 1: En-tête Groupe & Informations Principales ────── */}
      <div className="p-5 rounded-3xl indigo-circle-banner text-white shadow-xl space-y-4 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-black/40 text-[11px] font-black text-yellow-400 border border-yellow-400/20">
            {t("cycleLabel")} #{group.cycleNumber} • {group.frequency}
          </span>
          <TTSVoiceReader
            textToRead={`${t("dashboard")} ${group.name}. ${t("contributionLabel")} : ${group.contributionAmount} FCFA ${t("perMemberLabel")}.`}
            variant="mini"
          />
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">{group.name}</h1>
          <p className="text-xs text-slate-200 mt-1 font-semibold">
            {t("contributionLabel")} : <strong className="text-yellow-300">{formatCurrency(group.contributionAmount)}</strong> (+ 100 FCFA frais)
          </p>
        </div>

        <button
          onClick={() => setIsPaymentOpen(true)}
          className="w-full py-3 px-4 rounded-2xl btn-mango-gold text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>Payer ma Cotisation ({formatCurrency(group.contributionAmount + 100)})</span>
        </button>

        {(isAdmin || role === "owner") && (
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 hover:bg-white/20 transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{t("scheduleMeetingBtn")}</span>
          </button>
        )}
      </div>

      {/* ── CARD 2: Bénéficiaire du Pot (avec déduction 5% commission) ── */}
      <div className="p-5 rounded-3xl card-premium border-2 border-amber-500/50 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{t("potBeneficiaryTitle")}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300">
            {t("meetings")} #{meeting?.meetingNumber}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white leading-snug">
              {meeting?.beneficiaryName}
            </div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(netPotWinner)} <span className="text-[11px] font-normal text-slate-500">(Net à recevoir)</span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
              💡 {formatCurrency(ownerCommission)} (Commission 5% Propriétaire déduite)
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 overflow-hidden shadow-lg shrink-0 border border-amber-400">
            <img src="/pot_winner.jpg" alt="Cagnotte Gagnée" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── CARD 3: Métriques du Cycle ──────────────────────────── */}
      <div className="p-5 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
          📊 {t("tabOverview")}
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <span>💰</span>
              <span>{t("collectedStat")}</span>
            </div>
            <span className="font-black text-amber-600 dark:text-amber-400 text-sm">{formatCurrency(totalCollected)}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <span>✅</span>
              <span>{t("paidStat")}</span>
            </div>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{paidCount} / {group.members.length}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <span>⚠️</span>
              <span>{t("lateStat")}</span>
            </div>
            <span className="font-black text-red-600 dark:text-red-400 text-sm">{lateCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <span>🗓️</span>
              <span>{t("nextMeeting")}</span>
            </div>
            <span className="font-black text-blue-600 dark:text-blue-400 text-xs">{meeting?.date || "—"}</span>
          </div>
        </div>
      </div>

      {/* ── CARD 4: Suivi des Cotisations Réunion Active ──────────── */}
      <div className="p-5 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{t("tabMeeting")} #{meeting?.meetingNumber}</span>
          </h3>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {paidCount}/{group.members.length} {t("paid")}
          </span>
        </div>

        <div className="space-y-3">
          {meeting?.contributions.map((c) => {
            const member = group.members.find((m) => m.id === c.memberId);
            const reputation = MOCK_REPUTATIONS.find((r) => r.memberId === c.memberId);
            return (
              <div
                key={c.memberId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{member?.avatar || "👤"}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{c.memberName}</div>
                      {reputation && canSeePenalties && <MemberReputationBadge reputation={reputation} />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === "paid" && (
                      <img src="/payment_success.jpg" alt="Paiement OK" className="w-5 h-5 rounded-md object-cover shadow-sm shrink-0 border border-emerald-500/40" />
                    )}
                    <div className="text-right">
                      <span className="font-black text-amber-600 dark:text-amber-400 text-xs block">{formatCurrency(c.amount)}</span>
                      <span className="text-[9px] text-slate-400 font-bold block">+ 100 FCFA frais</span>
                    </div>
                  </div>
                </div>

                {/* Status Selector Buttons */}
                <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Statut :</span>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => handleStatusChange(c.memberId, "paid")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        c.status === "paid" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 hover:text-emerald-500"
                      }`}
                    >
                      {t("paid")}
                    </button>
                    <button
                      onClick={() => handleStatusChange(c.memberId, "pending")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        c.status === "pending" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-500 hover:text-amber-500"
                      }`}
                    >
                      {t("pending")}
                    </button>
                    <button
                      onClick={() => handleStatusChange(c.memberId, "late")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        c.status === "late" ? "bg-red-500 text-white shadow-sm" : "text-slate-500 hover:text-red-500"
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

      {/* ── CARD 5: Membres du Groupe & Ordre des Tours ──────────── */}
      <div className="p-5 rounded-3xl card-premium border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>{t("groupMembersTitle")} ({group.members.length})</span>
          </h3>
        </div>

        <div className="space-y-2">
          {group.members.map((m) => {
            const rep = MOCK_REPUTATIONS.find((r) => r.memberId === m.id);
            return (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{m.avatar}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {m.name}
                      {m.role === "admin" && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full font-black border border-amber-500/20">
                          {t("adminLabel")}
                        </span>
                      )}
                    </div>
                    {rep && canSeePenalties && <MemberReputationBadge reputation={rep} />}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 dark:text-white text-xs">{t("turnLabel")} #{m.position}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">{m.paidCount}/4 {t("paid")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Checkout Modal (Wave, Orange, MTN, Moov, Carte) */}
      <PaymentCheckoutModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedMemberForPay(null);
        }}
        title={`Cotisation Tontine — ${group.name}`}
        baseAmount={group.contributionAmount}
        feeAmount={100}
        onSuccess={handlePaymentSuccess}
      />

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
