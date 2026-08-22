'use client';
import React from 'react';
import { Badge } from '@/components/ui';

export default function PerformanceView() {
  const malls = [
    {name:'Kigali Convention Mall',occ:'87%',maint:'6.5h',msg:'1.8h',t:42,ms:'paid'},
    {name:'Musanze Heritage Plaza',occ:'71%',maint:'14.2h',msg:'6.8h',t:24,ms:'due'},
    {name:'Huye Trade Center',occ:'92%',maint:'5.1h',msg:'1.8h',t:36,ms:'paid'},
    {name:'Remera Business Arcade',occ:'95%',maint:'4.3h',msg:'1.2h',t:51,ms:'paid'},
    {name:'Rubavu Lakeside Mall',occ:'64%',maint:'19.6h',msg:'9.4h',t:19,ms:'overdue'},
    {name:'Nyamirambo Craft Market',occ:'38%',maint:'28h',msg:'15.5h',t:11,ms:'overdue'}
  ];
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Mall Performance</h2><div className="hint">Operational SLA metrics — spot which malls need help before it becomes a problem</div></div></div>

      {/* Desktop rows */}
      <div className="card hidden md:block">
        <div className="card-body">
          {malls.map((p,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom: i < malls.length - 1 ? '1px solid #F2EFE6' : 'none'}}>
              <div style={{flex:1.5,fontWeight:700,fontSize:13.5}}>{p.name}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}>{p.occ}</div><div style={{fontSize:11,color:'#8A968D'}}>Occupancy</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}><Badge type={p.ms} label={p.maint} /></div><div style={{fontSize:11,color:'#8A968D'}}>Avg. maintenance</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}><Badge type={p.ms} label={p.msg} /></div><div style={{fontSize:11,color:'#8A968D'}}>Avg. response</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}>{p.t}</div><div style={{fontSize:11,color:'#8A968D'}}>Tenants</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-[10px]">
        {malls.map((p,i) => (
          <div key={i} style={{border:'1px solid #E4E1D6',borderRadius:12,padding:'12px 14px',background:'#fff'}}>
            <div className="text-[13px] font-bold">{p.name}</div>
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px] mt-[10px]" style={{borderTop:'1px solid #F2EFE6',paddingTop:10}}>
              <div><div className="text-[14px] font-bold">{p.occ}</div><div className="text-[10.5px] text-[#8A968D]">Occupancy</div></div>
              <div><div className="text-[14px] font-bold"><Badge type={p.ms} label={p.maint} /></div><div className="text-[10.5px] text-[#8A968D]">Avg. maintenance</div></div>
              <div><div className="text-[14px] font-bold"><Badge type={p.ms} label={p.msg} /></div><div className="text-[10.5px] text-[#8A968D]">Avg. response</div></div>
              <div><div className="text-[14px] font-bold">{p.t}</div><div className="text-[10.5px] text-[#8A968D]">Tenants</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
