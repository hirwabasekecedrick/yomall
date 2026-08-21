'use client';
import React, { useState, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import LandlordSidebar from '@/components/LandlordSidebar';
import LandlordTopbar from '@/components/LandlordTopbar';
import TenantModal from '@/components/TenantModal';
import OrderModal from '@/components/OrderModal';
import OnboardingWizard from '@/components/OnboardingWizard';
import { MaintenanceRequestModal } from '@/components/MaintenanceModal';
import { AmenityModal, AnnouncementModal, TeamInviteModal, DocumentUploadModal } from '@/components/SmallModals';
import { HandbookEditModal, AssignTaskModal } from '@/components/AdminModals';
import { ToastProvider, useToast } from '@/components/Toast';
import { initialFloors, initialLedger, initialOrders, initialStaff, initialTenants, initialTenantProfiles, orderStageDefs, riderPool, downloadCSV } from '@/lib/data';
import { titles } from '@/lib/titles';
import { LandlordContext, LandlordContextValue } from './LandlordContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navOpen, setNavOpen] = useState(false);

  // Modal state
  const [selectedTenant, setSelectedTenant] = useState<Record<string, unknown> | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMaintRequest, setShowMaintRequest] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Record<string, unknown> | null>(null);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Record<string, unknown> | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showTeamInvite, setShowTeamInvite] = useState(false);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [selectedHandbookSection, setSelectedHandbookSection] = useState<Record<string, unknown> | null>(null);
  const [showHandbookEdit, setShowHandbookEdit] = useState(false);

  const currentView = pathname.replace(/^\/landlord\/?/, '') || 'overview';
  const titleEntry = titles[currentView] || ['yoMall', ''];
  const mallName = searchParams.get('mall') || 'Kigali Convention Mall';
  const isSuperadminSession = searchParams.get('sa') === '1';

  const navigate = (view: string) => {
    setNavOpen(false);
    router.push(view === 'overview' ? '/landlord/overview' : `/landlord/${view}`);
  };

  const exportCSV = (type: string) => {
    if (type === 'rent') downloadCSV('rent-collection.csv', [['Tenant','Unit','Plan','Per Instalment','Balance','Status'], ...initialLedger.map((l: Record<string, unknown>) => [l.name, l.unit, l.plan, l.per, l.bal, l.status])]);
    else if (type === 'occupancy') downloadCSV('occupancy.csv', [['Unit','Status','Tenant'], ...Object.entries(initialFloors).flatMap(([, units]) => (units as Record<string, unknown>[]).map(u => [u.n, u.s, u.t || 'Vacant']))]);
    else if (type === 'deliveries') downloadCSV('deliveries.csv', [['Order ID','Shop','Items','Rider','Status','Value'], ...initialOrders.map((o: Record<string, unknown>) => [o.id, o.shop, o.item, o.rider, o.status, o.val])]);
    else if (type === 'tenants') downloadCSV('tenants.csv', [['Name','Unit','Category','Plan','Phone'], ...initialTenants.map((t: Record<string, unknown>) => [t.name, t.unit, t.cat, t.plan, t.phone])]);
    toast('CSV exported');
  };

  const contextValue = useMemo<LandlordContextValue>(() => ({
    manageTenant: (t) => { setSelectedTenant(t as Record<string, unknown>); setShowTenantModal(true); },
    startOnboarding: () => setShowOnboarding(true),
    exportCSV,
    openOrder: (o) => { setSelectedOrder(o as Record<string, unknown>); setShowOrderModal(true); },
    assignTask: () => setShowAssignTask(true),
    editAmenity: (a) => { setSelectedAmenity(a as Record<string, unknown>); setShowAmenityModal(true); },
    newAmenity: () => { setSelectedAmenity(null); setShowAmenityModal(true); },
    editAnnouncement: (a) => { setSelectedAnnouncement(a as Record<string, unknown>); setShowAnnouncementModal(true); },
    newAnnouncement: () => { setSelectedAnnouncement(null); setShowAnnouncementModal(true); },
    inviteMember: () => setShowTeamInvite(true),
    uploadDocument: () => setShowDocUpload(true),
    editHandbookSection: (s) => { setSelectedHandbookSection(s as Record<string, unknown>); setShowHandbookEdit(true); },
  }), [toast]);

  return (
    <LandlordContext.Provider value={contextValue}>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <LandlordSidebar currentView={currentView} setView={navigate} onLogout={() => router.push('/')} mobileOpen={navOpen} setMobileOpen={setNavOpen} />
        <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
          <LandlordTopbar
            title={titleEntry[0]}
            subtitle={currentView === 'overview' ? `${mallName} · Sunday, 19 July 2026` : titleEntry[1]}
            canGoBack={currentView !== 'overview'}
            onBack={() => router.back()}
            onNavigate={navigate}
            onMenu={() => setNavOpen(true)}
          />
          <main className="p-[16px] sm:p-[24px_26px] pb-[60px]">
            {isSuperadminSession && (
              <div className="context-banner" style={{marginBottom:18}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}><ShieldCheck size={14} /> Superadmin session — currently viewing <b>{mallName}</b>'s dashboard as the platform operator.</div>
                <button onClick={() => router.push('/superadmin')} style={{display:'inline-flex',alignItems:'center',gap:4}}><ArrowLeft size={13} /> Back to Platform Console</button>
              </div>
            )}
            {children}
          </main>
        </div>

        {/* ===== MODALS ===== */}
        {showTenantModal && selectedTenant && (
          <TenantModal show onClose={() => setShowTenantModal(false)} tenant={selectedTenant} profile={initialTenantProfiles[selectedTenant.name as string]} onSave={() => { toast('Tenant updated'); }} />
        )}
        {showOnboarding && (
          <OnboardingWizard show onClose={() => setShowOnboarding(false)} floors={initialFloors} onComplete={() => { toast('Tenant onboarded'); }} />
        )}
        {showOrderModal && selectedOrder && (
          <OrderModal show onClose={() => setShowOrderModal(false)} order={selectedOrder} stages={orderStageDefs} onAdvanceStage={() => { toast('Stage advanced'); }} onAssignRider={() => { toast('Rider assigned'); }} onConfirmDelivery={() => { toast('Delivery confirmed'); }} riderPool={riderPool} />
        )}
        {showMaintRequest && (
          <MaintenanceRequestModal show onClose={() => setShowMaintRequest(false)} onSubmit={() => { toast('Request submitted'); }} staffList={initialStaff} />
        )}
        {showAssignTask && (
          <AssignTaskModal show onClose={() => setShowAssignTask(false)} staff={initialStaff} onSubmit={() => { toast('Task assigned'); }} />
        )}
        {showAmenityModal && (
          <AmenityModal show onClose={() => setShowAmenityModal(false)} amenity={selectedAmenity} onSave={() => { toast('Amenity saved'); }} onDelete={() => { toast('Amenity deleted'); }} />
        )}
        {showAnnouncementModal && (
          <AnnouncementModal show onClose={() => setShowAnnouncementModal(false)} announcement={selectedAnnouncement} onSave={() => { toast('Announcement saved'); }} onDelete={() => { toast('Announcement deleted'); }} />
        )}
        {showTeamInvite && (
          <TeamInviteModal show onClose={() => setShowTeamInvite(false)} onInvite={() => { toast('Invitation sent'); }} />
        )}
        {showDocUpload && (
          <DocumentUploadModal show onClose={() => setShowDocUpload(false)} onUpload={() => { toast('Document uploaded'); }} />
        )}
        {showHandbookEdit && (
          <HandbookEditModal show onClose={() => setShowHandbookEdit(false)} section={selectedHandbookSection} onSave={() => { toast('Section saved'); }} onDelete={() => { toast('Section deleted'); }} />
        )}
      </div>
    </LandlordContext.Provider>
  );
}

export default function LandlordShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <React.Suspense fallback={null}>
        <ShellInner>{children}</ShellInner>
      </React.Suspense>
    </ToastProvider>
  );
}
