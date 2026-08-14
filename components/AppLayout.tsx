"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, Users, ShieldAlert, Sparkles, Building2,
  Menu, X, Sun, Moon, ShieldCheck, ChevronRight, UserPlus,
  Smartphone, Tablet, Laptop, MoreVertical, Tag, Trash2
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import { useUserRole, UserRole } from "@/lib/UserRoleContext";
import { useGroups } from "@/lib/GroupContext";
import { LogoIcon } from "./LogoIcon";
import { LanguageSelector } from "./LanguageSelector";
import { JoinGroupModal } from "./JoinGroupModal";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ROLE_COLORS: Record<UserRole, string> = {
  owner: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  admin: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  member: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

interface FcfaBadgeIconProps {
  className?: string;
}

const FcfaBadgeIcon: React.FC<FcfaBadgeIconProps> = ({ className }) => (
  <span className={`text-[9px] font-black bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded border border-amber-500/40 leading-none shrink-0 ${className || ""}`}>
    FCFA
  </span>
);

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { role, setRole, canSeeMembers, canSeeReputation } = useUserRole();
  const { groups, activeGroupId, setActiveGroupId, activeGroup, deleteGroup } = useGroups();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<"auto" | "mobile" | "tablet">("auto");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const roleLabels: Record<UserRole, string> = {
    owner: t("roleOwner"),
    admin: t("roleAdmin"),
    member: t("roleMember"),
  };

  const navItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "groups", label: t("groupsTab"), icon: Building2 },
    ...(canSeeReputation ? [{ id: "reputation", label: t("reputationTab"), icon: ShieldAlert }] : []),
    ...(canSeeMembers ? [{ id: "account", label: t("accountTab"), icon: Users }] : []),
    { id: "pricing", label: t("pricing"), icon: Tag },
  ];

  const mainContainerClass = {
    auto: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6",
    tablet: "w-full max-w-[768px] mx-auto px-4 py-6 pb-24 border-x border-slate-200 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-950/95 my-4 rounded-2xl",
    mobile: "w-full max-w-[390px] mx-auto px-2 py-4 pb-24 border-x border-slate-200 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-950/95 my-4 rounded-3xl",
  }[deviceMode];

  return (
    <div className="page-wrapper min-h-screen flex flex-col text-slate-900 dark:text-slate-100 relative">

      {/* Tester Bar (Aperçu Écran Switcher) */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold">📱 TEST APERÇU ÉCRAN :</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setDeviceMode("auto")}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 font-bold transition-all ${
              deviceMode === "auto" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> Auto (Fluid)
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 font-bold transition-all ${
              deviceMode === "tablet" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablette (768px)
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 font-bold transition-all ${
              deviceMode === "mobile" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile (390px)
          </button>
        </div>
      </div>

      {/* Top Header Mobile / Tablette (avec Bouton 3 petits points & Menu) */}
      <div className={`flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 sticky top-10 z-40 ${
        deviceMode === "auto" ? "lg:hidden" : ""
      }`}>
        <div className="flex items-center gap-2">
          <LogoIcon size={32} />
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Tontine <span className="text-amber-500 font-black">bɔkun</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />

          {/* Bouton Changer Thème (Clair ☀️ / Sombre 🌙) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Changer le thème Clair / Sombre"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          {/* Bouton 3 petits points / Menu déroulant */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Menu & Options"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* Fond Voilé d'arrière-plan quand le Menu est ouvert */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      <div className="flex-1 flex">
        {/* Left Sidebar / Drawer Menu (Ouvre proprement au clic sur les 3 petits points) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
            deviceMode === "auto" ? "lg:static lg:translate-x-0" : ""
          } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="space-y-6">

            {/* Header du Menu Tiroir avec Bouton Fermer */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <LogoIcon size={38} />
                <div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block">
                    Tontine <span className="text-amber-500 font-black">bɔkun</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                    Tontine 2.0 Africa
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Group Selector Dropdown */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {t("activeGroupLabel")}
              </div>
              <select
                value={activeGroupId}
                onChange={(e) => setActiveGroupId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              {/* Member Self-Registration Button */}
              {activeGroup && (
                <button
                  onClick={() => {
                    setIsJoinModalOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full mt-2 py-2 px-2.5 rounded-xl btn-mango-gold text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>S&apos;inscrire à ce groupe</span>
                </button>
              )}

              {/* Delete Group Button (Admin/Owner Only) */}
              {activeGroup && (role === "owner" || role === "admin") && (
                <button
                  onClick={async () => {
                    if (window.confirm(`Voulez-vous vraiment supprimer définitivement le groupe "${activeGroup.name}" ? Cette action est irréversible.`)) {
                      await deleteGroup(activeGroup.id);
                      setSidebarOpen(false);
                    }
                  }}
                  className="w-full mt-2 py-2 px-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white font-extrabold text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer le groupe</span>
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{t("viewAs")} (Démo)</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="owner">{t("roleOwner")}</option>
                <option value="admin">{t("roleAdmin")}</option>
                <option value="member">{t("roleMember")}</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                🌍 Choix de la Langue
              </div>
              <div className="flex items-center justify-between gap-2">
                <LanguageSelector />
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  {mounted && theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Container */}
        <main className={`flex-1 transition-all ${mainContainerClass}`}>
          {children}
        </main>
      </div>

      {/* MOBILE / TABLETTE BOTTOM FIXED NAVIGATION BAR */}
      <div className={`fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 py-2.5 px-3 z-40 flex items-center justify-around shadow-2xl backdrop-blur-lg ${
        deviceMode === "mobile" ? "flex" : (deviceMode === "auto" ? "flex sm:hidden" : "hidden")
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive ? "text-amber-500 font-extrabold scale-105" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Member Self-Registration Modal */}
      <JoinGroupModal group={activeGroup} isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
};
