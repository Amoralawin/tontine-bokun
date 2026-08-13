"use client";

import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { useGroups } from "@/lib/GroupContext";
import { useLanguage } from "@/lib/LanguageContext";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const { createGroup } = useGroups();
  const { t } = useLanguage();
  const [groupName, setGroupName] = useState("");
  const [amount, setAmount] = useState<number>(100000);
  const [frequency, setFrequency] = useState("Mensuelle");
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    createGroup(groupName.trim(), Number(amount), frequency, adminName.trim(), adminPhone.trim());
    setGroupName("");
    setAdminName("");
    setAdminPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("createGroupTitle")}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nom du groupe — champ libre personnalisé */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              {t("groupNameLabel")}
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t("groupNamePlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 dark:text-white font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1">{t("groupNameHint")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Montant */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                {t("contributionAmountLabel")}
              </label>
              <input
                type="number"
                required
                min={5000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>

            {/* Fréquence */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("meetingFreqLabel")}</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 dark:text-white"
              >
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Bi-mensuelle">Bi-mensuelle</option>
                <option value="Mensuelle">Mensuelle</option>
              </select>
            </div>
          </div>

          {/* Admin / Créateur info */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="font-bold text-amber-700 dark:text-amber-300 text-xs">{t("creatorInfoTitle")}</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder={t("yourFullNamePlaceholder")}
                className="px-3 py-2 rounded-lg border border-amber-500/30 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder={t("yourPhonePlaceholder")}
                className="px-3 py-2 rounded-lg border border-amber-500/30 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> {t("createGroupBtn")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
            >
              {t("cancelBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
