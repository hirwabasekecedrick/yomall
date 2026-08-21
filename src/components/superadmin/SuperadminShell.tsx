'use client';
import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SuperadminSidebar from '@/components/SuperadminSidebar';
import SuperadminTopbar from '@/components/SuperadminTopbar';
import LoanWizard from '@/components/LoanWizard';
import { OnboardMallWizard } from '@/components/AdminModals';
import { ToastProvider, useToast } from '@/components/Toast';
import { titles } from '@/lib/titles';
import { SuperadminContext, SuperadminContextValue } from './SuperadminContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

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
  }), [router]);

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
          <OnboardMallWizard show onClose={() => setShowOnboardMall(false)} onComplete={() => { toast('Mall onboarded'); }} />
        )}
        {showLoanWizard && selectedLoan && (
          <LoanWizard show onClose={() => setShowLoanWizard(false)} application={selectedLoan} onApprove={() => { toast('Loan approved'); }} onReject={() => { toast('Loan rejected'); }} />
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
