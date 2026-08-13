"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, ShieldX, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { MemberReputation, getReputationConfig, getReputationLevel } from "@/lib/reputationSystem";

interface MemberReputationBadgeProps {
  reputation: MemberReputation;
  showDetails?: boolean;
}

export const MemberReputationBadge: React.FC<MemberReputationBadgeProps> = ({
  reputation,
  showDetails = false,
}) => {
  const config = getReputationConfig(reputation.level);

  if (!showDetails) {
    return (
      <span
        title={`Score: ${reputation.score}/100 — ${config.label}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.color} ${config.border}`}
      >
        <span>{config.badge}</span>
        <span>{reputation.score}/100</span>
      </span>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${config.border} ${config.bg} space-y-3`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {reputation.level === "blocked" ? (
            <ShieldX className={`w-5 h-5 ${config.color}`} />
          ) : reputation.level === "restricted" || reputation.level === "warning" ? (
            <ShieldAlert className={`w-5 h-5 ${config.color}`} />
          ) : (
            <ShieldCheck className={`w-5 h-5 ${config.color}`} />
          )}
          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black ${config.color}`}>{reputation.score}</div>
          <div className="text-[10px] text-slate-400">/ 100</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            reputation.level === "blocked" ? "bg-red-500" :
            reputation.level === "restricted" ? "bg-orange-500" :
            reputation.level === "warning" ? "bg-amber-500" :
            reputation.level === "good" ? "bg-blue-500" : "bg-emerald-500"
          }`}
          style={{ width: `${reputation.score}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="text-sm font-bold text-emerald-600">{reputation.totalOnTime}</div>
          <div className="text-[10px] text-slate-500">À temps</div>
        </div>
        <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="text-sm font-bold text-amber-600">{reputation.totalLate}</div>
          <div className="text-[10px] text-slate-500">Retards</div>
        </div>
        <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="text-sm font-bold text-red-600">{reputation.totalUnpaid}</div>
          <div className="text-[10px] text-slate-500">Impayés</div>
        </div>
      </div>

      {/* Identité */}
      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 border-t border-current/10 pt-2">
        {reputation.identity.phone && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">📱</span>
            <span>{reputation.identity.phone}</span>
          </div>
        )}
        {reputation.identity.email && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">📧</span>
            <span>{reputation.identity.email}</span>
          </div>
        )}
        {reputation.identity.momoNumber && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">💳</span>
            <span>{reputation.identity.momoProvider?.replace("_", " ").toUpperCase()} — {reputation.identity.momoNumber}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className={`text-xs font-medium ${config.color}`}>
        {config.description}
      </p>

      {/* Blocked info */}
      {reputation.level === "blocked" && reputation.blockedSince && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
          <div className="font-bold flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Bloqué depuis le {reputation.blockedSince}</span>
          </div>
          <div>{reputation.blockedReason}</div>
          {reputation.unblockRequestPending && (
            <div className="mt-1.5 text-amber-600 font-semibold">
              ⏳ Demande de déblocage en attente d'approbation
            </div>
          )}
        </div>
      )}
    </div>
  );
};
