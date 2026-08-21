'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { initialTenantOrders, relTime, orderItemsSummary, orderTotal } from '@/lib/data';

export default function TenantOrdersView({ onOrderClick }: { onOrderClick: (o: unknown) => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>My Orders</h2><div className="hint">Online orders placed through yoDeals</div></div>
      </div>

      {/* Desktop table */}
      <div className="card hidden md:block">
        <div className="card-body pt-[16px] overflow-x-auto">
          <table>
            <thead><tr><th>Order ID</th><th>Item(s)</th><th>Customer</th><th>Value</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {initialTenantOrders.map(o => (
                <tr key={o.id} className="rowhover" onClick={() => onOrderClick(o)} style={{cursor:'pointer'}}>
                  <td className="mono">#{o.id}</td>
                  <td style={{color:'#4B5A50'}}>{orderItemsSummary(o)}</td>
                  <td>{o.customerName}</td>
                  <td className="mono">RWF {orderTotal(o).toLocaleString()}</td>
                  <td><Badge type={o.stage <= 4 ? 'transit' : 'delivered'} label={o.stage <= 4 ? 'In transit' : 'Delivered'} /></td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{relTime(o.placedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-[10px]">
        {initialTenantOrders.map(o => (
          <div
            key={o.id}
            onClick={() => onOrderClick(o)}
            className="card cursor-pointer active:opacity-80"
            style={{marginBottom:0}}
          >
            <div className="card-body" style={{padding:'12px 14px'}}>
              <div className="flex items-center justify-between gap-[8px]">
                <span className="mono text-[12px] font-semibold">#{o.id}</span>
                <Badge type={o.stage <= 4 ? 'transit' : 'delivered'} label={o.stage <= 4 ? 'In transit' : 'Delivered'} />
              </div>
              <div className="text-[12.8px] text-[#4B5A50] mt-[6px]">{orderItemsSummary(o)}</div>
              <div className="flex items-center justify-between gap-[8px] mt-[8px]">
                <span className="text-[11.5px] text-[#8A968D]">{o.customerName} · {relTime(o.placedAt)}</span>
                <span className="mono text-[12.5px] font-semibold whitespace-nowrap">RWF {orderTotal(o).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
