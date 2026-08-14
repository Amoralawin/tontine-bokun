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

// ─── Réputation Système (Zéro mock data - 100% calculé sur les vrais membres) ─
export const MOCK_REPUTATIONS: MemberReputation[] = [];

// ─── Revenus pénalités propriétaire ──────────────────────────────────────────
export const PLATFORM_REVENUE = {
  totalPenaltiesCollected: 0,
  pendingPenalties: 0,
  totalBlockedMembers: 0,
  totalFlaggedMembers: 0,
  monthlyRevenue: [],
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

