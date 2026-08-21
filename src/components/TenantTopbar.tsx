'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ArrowLeft, Wallet, Search, Bell, Settings } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

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

  return (
    <div className="h-[66px] shrink-0 bg-[#FFFDFA] border-b border-[#EBDCC2] flex items-center justify-between gap-[10px] px-[14px] sm:px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[10px] sm:gap-[12px] min-w-0">
        {onMenu && (
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="lg:hidden w-[34px] h-[34px] shrink-0 rounded-[9px] border border-[#EBD9B4] bg-white flex items-center justify-center cursor-pointer text-[#8A6F3C] hover:text-[#513009] transition-colors"
          >
            <Menu size={17} />
          </button>
        )}
        {canGoBack && (
          <button
            onClick={onBack}
            className="bg-transparent border-none cursor-pointer text-[#8A6F3C] hover:text-[#513009] transition-colors px-[4px]"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-[18.5px] font-bold m-0 tracking-[-.2px] text-[#3A2405] truncate">{title}</h1>
          <div className="hidden sm:block text-[11px] md:text-[12px] text-[#A98D5D] mt-[1px] font-medium truncate">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] sm:gap-[12px] shrink-0">
        {/* <div className="hidden lg:flex items-center gap-[7px] bg-amber-100 border border-[#EBD9B4] rounded-[9px] p-[7px_11px] text-[12.5px] text-[#7A5714] font-semibold">
          <Wallet size={14} /> <span className="font-mono">RWF 12,500</span>
        </div> */}

        <div className="hidden xl:flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600 w-[200px]">
          <Search size={14} /> <input placeholder="Search orders, products..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans" />
        </div>

        <div className="relative" ref={notifRef}>
          <div
            className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer relative text-ink-600"
            onClick={() => setShowNotifs(p => !p)}
          >
            <Bell size={16} />
            <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white block"></span>
          </div>
          {showNotifs && (
            <NotificationsDropdown
              show={showNotifs}
              onClose={() => setShowNotifs(false)}
              role="tenant"
              onNavigate={(view) => { if (onNavigate) onNavigate(view); setShowNotifs(false); }}
            />
          )}
        </div>

        <div className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer text-ink-600">
          <Settings size={16} />
        </div>
      </div>
    </div>
  );
}
