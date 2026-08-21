'use client';
import React, { createContext, useContext } from 'react';

export interface SuperadminContextValue {
  enterMall: (name: string) => void;
  onboardMall: () => void;
  reviewLoan: (app: unknown) => void;
}

export const SuperadminContext = createContext<SuperadminContextValue | null>(null);

export function useSuperadmin(): SuperadminContextValue {
  const ctx = useContext(SuperadminContext);
  if (!ctx) throw new Error('useSuperadmin must be used within SuperadminShell');
  return ctx;
}
