'use client';
import React, { createContext, useContext } from 'react';

export interface LandlordTenant { name: string; unit: string; cat: string; plan: string; store: string; rent: string; phone: string }
export interface TeamMember { name: string; email: string; av: string; role: string }
export interface AnnouncementItem { id: number; icon?: string; title: string; body: string; meta: string }
export interface AmenityItem { id: number; icon: string; name: string; sub: string }

export interface LandlordContextValue {
  navigate: (view: string) => void;
  manageTenant: (t: unknown) => void;
  startOnboarding: () => void;
  exportCSV: (type: string) => void;
  openOrder: (o: unknown) => void;
  assignTask: () => void;
  editAmenity: (a: AmenityItem) => void;
  newAmenity: () => void;
  editAnnouncement: (a: AnnouncementItem) => void;
  newAnnouncement: () => void;
  inviteMember: () => void;
  uploadDocument: () => void;
  editHandbookSection: (s: { id?: number; title: string; body: string }) => void;

  tenants: LandlordTenant[];
  addTenant: (t: LandlordTenant) => void;
  removeTenant: (name: string) => void;

  teamMembers: TeamMember[];
  removeMember: (email: string) => void;

  announcements: AnnouncementItem[];
  saveAnnouncement: (a: AnnouncementItem) => void;
  deleteAnnouncement: (id: number) => void;

  amenities: AmenityItem[];
  saveAmenity: (a: AmenityItem) => void;
  deleteAmenity: (id: number) => void;
}

export const LandlordContext = createContext<LandlordContextValue | null>(null);

export function useLandlord(): LandlordContextValue {
  const ctx = useContext(LandlordContext);
  if (!ctx) throw new Error('useLandlord must be used within LandlordShell');
  return ctx;
}
