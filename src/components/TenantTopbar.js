'use client';
import React, { useState, useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

export default function TenantTopbar({ title, subtitle, canGoBack, onBack, onNavigate }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifs]);

  return (
    <div className="h-[66px] shrink-0 bg-[#FFFDFA] border-b border-[#EBDCC2] flex items-center justify-between px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[12px]">
        {canGoBack && (
          <button
            onClick={onBack}
            className="text-[14px] bg-transparent border-none cursor-pointer text-[#8A6F3C] hover:text-[#513009] transition-colors px-[4px]"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-[18.5px] font-bold m-0 tracking-[-.2px] text-[#3A2405]">{title}</h1>
          <div className="text-[12px] text-[#A98D5D] mt-[1px] font-medium">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <div className="hidden lg:flex items-center gap-[7px] bg-amber-100 border border-[#EBD9B4] rounded-[9px] p-[7px_11px] text-[12.5px] text-[#7A5714] font-semibold">
          👛 Wallet · <span className="font-mono">RWF 12,500</span>
        </div>

        <span className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-forest-100 text-forest-700 text-[10.5px] font-bold uppercase tracking-[.4px]">
          <span className="w-[6px] h-[6px] rounded-full bg-forest-500"></span> Storefront live
        </span>

        <div className="flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600 w-[200px]">
          🔍 <input placeholder="Search orders, products..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans" />
        </div>

        <div className="relative" ref={notifRef}>
          <div
            className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer relative"
            onClick={() => setShowNotifs(p => !p)}
          >
            🔔
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

        <div className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer">
          ⚙
        </div>
      </div>
    </div>
  );
}
