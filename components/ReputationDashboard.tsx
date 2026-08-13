"use client";

import React, { useState } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, XCircle, CheckCircle2,
  ShieldAlert, Users, CreditCard, Clock, ChevronDown, ChevronUp,
  Sparkles, Eye
} from "lucide-react";
import {
  MOCK_REPUTATIONS, PLATFORM_REVENUE, getReputationConfig,
  MemberReputation, calculatePenalty, getPenaltyRate
} from "@/lib/reputationSystem";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { BlockedMemberAlert } from "./BlockedMemberAlert";
import { PenaltyLegend } from "./PenaltyLegend";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export const ReputationDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<MemberReputation | null>(null);
  const [showAddMemberDemo, setShowAddMemberDemo] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResult, setSearchResult] = useState<MemberReputation | null | "not_found">(null);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  const blockedMembers = MOCK_REPUTATIONS.filter((m) => m.level === "blocked");
  const restrictedMembers = MOCK_REPUTATIONS.filter((m) => m.level === "restricted");
  const warningMembers = MOCK_REPUTATIONS.filter((m) => m.level === "warning");
  const totalPending = MOCK_REPUTATIONS.reduce((sum, m) => sum + m.totalPenaltiesOwed, 0);

  const handleSearch = () => {
    const found = MOCK_REPUTATIONS.find(
      (m) =>
        m.identity.phone?.includes(searchPhone) ||
        m.identity.email?.toLowerCase().includes(searchPhone.toLowerCase()) ||
        m.identity.momoNumber?.includes(searchPhone)
    );
    setSearchResult(found || "not_found");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{t("reputationEngineTitle")}</span>
          </div>
          <h2 className="text-2xl font-extrabold">🛡️ {t("reputationTab")}</h2>
          <p className="text-sm text-slate-300 mt-1">
            {t("reputationEngineDesc")}
          </p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">💰 Pénalités perçues</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fmt(PLATFORM_REVENUE.totalPenaltiesCollected)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Depuis le lancement</div>
        </div>
        <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">⏳ Pénalités en attente</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{fmt(totalPending)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">À collecter</div>
        </div>
        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 dark:bg-red-950/20">
          <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">🚫 Membres bloqués</div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{blockedMembers.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sur toute la plateforme</div>
        </div>
        <div className="p-5 rounded-xl border border-orange-500/30 bg-orange-500/5 dark:bg-orange-950/20">
          <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">⚠️ Membres signalés</div>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{restrictedMembers.length + warningMembers.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sous surveillance</div>
        </div>
      </div>

      {/* Penalty Calculator */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500" />
          Calculateur de pénalités automatique
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "1 à 7 jours", rate: "5%", example: "7 500 FCFA", color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "8 à 15 jours", rate: "7%", example: "10 500 FCFA", color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/20" },
            { label: "16+ jours", rate: "10%", example: "15 000 FCFA", color: "text-red-600", bg: "bg-red-500/10 border-red-500/20" },
          ].map((tier) => (
            <div key={tier.label} className={`p-4 rounded-xl border ${tier.bg}`}>
              <div className={`text-2xl font-black ${tier.color}`}>{tier.rate}</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{tier.label} de retard</div>
              <div className="text-[11px] text-slate-400 mt-1">Ex: cotisation 150k → <strong>{tier.example}</strong> d'amende</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-3">
          ✅ 100% des pénalités sont versées à votre compte propriétaire Tontine bɔkun
        </p>
      </div>

      {/* Search Member */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Vérifier un membre avant de l'accepter dans un groupe
        </h3>
        <p className="text-xs text-slate-500">
          Entrez le numéro de téléphone, Gmail ou numéro Mobile Money pour vérifier son historique inter-groupes.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="+225 07... ou email@gmail.com ou numéro MoMo"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
          >
            Vérifier
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          💡 Essayez : <button className="underline text-amber-600" onClick={() => { setSearchPhone("+225 05 13 14 15"); }}>+225 05 13 14 15</button> (restreinte) ou{" "}
          <button className="underline text-red-600" onClick={() => { setSearchPhone("+229 97 88 77 66"); }}>+229 97 88 77 66</button> (bloqué)
        </p>

        {searchResult === "not_found" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Aucun antécédent trouvé — Ce membre peut rejoindre librement un groupe.</span>
          </div>
        )}

        {searchResult && searchResult !== "not_found" && (
          <div className="space-y-3">
            <MemberReputationBadge reputation={searchResult} showDetails />
            {(searchResult.level === "blocked" || searchResult.level === "restricted") && (
              <BlockedMemberAlert
                reputation={searchResult}
                onReject={() => { setSearchResult(null); setSearchPhone(""); toast.error("Membre refusé avec succès."); }}
                onAcceptAnyway={() => toast.warning("Accepté sous votre responsabilité. Une alerte a été envoyée.")}
              />
            )}
          </div>
        )}
      </div>

      {/* All Members Reputation List */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-500" />
          Tous les membres — Réputation Inter-Groupes
        </h3>
        <PenaltyLegend />

        <div className="space-y-3">
          {MOCK_REPUTATIONS.map((rep) => {
            const config = getReputationConfig(rep.level);
            const isExpanded = expandedHistory === rep.memberId;

            return (
              <div key={rep.memberId} className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors"
                  onClick={() => setExpandedHistory(isExpanded ? null : rep.memberId)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${config.border} ${config.bg} ${config.color}`}>
                      {rep.memberName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                        <span>{rep.memberName}</span>
                        <MemberReputationBadge reputation={rep} />
                      </div>
                      <div className="text-xs text-slate-400">{rep.identity.phone} • {rep.identity.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    {rep.totalPenaltiesOwed > 0 && (
                      <span className="text-red-600 font-bold">{fmt(rep.totalPenaltiesOwed)} dû</span>
                    )}
                    {rep.totalPenaltiesPaid > 0 && (
                      <span className="text-emerald-600 font-bold">{fmt(rep.totalPenaltiesPaid)} payé</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {/* History */}
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historique</div>
                    <div className="space-y-2">
                      {rep.reputationHistory.map((event) => (
                        <div key={event.id} className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                          <div>
                            <span className="mr-1.5">
                              {event.type === "on_time" ? "✅" :
                               event.type === "late" ? "⚠️" :
                               event.type === "unpaid" ? "🔴" :
                               event.type === "excluded" ? "🚫" : "🔄"}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{event.description}</span>
                            <span className="ml-1.5 text-slate-400">— {event.date}</span>
                          </div>
                          <span className={`font-bold shrink-0 ${event.scoreChange > 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {event.scoreChange > 0 ? "+" : ""}{event.scoreChange} pts
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Unblock action */}
                    {rep.level === "blocked" && rep.unblockRequestPending && (
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => toast.success(`${rep.memberName} a été débloqué !`)}
                          className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          ✅ Approuver le déblocage
                        </button>
                        <button
                          onClick={() => toast.error(`Déblocage refusé pour ${rep.memberName}.`)}
                          className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-600 font-bold text-xs hover:bg-red-500/10"
                        >
                          ❌ Refuser
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
