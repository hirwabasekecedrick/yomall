'use client';
import React from 'react';
import { Download } from 'lucide-react';

export default function AuditView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Audit Log</h2><div className="hint">Every administrative action taken on the platform, most recent first</div></div><button className="btn ghost"><Download size={14} /> Export CSV</button></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No administrative actions recorded yet.</div>
        </div>
      </div>
    </div>
  );
}
