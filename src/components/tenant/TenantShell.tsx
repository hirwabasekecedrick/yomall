'use client';
import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TenantSidebar from '@/components/TenantSidebar';
import TenantTopbar from '@/components/TenantTopbar';
import PaymentModal from '@/components/PaymentModal';
import OrderModal from '@/components/OrderModal';
import { MaintenanceRequestModal } from '@/components/MaintenanceModal';
import { ToastProvider, useToast } from '@/components/Toast';
import { riderPool, orderStageDefs, initialStaff, CURRENT_TENANT_NAME } from '@/lib/data';
import { titles } from '@/lib/titles';
import { TenantContext, TenantContextValue } from './TenantContext';

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

  const segment = pathname.replace(/^\/tenant\/?/, '') || 'overview';
  const titleKey = T_PREFIXED.includes(segment) ? `t-${segment}` : segment;
  const titleEntry = titles[titleKey] || ['yoMall', ''];

  const navigate = (view: string) => {
    setNavOpen(false);
    router.push(view === 'overview' ? '/tenant/overview' : `/tenant/${view}`);
  };

  const contextValue = useMemo<TenantContextValue>(() => ({
    openPayment: () => setShowPaymentModal(true),
    openOrder: (o) => { setSelectedOrder(o as Record<string, unknown>); setShowOrderModal(true); },
    newMaintRequest: () => setShowMaintRequest(true),
  }), []);

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
          <OrderModal show onClose={() => setShowOrderModal(false)} order={selectedOrder} stages={orderStageDefs} onAdvanceStage={() => { toast('Stage advanced'); }} onAssignRider={() => { toast('Rider assigned'); }} onConfirmDelivery={() => { toast('Delivery confirmed'); }} riderPool={riderPool} />
        )}
        {showMaintRequest && (
          <MaintenanceRequestModal show onClose={() => setShowMaintRequest(false)} onSubmit={() => { toast('Request submitted'); }} staffList={initialStaff} />
        )}
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
