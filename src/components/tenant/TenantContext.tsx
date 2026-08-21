'use client';
import React, { createContext, useContext } from 'react';

export interface TenantContextValue {
  openPayment: () => void;
  openOrder: (o: unknown) => void;
  newMaintRequest: () => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantShell');
  return ctx;
}
