'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { KPI } from '@/components/ui';
import { initialFloors } from '@/lib/data';

export default function OverviewView({ onOpenMap, onUnitClick, onNudge, onReview, onAssign }: { onOpenMap: () => void; onUnitClick: (u: { n: string; s: string; t?: string }) => void; onNudge: () => void; onReview: () => void; onAssign: () => void }) {
  const miniUnits = initialFloors['G'].slice(0, 8);
  return (
    <div className="view-panel">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[14px] mb-[22px]">
        <KPI label="Occupancy" value="42 / 48" delta="87% units let" deltaClass="up" />
        <KPI label="Rent Collected Today" value="RWF 1.24M" delta="12% vs yesterday" deltaClass="up" />
        <KPI label="Overdue Balance" value="RWF 380K" delta="5 tenants overdue" deltaClass="down" />
        <KPI label="Deliveries In Progress" value="18" delta="via yoDeals riders" deltaClass="flat" />
        <KPI label="Online Sales Today" value="RWF 2.1M" delta="across 27 storefronts" deltaClass="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-[18px]">
        <div className="card">
          <div className="card-head">
            <div><h3>Mall Rent Health — Ground Floor</h3><div className="hint">Live snapshot · click a unit to open its ledger</div></div>
            <button className="link-btn" style={{display:'inline-flex',alignItems:'center',gap:4}} onClick={onOpenMap}>Open full map <ArrowRight size={13} /></button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-[8px]">
              {miniUnits.map(u => (
                <div key={u.n} className={`unit ${u.s}`} style={{height:58,cursor:'pointer'}} title={`${u.n} — ${u.t || 'Vacant'}`} onClick={() => onUnitClick(u)}>
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

        <div className="card">
          <div className="card-head"><div><h3>Attention needed</h3><div className="hint">Auto-flagged today</div></div></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            <div className="announce-card" style={{borderColor:'#FBE7E7',background:'#FBE7E7'}}>
              <div><div className="a-title" style={{color:'#D64545'}}>G-14 · Nyabugogo TechHub</div><div className="a-body">Daily repayment overdue by 3 days — RWF 45,000 outstanding.</div></div>
              <button className="btn" style={{background:'#fff'}} onClick={onNudge}>Nudge</button>
            </div>
            <div className="announce-card" style={{borderColor:'#FDF1DC',background:'#FDF1DC'}}>
              <div><div className="a-title" style={{color:'#DB9426'}}>1F-06 · Amasezerano Boutique</div><div className="a-body">Storefront draft not published — invisible on mall guide app.</div></div>
              <button className="btn" style={{background:'#fff'}} onClick={onReview}>Review</button>
            </div>
            <div className="announce-card">
              <div><div className="a-title">2F-02 · Café Umurava</div><div className="a-body">Maintenance request: AC unit — awaiting technician assignment.</div></div>
              <button className="btn" style={{background:'#fff'}} onClick={onAssign}>Assign</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:18}}>
        <div className="card-head"><div><h3>Rent collection health</h3><div className="hint">Read-only summary — full ledger and payouts are managed by yoMall's platform team</div></div></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'conic-gradient(#8B5CF6 0% 76%, #F2EFE6 76% 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'#FAF8F3',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>76%</div>
            </div>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              {[['Collected this month','RWF 14.1M'],['Outstanding','RWF 4.5M'],['Tenants overdue','5 of 42']].map(([label,val]) => (
                <div key={label}>
                  <div style={{fontSize:11,color:'#8A968D',fontWeight:600,textTransform:'uppercase',letterSpacing:'.4px'}}>{label}</div>
                  <div style={{fontSize:18,fontWeight:800,marginTop:4}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:12,fontSize:12,color:'#8A968D',borderTop:'1px solid #F2EFE6',paddingTop:10}}>Need the full breakdown or to run a payout? That's handled by yoMall's platform team on your behalf.</div>
        </div>
      </div>
    </div>
  );
}
