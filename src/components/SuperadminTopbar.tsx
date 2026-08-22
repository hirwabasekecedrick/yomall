'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ArrowLeft, ShieldCheck, Bell } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import SettingsMenu from './SettingsMenu';
import QuickSearch, { SearchItem } from './QuickSearch';
import { initialMalls } from '@/lib/data';

export default function SuperadminTopbar({ title, subtitle, canGoBack, onBack, onNavigate, onMenu }: { title: string; subtitle?: string; canGoBack?: boolean; onBack?: () => void; onNavigate?: (v: string) => void; onMenu?: () => void }) {
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

  const searchItems: SearchItem[] = [
    ...(onNavigate ? [
      { label:'Platform console', sub:'Page', action:() => onNavigate('console') },
      { label:'Landlords', sub:'Page', action:() => onNavigate('landlords') },
      { label:'Lending', sub:'Page', action:() => onNavigate('lending') },
      { label:'Performance', sub:'Page', action:() => onNavigate('performance') },
      { label:'Deal moderation', sub:'Page', action:() => onNavigate('moderation') },
      { label:'Escalations', sub:'Page', action:() => onNavigate('escalations') },
      { label:'Broadcast', sub:'Page', action:() => onNavigate('broadcast') },
      { label:'Privacy & data', sub:'Page', action:() => onNavigate('privacy') },
      { label:'Audit log', sub:'Page', action:() => onNavigate('audit') },
    ] : []),
    ...initialMalls.map(m => ({ label:m.name, sub:`Mall · ${m.loc}`, action:() => window.location.assign(`/landlord/overview?mall=${encodeURIComponent(m.name)}&sa=1`) })),
  ];

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
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-forest-500/10 text-forest-700 text-[10px] font-bold uppercase tracking-[.6px] border border-forest-500/30">
          <ShieldCheck size={12} /> Platform
        </span>

        <QuickSearch items={searchItems} placeholder="Search malls, pages..." width={240} />

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
              role="superadmin"
              onNavigate={(view) => { if (onNavigate) onNavigate(view); setShowNotifs(false); }}
            />
          )}
        </div>

        <SettingsMenu />

        <div className="w-[34px] h-[34px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans cursor-pointer shrink-0">
          PA
        </div>
      </div>
    </div>
  );
}
