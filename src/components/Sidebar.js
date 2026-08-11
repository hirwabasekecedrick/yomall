'use client';
import React from 'react';

export default function Sidebar({ currentRole, currentView, setView, onLogout }) {
  const NavItem = ({ view, icon, label }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setView(view)}
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

  return (
    <aside className="w-[236px] shrink-0 bg-gradient-to-b from-forest-900 to-forest-800 text-[#EFF6EF] flex flex-col p-[22px_14px] sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-amber-500 flex items-center justify-center font-sans font-extrabold text-forest-900 text-[16px]">
          yM
        </div>
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
          <div className="text-[10.5px] text-[#AFC9B4] tracking-[.4px] uppercase mt-[1px]">Property manager</div>
        </div>
      </div>

      {currentRole === 'tenant' ? (
        <div className="bg-white/5 border border-white/10 rounded-[10px] p-[9px_11px] mb-[18px] cursor-pointer">
          <div className="text-[9.5px] uppercase tracking-[.6px] text-[#9FC0A6] mb-[2px]">My shop</div>
          <div className="text-[13px] font-semibold flex items-center justify-between">
            Nyabugogo TechHub
          </div>
          <div className="text-[10.5px] text-[#9FC0A6] mt-[2px]">Unit G-14 · Kigali Convention Mall</div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[10px] p-[9px_11px] mb-[18px] cursor-pointer">
          <div className="text-[9.5px] uppercase tracking-[.6px] text-[#9FC0A6] mb-[2px]">Managing</div>
          <div className="text-[13px] font-semibold flex items-center justify-between">
            Kigali Convention Mall <span>⌄</span>
          </div>
        </div>
      )}

      <div className="flex-1">
        {currentRole === 'superadmin' && (
          <>
            <NavGroupLabel>Platform</NavGroupLabel>
            <div className="mb-[6px] px-[11px]">
              <select className="w-full bg-white/10 text-white border border-white/20 rounded-[8px] p-[6px_8px] text-[12px] outline-none">
                <option value="full">Full Admin</option>
                <option value="finance">Finance Admin</option>
                <option value="support">Support Agent</option>
              </select>
            </div>
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
          </>
        )}

        {currentRole === 'tenant' && (
          <>
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
          </>
        )}

        {currentRole === 'landlord' && (
          <>
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
          </>
        )}
      </div>

      <div className="mt-[14px] p-[12px_11px] border-t border-white/10 flex items-center gap-[9px]">
        {currentRole === 'superadmin' && (
          <>
            <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">PA</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-white">Platform Admin</div>
              <div className="text-[10.5px] text-[#9FC0A6] truncate">Superadmin · all malls</div>
            </div>
          </>
        )}
        {currentRole === 'tenant' && (
          <>
            <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">AU</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-white">Aline Uwera</div>
              <div className="text-[10.5px] text-[#9FC0A6] truncate">Tenant · Nyabugogo TechHub</div>
            </div>
          </>
        )}
        {currentRole === 'landlord' && (
          <>
            <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">SK</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-white">Shema Katende</div>
              <div className="text-[10.5px] text-[#9FC0A6] truncate">Landlord · Kigali Convention Mall</div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between p-[4px_11px_0]">
        {currentRole === 'superadmin' && <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-[.5px]">Superadmin</span>}
        {currentRole === 'landlord' && <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-[.5px]">Landlord</span>}
        {currentRole === 'tenant' && <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-[.5px]">Tenant</span>}
        
        <button onClick={onLogout} className="text-[12px] font-semibold text-[#CFE3D3] bg-transparent border-none cursor-pointer">Sign out</button>
      </div>
    </aside>
  );
}
