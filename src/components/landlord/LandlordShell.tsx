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
import { TodayDate } from '@/components/ui';
import { initialFloors, initialLedger, initialOrders, initialStaff, initialTenants, initialTenantProfiles, orderStageDefs, riderPool, downloadCSV, initials } from '@/lib/data';
import { titles } from '@/lib/titles';
import { LandlordContext, LandlordContextValue, LandlordTenant, TeamMember, AnnouncementItem, AmenityItem } from './LandlordContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navOpen, setNavOpen] = useState(false);

  // Mutable domain state
  const [tenants, setTenants] = useState<LandlordTenant[]>([...initialTenants]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name:'Shema Katende', email:'shema@edupoto.rw', av:'SK', role:'Owner · full access' },
    { name:'Marie Uwimana', email:'marie@edupoto.rw', av:'MU', role:'Manager · can view & edit' },
    { name:'Paul Nshimiyimana', email:'paul@edupoto.rw', av:'PN', role:'Finance · read-only' },
  ]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    { id:1, icon:'food', title:'Weekend food festival', body:'Enjoy discounts at all F&B tenants this Saturday from 12:00–18:00. Free entry.', meta:'Posted 2 days ago · Pinned' },
    { id:2, icon:'optics', title:'New tenant: Amara Optics', body:'Welcome Amara Optics to Unit 1F-08! Stop by for prescription glasses and sunglasses.', meta:'Posted 5 days ago' },
  ]);
  const [amenities, setAmenities] = useState<AmenityItem[]>([
    { id:1, icon:'parking', name:'Car parking', sub:'Level B1 · 120 bays · RWF 500/hr' },
    { id:2, icon:'restroom', name:'Restrooms', sub:'Every floor · east wing' },
    { id:3, icon:'atm', name:'ATMs', sub:'Ground floor near main entrance' },
    { id:4, icon:'prayer', name:'Prayer room', sub:'Floor 2 · open 06:00–22:00' },
    { id:5, icon:'foodcourt', name:'Food court', sub:'Floor 2 · 8 F&B tenants' },
  ]);
  const nextId = React.useRef(100);

  // Modal state
  const [selectedTenant, setSelectedTenant] = useState<Record<string, unknown> | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMaintRequest, setShowMaintRequest] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityItem | null>(null);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
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
    const keep = new URLSearchParams();
    const mall = searchParams.get('mall');
    if (mall) keep.set('mall', mall);
    if (searchParams.get('sa') === '1') keep.set('sa', '1');
    const qs = keep.toString();
    const base = view === 'overview' ? '/landlord/overview' : `/landlord/${view}`;
    router.push(qs ? `${base}?${qs}` : base);
  };

  const exportCSV = (type: string) => {
    if (type === 'rent') downloadCSV('rent-collection.csv', [['Tenant','Unit','Plan','Per Instalment','Balance','Status'], ...initialLedger.map((l: Record<string, unknown>) => [l.name, l.unit, l.plan, l.per, l.bal, l.status])]);
    else if (type === 'occupancy') downloadCSV('occupancy.csv', [['Unit','Status','Tenant'], ...Object.entries(initialFloors).flatMap(([, units]) => (units as Record<string, unknown>[]).map(u => [u.n, u.s, u.t || 'Vacant']))]);
    else if (type === 'deliveries') downloadCSV('deliveries.csv', [['Order ID','Shop','Items','Rider','Status','Value'], ...initialOrders.map((o: Record<string, unknown>) => [o.id, o.shop, o.item, o.rider, o.status, o.val])]);
    else if (type === 'tenants') downloadCSV('tenants.csv', [['Name','Unit','Category','Plan','Phone'], ...tenants.map((t: LandlordTenant) => [t.name, t.unit, t.cat, t.plan, t.phone])]);
    toast('CSV exported');
  };

  const contextValue = useMemo<LandlordContextValue>(() => ({
    navigate,
    manageTenant: (t) => { setSelectedTenant(t as Record<string, unknown>); setShowTenantModal(true); },
    startOnboarding: () => setShowOnboarding(true),
    exportCSV,
    openOrder: (o) => { setSelectedOrder(o as Record<string, unknown>); setShowOrderModal(true); },
    assignTask: () => setShowAssignTask(true),
    editAmenity: (a) => { setSelectedAmenity(a); setShowAmenityModal(true); },
    newAmenity: () => { setSelectedAmenity(null); setShowAmenityModal(true); },
    editAnnouncement: (a) => { setSelectedAnnouncement(a); setShowAnnouncementModal(true); },
    newAnnouncement: () => { setSelectedAnnouncement(null); setShowAnnouncementModal(true); },
    inviteMember: () => setShowTeamInvite(true),
    uploadDocument: () => setShowDocUpload(true),
    editHandbookSection: (s) => { setSelectedHandbookSection(s as Record<string, unknown>); setShowHandbookEdit(true); },

    tenants,
    addTenant: (t) => setTenants(p => [...p, t]),
    removeTenant: (name) => setTenants(p => p.filter(t => t.name !== name)),

    teamMembers,
    removeMember: (email) => setTeamMembers(p => p.filter(m => m.email !== email)),

    announcements,
    saveAnnouncement: (a) => {
      if (a.id) setAnnouncements(p => p.map(x => x.id === a.id ? { ...x, ...a } : x));
      else setAnnouncements(p => [{ id: ++nextId.current, title:a.title, body:a.body, meta:'Just now · Live' }, ...p]);
      toast(a.id ? 'Announcement updated' : 'Announcement published');
    },
    deleteAnnouncement: (id) => { setAnnouncements(p => p.filter(x => x.id !== id)); toast('Announcement removed'); },

    amenities,
    saveAmenity: (a) => {
      if (a.id && amenities.some(x => x.id === a.id)) setAmenities(p => p.map(x => x.id === a.id ? a : x));
      else setAmenities(p => [...p, { id: ++nextId.current, icon:a.icon || 'info', name:a.name, sub:a.sub }]);
      toast('Amenity saved');
    },
    deleteAmenity: (id) => { setAmenities(p => p.filter(x => x.id !== id)); toast('Amenity deleted'); },
  }), [toast, tenants, teamMembers, announcements, amenities, searchParams, router]);

  return (
    <LandlordContext.Provider value={contextValue}>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <LandlordSidebar currentView={currentView} setView={navigate} onLogout={() => router.push('/')} mobileOpen={navOpen} setMobileOpen={setNavOpen} />
        <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
          <LandlordTopbar
            title={titleEntry[0]}
            subtitle={currentView === 'overview'
              ? <>{mallName} · <TodayDate /></>
              : titleEntry[1]}
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
          <OnboardingWizard show onClose={() => setShowOnboarding(false)} floors={initialFloors} onComplete={(t) => {
            const rec = t as Record<string, unknown>;
            setTenants(p => [...p, {
              name:rec.name as string,
              unit:String(rec.unit || ''),
              cat:String(rec.cat || ''),
              plan:rec.plan === 'daily' ? 'daily' : 'weekly',
              store:'draft',
              rent:'due',
              phone:String(rec.phone || ''),
            }]);
            toast(`${rec.name} onboarded — added to directory`);
          }} />
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
        {showAssignTask && (
          <AssignTaskModal show onClose={() => setShowAssignTask(false)} staff={initialStaff} onSubmit={(task) => { toast(`Task assigned to ${(task as Record<string, unknown>).staff}`); }} />
        )}
        {showAmenityModal && (
          <AmenityModal show onClose={() => setShowAmenityModal(false)} amenity={selectedAmenity}
            onSave={(a) => contextValue.saveAmenity({ id:selectedAmenity?.id as number | undefined, ...(a as Record<string, unknown>) } as AmenityItem)}
            onDelete={(id) => contextValue.deleteAmenity(id as number)} />
        )}
        {showAnnouncementModal && (
          <AnnouncementModal show onClose={() => setShowAnnouncementModal(false)} announcement={selectedAnnouncement}
            onSave={(a) => contextValue.saveAnnouncement({ id:selectedAnnouncement?.id as number | undefined, ...(a as Record<string, unknown>) } as AnnouncementItem)}
            onDelete={(id) => contextValue.deleteAnnouncement(id as number)} />
        )}
        {showTeamInvite && (
          <TeamInviteModal show onClose={() => setShowTeamInvite(false)} onInvite={(m) => {
            const rec = m as Record<string, unknown>;
            setTeamMembers(p => [...p, { name:rec.name as string, email:rec.email as string, av:initials(rec.name as string), role:`${String(rec.role).charAt(0).toUpperCase() + String(rec.role).slice(1)} · invited` }]);
            toast(`Invitation sent to ${rec.email}`);
          }} />
        )}
        {showDocUpload && (
          <DocumentUploadModal show onClose={() => setShowDocUpload(false)} onUpload={(d) => { toast(`"${((d as Record<string, unknown>).name)}" uploaded`); }} />
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
