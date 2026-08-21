'use client';
import React from 'react';
import { Tag } from 'lucide-react';

export default function YoDealsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Post to yoDeals</h2><div className="hint">Special offers and discounts — not a full product catalogue</div></div></div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-[18px]">
        <div className="card">
          <div className="card-head"><h3>New deal</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Headline</label><input placeholder="e.g. 20% off all accessories today only" /></div>
            <div className="form-row"><label>Description</label><textarea placeholder="Describe what's on offer and any terms..." /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row"><label>Original price (RWF)</label><input type="number" placeholder="50000" /></div>
              <div className="form-row"><label>Deal price (RWF)</label><input type="number" placeholder="40000" /></div>
            </div>
            <div className="form-row"><label>Valid until</label><input type="date" /></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center',gap:6}}><Tag size={15} /> Post deal</button>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><h3>Active deals</h3></div>
            <div className="card-body">
              {[['20% off all chargers','Valid until 25 Jul','2 days left'],['Free delivery over RWF 20K','Ongoing','No expiry']].map(d => (
                <div key={d[0]} style={{padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:700,fontSize:13}}>{d[0]}</div>
                    <span className="badge paid">{d[2]}</span>
                  </div>
                  <div style={{fontSize:11.5,color:'#8A968D',marginTop:3}}>{d[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
