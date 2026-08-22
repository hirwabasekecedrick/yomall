'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

const KEY = 'yomall-settings';

interface Prefs { email: boolean; push: boolean; digest: boolean }

function load(): Prefs {
  if (typeof window === 'undefined') return { email:true, push:true, digest:false };
  try { return { email:true, push:true, digest:false, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { email:true, push:true, digest:false }; }
}

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ email:true, push:true, digest:false });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setPrefs(load()); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function toggle(k: keyof Prefs) {
    setPrefs(p => {
      const next = { ...p, [k]: !p[k] };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className="w-[34px] h-[34px] rounded-[9px] border border-line bg-white flex items-center justify-center cursor-pointer text-ink-600 hover:text-ink-900 transition-colors"
        title="Notification settings"
        aria-label="Notification settings"
        onClick={() => setOpen(p => !p)}
      >
        <Settings size={16} />
      </div>
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:30,background:'#fff',border:'1px solid #E4E1D6',borderRadius:12,boxShadow:'0 10px 28px rgba(20,30,20,.14)',width:250,padding:'6px'}}>
          <div style={{fontSize:10.5,fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'#8A968D',padding:'8px 10px 4px'}}>Notifications</div>
          {([['email','Email alerts'],['push','Push notifications'],['digest','Weekly summary digest']] as [keyof Prefs,string][]).map(([k,label]) => (
            <button key={k} onClick={() => toggle(k)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'9px 10px',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
              <span style={{fontSize:12.5,fontWeight:600}}>{label}</span>
              <span className={`switch ${prefs[k] ? 'on' : ''}`}><span className="knob"></span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
