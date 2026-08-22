'use client';
import React from 'react';
import { FileText, Flame, Zap, ShieldCheck, Download } from 'lucide-react';
import { Badge } from '@/components/ui';

const DOCS = [
  { ic:'file', name:'Building occupancy certificate', sub:'Issued by City of Kigali · Expires Dec 2026', badgeType:'compliant', badgeLabel:'Compliant' },
  { ic:'flame', name:'Fire safety certificate', sub:'Issued by Rwanda National Police · Expires Jun 2026', badgeType:'compliant', badgeLabel:'Compliant' },
  { ic:'zap', name:'Electrical compliance certificate', sub:'Issued by RURA · Expires Oct 2025', badgeType:'overdue', badgeLabel:'Expired' },
  { ic:'shield', name:'Insurance policy', sub:'Building & public liability · Expires Jan 2027', badgeType:'compliant', badgeLabel:'Compliant' },
];

export default function DocumentsView({ onUpload }: { onUpload: () => void }) {
  function handleDownload(name: string, sub: string) {
    const content = `yoMall document record\n\nDocument: ${name}\nDetails: ${sub}\nProperty: Kigali Convention Mall\nExported: ${new Date().toLocaleString()}\n\nThis is a system-generated record from yoMall.`;
    const blob = new Blob([content], { type:'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Documents</h2><div className="hint">Compliance certificates and building documents</div></div>
        <button className="btn primary" onClick={onUpload}>+ Upload document</button>
      </div>
      <div className="card">
        <div className="card-body">
          {DOCS.map(d => {
            const DocIcon = d.ic === 'file' ? FileText : d.ic === 'flame' ? Flame : d.ic === 'zap' ? Zap : ShieldCheck;
            return (
            <div key={d.name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="amenity-ic" style={{flexShrink:0,color:'#4B5A50'}}><DocIcon size={16} /></div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{d.name}</div><div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{d.sub}</div></div>
              <Badge type={d.badgeType} label={d.badgeLabel} />
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}} title={`Download ${d.name}`} onClick={() => handleDownload(d.name, d.sub)}><Download size={14} /></button>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
