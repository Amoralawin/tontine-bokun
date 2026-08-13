"use client";

import React, { useState } from "react";
import {
  User, Phone, Mail, CreditCard, Plus, CheckCircle2, Check,
  Users, Edit2, Trash2, Shield, ChevronRight, Save, X
} from "lucide-react";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { MOCK_REPUTATIONS } from "@/lib/reputationSystem";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

interface RegisteredMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  momoNumber: string;
  momoProvider: string;
  groups: string[];
  joinedAt: string;
  avatar: string;
}

const INITIAL_MEMBERS: RegisteredMember[] = [
  {
    id: "m1",
    name: "Amina Koné",
    phone: "+225 07 01 02 03",
    email: "amina.kone@gmail.com",
    momoNumber: "0701020304",
    momoProvider: "Orange Money",
    groups: ["Tontine des Mamans d'Abidjan", "Tontine Femmes Cocody"],
    joinedAt: "12/01/2026",
    avatar: "👩🏾",
  },
  {
    id: "m2",
    name: "Kofi Kouassi",
    phone: "+225 05 04 05 06",
    email: "kofi.kouassi@yahoo.fr",
    momoNumber: "0504050607",
    momoProvider: "Wave",
    groups: ["Tontine des Mamans d'Abidjan"],
    joinedAt: "12/01/2026",
    avatar: "👨🏾",
  },
  {
    id: "m5",
    name: "Fatou Bamba",
    phone: "+225 05 13 14 15",
    email: "fatou.bamba@gmail.com",
    momoNumber: "0513141516",
    momoProvider: "MTN MoMo",
    groups: ["Tontine des Mamans d'Abidjan", "Tontine Entraide Cocody", "Tontine Femmes du Plateau"],
    joinedAt: "03/02/2026",
    avatar: "👩🏿",
  },
];

const MOMO_PROVIDERS = ["Orange Money", "Wave", "MTN MoMo", "Moov Money"];
const GROUPS = [
  "Tontine des Mamans d'Abidjan",
  "Tontine Entraide Cocody",
  "Tontine Femmes du Plateau",
  "Tontine Cotonou Prospérité",
  "Tontine Femmes de Porto-Novo",
];

export const AccountView: React.FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<RegisteredMember[]>(INITIAL_MEMBERS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    momoNumber: "", momoProvider: "Orange Money",
    groups: [] as string[], avatar: "👤",
  });

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", momoNumber: "", momoProvider: "Orange Money", groups: [], avatar: "👤" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (m: RegisteredMember) => {
    setForm({ name: m.name, phone: m.phone, email: m.email, momoNumber: m.momoNumber, momoProvider: m.momoProvider, groups: m.groups, avatar: m.avatar });
    setEditId(m.id);
    setShowForm(true);
    setActiveCard(null);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Membre supprimé.");
    setActiveCard(null);
  };

  const handleToggleGroup = (g: string) => {
    setForm((f) => ({
      ...f,
      groups: f.groups.includes(g) ? f.groups.filter((x) => x !== g) : [...f.groups, g],
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast.error("Le nom et le téléphone sont obligatoires.");
      return;
    }
    if (editId) {
      setMembers((prev) =>
        prev.map((m) => m.id === editId ? { ...m, ...form } : m)
      );
      toast.success("Membre mis à jour !");
    } else {
      const newMember: RegisteredMember = {
        id: `m-${Date.now()}`,
        joinedAt: new Date().toLocaleDateString("fr-FR"),
        ...form,
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success(`${form.name} enregistré(e) avec succès !`);
    }
    resetForm();
  };

  const AVATARS = ["👤", "👩🏾", "👨🏾", "👩🏿", "👨🏿", "👩🏽", "👨🏽", "🧑🏾", "🧒🏾"];

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>{t("memberSpaceTitle")}</span>
            </div>
            <h2 className="text-2xl font-extrabold">{t("memberManagementTitle")}</h2>
            <p className="text-sm text-slate-300 mt-1">
              {t("memberManagementDesc")}
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>{t("newMemberBtn")}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 text-center">
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{members.length}</div>
          <div className="text-xs text-emerald-700/70 dark:text-emerald-500 font-medium">{t("members")}</div>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 text-center">
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{GROUPS.length}</div>
          <div className="text-xs text-amber-700/70 dark:text-amber-500 font-medium">{t("myGroups")}</div>
        </div>
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-50 dark:bg-blue-950/20 text-center">
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400">
            {members.reduce((s, m) => s + m.groups.length, 0)}
          </div>
          <div className="text-xs text-blue-700/70 dark:text-blue-500 font-medium">{t("groupsLabel")}</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {editId ? `✏️ ${t("editMemberTitle")}` : `➕ ${t("addMemberTitle")}`}
            </h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Avatar picker */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 block">{t("avatarLabel")}</label>
            <div className="flex gap-2 flex-wrap">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm((f) => ({ ...f, avatar: a }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2 ${
                    form.avatar === a
                      ? "border-emerald-500 bg-emerald-500/10 scale-110"
                      : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {t("fullNameLabel")}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Amina Koné"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {t("phoneLabel")}
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+225 07 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {t("emailLabel")}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="exemple@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* MoMo */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> {t("momoLabel")}
              </label>
              <div className="flex gap-2">
                <select
                  value={form.momoProvider}
                  onChange={(e) => setForm((f) => ({ ...f, momoProvider: e.target.value }))}
                  className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="orange_money">Orange Money</option>
                  <option value="wave">Wave</option>
                  <option value="mtn_momo">MTN MoMo</option>
                  <option value="moov_money">Moov Money</option>
                </select>
                <input
                  type="text"
                  value={form.momoNumber}
                  onChange={(e) => setForm((f) => ({ ...f, momoNumber: e.target.value }))}
                  placeholder="07 00 00 00 00"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Groups */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 block">
              {t("tontineGroupsLabel")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {GROUPS.map((g) => {
                const isSelected = form.groups.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGroup(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editId ? t("saveChangesBtn") : t("createMemberAccountBtn")}</span>
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t("cancelBtn")}
            </button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Membres enregistrés ({members.length})
        </h3>

        {members.map((m) => {
          const rep = MOCK_REPUTATIONS.find((r) => r.memberId === m.id);
          const isOpen = activeCard === m.id;
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Card header */}
              <div
                className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-950/50 transition-colors"
                onClick={() => setActiveCard(isOpen ? null : m.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-emerald-100 dark:from-amber-950/40 dark:to-emerald-950/40 flex items-center justify-center text-2xl shrink-0">
                    {m.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      {m.name}
                      {rep && <MemberReputationBadge reputation={rep} />}
                    </div>
                    <div className="text-xs text-slate-400">{m.phone} • {m.groups.length} groupe{m.groups.length > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1.5">
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Identité</div>
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{m.email || "—"}</div>
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{m.phone}</div>
                      <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-slate-400" />{m.momoProvider} — {m.momoNumber}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1.5">
                      <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Groupes</div>
                      {m.groups.map((g) => (
                        <div key={g} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rep && <MemberReputationBadge reputation={rep} showDetails />}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => handleEdit(m)}
                      className="flex-1 py-2 rounded-xl border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/10 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="flex-1 py-2 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
