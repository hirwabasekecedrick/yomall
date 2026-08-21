'use client';
import React from 'react';
import { FileText, Flame, Zap, ShieldCheck, Download } from 'lucide-react';
import { Badge } from '@/components/ui';

export default function DocumentsView({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Documents</h2><div className="hint">Compliance certificates and building documents</div></div>
        <button className="btn primary" onClick={onUpload}>+ Upload document</button>
      </div>
      <div className="card">
        <div className="card-body">
          {[['file','Building occupancy certificate','Issued by City of Kigali · Expires Dec 2026','compliant','Compliant'],['flame','Fire safety certificate','Issued by Rwanda National Police · Expires Jun 2026','compliant','Compliant'],['zap','Electrical compliance certificate','Issued by RURA · Expires Oct 2025','overdue','Expired'],['shield','Insurance policy','Building & public liability · Expires Jan 2027','compliant','Compliant']].map(([ic,name,sub,badgeType,badgeLabel]) => {
            const DocIcon = ic === 'file' ? FileText : ic === 'flame' ? Flame : ic === 'zap' ? Zap : ShieldCheck;
            return (
            <div key={name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="amenity-ic" style={{flexShrink:0,color:'#4B5A50'}}><DocIcon size={16} /></div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{name}</div><div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{sub}</div></div>
              <Badge type={badgeType} label={badgeLabel} />
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}}><Download size={14} /></button>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
