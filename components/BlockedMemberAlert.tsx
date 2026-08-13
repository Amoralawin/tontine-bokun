"use client";

import React from "react";
import { AlertTriangle, XCircle, Clock, CreditCard } from "lucide-react";
import { MemberReputation, PenaltyRecord } from "@/lib/reputationSystem";

// Simple currency formatter
function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

interface BlockedMemberAlertProps {
  reputation: MemberReputation;
  onAcceptAnyway?: () => void;
  onReject?: () => void;
}

export const BlockedMemberAlert: React.FC<BlockedMemberAlertProps> = ({
  reputation,
  onAcceptAnyway,
  onReject,
}) => {
  const isBlocked = reputation.level === "blocked";
  const isRestricted = reputation.level === "restricted";

  if (!isBlocked && !isRestricted) return null;

  return (
    <div className={`rounded-2xl border-2 p-5 space-y-4 ${
      isBlocked
        ? "border-red-500/60 bg-red-500/5 dark:bg-red-950/20"
        : "border-orange-500/60 bg-orange-500/5 dark:bg-orange-950/20"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isBlocked ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
          {isBlocked ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={`text-lg font-extrabold ${isBlocked ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
            {isBlocked ? "🚫 MEMBRE BLOQUÉ" : "⚠️ MEMBRE À RISQUE"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {reputation.memberName} est signalé sur la plateforme Tontine bɔkun
          </p>
        </div>
      </div>

      {/* Identity */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Identité vérifiée</div>
        {reputation.identity.phone && (
          <div className="flex items-center gap-2 text-xs">
            <span>📱</span><span className="font-medium">{reputation.identity.phone}</span>
          </div>
        )}
        {reputation.identity.email && (
          <div className="flex items-center gap-2 text-xs">
            <span>📧</span><span className="font-medium">{reputation.identity.email}</span>
          </div>
        )}
        {reputation.identity.momoNumber && (
          <div className="flex items-center gap-2 text-xs">
            <span>💳</span>
            <span className="font-medium">
              {reputation.identity.momoProvider?.replace("_", " ").toUpperCase()} — {reputation.identity.momoNumber}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-red-600">{reputation.totalUnpaid}</div>
          <div className="text-[10px] text-slate-500">Impayés</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-amber-600">{reputation.totalLate}</div>
          <div className="text-[10px] text-slate-500">Retards</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-slate-700 dark:text-slate-200">{reputation.score}/100</div>
          <div className="text-[10px] text-slate-500">Score</div>
        </div>
      </div>

      {/* Pending penalties */}
      {reputation.pendingPenalties.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-red-500" />
            <span>Pénalités impayées ({fmt(reputation.totalPenaltiesOwed)})</span>
          </div>
          {reputation.pendingPenalties.map((p) => (
            <div key={p.id} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{p.groupName}</div>
                <div className="text-slate-500">Réunion #{p.meetingNumber} • {p.daysLate} jours de retard • Taux {Math.round(p.penaltyRate * 100)}%</div>
              </div>
              <div className="text-red-600 dark:text-red-400 font-bold text-sm shrink-0 ml-3">+{fmt(p.penaltyAmount)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Blocked since */}
      {isBlocked && reputation.blockedSince && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
          <Clock className="w-4 h-4" />
          <span>Bloqué depuis le {reputation.blockedSince} : {reputation.blockedReason}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onReject}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all"
        >
          {isBlocked ? "🚫 Refuser l'accès" : "❌ Refuser le membre"}
        </button>
        {!isBlocked && (
          <button
            onClick={onAcceptAnyway}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            ⚠️ Accepter quand même
          </button>
        )}
      </div>

      {isBlocked && (
        <p className="text-[11px] text-center text-slate-400">
          Ce membre doit payer {fmt(reputation.totalPenaltiesOwed)} de pénalités et recevoir l'approbation de Tontine bɔkun pour être débloqué.
        </p>
      )}
    </div>
  );
};
