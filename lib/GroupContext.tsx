"use client";

import React, { createContext, useContext, useState } from "react";
import { INITIAL_GROUPS, TontineGroup, Member } from "./mockData";
import { MOCK_REPUTATIONS, isMemberBlockedGlobally } from "./reputationSystem";
import { toast } from "sonner";

export interface JoinRequest {
  id: string;
  groupId: string;
  groupName: string;
  memberName: string;
  phone: string;
  email: string;
  momoNumber: string;
  momoProvider: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

interface GroupContextType {
  groups: TontineGroup[];
  activeGroupId: string;
  activeGroup: TontineGroup;
  setActiveGroupId: (id: string) => void;
  createGroup: (name: string, amount: number, frequency: string, creatorName: string, creatorPhone: string) => void;
  joinRequests: JoinRequest[];
  submitJoinRequest: (groupId: string, memberName: string, phone: string, email: string, momoNumber: string, momoProvider: string, message?: string) => boolean;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  scheduleMeeting: (groupId: string, date: string, location: string, beneficiaryId: string, beneficiaryName: string, notes?: string) => void;
}

const INITIAL_REQUESTS: JoinRequest[] = [
  {
    id: "req-1",
    groupId: "group-1",
    groupName: "Tontine des Mamans d'Abidjan",
    memberName: "Mariam Traoré",
    phone: "+225 07 88 99 00",
    email: "mariam.traore@gmail.com",
    momoNumber: "0788990011",
    momoProvider: "Orange Money",
    message: "Je souhaite rejoindre votre tontine pour le cycle 2. Je suis commerçante à Adjamé.",
    status: "pending",
    requestedAt: "03/08/2026",
  },
];

const GroupContext = createContext<GroupContextType | null>(null);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<TontineGroup[]>(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState<string>(INITIAL_GROUPS[0].id);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(INITIAL_REQUESTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les données depuis localStorage au démarrage (Mode Hors-ligne)
  React.useEffect(() => {
    try {
      const savedGroups = localStorage.getItem("tontine_groups");
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      }
      const savedRequests = localStorage.getItem("tontine_requests");
      if (savedRequests) {
        setJoinRequests(JSON.parse(savedRequests));
      }
      const savedActiveId = localStorage.getItem("tontine_active_group_id");
      if (savedActiveId) {
        setActiveGroupId(savedActiveId);
      }
    } catch (e) {
      console.warn("Erreur chargement localStorage :", e);
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder automatiquement en local lors des modifications
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("tontine_groups", JSON.stringify(groups));
      localStorage.setItem("tontine_requests", JSON.stringify(joinRequests));
      localStorage.setItem("tontine_active_group_id", activeGroupId);
    } catch (e) {
      console.warn("Erreur sauvegarde localStorage :", e);
    }
  }, [groups, joinRequests, activeGroupId, isLoaded]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  // Création d'un nouveau groupe avec nom personnalisé libre
  const createGroup = (name: string, amount: number, frequency: string, creatorName: string, creatorPhone: string) => {
    const newGroup: TontineGroup = {
      id: `group-${Date.now()}`,
      name,
      contributionAmount: amount,
      currency: "FCFA",
      frequency,
      cycleNumber: 1,
      totalPot: amount * 6,
      members: [
        {
          id: `m-admin-${Date.now()}`,
          name: creatorName || "Admin Créateur",
          phone: creatorPhone || "+225 07 00 00 00",
          avatar: "👑",
          position: 1,
          role: "admin",
          paidCount: 1,
          totalDue: 0,
        },
      ],
      meetings: [
        {
          id: `mt-${Date.now()}`,
          meetingNumber: 1,
          date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
          location: "En ligne / Réunion locale",
          beneficiaryId: `m-admin-${Date.now()}`,
          beneficiaryName: creatorName || "Admin Créateur",
          potAmount: amount,
          status: "in_progress",
          contributions: [
            {
              memberId: `m-admin-${Date.now()}`,
              memberName: creatorName || "Admin Créateur",
              amount,
              status: "paid",
              paidAt: new Date().toLocaleDateString("fr-FR"),
            },
          ],
        },
      ],
    };

    setGroups((prev) => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    toast.success(`Le groupe "${name}" a été créé avec succès !`);
  };

  // Soumission d'une demande d'adhésion par un membre
  const submitJoinRequest = (
    groupId: string,
    memberName: string,
    phone: string,
    email: string,
    momoNumber: string,
    momoProvider: string,
    message?: string
  ): boolean => {
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return false;

    // Vérifier si le membre est bloqué pour dette non payée ailleurs
    const existingRep = MOCK_REPUTATIONS.find(
      (r) => r.phone === phone || r.email.toLowerCase() === email.toLowerCase()
    );

    if (existingRep && isMemberBlockedGlobally(existingRep.memberId)) {
      toast.error(`❌ Demande bloquée : Vous avez des impayés non réglés dans le groupe "${existingRep.blockedReason || 'autre groupe'}". Payez votre pénalité pour débloquer l'accès.`);
      return false;
    }

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      groupId,
      groupName: targetGroup.name,
      memberName,
      phone,
      email,
      momoNumber,
      momoProvider,
      message,
      status: "pending",
      requestedAt: new Date().toLocaleDateString("fr-FR"),
    };

    setJoinRequests((prev) => [...prev, newRequest]);
    toast.success(`Demande d'adhésion au groupe "${targetGroup.name}" envoyée ! En attente d'approbation de l'admin.`);
    return true;
  };

  // Approbation d'un membre par l'admin du groupe
  const approveJoinRequest = (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === req.groupId) {
          const newPos = g.members.length + 1;
          const newMember: Member = {
            id: `m-${Date.now()}`,
            name: req.memberName,
            phone: req.phone,
            avatar: "👤",
            position: newPos,
            role: "member",
            paidCount: 0,
            totalDue: g.contributionAmount,
          };
          return {
            ...g,
            members: [...g.members, newMember],
          };
        }
        return g;
      })
    );

    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r))
    );
    toast.success(`✅ ${req.memberName} a été approuvé(e) et ajouté(e) au groupe !`);
  };

  // Refus de la demande par l'admin
  const rejectJoinRequest = (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
    );
    toast.info(`Demande d'adhésion de ${req?.memberName || 'membre'} refusée.`);
  };

  // Programmation d'une nouvelle réunion par l'admin
  const scheduleMeeting = (
    groupId: string,
    date: string,
    location: string,
    beneficiaryId: string,
    beneficiaryName: string,
    notes?: string
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === groupId) {
          const nextNumber = (g.meetings[0]?.meetingNumber || 0) + 1;
          const newMeeting = {
            id: `mt-${Date.now()}`,
            meetingNumber: nextNumber,
            date,
            location,
            beneficiaryId,
            beneficiaryName,
            potAmount: g.contributionAmount * g.members.length,
            status: "in_progress" as const,
            contributions: g.members.map((m) => ({
              memberId: m.id,
              memberName: m.name,
              amount: g.contributionAmount,
              status: "pending" as const,
            })),
          };
          return {
            ...g,
            meetings: [newMeeting, ...g.meetings],
          };
        }
        return g;
      })
    );
    toast.success(`📅 Prochaine réunion programmée pour le ${date} !`);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        activeGroupId,
        activeGroup,
        setActiveGroupId,
        createGroup,
        joinRequests,
        submitJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        scheduleMeeting,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroups mut be used within a GroupProvider");
  return context;
};
