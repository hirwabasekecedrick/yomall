'use client';
import React from 'react';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui';
import { initialLedger, initials } from '@/lib/data';

export default function RentView({ onExport }: { onExport: (type: string) => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Rent &amp; Payments</h2><div className="hint">Landlord advances and tenant repayment plans</div></div>
        <button className="btn ghost" onClick={() => onExport('rent')}><Download size={14} /> Export CSV</button>
      </div>
      <div className="card">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead>
              <tr><th>Tenant</th><th>Plan</th><th>Per instalment</th><th>Progress</th><th>Balance</th><th>Next due</th><th>Status</th></tr>
            </thead>
            <tbody>
              {initialLedger.map(l => (
                <tr key={l.name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(l.name)}</div><div><div className="tname">{l.name}</div><div className="tunit">{l.unit}</div></div></div></td>
                  <td><span className={`freq-pill ${l.plan}`}>{l.plan === 'daily' ? 'Daily' : 'Weekly'}</span></td>
                  <td className="mono">RWF {l.per}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className="progress"><div className="fill" style={{width:`${l.pct}%`}}></div></div>
                      <span style={{fontSize:11,color:'#8A968D'}}>{l.pct}%</span>
                    </div>
                  </td>
                  <td className="mono">{l.bal === '0' ? '—' : `RWF ${l.bal}`}</td>
                  <td style={{fontSize:12}}>{l.next}</td>
                  <td><Badge type={l.status} label={l.status === 'paid' ? 'Settled' : l.status === 'due' ? 'Due soon' : 'Overdue'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
