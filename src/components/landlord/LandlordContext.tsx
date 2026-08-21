'use client';
import React, { createContext, useContext } from 'react';

export interface LandlordContextValue {
  manageTenant: (t: unknown) => void;
  startOnboarding: () => void;
  exportCSV: (type: string) => void;
  openOrder: (o: unknown) => void;
  assignTask: () => void;
  editAmenity: (a: { icon: string; name: string; sub: string }) => void;
  newAmenity: () => void;
  editAnnouncement: (a: { title: string }) => void;
  newAnnouncement: () => void;
  inviteMember: () => void;
  uploadDocument: () => void;
  editHandbookSection: (s: { id?: number; title: string; body: string }) => void;
}

export const LandlordContext = createContext<LandlordContextValue | null>(null);

export function useLandlord(): LandlordContextValue {
  const ctx = useContext(LandlordContext);
  if (!ctx) throw new Error('useLandlord must be used within LandlordShell');
  return ctx;
}
