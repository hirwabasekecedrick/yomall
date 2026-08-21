'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ArrowLeft, Search, Bell, Settings } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

export default function LandlordTopbar({ title, subtitle, canGoBack, onBack, onNavigate, onMenu }: { title: string; subtitle?: string; canGoBack?: boolean; onBack?: () => void; onNavigate?: (v: string) => void; onMenu?: () => void }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
    <>
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
          <button
            onClick={() => setShowSearch(p => !p)}
            aria-label="Toggle search"
            className={`md:hidden w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center cursor-pointer ${showSearch ? 'border-forest-500 bg-forest-100 text-forest-700' : 'border-line bg-white text-ink-600'}`}
          >
            <Search size={15} />
          </button>

          <div className="hidden md:flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600 w-[230px] lg:w-[260px]">
            <Search size={14} /> <input placeholder="Search tenant, unit, order..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans" />
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
                role="landlord"
                onNavigate={(view) => { if (onNavigate) onNavigate(view); setShowNotifs(false); }}
              />
            )}
          </div>

          <div className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer text-ink-600">
            <Settings size={16} />
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden bg-[#FFFEFB] border-b border-line px-[14px] py-[10px] sticky top-[66px] z-10">
          <div className="flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[8px_11px] text-[12.5px] text-ink-600">
            <Search size={14} /> <input autoFocus placeholder="Search tenant, unit, order..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans" />
          </div>
        </div>
      )}
    </>
  );
}
