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
  proofUrl?: string;
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
  potProofUrl?: string;
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

export const INITIAL_GROUPS: TontineGroup[] = [];
