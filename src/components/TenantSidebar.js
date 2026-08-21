'use client';
import React from 'react';
import Image from 'next/image';

export default function TenantSidebar({ currentView, setView, onLogout }) {
  const NavItem = ({ view, icon, label }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex items-center gap-[11px] p-[9px_11px] rounded-[9px] text-[13.4px] font-medium cursor-pointer text-left w-full transition-colors ${
          isActive
            ? 'bg-amber-500 text-[#3A2405]'
            : 'text-[#F3E4C6] hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-85'}`}>{icon}</span> {label}
      </button>
    );
  };

  const NavGroupLabel = ({ children }) => (
    <div className="text-[10px] uppercase tracking-[.7px] text-[#CDAF7E] mx-[11px] mt-[16px] mb-[6px]">
      {children}
    </div>
  );

  return (
    <aside className="w-[236px] shrink-0 bg-gradient-to-b from-[#513009] to-[#7A4E14] text-[#FDF6EA] flex flex-col p-[22px_14px] sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <Image src="/logo.png" alt="yoMall logo" width={34} height={34} className="rounded-[9px]" />
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
          <div className="text-[10.5px] text-[#E4C892] tracking-[.4px] uppercase mt-[1px]">Tenant portal</div>
        </div>
      </div>

      <div className="bg-white/10 border border-white/15 rounded-[10px] p-[9px_11px] mb-[18px] cursor-pointer">
        <div className="text-[9.5px] uppercase tracking-[.6px] text-[#E4C892] mb-[2px]">My shop</div>
        <div className="text-[13px] font-semibold flex items-center justify-between">
          Nyabugogo TechHub
        </div>
        <div className="text-[10.5px] text-[#E4C892] mt-[2px]">Unit G-14 · Kigali Convention Mall</div>
      </div>

      <div className="flex-1">
        <NavGroupLabel>My shop</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="t-overview" icon="◆" label="Overview" />
          <NavItem view="storefront" icon="✎" label="My Storefront" />
          <NavItem view="yodeals" icon="🏷️" label="Post to yoDeals" />
          <NavItem view="t-orders" icon="➤" label="My Orders" />
          <NavItem view="t-rent" icon="₣" label="My Rent" />
          <NavItem view="t-lease" icon="📜" label="My Lease" />
          <NavItem view="t-messages" icon="💬" label="Messages" />
        </nav>
        <NavGroupLabel>Support</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="staff" icon="✚" label="Maintenance Directory" />
          <NavItem view="handbook" icon="📘" label="Tenant Handbook" />
        </nav>
      </div>

      <div className="mt-[14px] p-[12px_11px] border-t border-white/15 flex items-center gap-[9px]">
        <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-[#3A2405] flex items-center justify-center font-bold text-[12px] font-sans shrink-0">AU</div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">Aline Uwera</div>
          <div className="text-[10.5px] text-[#E4C892] truncate">Tenant · Nyabugogo TechHub</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-[4px_11px_0]">
        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/15 text-white text-[9px] font-bold uppercase tracking-[.5px]">Tenant</span>
        <button onClick={onLogout} className="text-[12px] font-semibold text-[#F3E4C6] bg-transparent border-none cursor-pointer">Sign out</button>
      </div>
    </aside>
  );
}
