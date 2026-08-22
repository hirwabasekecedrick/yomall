"use client";
import React from "react";
import Image from "next/image";
import Sheet from "./Sheet";
import {
  LayoutDashboard,
  Store,
  Tag,
  Package,
  Wallet,
  ScrollText,
  MessageSquare,
  Wrench,
  BookOpen,
  LogOut,
} from "lucide-react";

export default function TenantSidebar({
  currentView,
  setView,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: {
  currentView: string;
  setView: (v: string) => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}) {
  const closeMobile = () => setMobileOpen && setMobileOpen(false);
  const handleNavigate = (view: string) => {
    setView(view);
    closeMobile();
  };

  const NavItem = ({
    view,
    icon,
    label,
  }: {
    view: string;
    icon: React.ReactNode;
    label: string;
  }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavigate(view)}
        className={`flex items-center gap-[11px] p-[9px_11px] rounded-[9px] text-[13.4px] font-medium cursor-pointer text-left w-full transition-colors ${
          isActive
            ? "bg-forest-500 text-white"
            : "text-[#CFE3D3] hover:bg-white/5 hover:text-white"
        }`}
      >
        <span
          className={`w-[17px] h-[17px] shrink-0 flex items-center justify-center ${isActive ? "opacity-100" : "opacity-85"}`}
        >
          {icon}
        </span>{" "}
        {label}
      </button>
    );
  };

  const NavGroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] uppercase tracking-[.7px] text-[#7FA189] mx-[11px] mt-[16px] mb-[6px]">
      {children}
    </div>
  );

  const nav = (
    <aside className="w-full sm:w-[236px] shrink-0 h-full bg-gradient-to-b from-forest-900 to-forest-800 text-[#EFF6EF] flex flex-col p-[22px_14px] overflow-y-auto">
      <div className="flex items-center gap-[10px] p-[4px_8px_22px_8px]">
        <Image
          src="/logo.png"
          alt="yoMall logo"
          width={34}
          height={34}
          className="rounded-[9px]"
        />
        <div>
          <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">
            yoMall
          </div>
          <div className="text-[10.5px] text-[#AFC9B4] tracking-[.4px] uppercase mt-[1px]">
            Tenant portal
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[10px] p-[9px_11px] mb-[18px] cursor-pointer">
        <div className="text-[9.5px] uppercase tracking-[.6px] text-[#9FC0A6] mb-[2px]">
          My shop
        </div>
        <div className="text-[13px] font-semibold flex items-center justify-between">
          Nyabugogo TechHub
        </div>
        <div className="text-[10.5px] text-[#9FC0A6] mt-[2px]">
          Unit G-14 · Kigali Convention Mall
        </div>
      </div>

      <div className="flex-1">
        <NavGroupLabel>My shop</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem
            view="overview"
            icon={<LayoutDashboard size={17} />}
            label="Overview"
          />
          <NavItem
            view="storefront"
            icon={<Store size={17} />}
            label="My Storefront"
          />
          <NavItem
            view="yodeals"
            icon={<Tag size={17} />}
            label="Post to yoDeals"
          />
          <NavItem
            view="orders"
            icon={<Package size={17} />}
            label="My Orders"
          />
          <NavItem view="rent" icon={<Wallet size={17} />} label="My Rent" />
          <NavItem
            view="lease"
            icon={<ScrollText size={17} />}
            label="My Lease"
          />
          <NavItem
            view="messages"
            icon={<MessageSquare size={17} />}
            label="Messages"
          />
        </nav>
        <NavGroupLabel>Support</NavGroupLabel>
        <nav className="flex flex-col gap-[2px]">
          <NavItem
            view="staff"
            icon={<Wrench size={17} />}
            label="Maintenance Directory"
          />
          <NavItem
            view="handbook"
            icon={<BookOpen size={17} />}
            label="Tenant Handbook"
          />
        </nav>
      </div>

      <div className="mt-[14px] p-[12px_0px] border-t border-white/10 flex items-center gap-[9px]">
        <div className="w-[30px] h-[30px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">
          AU
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">
            Aline Uwera
          </div>
          <div className="text-[10.5px] text-[#9FC0A6] truncate">
            Tenant · Nyabugogo TechHub
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <button
            onClick={onLogout}
            aria-label="Sign out"
            title="Sign out"
            className="w-[28px] h-[28px] rounded-[8px] bg-transparent border border-white/15 flex items-center justify-center cursor-pointer text-[#CFE3D3] hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-0 h-screen">{nav}</div>
      <Sheet open={!!mobileOpen} onClose={closeMobile} side="left" width={320}>
        {nav}
      </Sheet>
    </>
  );
}
