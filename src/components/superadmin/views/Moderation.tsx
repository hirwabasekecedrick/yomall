'use client';
import React from 'react';
import { Tag } from 'lucide-react';
import { initialCmsDeals } from '@/lib/data';

export default function ModerationView({ onRejectDeal }: { onRejectDeal: (d: { headline: string }) => void }) {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Deal Moderation</h2><div className="hint">Every deal is reviewed before it appears live on yoDeals</div></div></div>
      <div className="card">
        <div className="card-body">
          {initialCmsDeals.filter(d => d.moderationStatus === 'pending').map(d => (
            <div key={d.id} style={{display:'flex',gap:12,padding:'12px 0',alignItems:'center',borderBottom:'1px solid #F2EFE6'}}>
              <div style={{width:40,height:40,borderRadius:9,background:'#FBE7E7',color:'#D64545',display:'flex',alignItems:'center',justifyContent:'center'}}><Tag size={20} /></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5}}>{d.headline}</div>
                <div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{d.shopName} · {d.badge}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn ghost" style={{color:'#D64545',borderColor:'#FBE7E7',padding:'6px 10px',fontSize:11}} onClick={() => onRejectDeal(d)}>Reject</button>
                <button className="btn primary" style={{padding:'6px 10px',fontSize:11}}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
