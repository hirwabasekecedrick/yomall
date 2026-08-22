'use client';
import React, { createContext, useContext } from 'react';

export interface CmsDeal { id: number; headline: string; shopName?: string; badge?: string }
export interface PlatformMall { name: string; loc: string; plan: string; tenants: number | string; occ: string; gmv: string; color: string; suspended?: boolean }
export interface BroadcastMsg { id: number; to: string; subject: string; at: string }

export interface SuperadminContextValue {
  enterMall: (name: string) => void;
  onboardMall: () => void;
  reviewLoan: (app: unknown) => void;

  malls: PlatformMall[];
  addMall: (m: PlatformMall) => void;
  toggleSuspend: (name: string) => void;

  pendingDeals: Record<string, unknown>[];
  approveDeal: (id: number) => void;
  rejectDeal: (id: number) => void;

  broadcasts: { id: number; to: string; subject: string; at: number }[];
  sendBroadcast: (b: { to: string; subject: string }) => void;

  auditRows: [string, string][];
}

export const SuperadminContext = createContext<SuperadminContextValue | null>(null);

export function useSuperadmin(): SuperadminContextValue {
  const ctx = useContext(SuperadminContext);
  if (!ctx) throw new Error('useSuperadmin must be used within SuperadminShell');
  return ctx;
}
