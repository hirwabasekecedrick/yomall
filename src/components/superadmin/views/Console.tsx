'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { KPI } from '@/components/ui';
import { initialMalls } from '@/lib/data';

export default function ConsoleView({ onEnterMall, onOnboardMall }: { onEnterMall: (name: string) => void; onOnboardMall: () => void }) {
  return (
    <div className="view-panel">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[14px] mb-[22px]">
        <KPI label="Malls on platform" value="12" delta="2 recently added" deltaClass="up" />
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
        {initialMalls.map(m => (
          <div key={m.name} className="mall-card">
            <div className="mall-cover" style={{background:`linear-gradient(135deg, ${m.color}, #2E1065)`}}>
              <div className="mc-plan">{m.plan} plan</div>
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
                <button className="btn ghost" style={{flex:0}}>⋯</button>
                <button className="btn primary" style={{flex:1,justifyContent:'center',gap:6}} onClick={() => onEnterMall(m.name)}>Enter dashboard <ArrowRight size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
