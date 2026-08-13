"use client";

import React, { useState } from "react";
import { User, Phone, Mail, CreditCard, X, ShieldAlert, Send } from "lucide-react";
import { useGroups } from "@/lib/GroupContext";
import { useLanguage } from "@/lib/LanguageContext";
import { TontineGroup } from "@/lib/mockData";
import { MOCK_REPUTATIONS, isMemberBlockedGlobally } from "@/lib/reputationSystem";

interface JoinGroupModalProps {
  group: TontineGroup | null;
  isOpen: boolean;
  onClose: () => void;
}

const MOMO_PROVIDERS = ["Orange Money", "Wave", "MTN MoMo", "Moov Money"];

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ group, isOpen, onClose }) => {
  const { submitJoinRequest } = useGroups();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [momoProvider, setMomoProvider] = useState("Orange Money");
  const [message, setMessage] = useState("");

  if (!isOpen || !group) return null;

  // Real-time check if member has unresolved debts in another group
  const matchedRep = MOCK_REPUTATIONS.find((r) => {
    const reqCleanPhone = (phone || "").replace(/\s+/g, "");
    const repPhone = (r.identity?.phone || "").replace(/\s+/g, "");
    const phoneMatch = reqCleanPhone.length > 5 && repPhone.length > 5 && repPhone.includes(reqCleanPhone);
    const emailMatch = !!email && !!r.identity?.email && r.identity.email.toLowerCase() === email.toLowerCase();
    return phoneMatch || emailMatch;
  });
  const isBlocked = matchedRep ? isMemberBlockedGlobally(matchedRep.memberId) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const ok = submitJoinRequest(group.id, name, phone, email, momoNumber, momoProvider, message);
    if (ok) {
      setName("");
      setPhone("");
      setEmail("");
      setMomoNumber("");
      setMessage("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">{t("joinRequestTitle")}</span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("joinHeader")} {group.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Visual Illustration Banner */}
        <div className="w-full h-28 rounded-2xl overflow-hidden shadow-sm border border-amber-500/30 shrink-0">
          <img src="/join_group.jpg" alt="Rejoindre la tontine" className="w-full h-full object-cover" />
        </div>

        {/* Reputation Warning Banner if candidate has debt */}
        {isBlocked && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Bloqué par le système de réputation inter-groupes
            </div>
            <p className="text-[11px] leading-relaxed">
              Vous avez un retard de paiement non réglé dans &quot;{matchedRep?.blockedReason}&quot;. Réglez votre amende pour pouvoir soumettre une demande.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Termes & Clauses d&apos;Adhésion au Groupe</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 font-medium">
              <div>• <strong>Cotisation Pot :</strong> {group.contributionAmount.toLocaleString("fr-FR")} FCFA + <strong>100 FCFA</strong> (Frais plateforme) = <strong>{(group.contributionAmount + 100).toLocaleString("fr-FR")} FCFA Total</strong>.</div>
              <div>• <strong>Commission Propriétaire :</strong> Taux de <strong>5% mensuel</strong> réservé au fondateur du groupe sur la cagnotte lors du tirage.</div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("yourFullNameLabel")}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Kouamé N'Dri"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Phone */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("yourPhoneLabel")}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 00 00 00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("emailOptionalLabel")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          {/* MoMo */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("momoLabel")}</label>
            <div className="flex gap-2">
              <select
                value={momoProvider}
                onChange={(e) => setMomoProvider(e.target.value)}
                className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              >
                {MOMO_PROVIDERS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input
                type="text"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="Numéro Mobile Money"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">{t("messageAdminLabel")}</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isBlocked}
              className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                isBlocked
                  ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
              }`}
            >
              <Send className="w-4 h-4" /> {t("sendRequestBtn")}
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
