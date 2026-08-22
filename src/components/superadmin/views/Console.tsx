'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { KPI } from '@/components/ui';
import { useSuperadmin } from '@/components/superadmin/SuperadminContext';

export default function ConsoleView() {
  const sa = useSuperadmin();
  const { malls, toggleSuspend } = sa;
  const onEnterMall = sa.enterMall;
  const onOnboardMall = sa.onboardMall;
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    }
    if (menuFor) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuFor]);

  return (
    <div className="view-panel">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[14px] mb-[22px]">
        <KPI label="Malls on platform" value={String(malls.length)} delta={`${malls.filter(m => !m.suspended).length} active`} deltaClass="up" />
        <KPI label="Total tenants" value="486" delta="34 this month" deltaClass="up" />
        <KPI label="Rent collected" value="RWF 210M" delta="across all landlords" deltaClass="flat" />
        <KPI label="Platform MRR" value="RWF 9.6M" delta="8% MoM" deltaClass="up" />
        <KPI label="Landlord accounts" value="6" delta="1 pending verification" deltaClass="flat" />
      </div>
      <div className="section-title">
        <div><h2>Malls &amp; buildings</h2><div className="hint">Every property running on yoMall — open any of them as if you were the landlord</div></div>
        <button className="btn primary" onClick={onOnboardMall}>+ Onboard new mall</button>
      </div>
      <div className="mall-grid">
        {malls.map(m => (
          <div key={m.name} className="mall-card" style={m.suspended ? {opacity:.65} : undefined}>
            <div className="mall-cover" style={{background:`linear-gradient(135deg, ${m.color}, #2E1065)`}}>
              <div className="mc-plan">{m.plan} plan{m.suspended ? ' · suspended' : ''}</div>
            </div>
            <div className="mall-body">
              <div className="mall-name">{m.name}</div>
              <div className="mall-loc">{m.loc}</div>
              <div className="mall-stats">
                <div className="ms"><b>{m.tenants}</b><span>Tenants</span></div>
                <div className="ms"><b>{m.occ}</b><span>Occupied</span></div>
                <div className="ms"><b>{m.gmv}</b><span>GMV RWF</span></div>
              </div>
              <div className="mall-foot">
                <div style={{position:'relative'}} ref={menuFor === m.name ? menuRef : undefined}>
                  <button className="btn ghost" style={{flex:0,padding:'8px 10px'}} title="More actions" aria-label={`Actions for ${m.name}`} onClick={() => setMenuFor(p => p === m.name ? null : m.name)}><MoreHorizontal size={15} /></button>
                  {menuFor === m.name && (
                    <div style={{position:'absolute',bottom:'calc(100% + 6px)',left:0,zIndex:20,background:'#fff',border:'1px solid #E4E1D6',borderRadius:10,boxShadow:'0 8px 24px rgba(20,30,20,.12)',minWidth:180,overflow:'hidden'}}>
                      <button style={{display:'block',width:'100%',textAlign:'left',padding:'9px 12px',fontSize:12,background:'none',border:'none',cursor:'pointer'}} onClick={() => { setMenuFor(null); onEnterMall(m.name); }}>Enter dashboard</button>
                      <button style={{display:'block',width:'100%',textAlign:'left',padding:'9px 12px',fontSize:12,background:'none',border:'none',cursor:'pointer',color:m.suspended ? '#4B5A50' : '#D64545'}} onClick={() => { setMenuFor(null); toggleSuspend(m.name); }}>{m.suspended ? 'Reactivate mall' : 'Suspend mall'}</button>
                    </div>
                  )}
                </div>
                <button className="btn primary" style={{flex:1,justifyContent:'center',gap:6}} onClick={() => onEnterMall(m.name)}>{m.suspended ? 'Preview dashboard' : 'Enter dashboard'} <ArrowRight size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
