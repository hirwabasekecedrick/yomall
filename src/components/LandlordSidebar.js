'use client';
import React from 'react';
import Image from 'next/image';
import Sheet from './Sheet';

export default function LandlordSidebar({ currentView, setView, onLogout, mobileOpen, setMobileOpen }) {
  const closeMobile = () => setMobileOpen && setMobileOpen(false);
  const handleNavigate = (view) => {
    setView(view);
    closeMobile();
  };

  const NavItem = ({ view, icon, label }) => {
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
        <span className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-85'}`}>{icon}</span> {label}
      </button>
    );
  };

  const NavGroupLabel = ({ children }) => (
    <div className="text-[10px] uppercase tracking-[.7px] text-[#7FA189] mx-[11px] mt-[16px] mb-[6px]">
      {children}
    </div>
  );

  const nav = (
    <aside className="w-full sm:w-[236px] shrink-0 h-full bg-gradient-to-b from-forest-900 to-forest-800 text-[#EFF6EF] flex flex-col p-[22px_14px] overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <Image src="/logo.png" alt="yoMall logo" width={34} height={34} className="rounded-[9px]" />
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
          <div className="text-[10.5px] text-[#AFC9B4] tracking-[.4px] uppercase mt-[1px]">Property manager</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[10px] p-[9px_11px] mb-[18px] cursor-pointer">
        <div className="text-[9.5px] uppercase tracking-[.6px] text-[#9FC0A6] mb-[2px]">Managing</div>
        <div className="text-[13px] font-semibold flex items-center justify-between">
          Kigali Convention Mall <span>⌄</span>
        </div>
      </div>

      <div className="flex-1">
        <NavGroupLabel>Mall operations</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="overview" icon="◆" label="Overview" />
          <NavItem view="floormap" icon="▦" label="Floor & Unit Map" />
          <NavItem view="tenants" icon="☰" label="Tenant Directory" />
          <NavItem view="storefront" icon="✎" label="Storefront" />
          <NavItem view="yodeals" icon="🏷️" label="Post to yoDeals" />
          <NavItem view="guide" icon="⚑" label="Mall Guide Content" />
        </nav>

        <NavGroupLabel>Insights & tools</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="renewals" icon="⟲" label="Lease Renewals" />
          <NavItem view="reports" icon="▤" label="Reports" />
          <NavItem view="team" icon="◈" label="Team" />
          <NavItem view="documents" icon="▥" label="Documents" />
          <NavItem view="handbook" icon="📘" label="Tenant Handbook" />
        </nav>

        <NavGroupLabel>Money & logistics</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="rent" icon="₣" label="Rent & Payments" />
          <NavItem view="deliveries" icon="➤" label="Deliveries & yoDeals Sales" />
          <NavItem view="staff" icon="✚" label="Maintenance & Support" />
        </nav>
      </div>

      <div className="mt-[14px] p-[12px_11px] border-t border-white/10 flex items-center gap-[9px]">
        <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">SK</div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">Shema Katende</div>
          <div className="text-[10.5px] text-[#9FC0A6] truncate">Landlord · Kigali Convention Mall</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-[4px_11px_0]">
        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-[.5px]">Landlord</span>
        <button onClick={onLogout} className="text-[12px] font-semibold text-[#CFE3D3] bg-transparent border-none cursor-pointer">Sign out</button>
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
