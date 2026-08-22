'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initialOrders } from '@/lib/data';

export default function DeliveriesView({ onOrderClick }: { onOrderClick: (o: unknown) => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Deliveries &amp; yoDeals Sales</h2><div className="hint">Monitor online orders and rider status</div></div>
      </div>

      {/* Desktop table */}
      <div className="card hidden md:block">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Shop</th><th>Item(s)</th><th>Rider</th><th>Status</th><th>Value</th><th>Time</th></tr>
            </thead>
            <tbody>
              {initialOrders.map(o => (
                <tr key={o.id} className="rowhover" onClick={() => onOrderClick(o)} style={{cursor:'pointer'}}>
                  <td className="mono">{o.id}</td>
                  <td>{o.shop}</td>
                  <td style={{color:'#4B5A50'}}>{o.item}</td>
                  <td>{o.rider}</td>
                  <td><Badge type={o.status === 'transit' ? 'transit' : 'delivered'} label={o.status === 'transit' ? 'In transit' : 'Delivered'} /></td>
                  <td className="mono">RWF {o.val}</td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-[10px]">
        {initialOrders.map(o => (
          <div key={o.id} onClick={() => onOrderClick(o)} style={{border:'1px solid #E4E1D6',borderRadius:12,padding:'12px 14px',background:'#fff',cursor:'pointer'}}>
            <div className="flex items-center justify-between gap-[8px]">
              <span className="mono text-[12.5px] font-semibold">{o.id}</span>
              <Badge type={o.status === 'transit' ? 'transit' : 'delivered'} label={o.status === 'transit' ? 'In transit' : 'Delivered'} />
            </div>
            <div className="text-[12.8px] font-semibold mt-[6px]">{o.item}</div>
            <div className="text-[11.5px] text-[#8A968D] mt-[2px]">{o.shop} · Rider: {o.rider}</div>
            <div className="flex items-center justify-between gap-[8px] mt-[10px]" style={{borderTop:'1px solid #F2EFE6',paddingTop:10}}>
              <span className="mono text-[12px]">RWF {o.val}</span>
              <span className="text-[10.5px] text-[#8A968D]">{o.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
