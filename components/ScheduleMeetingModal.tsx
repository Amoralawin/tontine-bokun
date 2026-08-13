"use client";

import React, { useState } from "react";
import { Calendar, MapPin, User, X, Sparkles, Plus, Clock } from "lucide-react";
import { useGroups } from "@/lib/GroupContext";
import { useLanguage } from "@/lib/LanguageContext";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose }) => {
  const { activeGroup, scheduleMeeting } = useGroups();
  const { t } = useLanguage();

  const [date, setDate] = useState("15 Août 2026 à 16:00");
  const [location, setLocation] = useState("Cocody II Plateaux (Chez l'Admin)");
  const [beneficiaryId, setBeneficiaryId] = useState(activeGroup.members[0]?.id || "");
  const [notes, setNotes] = useState("");

  if (!isOpen || !activeGroup) return null;

  const selectedBeneficiary = activeGroup.members.find((m) => m.id === beneficiaryId) || activeGroup.members[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !location) return;

    scheduleMeeting(
      activeGroup.id,
      date,
      location,
      selectedBeneficiary?.id || "",
      selectedBeneficiary?.name || "Bénéficiaire",
      notes
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {t("scheduleMeetingTitle")}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-amber-700 dark:text-amber-300 text-xs">
              Groupe : {activeGroup.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Cycle #{activeGroup.cycleNumber} • Cagnotte totale :{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {(activeGroup.contributionAmount * activeGroup.members.length).toLocaleString("fr-FR")} FCFA
              </strong>
            </div>
          </div>

          {/* Date & Heure */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              {t("meetingDateLabel")}
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 20 Août 2026 à 15h30"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              {t("meetingLocationLabel")}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Abidjan Cocody ou En ligne (Meet/WhatsApp)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Bénéficiaire du pot */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              {t("selectBeneficiaryLabel")}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 dark:text-white"
              >
                {activeGroup.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name} (Tour #{m.position})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ordre du jour / Notes */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              {t("agendaNotesLabel")}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Apporter les cotisations avant 17h, validation du bénéficiaire..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> {t("saveMeetingBtn")}
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
