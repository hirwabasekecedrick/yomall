'use client';
import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Deal { id: number; headline: string; meta: string; left: string }

export default function YoDealsView() {
  const toast = useToast();
  const [deals, setDeals] = useState<Deal[]>([
    { id:1, headline:'20% off all chargers', meta:'Valid until 25 Jul', left:'2 days left' },
    { id:2, headline:'Free delivery over RWF 20K', meta:'Ongoing', left:'No expiry' },
  ]);
  const [headline, setHeadline] = useState('');
  const [orig, setOrig] = useState('');
  const [price, setPrice] = useState('');
  const [until, setUntil] = useState('');

  function handlePost() {
    if (!headline.trim() || !orig || !price) return;
    if (Number(price) >= Number(orig)) { toast('Deal price must be lower than the original price'); return; }
    const off = Math.round((1 - Number(price) / Number(orig)) * 100);
    setDeals(p => [{ id:Date.now(), headline:headline.trim(), meta:until ? `Valid until ${until}` : 'Ongoing', left:`${off}% off` }, ...p]);
    toast(`Deal posted — "${headline.trim()}" is live on yoDeals`);
    setHeadline(''); setOrig(''); setPrice(''); setUntil('');
  }

  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Post to yoDeals</h2><div className="hint">Special offers and discounts — not a full product catalogue</div></div></div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-[18px]">
        <div className="card">
          <div className="card-head"><h3>New deal</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Headline</label><input placeholder="e.g. 20% off all accessories today only" value={headline} onChange={e => setHeadline(e.target.value)} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row"><label>Original price (RWF)</label><input type="number" placeholder="50000" value={orig} onChange={e => setOrig(e.target.value)} /></div>
              <div className="form-row"><label>Deal price (RWF)</label><input type="number" placeholder="40000" value={price} onChange={e => setPrice(e.target.value)} /></div>
            </div>
            <div className="form-row"><label>Valid until</label><input type="date" value={until} onChange={e => setUntil(e.target.value)} /></div>
            <button className="btn primary" disabled={!headline.trim() || !orig || !price} style={{width:'100%',justifyContent:'center',gap:6,opacity:(!headline.trim() || !orig || !price) ? .5 : 1}} onClick={handlePost}><Tag size={15} /> Post deal</button>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><h3>Active deals</h3></div>
            <div className="card-body">
              {deals.length === 0 && <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No active deals.</div>}
              {deals.map(d => (
                <div key={d.id} style={{padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:700,fontSize:13}}>{d.headline}</div>
                    <span className="badge paid">{d.left}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:3}}>
                    <div style={{fontSize:11.5,color:'#8A968D'}}>{d.meta}</div>
                    <button
                      title={`Remove ${d.headline}`}
                      aria-label={`Remove ${d.headline}`}
                      style={{background:'none',border:'none',cursor:'pointer',color:'#D64545',display:'flex',alignItems:'center'}}
                      onClick={() => { setDeals(p => p.filter(x => x.id !== d.id)); toast(`Deal removed: ${d.headline}`); }}
                    ><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
