'use client';
import React from 'react';
import { KPI, Badge } from '@/components/ui';

export default function TenantOverviewView({ onPayNow, onNewMaint }: { onPayNow: () => void; onNewMaint: () => void }) {
  return (
    <div className="view-panel">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[14px] mb-[22px]">
        <KPI label="Today's sales" value="RWF 88,400" delta="14% vs yesterday" deltaClass="up" />
        <KPI label="Orders today" value="11" delta="via yoDeals" deltaClass="flat" />
        <KPI label="Rent balance" value="RWF 57,000" delta="Overdue by 3 days" deltaClass="down" />
        <KPI label="Storefront status" value="Published" delta="Live on mall guide" deltaClass="up" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-[18px]">
        <div className="card">
          <div className="card-head"><div><h3>Recent orders</h3><div className="hint">Latest yoDeals activity for your shop</div></div></div>
          <div className="card-body pt-[10px] overflow-x-auto">
            <table>
              <thead><tr><th>Order</th><th>Item</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>
                {[['#YD-3391','Earbuds, charger, speaker','52,000','transit'],['#YD-3387','USB-C cable x3','8,400','delivered'],['#YD-3381','Screen protector','3,500','delivered']].map(([id,item,val,status]) => (
                  <tr key={id} className="rowhover">
                    <td className="mono">{id}</td>
                    <td style={{color:'#4B5A50'}}>{item}</td>
                    <td className="mono">RWF {val}</td>
                    <td><Badge type={status === 'transit' ? 'transit' : 'delivered'} label={status === 'transit' ? 'In transit' : 'Delivered'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Rent reminder</h3></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            <div className="announce-card" style={{borderColor:'#FBE7E7',background:'#FBE7E7'}}>
              <div><div className="a-title" style={{color:'#D64545'}}>3 days overdue</div><div className="a-body">RWF 57,000 owed on your daily repayment plan.</div></div>
              <button className="btn" style={{background:'#fff'}} onClick={onPayNow}>Pay now</button>
            </div>
            <div className="announce-card">
              <div><div className="a-title">Need a repair?</div><div className="a-body">Request maintenance from our on-call directory.</div></div>
              <button className="btn" style={{background:'#fff'}} onClick={onNewMaint}>Directory</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
