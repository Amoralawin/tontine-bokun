"use client";

import React, { createContext, useContext, useState } from "react";

export type UserRole = "owner" | "admin" | "member";

interface UserRoleContextType {
  role: UserRole;
  setRole: (r: UserRole) => void;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  canSeeMembers: boolean;      // Espace Membres : owner + admin seulement
  canSeePenalties: boolean;    // Détails pénalités : owner + admin seulement
  canSeeReputation: boolean;   // Dashboard réputation : owner + admin seulement
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: "member",
  setRole: () => {},
  isOwner: false,
  isAdmin: false,
  isMember: true,
  canSeeMembers: false,
  canSeePenalties: false,
  canSeeReputation: false,
});

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("admin"); // défaut : admin pour la démo

  const isOwner  = role === "owner";
  const isAdmin  = role === "admin" || role === "owner";
  const isMember = role === "member";

  return (
    <UserRoleContext.Provider
      value={{
        role, setRole,
        isOwner,
        isAdmin,
        isMember,
        canSeeMembers: isOwner || isAdmin,
        canSeePenalties: isOwner || isAdmin,
        canSeeReputation: isOwner || isAdmin,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
