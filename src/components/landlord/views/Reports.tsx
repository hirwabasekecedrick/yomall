'use client';
import React from 'react';
import { BarChart3, Building2, Package, ClipboardList } from 'lucide-react';

export default function ReportsView({ onExport }: { onExport: (type: string) => void }) {
  const reportTypes = [
    {icon:<BarChart3 size={26} />,title:'Rent collection report',sub:'Monthly rent collected, outstanding balances and payment plan progress',btn:'Export CSV',type:'rent'},
    {icon:<Building2 size={26} />,title:'Occupancy report',sub:'Current occupancy by floor, unit status and vacancy summary',btn:'Export CSV',type:'occupancy'},
    {icon:<Package size={26} />,title:'Delivery & sales report',sub:'yoDeals order volumes, GMV and rider performance for this month',btn:'Export CSV',type:'deliveries'},
    {icon:<ClipboardList size={26} />,title:'Tenant directory export',sub:'Full list of tenants with contact info, lease dates and rent status',btn:'Export CSV',type:'tenants'},
  ];
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Reports</h2><div className="hint">Export building data for your own records</div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {reportTypes.map(r => (
          <div key={r.title} className="card">
            <div className="card-body" style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{flexShrink:0,color:'#6D28D9',display:'flex'}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5,marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:12,color:'#4B5A50',marginBottom:12}}>{r.sub}</div>
                <button className="btn primary" onClick={() => onExport(r.type)}>{r.btn}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
