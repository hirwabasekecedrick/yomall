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
      <div className="card">
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
    </div>
  );
}
