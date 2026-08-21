'use client';
import React from 'react';
import Image from 'next/image';

export default function SuperadminSidebar({ currentView, setView, onLogout }) {
  const NavItem = ({ view, icon, label }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex items-center gap-[11px] p-[9px_11px] rounded-[9px] text-[13.4px] font-medium cursor-pointer text-left w-full transition-colors ${
          isActive
            ? 'bg-forest-500 text-white'
            : 'text-[#B4A8D4] hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-85'}`}>{icon}</span> {label}
      </button>
    );
  };

  const NavGroupLabel = ({ children }) => (
    <div className="text-[10px] uppercase tracking-[.7px] text-[#7E6FA3] mx-[11px] mt-[16px] mb-[6px]">
      {children}
    </div>
  );

  return (
    <aside className="w-[236px] shrink-0 bg-gradient-to-b from-[#140F22] to-[#251739] text-[#F0EDF8] flex flex-col p-[22px_14px] sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <Image src="/logo.png" alt="yoMall logo" width={34} height={34} className="rounded-[9px]" />
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
          <div className="text-[10.5px] text-[#9C8CC4] tracking-[.4px] uppercase mt-[1px]">Platform admin</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[10px] p-[9px_11px] mb-[18px]">
        <div className="text-[9.5px] uppercase tracking-[.6px] text-[#9C8CC4] mb-[6px]">Access level</div>
        <select className="w-full bg-white/10 text-white border border-white/20 rounded-[8px] p-[6px_8px] text-[12px] outline-none">
          <option value="full">Full Admin</option>
          <option value="finance">Finance Admin</option>
          <option value="support">Support Agent</option>
        </select>
      </div>

      <div className="flex-1">
        <NavGroupLabel>Platform</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem view="console" icon="▤" label="Platform Console" />
          <NavItem view="landlords" icon="🧑‍💼" label="Landlords" />
          <NavItem view="lending" icon="🏦" label="Lending Partner" />
          <NavItem view="performance" icon="📊" label="Mall Performance" />
          <NavItem view="moderation" icon="🛡️" label="Deal Moderation" />
          <NavItem view="escalations" icon="⚖️" label="Escalations" />
          <NavItem view="broadcast" icon="📣" label="Broadcast" />
          <NavItem view="privacy" icon="🔒" label="Privacy & Data" />
          <NavItem view="audit" icon="🕓" label="Audit Log" />
        </nav>
      </div>

      <div className="mt-[14px] p-[12px_11px] border-t border-white/10 flex items-center gap-[9px]">
        <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">PA</div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">Platform Admin</div>
          <div className="text-[10.5px] text-[#9C8CC4] truncate">Superadmin · all malls</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-[4px_11px_0]">
        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-[.5px]">Superadmin</span>
        <button onClick={onLogout} className="text-[12px] font-semibold text-[#B4A8D4] bg-transparent border-none cursor-pointer">Sign out</button>
      </div>
    </aside>
  );
}
