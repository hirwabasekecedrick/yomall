'use client';
import React from 'react';

export default function PrivacyView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Privacy &amp; Data</h2><div className="hint">Manage KYC documents stored on the platform — export or delete on request</div></div></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No KYC documents currently stored.</div>
        </div>
      </div>
    </div>
  );
}
