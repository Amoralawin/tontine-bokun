"use client";

import React from "react";
import { Sun, Moon, Users, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import { useUserRole, UserRole } from "@/lib/UserRoleContext";
import { LanguageSelector } from "./LanguageSelector";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { LogoIcon } from "./LogoIcon";

const ROLE_COLORS: Record<UserRole, string> = {
  owner: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  admin: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  member: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export const Navbar: React.FC<{ activeTab?: string; setActiveTab?: (tab: string) => void }> = ({
  activeTab = "home",
  setActiveTab,
}) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { role, setRole, canSeeMembers, canSeeReputation } = useUserRole();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const roleLabels: Record<UserRole, string> = {
    owner: t("roleOwner"),
    admin: t("roleAdmin"),
    member: t("roleMember"),
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={38} />
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Tontine <span className="text-amber-600 dark:text-yellow-400 font-black">bɔkun</span>
              </span>
              <span className="hidden sm:block text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider leading-none">
                Tontine 2.0 Africa
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab && setActiveTab("home")}
            className={`hover:text-amber-600 dark:hover:text-yellow-400 transition-colors ${activeTab === "home" ? "text-amber-600 dark:text-yellow-400 font-bold" : ""}`}
          >
            {t("dashboard")}
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("features")}
            className={`hover:text-amber-600 dark:hover:text-yellow-400 transition-colors ${activeTab === "features" ? "text-amber-600 dark:text-yellow-400 font-bold" : ""}`}
          >
            {t("features")}
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("pricing")}
            className={`hover:text-amber-600 dark:hover:text-yellow-400 transition-colors ${activeTab === "pricing" ? "text-amber-600 dark:text-yellow-400 font-bold" : ""}`}
          >
            {t("pricing")}
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab("groups")}
            className={`hover:text-amber-600 dark:hover:text-yellow-400 transition-colors flex items-center gap-1.5 ${activeTab === "groups" ? "text-amber-600 dark:text-yellow-400 font-bold" : ""}`}
          >
            <span>🏦</span>
            <span>{t("groupsTab")}</span>
          </button>

          {/* Réputation — admin/owner seulement */}
          {canSeeReputation && (
            <button
              onClick={() => setActiveTab && setActiveTab("reputation")}
              className={`hover:text-red-500 transition-colors flex items-center gap-1.5 ${activeTab === "reputation" ? "text-red-500 font-bold" : ""}`}
            >
              <span>🛡️</span>
              <span>{t("reputationTab")}</span>
            </button>
          )}

          {/* Membres — admin/owner seulement */}
          {canSeeMembers && (
            <button
              onClick={() => setActiveTab && setActiveTab("account")}
              className={`hover:text-amber-600 dark:hover:text-yellow-400 transition-colors flex items-center gap-1.5 ${activeTab === "account" ? "text-amber-600 dark:text-yellow-400 font-bold" : ""}`}
            >
              <span>👤</span>
              <span>{t("accountTab")}</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">

          {/* Sélecteur de rôle (démo) */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${ROLE_COLORS[role]}`}
              title={t("viewAs")}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{roleLabels[role]}</span>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 top-10 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-1.5 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("viewAs")}</div>
                {(["owner", "admin", "member"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      role === r ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TTS */}
          <TTSVoiceReader
            textToRead="Bienvenue sur Tontine bɔkun."
            variant="mini"
          />

          {/* Language */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Changer de thème"
          >
            {mounted && theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* CTA */}
          <button
            onClick={() => setActiveTab && setActiveTab("dashboard")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs btn-mango-gold transition-all hover:scale-105"
          >
            <Users className="w-4 h-4" />
            <span>{t("getStarted")}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
