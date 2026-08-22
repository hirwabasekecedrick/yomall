'use client';
import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SuperadminSidebar from '@/components/SuperadminSidebar';
import SuperadminTopbar from '@/components/SuperadminTopbar';
import LoanWizard from '@/components/LoanWizard';
import { OnboardMallWizard } from '@/components/AdminModals';
import { ToastProvider, useToast } from '@/components/Toast';
import { titles } from '@/lib/titles';
import { initialCmsDeals, initialMalls } from '@/lib/data';
import { SuperadminContext, SuperadminContextValue, PlatformMall } from './SuperadminContext';

const MALL_COLORS = ['#4C1D95', '#6D28D9', '#8B5CF6', '#5B21B6', '#7C3AED'];

function ShellInner({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  // Domain state
  const [malls, setMalls] = useState<PlatformMall[]>(initialMalls.map(m => ({ ...m })));
  const [pendingDeals, setPendingDeals] = useState(initialCmsDeals.filter((d: Record<string, unknown>) => d.moderationStatus === 'pending').map(d => ({ ...d })) as Record<string, unknown>[]);
  const [broadcasts, setBroadcasts] = useState<{ id: number; to: string; subject: string; at: number }[]>([]);
  const [auditRows, setAuditRows] = useState<[string, string][]>([]);

  function logAudit(action: string) {
    setAuditRows(p => [[new Date().toLocaleString(), action], ...p]);
  }

  // Modal state
  const [showOnboardMall, setShowOnboardMall] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Record<string, unknown> | null>(null);
  const [showLoanWizard, setShowLoanWizard] = useState(false);

  const segment = pathname.replace(/^\/superadmin\/?/, '') || 'console';
  const titleEntry = titles[segment] || ['yoMall', ''];

  const navigate = (view: string) => {
    setNavOpen(false);
    router.push(view === 'console' ? '/superadmin/console' : `/superadmin/${view}`);
  };

  const contextValue = useMemo<SuperadminContextValue>(() => ({
    enterMall: (name) => router.push(`/landlord/overview?mall=${encodeURIComponent(name)}&sa=1`),
    onboardMall: () => setShowOnboardMall(true),
    reviewLoan: (app) => { setSelectedLoan(app as Record<string, unknown>); setShowLoanWizard(true); },

    malls,
    addMall: (m) => { setMalls(p => [...p, m]); toast(`${m.name} onboarded — added to platform`); logAudit(`Onboarded mall "${m.name}"`); },
    toggleSuspend: (name) => {
      setMalls(p => p.map(m => m.name === name ? { ...m, suspended: !m.suspended } : m));
      const nowSuspended = malls.find(m => m.name === name)?.suspended !== true;
      toast(nowSuspended ? `${name} suspended — landlord access paused` : `${name} reactivated`);
      logAudit(`${nowSuspended ? 'Suspended' : 'Reactivated'} mall "${name}"`);
    },

    pendingDeals,
    approveDeal: (id) => {
      const deal = pendingDeals.find(d => d.id === id);
      setPendingDeals(p => p.filter(d => d.id !== id));
      toast(`Approved: ${(deal?.headline as string) || 'deal'} is now live on yoDeals`);
      logAudit(`Approved deal "${deal?.headline ?? id}"`);
    },
    rejectDeal: (id) => {
      const deal = pendingDeals.find(d => d.id === id);
      setPendingDeals(p => p.filter(d => d.id !== id));
      toast(`Rejected: ${(deal?.headline as string) || 'deal'} was not published`);
      logAudit(`Rejected deal "${deal?.headline ?? id}"`);
    },

    broadcasts,
    sendBroadcast: (b) => {
      setBroadcasts(p => [{ id: Date.now(), to: b.to, subject: b.subject, at: Date.now() }, ...p]);
      toast(`Broadcast sent to ${b.to.toLowerCase()}`);
      logAudit(`Sent broadcast "${b.subject}" to ${b.to}`);
    },

    auditRows,
  }), [router, toast, malls, pendingDeals, broadcasts, auditRows]);

  return (
    <SuperadminContext.Provider value={contextValue}>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <SuperadminSidebar currentView={segment} setView={navigate} onLogout={() => router.push('/')} mobileOpen={navOpen} setMobileOpen={setNavOpen} />
        <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
          <SuperadminTopbar
            title={titleEntry[0]}
            subtitle={titleEntry[1]}
            canGoBack={segment !== 'console'}
            onBack={() => router.back()}
            onNavigate={navigate}
            onMenu={() => setNavOpen(true)}
          />
          <main className="p-[16px] sm:p-[24px_26px] pb-[60px]">
            {children}
          </main>
        </div>

        {/* ===== MODALS ===== */}
        {showOnboardMall && (
          <OnboardMallWizard show onClose={() => setShowOnboardMall(false)} onComplete={(data) => {
            const d = data as Record<string, unknown>;
            const addr = d.address as Record<string, string>;
            contextValue.addMall({
              name:(d.name as string),
              loc:[addr.street, addr.province].filter(Boolean).join(', ') || 'Rwanda',
              plan:'Growth',
              tenants:'—',
              occ:'0%',
              gmv:'0',
              color:MALL_COLORS[malls.length % MALL_COLORS.length],
            });
          }} />
        )}
        {showLoanWizard && selectedLoan && (
          <LoanWizard show onClose={() => setShowLoanWizard(false)} application={selectedLoan}
            onApprove={(id) => { toast(`Loan ${id} approved`); logAudit(`Approved loan application ${id}`); }}
            onReject={(id, reason) => { toast(`Loan ${id} rejected${reason ? ` — ${reason}` : ''}`); logAudit(`Rejected loan application ${id}${reason ? `: ${reason}` : ''}`); }} />
        )}
      </div>
    </SuperadminContext.Provider>
  );
}

export default function SuperadminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <ShellInner>{children}</ShellInner>
      </React.Suspense>
    </ToastProvider>
  );
}
