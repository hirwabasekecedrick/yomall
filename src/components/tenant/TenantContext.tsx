'use client';
import React, { createContext, useContext } from 'react';

export interface RentAdvanceApplication {
  id: string;
  amount: string;
  frequency: 'daily' | 'weekly';
  term: string;
  idNumber: string;
  idPhoto: string | null;
  selfie: string | null;
  signature: string;
  agreedAt: number;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
}

export interface RepaymentInstallment {
  seq: number;
  dueDate: Date;
  amount: number;
  status: 'due' | 'upcoming' | 'paid';
}

export interface Repayment {
  seq: string;
  date: string;
  amount: number;
  account: string;
}

export interface TenantContextValue {
  openPayment: () => void;
  openOrder: (o: unknown) => void;
  newMaintRequest: () => void;

  rentAdvanceApp: RentAdvanceApplication | null;
  openRentAdvance: () => void;

  raSchedule: RepaymentInstallment[];
  raBalance: number;
  raRepayments: Repayment[];
  raSelectedSeqs: number[];
  toggleSelectInstallment: (seq: number) => void;
  paySingle: (seq: number) => void;
  quickPayDue: () => void;
  openRepaySheet: () => void;
  closeRepaySheet: () => void;
  repaySheetOpen: boolean;
  submitRepayment: (amount: number, account: string) => void;
  downloadReceipt: () => void;

  creditsBalance: number;
  spendCredits: (amount: number) => void;
  openTopUp: () => void;
  closeTopUp: () => void;
  topUpOpen: boolean;
  confirmTopUp: (amount: number, method: string) => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantShell');
  return ctx;
}
