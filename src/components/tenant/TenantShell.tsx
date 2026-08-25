'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TenantSidebar from '@/components/TenantSidebar';
import TenantTopbar from '@/components/TenantTopbar';
import PaymentModal from '@/components/PaymentModal';
import OrderModal from '@/components/OrderModal';
import { MaintenanceRequestModal } from '@/components/MaintenanceModal';
import RentAdvanceWizard from './RentAdvanceWizard';
import RentAdvanceRepaySheet from './RentAdvanceRepaySheet';
import CreditsTopUpModal from '@/components/CreditsTopUpModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { riderPool, orderStageDefs, initialStaff, CURRENT_TENANT_NAME, buildRepaymentSchedule, INITIAL_CREDITS_BALANCE } from '@/lib/data';
import { titles } from '@/lib/titles';
import { TenantContext, TenantContextValue, RentAdvanceApplication, RepaymentInstallment, Repayment } from './TenantContext';

const T_PREFIXED = ['overview', 'orders', 'rent', 'lease', 'messages'];

function ShellInner({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  // Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMaintRequest, setShowMaintRequest] = useState(false);
  const [showRentAdvance, setShowRentAdvance] = useState(false);
  const [rentAdvanceApp, setRentAdvanceApp] = useState<RentAdvanceApplication | null>(null);

  // Rent advance repayment schedule
  const [raSchedule, setRaSchedule] = useState<RepaymentInstallment[]>([]);
  const [raBalance, setRaBalance] = useState(0);
  const [raRepayments, setRaRepayments] = useState<Repayment[]>([]);
  const [raSelectedSeqs, setRaSelectedSeqs] = useState<number[]>([]);
  const [repaySheetOpen, setRepaySheetOpen] = useState(false);

  // Credits (used by POS / storefront composer)
  const [creditsBalance, setCreditsBalance] = useState(INITIAL_CREDITS_BALANCE);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const segment = pathname.replace(/^\/tenant\/?/, '') || 'overview';
  const titleKey = T_PREFIXED.includes(segment) ? `t-${segment}` : segment;
  const titleEntry = titles[titleKey] || ['yoMall', ''];

  const navigate = (view: string) => {
    setNavOpen(false);
    router.push(view === 'overview' ? '/tenant/overview' : `/tenant/${view}`);
  };

  const toggleSelectInstallment = useCallback((seq: number) => {
    setRaSelectedSeqs(prev => prev.includes(seq) ? prev.filter(s => s !== seq) : [...prev, seq]);
  }, []);

  const openRepaySheet = useCallback(() => {
    setRaSelectedSeqs(prev => {
      if (prev.length) return prev;
      const due = raSchedule.find(s => s.status === 'due');
      return due ? [due.seq] : prev;
    });
    setRepaySheetOpen(true);
  }, [raSchedule]);

  const paySingle = useCallback((seq: number) => {
    setRaSelectedSeqs([seq]);
    setRepaySheetOpen(true);
  }, []);

  const quickPayDue = useCallback(() => {
    const due = raSchedule.find(s => s.status === 'due');
    if (!due) return;
    setRaSelectedSeqs([due.seq]);
    setRepaySheetOpen(true);
  }, [raSchedule]);

  const submitRepayment = useCallback((amount: number, account: string) => {
    setRaSchedule(prev => {
      const next = prev.map(s => raSelectedSeqs.includes(s.seq) ? { ...s, status: 'paid' as const } : s);
      const stillUpcoming = next.find(s => s.status === 'upcoming');
      return stillUpcoming ? next.map(s => s.seq === stillUpcoming.seq ? { ...s, status: 'due' as const } : s) : next;
    });
    const label = raSelectedSeqs.length > 1 ? `${raSelectedSeqs[0]}–${raSelectedSeqs[raSelectedSeqs.length - 1]}` : String(raSelectedSeqs[0]);
    setRaRepayments(prev => [{ seq: label, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), amount, account }, ...prev]);
    setRaBalance(prev => Math.max(0, prev - amount));
    setRepaySheetOpen(false);
    setRaSelectedSeqs([]);
    const plural = raSelectedSeqs.length > 1 ? `${raSelectedSeqs.length} installments (ahead of schedule)` : `installment ${raSelectedSeqs[0]}`;
    toast(`Repayment received for ${plural} — RWF ${amount.toLocaleString()}`);
  }, [raSelectedSeqs, toast]);

  const downloadReceipt = useCallback(() => {
    if (!rentAdvanceApp) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${rentAdvanceApp.id}</title></head><body>
    <div style="max-width:360px;margin:40px auto;font-family:Montserrat,sans-serif;padding:24px;">
      <h2 style="margin-bottom:4px;">yoMall rentAdvance</h2>
      <div style="font-size:11px;color:#888;margin-bottom:18px;">Settlement receipt — ${rentAdvanceApp.id}</div>
      <div style="border-top:1px dashed #ccc;border-bottom:1px dashed #ccc;padding:10px 0;">
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span>Paid to landlord</span><span>RWF ${rentAdvanceApp.amount}</span></div>
      </div>
      <div style="font-size:11px;color:#888;margin-top:16px;">Tenant: ${CURRENT_TENANT_NAME} · Unit G-14<br/>Frequency: ${rentAdvanceApp.frequency === 'daily' ? 'Daily' : 'Weekly'} · Term: ${rentAdvanceApp.term}<br/>Date settled: ${new Date().toLocaleString()}</div>
    </div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `rentadvance-receipt-${rentAdvanceApp.id}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Settlement receipt downloaded');
  }, [rentAdvanceApp, toast]);

  const spendCredits = useCallback((amount: number) => setCreditsBalance(prev => Math.max(0, prev - amount)), []);
  const confirmTopUp = useCallback((amount: number, method: string) => {
    setCreditsBalance(prev => prev + amount);
    setTopUpOpen(false);
    toast(`${amount} credits added via ${method} — new balance ${creditsBalance + amount}`);
  }, [creditsBalance, toast]);

  const contextValue = useMemo<TenantContextValue>(() => ({
    openPayment: () => setShowPaymentModal(true),
    openOrder: (o) => { setSelectedOrder(o as Record<string, unknown>); setShowOrderModal(true); },
    newMaintRequest: () => setShowMaintRequest(true),

    rentAdvanceApp,
    openRentAdvance: () => setShowRentAdvance(true),

    raSchedule,
    raBalance,
    raRepayments,
    raSelectedSeqs,
    toggleSelectInstallment,
    paySingle,
    quickPayDue,
    openRepaySheet,
    closeRepaySheet: () => setRepaySheetOpen(false),
    repaySheetOpen,
    submitRepayment,
    downloadReceipt,

    creditsBalance,
    spendCredits,
    openTopUp: () => setTopUpOpen(true),
    closeTopUp: () => setTopUpOpen(false),
    topUpOpen,
    confirmTopUp,
  }), [rentAdvanceApp, raSchedule, raBalance, raRepayments, raSelectedSeqs, toggleSelectInstallment, paySingle, quickPayDue, openRepaySheet, repaySheetOpen, submitRepayment, downloadReceipt, creditsBalance, spendCredits, topUpOpen, confirmTopUp]);

  return (
    <TenantContext.Provider value={contextValue}>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <TenantSidebar currentView={segment} setView={navigate} onLogout={() => router.push('/')} mobileOpen={navOpen} setMobileOpen={setNavOpen} />
        <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
          <TenantTopbar
            title={titleEntry[0]}
            subtitle={titleEntry[1]}
            canGoBack={segment !== 'overview'}
            onBack={() => router.back()}
            onNavigate={navigate}
            onMenu={() => setNavOpen(true)}
          />
          <main className="p-[16px] sm:p-[24px_26px] pb-[60px]">
            {children}
          </main>
        </div>

        {/* ===== MODALS ===== */}
        {showPaymentModal && (
          <PaymentModal show onClose={() => setShowPaymentModal(false)} tenantName={CURRENT_TENANT_NAME} balance="57,000" dailyRate="15,000" onPay={() => { toast('Payment processed'); }} />
        )}
        {showOrderModal && selectedOrder && (
          <OrderModal show onClose={() => setShowOrderModal(false)} order={selectedOrder} stages={orderStageDefs}
            onAdvanceStage={(id, stage) => {
              setSelectedOrder(p => p && p.id === id ? { ...p, stage } : p);
              toast(`Order ${id} moved to "${orderStageDefs[stage]?.label || 'next stage'}"`);
            }}
            onAssignRider={(id, rider) => {
              setSelectedOrder(p => p && p.id === id ? { ...p, rider } : p);
              toast(`${(rider as Record<string, unknown>).name} assigned to ${id}`);
            }}
            onConfirmDelivery={(id) => {
              setSelectedOrder(p => p && p.id === id ? { ...p, status:'delivered', stage: orderStageDefs.length - 1 } : p);
              toast(`Delivery of ${id} confirmed — PIN verified`);
            }}
            riderPool={riderPool} />
        )}
        {showMaintRequest && (
          <MaintenanceRequestModal show onClose={() => setShowMaintRequest(false)} onSubmit={() => { toast('Request submitted'); }} staffList={initialStaff} />
        )}
        <RentAdvanceWizard
          show={showRentAdvance}
          onClose={() => setShowRentAdvance(false)}
          onSubmit={(app) => {
            setRentAdvanceApp(app);
            toast(`rentAdvance application submitted — ref ${app.id}`);
            // Demo: our lending partner responds shortly after submission.
            window.setTimeout(() => {
              setRentAdvanceApp(prev => prev && prev.id === app.id ? { ...prev, status: 'approved' } : prev);
              const schedule = buildRepaymentSchedule(app.amount, app.frequency, app.term) as RepaymentInstallment[];
              setRaSchedule(schedule);
              setRaBalance(schedule.reduce((s, i) => s + i.amount, 0));
              toast(`RWF ${app.amount} was paid to your landlord — rentAdvance approved`);
            }, 5000);
          }}
        />
        <RentAdvanceRepaySheet />
        <CreditsTopUpModal show={topUpOpen} onClose={() => setTopUpOpen(false)} creditsBalance={creditsBalance} onConfirm={confirmTopUp} />
      </div>
    </TenantContext.Provider>
  );
}

export default function TenantShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <ShellInner>{children}</ShellInner>
      </React.Suspense>
    </ToastProvider>
  );
}
