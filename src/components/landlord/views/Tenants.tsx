'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initialTenants, initials } from '@/lib/data';

export default function TenantsView({ onManage, onOnboard }: { onManage: (t: { name: string; unit: string; cat: string; plan: string; store: string; rent: string; phone: string }) => void; onOnboard: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Tenant Directory</h2><div className="hint">42 active tenants across 3 floors</div></div>
        <button className="btn primary" onClick={onOnboard}>+ Onboard tenant</button>
      </div>
      <div className="card">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead>
              <tr><th>Tenant</th><th>Category</th><th>Repayment plan</th><th>Storefront</th><th>Rent status</th><th>Contact</th><th></th></tr>
            </thead>
            <tbody>
              {initialTenants.map(t => (
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
    </div>
  );
}
