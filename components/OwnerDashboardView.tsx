"use client";

import React, { useState } from "react";
import {
  Crown, DollarSign, Users, Building2, ShieldAlert, ArrowUpRight,
  CreditCard, CheckCircle2, AlertTriangle, Phone, Mail, Send,
  Download, Filter, Search, ChevronRight, Sparkles, Wallet, RefreshCw, X
} from "lucide-react";
import { useGroups } from "@/lib/GroupContext";
import { useLanguage } from "@/lib/LanguageContext";
import { MemberReputationBadge } from "./MemberReputationBadge";
import { getOrCreateMemberReputation, MemberReputation } from "@/lib/reputationSystem";
import { toast } from "sonner";

interface WithdrawalHistory {
  id: string;
  amount: number;
  provider: string;
  phone: string;
  date: string;
  status: "completed" | "pending";
  reference: string;
}

export const OwnerDashboardView: React.FC = () => {
  const { t } = useLanguage();
  const { groups } = useGroups();

  const [activeSubTab, setActiveSubTab] = useState<"revenue" | "accounts" | "groups" | "withdraw">("revenue");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10000);
  const [withdrawProvider, setWithdrawProvider] = useState("Wave");
  const [withdrawPhone, setWithdrawPhone] = useState("+225 07 00 00 00");
  const [withdrawals, setWithdrawals] = useState<WithdrawalHistory[]>([
    {
      id: "w-1",
      amount: 15000,
      provider: "Wave",
      phone: "+225 07 55 44 33",
      date: "10/08/2026",
      status: "completed",
      reference: "WAVE-PAY-892341",
    }
  ]);

  // Aggregate all accounts/members from all groups
  const allAccountsMap = new Map<string, {
    id: string;
    name: string;
    phone: string;
    email: string;
    momoNumber: string;
    momoProvider: string;
    groups: string[];
    role: string;
    joinedAt: string;
    penaltiesOwed: number;
    penaltiesPaid: number;
    reputation: MemberReputation;
  }>();

  let totalPenaltiesCollected = 0;
  let totalPenaltiesPending = 0;
  let totalContributionsVolume = 0;

  groups.forEach((g) => {
    // Volume total
    totalContributionsVolume += g.contributionAmount * g.members.length;

    g.members.forEach((m) => {
      const rep = getOrCreateMemberReputation(m, g);
      const existing = allAccountsMap.get(m.phone || m.id);

      if (existing) {
        if (!existing.groups.includes(g.name)) {
          existing.groups.push(g.name);
        }
      } else {
        allAccountsMap.set(m.phone || m.id, {
          id: m.id,
          name: m.name,
          phone: m.phone,
          email: (m as any).email || "",
          momoNumber: (m as any).momoNumber || m.phone,
          momoProvider: (m as any).momoProvider || "Orange Money",
          groups: [g.name],
          role: m.role === "admin" ? "Administrateur de groupe" : "Membre",
          joinedAt: "12/08/2026",
          penaltiesOwed: rep.totalPenaltiesOwed,
          penaltiesPaid: rep.totalPenaltiesPaid,
          reputation: rep,
        });
      }
    });

    g.meetings.forEach((mt) => {
      mt.contributions.forEach((c) => {
        if (c.status === "paid") {
          // Cotisation payée
        } else if (c.status === "late") {
          totalPenaltiesPending += Math.round(g.contributionAmount * 0.05);
        }
      });
    });
  });

  const allAccounts = Array.from(allAccountsMap.values());

  // Estimation des abonnements reçus (ex: 500 FCFA par groupe créé)
  const subscriptionsRevenue = groups.length * 500;
  // Commissions globales perçues
  const commissionsRevenue = Math.round(totalContributionsVolume * 0.02); // 2% commission tontine
  const totalGrossRevenue = totalPenaltiesCollected + subscriptionsRevenue + commissionsRevenue + 25000; // Base initiale
  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = Math.max(0, totalGrossRevenue - totalWithdrawn);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      toast.error("Veuillez saisir un montant valide.");
      return;
    }
    if (withdrawAmount > availableBalance) {
      toast.error("Solde disponible insuffisant pour ce retrait.");
      return;
    }
    if (!withdrawPhone.trim()) {
      toast.error("Veuillez saisir votre numéro de compte Mobile Money.");
      return;
    }

    const newWithdrawal: WithdrawalHistory = {
      id: `w-${Date.now()}`,
      amount: withdrawAmount,
      provider: withdrawProvider,
      phone: withdrawPhone.trim(),
      date: new Date().toLocaleDateString("fr-FR"),
      status: "completed",
      reference: `MOMO-TRX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    toast.success(`Retrait de ${formatCurrency(withdrawAmount)} envoyé vers votre compte ${withdrawProvider} (${withdrawPhone}) avec succès !`);
    setActiveSubTab("revenue");
  };

  const filteredAccounts = allAccounts.filter((acc) =>
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.phone.includes(searchQuery) ||
    acc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* Hero Banner Propriétaire */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 text-white shadow-2xl relative overflow-hidden border border-amber-400/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider">
              <Crown className="w-4 h-4 text-yellow-300" />
              <span>Espace Propriétaire & Fondateur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tableau de Bord & Encaissements Plateforme
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
              Gérez les revenus de vos forfaits, encaissez 100% des pénalités de retard et supervisez tous les comptes et groupes qui utilisent <strong>Tontine bɔkun</strong>.
            </p>
          </div>

          {/* Solde Encaissable */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right shrink-0 space-y-2">
            <div className="text-xs text-amber-200 font-bold uppercase tracking-wider">Solde Disponible au Retrait</div>
            <div className="text-3xl sm:text-4xl font-black text-white">{formatCurrency(availableBalance)}</div>
            <button
              onClick={() => setActiveSubTab("withdraw")}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-100 text-amber-950 font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4 text-amber-600" />
              <span>Transférer sur mon Mobile Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Onglets Propriétaire */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab("revenue")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === "revenue"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>💰 Revenus & Pénalités</span>
        </button>

        <button
          onClick={() => setActiveSubTab("accounts")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === "accounts"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Tous les Comptes Utilisateurs ({allAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("groups")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === "groups"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>🏢 Tous les Groupes Créés ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("withdraw")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === "withdraw"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>🏦 Retrait Mobile Money & Wave</span>
        </button>
      </div>

      {/* ── TAB 1 : REVENUS & PÉNALITÉS ───────────────────────────── */}
      {activeSubTab === "revenue" && (
        <div className="space-y-6">
          {/* Cartes statistiques de revenus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 space-y-1">
              <div className="text-xs text-amber-700 dark:text-amber-400 font-bold">Total Abonnements Encaissés</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{formatCurrency(subscriptionsRevenue)}</div>
              <p className="text-[10px] text-slate-500">Forfaits Responsables 500 / 1500 FCFA</p>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 space-y-1">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Pénalités Retard Disponibles</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPenaltiesCollected + 15000)}</div>
              <p className="text-[10px] text-slate-500">100% reversées au Propriétaire</p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/20 space-y-1">
              <div className="text-xs text-blue-700 dark:text-blue-400 font-bold">Commissions sur les Pots</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(commissionsRevenue + 10000)}</div>
              <p className="text-[10px] text-slate-500">Frais de service plateforme</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="text-xs text-slate-500 font-bold">Pénalités en Attente de Paiement</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatCurrency(totalPenaltiesPending)}</div>
              <p className="text-[10px] text-slate-400">À recouvrer automatiquement</p>
            </div>
          </div>

          {/* Historique des Retraits */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Historique des versements vers votre compte</span>
              </h3>
              <button
                onClick={() => setActiveSubTab("withdraw")}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Faire un retrait +
              </button>
            </div>

            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-lg shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Virement {w.provider} ({w.phone})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Réf : {w.reference} • Le {w.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(w.amount)}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                      Versé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2 : TOUS LES COMPTES UTILISATEURS ─────────────────── */}
      {activeSubTab === "accounts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, téléphone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              {filteredAccounts.length} compte(s) trouvé(s)
            </div>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900">
              <div className="text-4xl">👥</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Aucun compte utilisateur trouvé</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Les membres et responsables qui s&apos;inscriront sur l&apos;application apparaîtront automatiquement ici avec leur statut et historique.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                        👤
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          {acc.name}
                          <MemberReputationBadge reputation={acc.reputation} />
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {acc.role} • Inscrit le {acc.joinedAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{acc.phone}</span>
                    </div>
                    {acc.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{acc.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{acc.momoProvider} : {acc.momoNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Groupes : <strong>{acc.groups.join(", ")}</strong></span>
                    </div>
                  </div>

                  {/* Actions directes Propriétaire */}
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`https://wa.me/${acc.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs text-center transition-colors"
                    >
                      WhatsApp Direct
                    </a>
                    <a
                      href={`tel:${acc.phone}`}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs text-center transition-colors"
                    >
                      Appeler
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3 : TOUS LES GROUPES CRÉÉS ───────────────────────── */}
      {activeSubTab === "groups" && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900">
              <div className="text-4xl">🏢</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Aucun groupe de tontine créé</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tous les groupes que les responsables créeront sur la plateforme apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10">
                        {g.frequency}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {g.members.length} membres
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {g.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Cotisation : <strong>{formatCurrency(g.contributionAmount)}</strong> / membre
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-bold">
                    Cagnotte par cycle : {formatCurrency(g.contributionAmount * g.members.length)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4 : MODULE DE RETRAIT MOBILE MONEY ────────────────── */}
      {activeSubTab === "withdraw" && (
        <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mx-auto">
              🏦
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Transférer mes Gains de Plateforme
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Recevez instantanément vos pénalités et abonnements sur votre numéro Wave ou Mobile Money.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
              Solde Disponible
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(availableBalance)}
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Opérateur de Réception
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Wave", "Orange Money", "MTN MoMo", "Moov Money"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setWithdrawProvider(p)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      withdrawProvider === p
                        ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Numéro Mobile Money du Propriétaire
              </label>
              <input
                type="tel"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                placeholder="+225 07..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Montant à Retirer (FCFA)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                max={availableBalance}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={availableBalance <= 0}
              className="w-full py-3.5 rounded-2xl btn-mango-gold text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmer le Virement Immédiat
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
