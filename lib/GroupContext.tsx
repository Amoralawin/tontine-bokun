"use client";

import React, { createContext, useContext, useState } from "react";
import { INITIAL_GROUPS, TontineGroup, Member } from "./mockData";
import { MOCK_REPUTATIONS, isMemberBlockedGlobally } from "./reputationSystem";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";

function uuidv4(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
  deleteGroup: (groupId: string) => Promise<void>;
  joinRequests: JoinRequest[];
  submitJoinRequest: (groupId: string, memberName: string, phone: string, email: string, momoNumber: string, momoProvider: string, message?: string) => boolean;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  scheduleMeeting: (groupId: string, date: string, location: string, beneficiaryId: string, beneficiaryName: string, notes?: string) => void;
  updateContributionStatus: (groupId: string, meetingId: string, memberId: string, status: "paid" | "pending" | "late") => void;
  syncFromSupabase: () => Promise<void>;
}

const LanguageContextDefault: GroupContextType = {
  groups: [],
  activeGroupId: "",
  activeGroup: undefined as any,
  setActiveGroupId: () => {},
  createGroup: () => {},
  deleteGroup: async () => {},
  joinRequests: [],
  submitJoinRequest: () => false,
  approveJoinRequest: () => {},
  rejectJoinRequest: () => {},
  scheduleMeeting: () => {},
  updateContributionStatus: () => {},
  syncFromSupabase: async () => {},
};

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

  // Charger les données depuis Supabase, avec fallback local storage / mock data
  const syncFromSupabase = async () => {
    try {
      // Tester si Supabase est correctement configuré
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase URL ou Anon Key manquante dans .env.local");
        return;
      }

      const { data: dbGroups, error: errGroups } = await supabase.from("groups").select("*");
      if (errGroups) {
        // Probablement les tables ne sont pas encore créées
        console.warn("Les tables Supabase ne semblent pas encore créées. Utilisation du stockage local.");
        return;
      }

      if (!dbGroups || dbGroups.length === 0) {
        console.info("Base de données Supabase vide. Prêt pour de nouveaux groupes !");
        setGroups([]);
        setJoinRequests([]);
        return;
      }

      const { data: dbMembers } = await supabase.from("members").select("*");
      const { data: dbMeetings } = await supabase.from("meetings").select("*");
      const { data: dbContributions } = await supabase.from("contributions").select("*");

      const assembledGroups: TontineGroup[] = dbGroups.map((g) => {
        const groupMembers = (dbMembers || [])
          .filter((m) => m.group_id === g.id)
          .map((m) => ({
            id: m.id,
            name: m.name,
            phone: m.phone,
            avatar: m.avatar || "👤",
            position: m.position,
            role: m.role as "admin" | "member",
            paidCount: m.paid_count,
            totalDue: Number(m.total_due),
          }));

        const groupMeetings = (dbMeetings || [])
          .filter((mt) => mt.group_id === g.id)
          .map((mt) => {
            const meetingContributions = (dbContributions || [])
              .filter((c) => c.meeting_id === mt.id)
              .map((c) => ({
                memberId: c.member_id,
                memberName: c.member_name,
                amount: Number(c.amount),
                status: c.status as "paid" | "pending" | "late",
                paidAt: c.paid_at || undefined,
              }));

            return {
              id: mt.id,
              meetingNumber: mt.meeting_number,
              date: mt.date,
              location: mt.location,
              beneficiaryId: mt.beneficiary_id,
              beneficiaryName: mt.beneficiary_name,
              potAmount: Number(mt.pot_amount),
              status: mt.status as "upcoming" | "in_progress" | "completed",
              contributions: meetingContributions,
            };
          });

        return {
          id: g.id,
          name: g.name,
          contributionAmount: Number(g.contribution_amount),
          currency: g.currency || "FCFA",
          frequency: g.frequency,
          cycleNumber: g.cycle_number,
          totalPot: Number(g.total_pot),
          members: groupMembers,
          meetings: groupMeetings,
        };
      });

      setGroups(assembledGroups);
      if (assembledGroups.length > 0) {
        setActiveGroupId(assembledGroups[0].id);
      }

      const { data: dbRequests } = await supabase.from("join_requests").select("*");
      if (dbRequests) {
        setJoinRequests(dbRequests.map((r) => ({
          id: r.id,
          groupId: r.group_id,
          groupName: r.group_name,
          memberName: r.member_name,
          phone: r.phone,
          email: r.email || "",
          momoNumber: r.momo_number,
          momoProvider: r.momo_provider,
          message: r.message || undefined,
          status: r.status as "pending" | "approved" | "rejected",
          requestedAt: r.requested_at,
        })));
      }
    } catch (e) {
      console.warn("Erreur synchronisation Supabase :", e);
    }
  };

  // Charger les données locales au démarrage
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
    syncFromSupabase();
  }, []);

  // Sauvegarder localement lors des modifications (fallback)
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

  // Création d'un nouveau groupe
  const createGroup = async (name: string, amount: number, frequency: string, creatorName: string, creatorPhone: string) => {
    const groupId = uuidv4();
    const adminId = uuidv4();
    const meetingId = uuidv4();

    const newGroup: TontineGroup = {
      id: groupId,
      name,
      contributionAmount: amount,
      currency: "FCFA",
      frequency,
      cycleNumber: 1,
      totalPot: amount * 6,
      members: [
        {
          id: adminId,
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
          id: meetingId,
          meetingNumber: 1,
          date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
          location: "En ligne / Réunion locale",
          beneficiaryId: adminId,
          beneficiaryName: creatorName || "Admin Créateur",
          potAmount: amount,
          status: "in_progress",
          contributions: [
            {
              memberId: adminId,
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
    toast.success(`Le groupe "${name}" a été créé localement !`);

    // Synchronisation en base de données réelle
    try {
      const { data: dbGroup, error: errGroup } = await supabase.from("groups").insert({
        id: newGroup.id,
        name: newGroup.name,
        contribution_amount: newGroup.contributionAmount,
        currency: newGroup.currency,
        frequency: newGroup.frequency,
        cycle_number: newGroup.cycleNumber,
        total_pot: newGroup.totalPot,
      }).select().single();

      if (dbGroup) {
        await supabase.from("members").insert({
          id: newGroup.members[0].id,
          group_id: dbGroup.id,
          name: newGroup.members[0].name,
          phone: newGroup.members[0].phone,
          avatar: newGroup.members[0].avatar,
          position: newGroup.members[0].position,
          role: newGroup.members[0].role,
          paid_count: newGroup.members[0].paidCount,
          total_due: newGroup.members[0].totalDue,
        });

        const mt = newGroup.meetings[0];
        await supabase.from("meetings").insert({
          id: mt.id,
          group_id: dbGroup.id,
          meeting_number: mt.meetingNumber,
          date: mt.date,
          location: mt.location,
          beneficiary_id: mt.beneficiaryId,
          beneficiary_name: mt.beneficiaryName,
          pot_amount: mt.potAmount,
          status: mt.status,
        });

        await supabase.from("contributions").insert({
          meeting_id: mt.id,
          member_id: mt.contributions[0].memberId,
          member_name: mt.contributions[0].memberName,
          amount: mt.contributions[0].amount,
          status: mt.contributions[0].status,
          paid_at: mt.contributions[0].paidAt,
        });

        toast.success(`Le groupe "${name}" est en ligne sur Supabase !`);
      }
    } catch (e) {
      console.warn("Échec écriture Supabase :", e);
    }
  };

  // Supprimer un groupe
  const deleteGroup = async (groupId: string) => {
    // 1. Mise à jour de l'état local
    setGroups((prev) => {
      const filtered = prev.filter((g) => g.id !== groupId);
      if (activeGroupId === groupId) {
        if (filtered.length > 0) {
          setActiveGroupId(filtered[0].id);
        } else {
          setActiveGroupId("");
        }
      }
      return filtered;
    });

    toast.success("Le groupe a été supprimé !");

    // 2. Synchronisation de la suppression sur Supabase
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return;
      }
      const { error } = await supabase.from("groups").delete().eq("id", groupId);
      if (error) {
        console.warn("Erreur suppression Supabase :", error);
      }
    } catch (e) {
      console.warn("Échec suppression Supabase :", e);
    }
  };

  // Soumission d'une demande d'adhésion
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

    const existingRep = MOCK_REPUTATIONS.find(
      (r) => r.identity.phone === phone || r.identity.email?.toLowerCase() === email.toLowerCase()
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
    toast.success(`Demande d'adhésion au groupe "${targetGroup.name}" envoyée !`);

    // Synchro Supabase
    supabase.from("join_requests").insert({
      id: newRequest.id,
      group_id: newRequest.groupId,
      group_name: newRequest.groupName,
      member_name: newRequest.memberName,
      phone: newRequest.phone,
      email: newRequest.email,
      momo_number: newRequest.momoNumber,
      momo_provider: newRequest.momoProvider,
      message: newRequest.message,
      status: newRequest.status,
      requested_at: newRequest.requestedAt,
    }).then(({ error }) => {
      if (!error) toast.success("Demande enregistrée sur la base de données !");
    });

    return true;
  };

  // Approbation d'un membre
  const approveJoinRequest = async (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newMemberId = `m-${Date.now()}`;
    let newPos = 1;

    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === req.groupId) {
          newPos = g.members.length + 1;
          const newMember: Member = {
            id: newMemberId,
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

    toast.success(`✅ ${req.memberName} a été approuvé(e) localement !`);

    // Synchro Supabase
    try {
      const activeG = groups.find((g) => g.id === req.groupId);
      if (activeG) {
        await supabase.from("members").insert({
          id: newMemberId,
          group_id: req.groupId,
          name: req.memberName,
          phone: req.phone,
          avatar: "👤",
          position: newPos,
          role: "member",
          paid_count: 0,
          total_due: activeG.contributionAmount,
        });

        await supabase.from("join_requests").update({ status: "approved" }).eq("id", requestId);
        toast.success("Statut synchronisé sur la base de données !");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Refus de la demande
  const rejectJoinRequest = async (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
    );
    toast.info(`Demande d'adhésion de ${req?.memberName || 'membre'} refusée.`);

    try {
      await supabase.from("join_requests").update({ status: "rejected" }).eq("id", requestId);
    } catch (e) {
      console.warn(e);
    }
  };

  // Programmation d'une nouvelle réunion
  const scheduleMeeting = async (
    groupId: string,
    date: string,
    location: string,
    beneficiaryId: string,
    beneficiaryName: string,
    notes?: string
  ) => {
    const nextMeetingId = `mt-${Date.now()}`;
    let nextNumber = 1;
    let computedPot = 0;

    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === groupId) {
          nextNumber = (g.meetings[0]?.meetingNumber || 0) + 1;
          computedPot = g.contributionAmount * g.members.length;
          const newMeeting = {
            id: nextMeetingId,
            meetingNumber: nextNumber,
            date,
            location,
            beneficiaryId,
            beneficiaryName,
            potAmount: computedPot,
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
    toast.success(`📅 Réunion programmée localement !`);

    // Synchro Supabase
    try {
      await supabase.from("meetings").insert({
        id: nextMeetingId,
        group_id: groupId,
        meeting_number: nextNumber,
        date,
        location,
        beneficiary_id: beneficiaryId,
        beneficiary_name: beneficiaryName,
        pot_amount: computedPot,
        status: "in_progress",
      });

      const activeG = groups.find((g) => g.id === groupId);
      if (activeG) {
        const contributionsToInsert = activeG.members.map((m) => ({
          meeting_id: nextMeetingId,
          member_id: m.id,
          member_name: m.name,
          amount: activeG.contributionAmount,
          status: "pending",
        }));
        await supabase.from("contributions").insert(contributionsToInsert);
        toast.success("Réunion sauvegardée sur Supabase !");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Mise à jour du statut d'une cotisation
  const updateContributionStatus = async (
    groupId: string,
    meetingId: string,
    memberId: string,
    status: "paid" | "pending" | "late"
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            meetings: g.meetings.map((m) => {
              if (m.id === meetingId) {
                return {
                  ...m,
                  contributions: m.contributions.map((c) => {
                    if (c.memberId === memberId) {
                      return {
                        ...c,
                        status,
                        paidAt: status === "paid" ? new Date().toLocaleDateString("fr-FR") : undefined,
                      };
                    }
                    return c;
                  }),
                };
              }
              return m;
            }),
          };
        }
        return g;
      })
    );
    toast.success("Statut mis à jour localement !");

    // Synchro Supabase
    try {
      const paidAtStr = status === "paid" ? new Date().toLocaleDateString("fr-FR") : null;
      await supabase.from("contributions")
        .update({ status, paid_at: paidAtStr })
        .eq("meeting_id", meetingId)
        .eq("member_id", memberId);
      toast.success("Cotisation mise à jour sur Supabase !");
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        activeGroupId,
        activeGroup,
        setActiveGroupId,
        createGroup,
        deleteGroup,
        joinRequests,
        submitJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        scheduleMeeting,
        updateContributionStatus,
        syncFromSupabase,
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
