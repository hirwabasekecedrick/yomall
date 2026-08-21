'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initials } from '@/lib/data';

export default function RenewalsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Lease Renewals</h2><div className="hint">Upcoming lease expirations across your building</div></div></div>
      <div className="card">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead><tr><th>Tenant</th><th>Unit</th><th>Lease expiry</th><th>Days remaining</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {([['Coko Bookshop','G-10','1 Nov 2026',90,'on-track'],['Café Umurava','2F-02','1 Sep 2026',29,'due-soon'],['Muraho Electronics','G-04','10 Mar 2027',219,'on-track'],['Amasezerano Boutique','1F-06','15 Jun 2027',315,'on-track']] as [string,string,string,number,string][]).map(([name,unit,exp,days]) => (
                <tr key={name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(name)}</div><div className="tname">{name}</div></div></td>
                  <td className="mono">{unit}</td>
                  <td>{exp}</td>
                  <td><span style={{fontWeight:700,color: days < 60 ? '#D64545' : '#8A968D'}}>{days} days</span></td>
                  <td><Badge type={days < 60 ? 'due' : 'paid'} label={days < 60 ? 'Expiring soon' : 'On track'} /></td>
                  <td><button className="btn ghost" style={{padding:'6px 10px',fontSize:11.5}}>Send renewal</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
