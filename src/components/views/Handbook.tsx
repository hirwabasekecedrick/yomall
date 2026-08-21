'use client';
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { initialHandbookSections } from '@/lib/data';

export default function HandbookView({ onEditSection }: { onEditSection?: (s: { id?: number; title: string; body: string }) => void }) {
  const sections = initialHandbookSections;
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Tenant Handbook</h2><div className="hint">Building operating rules for all tenants</div></div></div>
      <div className="card">
        <div className="card-body">
          {sections.map((s: { id?: number; title: string; body: string }, i: number) => (
            <div key={s.id || s.title} style={{padding:'14px 0',borderTop: i > 0 ? '1px solid #F2EFE6' : 'none',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13.5,fontWeight:700,marginBottom:6,display:'flex',alignItems:'center',gap:6}}><ClipboardList size={14} /> {s.title}</div>
                <div style={{fontSize:12.8,color:'#4B5A50',lineHeight:1.7}}>{s.body}</div>
              </div>
              {onEditSection && <button className="btn ghost" style={{padding:'5px 10px',fontSize:11,flexShrink:0,marginLeft:8}} onClick={() => onEditSection(s)}>Edit</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
