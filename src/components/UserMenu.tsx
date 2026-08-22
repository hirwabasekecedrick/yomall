'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, UserRound, LogOut } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function UserMenu({ initials, name, meta }: { initials: string; name: string; meta: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        aria-label="Account menu"
        aria-expanded={open}
        className={`flex items-center gap-[6px] h-[34px] pl-[3px] pr-[7px] rounded-full border cursor-pointer transition-colors ${open ? 'border-forest-500 bg-forest-100' : 'border-line bg-white hover:border-forest-500/50'}`}
      >
        <span className="w-[28px] h-[28px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[10.5px] font-sans shrink-0">
          {initials}
        </span>
        <ChevronDown size={13} className={open ? 'text-forest-700' : 'text-ink-400'} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[230px] bg-white border border-[#E4E1D6] rounded-[12px] shadow-[0_8px_30px_rgba(20,30,20,0.12)] overflow-hidden z-50 text-left">
          <div className="flex items-center gap-[10px] p-[12px_14px]">
            <span className="w-[34px] h-[34px] rounded-full bg-amber-500 text-forest-900 flex items-center justify-center font-bold text-[12px] font-sans shrink-0">
              {initials}
            </span>
            <div className="min-w-0">
              <div className="text-[12.8px] font-bold truncate">{name}</div>
              <div className="text-[10.5px] text-[#8A968D] truncate">{meta}</div>
            </div>
          </div>
          <div style={{borderTop:'1px solid #F2EFE6'}} />
          <button
            className="w-full flex items-center gap-[9px] px-[14px] py-[9px] bg-transparent border-none cursor-pointer text-[12.5px] font-semibold text-ink-700 hover:bg-[#FAF8F3]"
            onClick={() => { toast('Profile management coming soon'); setOpen(false); }}
          >
            <UserRound size={15} /> Profile
          </button>
          <button
            className="w-full flex items-center gap-[9px] px-[14px] py-[9px] pb-[11px] bg-transparent border-none cursor-pointer text-[12.5px] font-semibold hover:bg-red-50"
            style={{color:'#D64545',borderTop:'1px solid #F2EFE6'}}
            onClick={() => router.push('/')}
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
