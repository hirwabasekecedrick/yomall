'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ArrowLeft, ShieldCheck, Search, Bell } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

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

  return (
    <div className="h-[66px] shrink-0 bg-[#140F22] border-b border-white/10 flex items-center justify-between gap-[10px] px-[14px] sm:px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[10px] sm:gap-[12px] min-w-0">
        {onMenu && (
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="lg:hidden w-[34px] h-[34px] shrink-0 rounded-[9px] border border-white/15 bg-white/5 flex items-center justify-center cursor-pointer text-[#C4B5F0] hover:text-white transition-colors"
          >
            <Menu size={17} />
          </button>
        )}
        {canGoBack && (
          <button
            onClick={onBack}
            className="bg-transparent border-none cursor-pointer text-[#9C8CC4] hover:text-white transition-colors px-[4px]"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-[18.5px] font-bold m-0 tracking-[-.2px] text-white truncate">{title}</h1>
          <div className="hidden sm:block text-[11px] md:text-[12px] text-[#9C8CC4] mt-[1px] font-medium truncate">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] sm:gap-[12px] shrink-0">
        <div className="hidden lg:flex items-center gap-[7px] bg-white/5 border border-white/15 rounded-[9px] p-[7px_11px] text-[12.5px] text-[#B4A8D4] w-[240px]">
          <Search size={14} /> <input placeholder="Search malls, landlords, tenants..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-white font-sans placeholder:text-[#7E6FA3]" />
        </div>

        <div className="relative" ref={notifRef}>
          <div
            className="w-[34px] h-[34px] rounded-[9px] border border-white/15 bg-white/5 flex items-center justify-center cursor-pointer relative text-[#C4B5F0]"
            onClick={() => setShowNotifs(p => !p)}
          >
            <Bell size={16} />
            <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-[#140F22] block"></span>
          </div>
          {showNotifs && (
            <NotificationsDropdown
              show={showNotifs}
              onClose={() => setShowNotifs(false)}
              role="superadmin"
              onNavigate={(view) => { if (onNavigate) onNavigate(view); setShowNotifs(false); }}
            />
          )}
        </div>

        <div className="w-[34px] h-[34px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans cursor-pointer shrink-0">
          PA
        </div>
      </div>
    </div>
  );
}
