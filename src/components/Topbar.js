'use client';
import React, { useState, useRef, useEffect } from 'react';
import NotificationsDropdown from './NotificationsDropdown';

export default function Topbar({ title, subtitle, canGoBack, onBack, role, onNavigate }) {
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
    <div className="h-[66px] shrink-0 bg-[#FFFEFB] border-b border-line flex items-center justify-between px-[26px] sticky top-0 z-10">
      <div className="flex items-center gap-[12px]">
        {canGoBack && (
          <button
            onClick={onBack}
            className="text-[14px] bg-transparent border-none cursor-pointer text-ink-600 hover:text-ink-900 transition-colors px-[4px]"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-[18.5px] font-bold m-0 tracking-[-.2px]">{title}</h1>
          <div className="text-[12px] text-ink-400 mt-[1px] font-medium">{subtitle}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-[12px]">
        <div className="flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600 w-[230px]">
          🔍 <input placeholder="Search tenant, unit, order..." className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans" />
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
              role={role || 'landlord'}
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
