'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initials } from '@/lib/data';
import { LandlordTenant } from '@/components/landlord/LandlordContext';

export default function TenantsView({ tenants, onManage, onOnboard }: { tenants: LandlordTenant[]; onManage: (t: LandlordTenant) => void; onOnboard: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Tenant Directory</h2><div className="hint">{tenants.length} active tenants across 3 floors</div></div>
        <button className="btn primary" onClick={onOnboard}>+ Onboard tenant</button>
      </div>

      {/* Desktop table */}
      <div className="card hidden md:block">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead>
              <tr><th>Tenant</th><th>Category</th><th>Repayment plan</th><th>Storefront</th><th>Rent status</th><th>Contact</th><th></th></tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(t.name)}</div><div><div className="tname">{t.name}</div><div className="tunit">{t.unit}</div></div></div></td>
                  <td>{t.cat}</td>
                  <td><span className={`freq-pill ${t.plan}`}>{t.plan === 'daily' ? 'Daily' : 'Weekly'}</span></td>
                  <td><Badge type={t.store} label={t.store === 'published' ? 'Published' : 'Draft'} /></td>
                  <td><Badge type={t.rent} label={t.rent === 'paid' ? 'Paid up' : t.rent === 'due' ? 'Due soon' : 'Overdue'} /></td>
                  <td className="mono" style={{fontSize:11.5,color:'#4B5A50'}}>{t.phone}</td>
                  <td><button className="btn ghost" style={{padding:'6px 10px',fontSize:11.5}} onClick={() => onManage(t)}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-[10px]">
        {tenants.map(t => (
          <div key={t.name} style={{border:'1px solid #E4E1D6',borderRadius:12,padding:'12px 14px',background:'#fff'}}>
            <div className="flex items-center justify-between gap-[8px]">
              <div className="cell-tenant"><div className="avatar-sm">{initials(t.name)}</div><div><div className="tname">{t.name}</div><div className="tunit">{t.unit}</div></div></div>
              <Badge type={t.rent} label={t.rent === 'paid' ? 'Paid up' : t.rent === 'due' ? 'Due soon' : 'Overdue'} />
            </div>
            <div className="flex items-center flex-wrap gap-[6px] mt-[10px]">
              <span className="text-[11.5px] text-[#4B5A50]">{t.cat}</span>
              <span className={`freq-pill ${t.plan}`}>{t.plan === 'daily' ? 'Daily' : 'Weekly'}</span>
              <Badge type={t.store} label={t.store === 'published' ? 'Published' : 'Draft'} />
            </div>
            <div className="flex items-center justify-between gap-[8px] mt-[10px]" style={{borderTop:'1px solid #F2EFE6',paddingTop:10}}>
              <span className="mono text-[11.5px] text-[#4B5A50]">{t.phone}</span>
              <button className="btn ghost" style={{padding:'6px 10px',fontSize:11.5}} onClick={() => onManage(t)}>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
