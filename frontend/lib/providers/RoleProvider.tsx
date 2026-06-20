"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export type UserRole = "urban" | "farmer" | "industry";

interface RoleContextType {
  role: UserRole;
  switchRole: (role: UserRole) => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserRole } = useAuth();
  const [localRole, setLocalRole] = useState<UserRole>("urban");

  useEffect(() => {
    if (user?.selectedRole) {
      setLocalRole(user.selectedRole);
    }
  }, [user]);

  const switchRole = async (newRole: UserRole) => {
    setLocalRole(newRole);
    if (user) {
      await updateUserRole(newRole);
    }
  };

  return (
    <RoleContext.Provider value={{ role: localRole, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
