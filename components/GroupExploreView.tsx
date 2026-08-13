"use client";

import React, { useState } from "react";
import {
  Users, Plus, CheckCircle2, XCircle, Clock, ShieldAlert, Sparkles,
  ArrowRight, Search, Check, AlertCircle, Building, DollarSign, Send
} from "lucide-react";
import { useGroups } from "@/lib/GroupContext";
import { useUserRole } from "@/lib/UserRoleContext";
import { useLanguage } from "@/lib/LanguageContext";
import { CreateGroupModal } from "./CreateGroupModal";
import { JoinGroupModal } from "./JoinGroupModal";
import { TontineGroup } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { MOCK_REPUTATIONS } from "@/lib/reputationSystem";
import { MemberReputationBadge } from "./MemberReputationBadge";

export const GroupExploreView: React.FC = () => {
  const { groups, activeGroupId, setActiveGroupId, joinRequests, approveJoinRequest, rejectJoinRequest } = useGroups();
  const { isAdmin } = useUserRole();
  const { t } = useLanguage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroupToJoin, setSelectedGroupToJoin] = useState<TontineGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const pendingRequests = joinRequests.filter((r) => r.status === "pending");

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{t("groupTabTitle")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{t("groupTabTitle")}</h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              {t("groupTabSubtitle")}
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm shadow-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 text-amber-400" />
            <span>{t("createGroupBtn")}</span>
          </button>
        </div>
      </div>

      {/* Admin Approval Section */}
      {isAdmin && (
        <div className="p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              {t("pendingApprovalTitle")} ({pendingRequests.length})
            </h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{t("adminValidationRequired")}</span>
          </div>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {t("noPendingRequests")}
            </p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => {
                const rep = MOCK_REPUTATIONS.find((r) => {
                  const reqCleanPhone = (req.phone || "").replace(/\s+/g, "");
                  const repPhone = (r.identity?.phone || "").replace(/\s+/g, "");
                  const phoneMatch = reqCleanPhone.length > 5 && repPhone.length > 5 && repPhone.includes(reqCleanPhone);
                  const emailMatch = !!req.email && !!r.identity?.email && r.identity.email.toLowerCase() === req.email.toLowerCase();
                  return phoneMatch || emailMatch;
                });
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{req.memberName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20">
                          Groupe : {req.groupName}
                        </span>
                        {rep && <MemberReputationBadge reputation={rep} />}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>📞 {req.phone}</span>
                        <span>✉️ {req.email || "—"}</span>
                        <span>💳 {req.momoProvider} ({req.momoNumber})</span>
                      </div>
                      {req.message && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2 rounded-lg mt-1 border border-slate-100 dark:border-slate-800">
                          &quot;{req.message}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveJoinRequest(req.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> {t("approveBtn")}
                      </button>
                      <button
                        onClick={() => rejectJoinRequest(req.id)}
                        className="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 font-semibold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> {t("rejectBtn")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Group List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" />
            {t("allAvailableGroups")} ({filteredGroups.length})
          </h3>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchGroupPlaceholder")}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((g) => {
            const isActive = g.id === activeGroupId;
            const admin = g.members.find((m) => m.role === "admin");
            return (
              <div
                key={g.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isActive
                    ? "border-amber-500 bg-amber-500/5 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">{g.name}</span>
                      {isActive && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {t("activeGroupBadge")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>👑 {t("adminLabel")} : {admin?.name || "Responsable"}</span>
                      <span>•</span>
                      <span>{g.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t("contributionLabel")}</div>
                    <div className="text-xs font-black text-amber-600 dark:text-amber-400">{formatCurrency(g.contributionAmount)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t("membersLabel")}</div>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200">{g.members.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold">{t("potCycleLabel")}</div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(g.totalPot)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveGroupId(g.id);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500"
                    }`}
                  >
                    {isActive ? t("activeDashboardBtn") : t("viewGroupBtn")}
                  </button>

                  <button
                    onClick={() => setSelectedGroupToJoin(g)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> {t("requestJoinBtn")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <JoinGroupModal group={selectedGroupToJoin} isOpen={!!selectedGroupToJoin} onClose={() => setSelectedGroupToJoin(null)} />
    </div>
  );
};
