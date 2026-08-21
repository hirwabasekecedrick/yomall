'use client';
import React from 'react';

export default function EscalationsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Escalations</h2><div className="hint">Disputes raised by a landlord when tenant-landlord messaging doesn't resolve things</div></div></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No escalations — all tenant-landlord issues are resolving directly.</div>
        </div>
      </div>
    </div>
  );
}
