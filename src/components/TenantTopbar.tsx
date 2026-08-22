'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ArrowLeft, Wallet, Bell } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import SettingsMenu from './SettingsMenu';
import QuickSearch, { SearchItem } from './QuickSearch';

export default function TenantTopbar({ title, subtitle, canGoBack, onBack, onNavigate, onMenu }: { title: string; subtitle?: string; canGoBack?: boolean; onBack?: () => void; onNavigate?: (v: string) => void; onMenu?: () => void }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifs]);

  const searchItems: SearchItem[] = onNavigate ? [
    { label:'Overview', sub:'Page', action:() => onNavigate('overview') },
    { label:'My orders', sub:'Page', action:() => onNavigate('orders') },
    { label:'Rent & payments', sub:'Page', action:() => onNavigate('rent') },
    { label:'Lease agreement', sub:'Page', action:() => onNavigate('lease') },
    { label:'Messages', sub:'Page', action:() => onNavigate('messages') },
    { label:'My storefront', sub:'Page — manage shop profile', action:() => onNavigate('storefront') },
    { label:'Post to yoDeals', sub:'Page — deals & discounts', action:() => onNavigate('yodeals') },
    { label:'Staff directory', sub:'Page — building staff', action:() => onNavigate('staff') },
    { label:'Mall handbook', sub:'Page — building rules', action:() => onNavigate('handbook') },
  ] : [];

  return (
    <div className="h-[66px] shrink-0 bg-[#FFFEFB] border-b border-line flex items-center justify-between gap-[10px] px-[14px] sm:px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[10px] sm:gap-[12px] min-w-0">
        {onMenu && (
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="lg:hidden w-[34px] h-[34px] shrink-0 rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer text-ink-600 hover:text-ink-900 transition-colors"
          >
            <Menu size={17} />
          </button>
        )}
        {canGoBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="bg-transparent border-none cursor-pointer text-ink-600 hover:text-ink-900 transition-colors px-[4px]"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-[18.5px] font-bold m-0 tracking-[-.2px] truncate">{title}</h1>
          <div className="hidden sm:block text-[11px] md:text-[12px] text-ink-400 mt-[1px] font-medium truncate">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] sm:gap-[12px] shrink-0">
        <div className="hidden lg:flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600 font-semibold">
          <Wallet size={14} /> <span className="font-mono">RWF 12,500</span>
        </div>

        <QuickSearch items={searchItems} placeholder="Search pages..." width={200} />

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer relative text-ink-600"
            onClick={() => setShowNotifs(p => !p)}
          >
            <Bell size={16} />
            <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white block"></span>
          </button>
          {showNotifs && (
            <NotificationsDropdown
              show={showNotifs}
              onClose={() => setShowNotifs(false)}
              role="tenant"
              onNavigate={(view) => { if (onNavigate) onNavigate(view); setShowNotifs(false); }}
            />
          )}
        </div>

        <SettingsMenu />

        <div className="w-[34px] h-[34px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans cursor-pointer shrink-0">
          NT
        </div>
      </div>
    </div>
  );
}
