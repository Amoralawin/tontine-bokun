// Système de réputation inter-groupes et moteur de pénalités automatiques

export type ReputationLevel = "excellent" | "good" | "warning" | "restricted" | "blocked";

export interface MemberIdentity {
  phone?: string;
  email?: string;
  momoNumber?: string;
  momoProvider?: "orange_money" | "wave" | "mtn_momo" | "moov_money";
  nationalId?: string;
}

export interface PenaltyRecord {
  id: string;
  groupId: string;
  groupName: string;
  meetingNumber: number;
  contributionAmount: number;
  daysLate: number;
  penaltyRate: number;
  penaltyAmount: number;
  status: "pending" | "paid" | "disputed";
  createdAt: string;
  paidAt?: string;
}

export interface ReputationEvent {
  id: string;
  type: "on_time" | "late" | "unpaid" | "excluded" | "rehabilitated";
  groupName: string;
  description: string;
  scoreChange: number;
  date: string;
}

export interface MemberReputation {
  memberId: string;
  memberName: string;
  identity: MemberIdentity;
  score: number;
  level: ReputationLevel;
  totalGroupsJoined: number;
  totalOnTime: number;
  totalLate: number;
  totalUnpaid: number;
  pendingPenalties: PenaltyRecord[];
  paidPenalties: PenaltyRecord[];
  reputationHistory: ReputationEvent[];
  blockedSince?: string;
  blockedReason?: string;
  unblockRequestPending?: boolean;
  totalPenaltiesOwed: number;
  totalPenaltiesPaid: number;
}

// ─── Calcul du taux de pénalité selon les jours de retard ───────────────────
export function getPenaltyRate(daysLate: number): number {
  if (daysLate <= 0) return 0;
  if (daysLate <= 7) return 0.05;   // 5%
  if (daysLate <= 15) return 0.07;  // 7%
  return 0.10;                       // 10%
}

export function calculatePenalty(contributionAmount: number, daysLate: number): number {
  const rate = getPenaltyRate(daysLate);
  return Math.round(contributionAmount * rate);
}

// ─── Niveau de réputation selon le score ────────────────────────────────────
export function getReputationLevel(score: number): ReputationLevel {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "warning";
  if (score >= 30) return "restricted";
  return "blocked";
}

export function getReputationConfig(level: ReputationLevel) {
  const configs = {
    excellent: {
      label: "Excellent payeur",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      badge: "🟢",
      description: "Accès libre à tous les groupes",
      canJoin: true,
    },
    good: {
      label: "Bon payeur",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      badge: "🔵",
      description: "Dépôt de garantie suggéré",
      canJoin: true,
    },
    warning: {
      label: "Retards fréquents",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      badge: "🟡",
      description: "Alerte envoyée à l'admin",
      canJoin: true,
    },
    restricted: {
      label: "Mauvais payeur",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      badge: "🟠",
      description: "Approbation admin requise",
      canJoin: false,
    },
    blocked: {
      label: "BLOQUÉ",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      badge: "🔴",
      description: "Interdit de tout nouveau groupe",
      canJoin: false,
    },
  };
  return configs[level];
}

// ─── Données de démonstration ─────────────────────────────────────────────────
export const MOCK_REPUTATIONS: MemberReputation[] = [
  {
    memberId: "m1",
    memberName: "Amina Koné",
    identity: {
      phone: "+225 07 01 02 03",
      email: "amina.kone@gmail.com",
      momoNumber: "0701020304",
      momoProvider: "orange_money",
    },
    score: 95,
    level: "excellent",
    totalGroupsJoined: 3,
    totalOnTime: 18,
    totalLate: 0,
    totalUnpaid: 0,
    pendingPenalties: [],
    paidPenalties: [],
    reputationHistory: [
      { id: "rh1", type: "on_time", groupName: "Tontine des Mamans d'Abidjan", description: "Paiement à temps — Réunion #4", scoreChange: +5, date: "04/08/2026" },
      { id: "rh2", type: "on_time", groupName: "Tontine des Mamans d'Abidjan", description: "Paiement à temps — Réunion #3", scoreChange: +5, date: "04/07/2026" },
    ],
    totalPenaltiesOwed: 0,
    totalPenaltiesPaid: 0,
  },
  {
    memberId: "m2",
    memberName: "Kofi Kouassi",
    identity: {
      phone: "+225 05 04 05 06",
      email: "kofi.kouassi@yahoo.fr",
      momoNumber: "0504050607",
      momoProvider: "wave",
    },
    score: 82,
    level: "good",
    totalGroupsJoined: 2,
    totalOnTime: 12,
    totalLate: 1,
    totalUnpaid: 0,
    pendingPenalties: [],
    paidPenalties: [
      {
        id: "p-old-1",
        groupId: "group-1",
        groupName: "Tontine des Mamans d'Abidjan",
        meetingNumber: 2,
        contributionAmount: 150000,
        daysLate: 5,
        penaltyRate: 0.05,
        penaltyAmount: 7500,
        status: "paid",
        createdAt: "10/06/2026",
        paidAt: "14/06/2026",
      },
    ],
    reputationHistory: [
      { id: "rh3", type: "late", groupName: "Tontine des Mamans d'Abidjan", description: "Paiement en retard de 5 jours — Réunion #2 — Pénalité: 7 500 FCFA", scoreChange: -10, date: "10/06/2026" },
      { id: "rh4", type: "rehabilitated", groupName: "Système", description: "3 mois sans incident — Score restauré", scoreChange: +15, date: "01/07/2026" },
    ],
    totalPenaltiesOwed: 0,
    totalPenaltiesPaid: 7500,
  },
  {
    memberId: "m5",
    memberName: "Fatou Bamba",
    identity: {
      phone: "+225 05 13 14 15",
      email: "fatou.bamba@gmail.com",
      momoNumber: "0513141516",
      momoProvider: "mtn_momo",
    },
    score: 38,
    level: "restricted",
    totalGroupsJoined: 3,
    totalOnTime: 6,
    totalLate: 4,
    totalUnpaid: 2,
    pendingPenalties: [
      {
        id: "p1",
        groupId: "group-1",
        groupName: "Tontine des Mamans d'Abidjan",
        meetingNumber: 3,
        contributionAmount: 150000,
        daysLate: 18,
        penaltyRate: 0.10,
        penaltyAmount: 15000,
        status: "pending",
        createdAt: "08/07/2026",
      },
      {
        id: "p2",
        groupId: "group-2",
        groupName: "Tontine Entraide Cocody",
        meetingNumber: 1,
        contributionAmount: 100000,
        daysLate: 12,
        penaltyRate: 0.07,
        penaltyAmount: 7000,
        status: "pending",
        createdAt: "15/06/2026",
      },
    ],
    paidPenalties: [],
    reputationHistory: [
      { id: "rh5", type: "late", groupName: "Tontine des Mamans d'Abidjan", description: "Retard 18 jours — Réunion #3 — Pénalité: 15 000 FCFA", scoreChange: -25, date: "08/07/2026" },
      { id: "rh6", type: "late", groupName: "Tontine Entraide Cocody", description: "Retard 12 jours — Réunion #1 — Pénalité: 7 000 FCFA", scoreChange: -10, date: "15/06/2026" },
      { id: "rh7", type: "unpaid", groupName: "Tontine Femmes du Plateau", description: "Non-paiement confirmé — Exclue du groupe", scoreChange: -25, date: "10/05/2026" },
    ],
    totalPenaltiesOwed: 22000,
    totalPenaltiesPaid: 0,
  },
  {
    memberId: "m-ext-1",
    memberName: "Koffi Adjanou",
    identity: {
      phone: "+229 97 88 77 66",
      email: "koffi.adjanou@gmail.com",
      momoNumber: "97887766",
      momoProvider: "mtn_momo",
    },
    score: 15,
    level: "blocked",
    totalGroupsJoined: 4,
    totalOnTime: 5,
    totalLate: 7,
    totalUnpaid: 4,
    blockedSince: "01/07/2026",
    blockedReason: "Non-paiement dans 2 groupes + exclusion confirmée",
    unblockRequestPending: true,
    pendingPenalties: [
      {
        id: "p3",
        groupId: "group-ext-1",
        groupName: "Tontine Cotonou Prospérité",
        meetingNumber: 5,
        contributionAmount: 200000,
        daysLate: 45,
        penaltyRate: 0.10,
        penaltyAmount: 20000,
        status: "pending",
        createdAt: "15/05/2026",
      },
      {
        id: "p4",
        groupId: "group-ext-2",
        groupName: "Tontine Femmes de Porto-Novo",
        meetingNumber: 3,
        contributionAmount: 150000,
        daysLate: 38,
        penaltyRate: 0.10,
        penaltyAmount: 15000,
        status: "pending",
        createdAt: "01/06/2026",
      },
    ],
    paidPenalties: [],
    reputationHistory: [
      { id: "rh8", type: "excluded", groupName: "Tontine Cotonou Prospérité", description: "Exclusion pour non-paiement répété", scoreChange: -40, date: "01/07/2026" },
      { id: "rh9", type: "unpaid", groupName: "Tontine Femmes de Porto-Novo", description: "Retard 38 jours — Non-paiement", scoreChange: -25, date: "01/06/2026" },
    ],
    totalPenaltiesOwed: 35000,
    totalPenaltiesPaid: 0,
  },
];

// ─── Revenus pénalités propriétaire ──────────────────────────────────────────
export const PLATFORM_REVENUE = {
  totalPenaltiesCollected: 7500,
  pendingPenalties: 57000,
  totalBlockedMembers: 1,
  totalFlaggedMembers: 2,
  monthlyRevenue: [
    { month: "Mai 2026", amount: 0 },
    { month: "Juin 2026", amount: 7500 },
    { month: "Juil. 2026", amount: 0 },
    { month: "Août 2026", amount: 0 },
  ],
};

export function isMemberBlockedGlobally(memberId: string): boolean {
  const member = MOCK_REPUTATIONS.find((r) => r.memberId === memberId);
  if (!member) return false;
  return member.level === "blocked" || member.totalPenaltiesOwed > 0;
}

export function getOrCreateMemberReputation(
  member: { id: string; name: string; phone: string; email?: string; paidCount: number; totalDue: number },
  group?: { id: string; name: string; contributionAmount: number; meetings: any[] }
): MemberReputation {
  // Calculate dynamically for local member
  let totalOnTime = member.paidCount;
  let totalLate = 0;
  let totalUnpaid = member.totalDue > 0 ? 1 : 0;
  let history: any[] = [];

  if (group) {
    totalOnTime = 0;
    totalLate = 0;
    totalUnpaid = 0;
    group.meetings.forEach((m: any) => {
      const contribution = m.contributions.find((c: any) => c.memberId === member.id);
      if (contribution) {
        const dateStr = m.date || new Date().toLocaleDateString("fr-FR");
        if (contribution.status === "paid") {
          totalOnTime += 1;
          history.push({
            id: `h-paid-${m.id}`,
            date: dateStr,
            type: "on_time",
            description: `Cotisation payée à temps pour la réunion #${m.meetingNumber}`,
            scoreChange: 5,
          });
        } else if (contribution.status === "late") {
          totalLate += 1;
          history.push({
            id: `h-late-${m.id}`,
            date: dateStr,
            type: "late",
            description: `Retard de paiement pour la réunion #${m.meetingNumber}`,
            scoreChange: -15,
          });
        } else if (contribution.status === "pending") {
          totalUnpaid += 1;
          history.push({
            id: `h-unpaid-${m.id}`,
            date: dateStr,
            type: "unpaid",
            description: `Cotisation impayée pour la réunion #${m.meetingNumber}`,
            scoreChange: -25,
          });
        }
      }
    });
  }

  // Calculate score starting at 80
  let score = 80 + (totalOnTime * 5) - (totalLate * 15) - (totalUnpaid * 25);
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // Check global database matching for overrides
  const globalRep = MOCK_REPUTATIONS.find((r) => {
    const cleanPhone = (member.phone || "").replace(/\s+/g, "");
    const repPhone = (r.identity?.phone || "").replace(/\s+/g, "");
    const phoneMatch = cleanPhone.length > 5 && repPhone.length > 5 && repPhone.includes(cleanPhone);
    const emailMatch = !!member.email && !!r.identity?.email && r.identity.email.toLowerCase() === member.email.toLowerCase();
    const nameMatch = member.name.toLowerCase() === r.memberName.toLowerCase();
    return phoneMatch || emailMatch || nameMatch;
  });

  let level = getReputationLevel(score);
  let blockedReason = undefined;
  let unblockRequestPending = false;

  if (globalRep) {
    if (globalRep.level === "blocked" || globalRep.level === "restricted") {
      level = globalRep.level;
      blockedReason = globalRep.blockedReason;
      unblockRequestPending = !!globalRep.unblockRequestPending;
      if (globalRep.level === "blocked") {
        score = Math.min(score, 30);
      }
    }
    // Merge mock history to show a full timeline
    if (globalRep.reputationHistory && globalRep.reputationHistory.length > 0) {
      history = [...history, ...globalRep.reputationHistory];
    }
  }

  // Calculate penalties owed dynamically
  let totalPenaltiesOwed = 0;
  if (group) {
    group.meetings.forEach((m: any) => {
      const contribution = m.contributions.find((c: any) => c.memberId === member.id);
      if (contribution && contribution.status === "late") {
        totalPenaltiesOwed += Math.round(group.contributionAmount * 0.05);
      }
    });
  }

  return {
    memberId: member.id,
    memberName: member.name,
    identity: {
      phone: member.phone,
      email: member.email,
    },
    score,
    level,
    totalGroupsJoined: globalRep ? globalRep.totalGroupsJoined : 1,
    totalOnTime,
    totalLate,
    totalUnpaid,
    pendingPenalties: globalRep ? globalRep.pendingPenalties : [],
    paidPenalties: globalRep ? globalRep.paidPenalties : [],
    reputationHistory: history,
    totalPenaltiesOwed: totalPenaltiesOwed || (globalRep ? globalRep.totalPenaltiesOwed : 0),
    totalPenaltiesPaid: globalRep ? globalRep.totalPenaltiesPaid : 0,
    blockedReason,
    unblockRequestPending,
  };
}

