'use client';
import React from 'react';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/lib/data';
import { useSuperadmin } from '@/components/superadmin/SuperadminContext';

export default function AuditView() {
  const { auditRows } = useSuperadmin();
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Audit Log</h2><div className="hint">Every administrative action taken on the platform, most recent first</div></div>
        <button className="btn ghost" disabled={auditRows.length === 0} style={{opacity:auditRows.length === 0 ? .5 : 1}} onClick={() => downloadCSV('audit-log.csv', [['Timestamp','Action'], ...auditRows])}><Download size={14} /> Export CSV</button>
      </div>
      <div className="card">
        <div className="card-body">
          {auditRows.length === 0 && (
            <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No administrative actions recorded yet — actions you take (approvals, broadcasts, onboarding) will appear here.</div>
          )}
          {auditRows.map(([at, action], i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',gap:12,padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
              <span style={{fontWeight:600,fontSize:12.8}}>{action}</span>
              <span className="mono" style={{fontSize:11,color:'#8A968D',flexShrink:0}}>{at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
