'use client';
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { initialFloors } from '@/lib/data';
import { useLandlord } from '@/components/landlord/LandlordContext';
import { useToast } from '@/components/Toast';

export default function FloorMapView() {
  const [activeFloor, setActiveFloor] = useState('G');
  const [listedUnits, setListedUnits] = useState<{ unit: string; floor: string }[]>([]);
  const { tenants, manageTenant, startOnboarding } = useLandlord();
  const toast = useToast();
  const units = initialFloors[activeFloor] || [];

  function handleUnitClick(u: { n: string; s: string; t?: string }) {
    if (u.s === 'vacant') {
      if (listedUnits.some(l => l.unit === u.n)) { toast(`Unit ${u.n} is already listed`); return; }
      setListedUnits(p => [...p, { unit:u.n, floor:activeFloor }]);
      toast(`Unit ${u.n} listed — prospective tenants can now inquire`);
      return;
    }
    const tenant = tenants.find(t => t.unit === `${activeFloor === 'G' ? 'G' : activeFloor + 'F'}-${u.n.split('-')[1]}`) || tenants.find(t => t.unit.endsWith(u.n));
    if (tenant) manageTenant(tenant);
    else startOnboarding();
  }

  return (
    <div className="view-panel">
      <div className="section-title">
        <div>
          <h2>Floor &amp; Unit Map</h2>
          <div className="hint">Click an occupied unit to open its ledger · click a vacant unit to list it</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {['G','1','2'].map(f => (
            <button key={f} onClick={() => setActiveFloor(f)}
              style={{padding:'6px 13px',borderRadius:8,fontSize:12,fontWeight:600,border:'1px solid #E4E1D6',cursor:'pointer',
                background: activeFloor===f ? '#2E1065' : '#fff',
                color: activeFloor===f ? '#fff' : '#4B5A50',
                borderColor: activeFloor===f ? '#2E1065' : '#E4E1D6'}}>
              {f === 'G' ? 'Ground' : `Floor ${f}`}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-[10px]">
            {units.map(u => (
              <div key={u.n} className={`unit ${u.s}`} style={{height:70,cursor:'pointer'}} title={`${u.n} — ${u.t || 'Vacant'} · click to open`} onClick={() => handleUnitClick(u)}>
                <div className="u-name">{u.n}</div>
                <div className="u-tag">{u.t || 'Vacant'}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
            {[['#8B5CF6','Paid up'],['#F2A93B','Due this week'],['#D64545','Overdue'],['#DDD9CC','Vacant']].map(([bg,lbl]) => (
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'#4B5A50',fontWeight:500}}>
                <span style={{width:10,height:10,borderRadius:3,background:bg,display:'inline-block'}}></span> {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-[18px] mt-[18px]">
        <div className="card">
          <div className="card-head"><h3>Listed vacancies</h3><div className="hint" style={{marginTop:0}}>Units currently marketed to prospective tenants</div></div>
          <div className="card-body">
            {listedUnits.length === 0 && (
              <div className="maint-req-empty" style={{color:'#8A968D',fontSize:12.5,padding:'12px 0'}}>No vacancies listed yet — click a vacant unit on the map to list it.</div>
            )}
            {listedUnits.map(l => (
              <div key={l.unit} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                <div><span className="mono" style={{fontWeight:700}}>{l.unit}</span> <span style={{fontSize:11,color:'#8A968D'}}>· {l.floor === 'G' ? 'Ground' : `Floor ${l.floor}`}</span></div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span className="badge published">Listed</span>
                  <button className="btn ghost" style={{padding:'5px 10px',fontSize:11,color:'#D64545'}} onClick={() => { setListedUnits(p => p.filter(x => x.unit !== l.unit)); toast(`Unit ${l.unit} unlisted`); }}>Unlist</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Prospective tenant inquiries</h3><div className="hint" style={{marginTop:0}}>People who reached out about a listed unit</div></div>
          <div className="card-body">
            {[
              {name:'Eric Mugisha',unit:'G-03',msg:'Interested in this unit for a phone accessories shop — is it still available?',meta:'+250 78• ••• 552 · 48 hrs ago'},
              {name:'Solange Uwase',unit:'1F-04',msg:'Looking for a boutique space, can I schedule a viewing?',meta:'+250 72• ••• 810 · 120 hrs ago'},
            ].map(inq => (
              <div key={inq.name} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                <div className="amenity-ic"><Users size={15} /></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.8,fontWeight:600}}>{inq.name} <span style={{fontWeight:500,color:'#8A968D'}}>— Unit {inq.unit}</span></div>
                  <div style={{fontSize:11.5,color:'#4B5A50',marginTop:2}}>{inq.msg}</div>
                  <div style={{fontSize:10.5,color:'#8A968D',marginTop:4}}>{inq.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
