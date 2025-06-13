
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export type UserRole = 'admin' | 'manufacturer' | 'supplier' | 'retailer' | 'recycler' | 'verifier' | 'service_provider';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  // Ensure service_provider is in this list
  const availableRoles: UserRole[] = ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider'];

  const contextValue = useMemo(() => ({
    currentRole,
    setCurrentRole,
    availableRoles,
  }), [currentRole]); // currentRole is the dependency for re-memoizing

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
