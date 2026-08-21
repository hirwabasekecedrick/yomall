'use client';
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui';
import { initialLedger } from '@/lib/data';

export default function TenantRentView() {
  const l = initialLedger[0];
  return (
    <div className="view-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-[18px]">
        <div className="card" style={{border:'2px solid #FBE7E7',background:'#fffafa'}}>
          <div className="card-body">
            <div className="k-label">Balance owed</div>
            <div className="k-value mono" style={{color:'#D64545'}}>RWF {l.bal}</div>
            <div className="k-delta down">Overdue · next due: {l.next}</div>
            <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center',gap:6}}><CreditCard size={15} /> Pay now via MoMo</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="k-label">Monthly charge breakdown</div>
            {[['Base rent','RWF 450,000'],['CAM charges','RWF 32,000'],['Marketing fund','RWF 12,000'],['Total','RWF 494,000']].map(([label,val],i) => (
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop: i > 0 ? '1px solid #F2EFE6' : 'none',fontWeight: label === 'Total' ? 700 : 500,fontSize:12.8}}>
                <span>{label}</span><span className="mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Repayment plan — Daily</h3><div className="hint" style={{marginTop:2}}>RWF 15,000 per day · 30-day advance</div></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:14}}>
            <div className="progress" style={{width:200,height:8}}><div className="fill" style={{width:`${l.pct}%`}}></div></div>
            <span style={{fontSize:12,fontWeight:600}}>{l.pct}% repaid</span>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {[['Today','15,000','MoMo','overdue'],['Yesterday','15,000','MoMo','paid'],['2 days ago','15,000','MoMo','paid'],['3 days ago','15,000','MoMo','paid']].map(([date,amt,method,status]) => (
                <tr key={date}><td>{date}</td><td className="mono">RWF {amt}</td><td>{status === 'overdue' ? '—' : method}</td><td><Badge type={status === 'paid' ? 'paid' : 'overdue'} label={status === 'paid' ? 'Paid' : 'Missed'} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
