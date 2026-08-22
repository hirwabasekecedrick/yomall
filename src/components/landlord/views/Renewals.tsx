'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initials } from '@/lib/data';

export default function RenewalsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Lease Renewals</h2><div className="hint">Upcoming lease expirations across your building</div></div></div>

      {/* Desktop table */}
      <div className="card hidden md:block">
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

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-[10px]">
        {([['Coko Bookshop','G-10','1 Nov 2026',90],['Café Umurava','2F-02','1 Sep 2026',29],['Muraho Electronics','G-04','10 Mar 2027',219],['Amasezerano Boutique','1F-06','15 Jun 2027',315]] as [string,string,string,number][]).map(([name,unit,exp,days]) => (
          <div key={name} style={{border:'1px solid #E4E1D6',borderRadius:12,padding:'12px 14px',background:'#fff'}}>
            <div className="flex items-center justify-between gap-[8px]">
              <div className="cell-tenant"><div className="avatar-sm">{initials(name)}</div><div className="tname">{name}</div></div>
              <Badge type={days < 60 ? 'due' : 'paid'} label={days < 60 ? 'Expiring soon' : 'On track'} />
            </div>
            <div className="flex items-center justify-between gap-[8px] mt-[10px]" style={{borderTop:'1px solid #F2EFE6',paddingTop:10}}>
              <span className="mono text-[11.5px] text-[#4B5A50]">{unit} · expires {exp}</span>
              <span className="text-[11.5px] font-bold" style={{color: days < 60 ? '#D64545' : '#8A968D'}}>{days} days</span>
            </div>
            <button className="btn ghost" style={{marginTop:10,padding:'6px 10px',fontSize:11.5,width:'100%'}}>Send renewal</button>
          </div>
        ))}
      </div>
    </div>
  );
}
