'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';

export interface SearchItem { label: string; sub: string; action: () => void }

export default function QuickSearch({ items, placeholder, width = 230 }: { items: SearchItem[]; placeholder: string; width?: number }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const query = q.trim().toLowerCase();
  const matches = query ? items.filter(i => `${i.label} ${i.sub}`.toLowerCase().includes(query)).slice(0, 7) : [];

  function run(item?: SearchItem) {
    const target = item || matches[0];
    if (!target) return;
    target.action();
    setQ('');
    setOpen(false);
  }

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <div className="flex items-center gap-[7px] bg-cream-100 border border-line rounded-[9px] p-[7px_11px] text-[12.5px] text-ink-600" style={{width}}>
        <Search size={14} />
        <input
          type="search"
          aria-label={placeholder}
          value={q}
          placeholder={placeholder}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => { if (e.key === 'Enter') run(); if (e.key === 'Escape') setOpen(false); }}
          className="border-none bg-transparent outline-none text-[12.5px] w-full text-ink-900 font-sans"
        />
      </div>
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,right:0,zIndex:30,background:'#fff',border:'1px solid #E4E1D6',borderRadius:12,boxShadow:'0 10px 28px rgba(20,30,20,.14)',overflow:'hidden'}}>
          {matches.length === 0 && (
            <div style={{padding:'10px 12px',fontSize:12,color:'#8A968D'}}>{query ? `No matches for "${q}"` : 'Type to search pages and records'}</div>
          )}
          {matches.map((m,i) => (
            <button key={`${m.label}-${i}`} onClick={() => run(m)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,width:'100%',textAlign:'left',padding:'9px 12px',background:'none',border:'none',borderTop:i ? '1px solid #F2EFE6' : 'none',cursor:'pointer'}}>
              <span>
                <span style={{display:'block',fontSize:12.5,fontWeight:700}}>{m.label}</span>
                <span style={{display:'block',fontSize:10.5,color:'#8A968D'}}>{m.sub}</span>
              </span>
              {i === 0 && <CornerDownLeft size={12} color="#8A968D" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
