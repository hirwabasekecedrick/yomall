'use client';
import React from 'react';
import Image from 'next/image';
import Sheet from './Sheet';
import { LayoutDashboard, Grid3x3, Users, Store, Tag, Flag, CalendarClock, BarChart3, UsersRound, FolderOpen, BookOpen, Wallet, Truck, Wrench, ChevronDown, LogOut } from 'lucide-react';

export default function LandlordSidebar({ currentView, setView, onLogout, mobileOpen, setMobileOpen }: { currentView: string; setView: (v: string) => void; onLogout: () => void; mobileOpen?: boolean; setMobileOpen?: (v: boolean) => void }) {
  const closeMobile = () => setMobileOpen && setMobileOpen(false);
  const handleNavigate = (view: string) => {
    setView(view);
    closeMobile();
  };

  const NavItem = ({ view, icon, label }: { view: string; icon: React.ReactNode; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavigate(view)}
        className={`flex items-center gap-[11px] p-[9px_11px] rounded-[9px] text-[13.4px] font-medium cursor-pointer text-left w-full transition-colors ${
          isActive
            ? 'bg-forest-500 text-white'
            : 'text-[#CFE3D3] hover:bg-white/5 hover:text-white'
        }`}
      >
        <span className={`w-[17px] h-[17px] shrink-0 flex items-center justify-center ${isActive ? 'opacity-100' : 'opacity-85'}`}>{icon}</span> {label}
      </button>
    );
  };

  const NavGroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] uppercase tracking-[.7px] text-[#7FA189] mx-[11px] mt-[16px] mb-[6px]">
      {children}
    </div>
  );

  const nav = (
    <aside className="w-[236px] shrink-0 h-full bg-gradient-to-b from-forest-900 to-forest-800 text-[#EFF6EF] flex flex-col p-[22px_14px] overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <Image src="/logo.png" alt="yoMall logo" width={34} height={34} className="rounded-[9px]" />
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
          <div className="text-[10.5px] text-[#AFC9B4] tracking-[.4px] uppercase mt-[1px]">Property manager</div>
        </div>
      </div>

      <div className="flex-1">
        <NavGroupLabel>Mall operations</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="overview" icon={<LayoutDashboard size={17} />} label="Overview" />
          <NavItem view="floormap" icon={<Grid3x3 size={17} />} label="Floor & Unit Map" />
          <NavItem view="tenants" icon={<Users size={17} />} label="Tenant Directory" />
          <NavItem view="storefront" icon={<Store size={17} />} label="Storefront" />
          <NavItem view="yodeals" icon={<Tag size={17} />} label="Post to yoDeals" />
          <NavItem view="guide" icon={<Flag size={17} />} label="Mall Guide Content" />
        </nav>

        <NavGroupLabel>Insights & tools</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="renewals" icon={<CalendarClock size={17} />} label="Lease Renewals" />
          <NavItem view="reports" icon={<BarChart3 size={17} />} label="Reports" />
          <NavItem view="team" icon={<UsersRound size={17} />} label="Team" />
          <NavItem view="documents" icon={<FolderOpen size={17} />} label="Documents" />
          <NavItem view="handbook" icon={<BookOpen size={17} />} label="Tenant Handbook" />
        </nav>

        <NavGroupLabel>Money & logistics</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="rent" icon={<Wallet size={17} />} label="Rent & Payments" />
          <NavItem view="deliveries" icon={<Truck size={17} />} label="Deliveries & yoDeals Sales" />
          <NavItem view="staff" icon={<Wrench size={17} />} label="Maintenance & Support" />
        </nav>
      </div>

      <div className="mt-[14px] p-[12px_0px] border-t border-white/10 flex items-center gap-[9px]">
        <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">SK</div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">Shema Katende</div>
          <div className="text-[10.5px] text-[#9FC0A6] truncate">Landlord </div>
        </div>
        
      <div className="flex items-center justify-between">
        <button onClick={onLogout} aria-label="Sign out" title="Sign out" className="w-[28px] h-[28px] rounded-[8px] bg-transparent border border-white/15 flex items-center justify-center cursor-pointer text-[#CFE3D3] hover:text-white hover:bg-white/10 transition-colors">
          <LogOut size={14} />
        </button>
      </div>
      </div>

    </aside>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-0 h-screen">
        {nav}
      </div>
      <Sheet open={!!mobileOpen} onClose={closeMobile} side="left" width={320}>
        {nav}
      </Sheet>
    </>
  );
}
