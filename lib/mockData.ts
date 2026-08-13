export interface Member {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  position: number;
  role: "admin" | "member";
  paidCount: number;
  totalDue: number;
}

export interface Contribution {
  memberId: string;
  memberName: string;
  amount: number;
  status: "paid" | "pending" | "late";
  paidAt?: string;
}

export interface Meeting {
  id: string;
  meetingNumber: number;
  date: string;
  location: string;
  beneficiaryId: string;
  beneficiaryName: string;
  potAmount: number;
  status: "upcoming" | "in_progress" | "completed";
  contributions: Contribution[];
}

export interface TontineGroup {
  id: string;
  name: string;
  contributionAmount: number;
  currency: string;
  frequency: string;
  cycleNumber: number;
  totalPot: number;
  members: Member[];
  meetings: Meeting[];
}

export const INITIAL_GROUPS: TontineGroup[] = [
  {
    id: "group-1",
    name: "Tontine Solidarité (Abidjan - Treichville)",
    contributionAmount: 10000,
    currency: "FCFA",
    frequency: "Mensuelle",
    cycleNumber: 1,
    totalPot: 60000,
    members: [
      { id: "m1", name: "Amina Koné", phone: "+225 07 01 02 03", avatar: "👩🏾‍💼", position: 1, role: "admin", paidCount: 4, totalDue: 0 },
      { id: "m2", name: "Kofi Kouassi", phone: "+225 05 04 05 06", avatar: "👨🏾‍💼", position: 2, role: "member", paidCount: 4, totalDue: 0 },
      { id: "m3", name: "Mama Adjoa", phone: "+225 01 07 08 09", avatar: "👵🏾", position: 3, role: "member", paidCount: 3, totalDue: 10000 },
      { id: "m4", name: "Yao N'Guessan", phone: "+225 07 10 11 12", avatar: "👨🏾", position: 4, role: "member", paidCount: 4, totalDue: 0 },
      { id: "m5", name: "Fatou Bamba", phone: "+225 05 13 14 15", avatar: "👩🏾", position: 5, role: "member", paidCount: 2, totalDue: 20000 },
      { id: "m6", name: "Jean-Baptiste Dossou", phone: "+229 97 01 02 03", avatar: "👨🏾‍🌾", position: 6, role: "member", paidCount: 4, totalDue: 0 },
    ],
    meetings: [
      {
        id: "mt-4",
        meetingNumber: 4,
        date: "5 Août 2026",
        location: "Abidjan, Treichville Avenue 8 (Chez Mama Adjoa)",
        beneficiaryId: "m3",
        beneficiaryName: "Mama Adjoa",
        potAmount: 60000,
        status: "in_progress",
        contributions: [
          { memberId: "m1", memberName: "Amina Koné", amount: 10000, status: "paid", paidAt: "01/08/2026" },
          { memberId: "m2", memberName: "Kofi Kouassi", amount: 10000, status: "paid", paidAt: "02/08/2026" },
          { memberId: "m3", memberName: "Mama Adjoa", amount: 10000, status: "paid", paidAt: "03/08/2026" },
          { memberId: "m4", memberName: "Yao N'Guessan", amount: 10000, status: "paid", paidAt: "04/08/2026" },
          { memberId: "m5", memberName: "Fatou Bamba", amount: 10000, status: "late" },
          { memberId: "m6", memberName: "Jean-Baptiste Dossou", amount: 10000, status: "pending" },
        ],
      },
    ],
  },
];
