'use client';
import React, { useState, useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

export default function SuperadminTopbar({ title, subtitle, canGoBack, onBack, onNavigate }) {
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
    <div className="h-[66px] shrink-0 bg-[#140F22] border-b border-white/10 flex items-center justify-between px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[12px]">
        {canGoBack && (
          <button
            onClick={onBack}
            className="text-[14px] bg-transparent border-none cursor-pointer text-[#9C8CC4] hover:text-white transition-colors px-[4px]"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-[18.5px] font-bold m-0 tracking-[-.2px] text-white">{title}</h1>
          <div className="text-[12px] text-[#9C8CC4] mt-[1px] font-medium">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-forest-500/20 text-[#C4B5F0] text-[10px] font-bold uppercase tracking-[.6px] border border-forest-500/40">
          🛡️ Platform
        </span>

        <div className="flex items-center gap-[7px] bg-white/5 border border-white/15 rounded-[9px] p-[7px_11px] text-[12.5px] text-[#B4A8D4] w-[240px]">
          🔍 <input placeholder="Search malls, landlords, tenants..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-white font-sans placeholder:text-[#7E6FA3]" />
        </div>

        <div className="relative" ref={notifRef}>
          <div
            className="w-[34px] h-[34px] rounded-[9px] border border-white/15 bg-white/5 flex items-center justify-center cursor-pointer relative"
            onClick={() => setShowNotifs(p => !p)}
          >
            🔔
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

        <div className="w-[34px] h-[34px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans cursor-pointer">
          PA
        </div>
      </div>
    </div>
  );
}
