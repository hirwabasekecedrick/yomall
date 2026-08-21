'use client';
import React, { useState } from 'react';
import { X, TriangleAlert } from 'lucide-react';
import PhonePreview from '@/components/PhonePreview';
import { Badge } from '@/components/ui';
import { productsData } from '@/lib/data';

export default function StorefrontView() {
  const [shopOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <div className="view-panel">
      <div className="section-title">
        <div>
          <h2 style={{display:'flex',alignItems:'center'}}>Storefront <Badge type="published" label="Live" /></h2>
          <div className="hint">Editing: <b>Nyabugogo TechHub</b> — G-14 · content publishes straight to the mall guide app</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn ghost" onClick={() => setPreviewOpen(true)}>Preview</button>
          <button className="btn primary">Publish changes</button>
        </div>
      </div>
      <div className="w-full max-w-[600px]">
        <div className="card" style={{marginBottom:18}}>
          <div className="card-head"><h3>Shop profile</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Shop name</label><input defaultValue="Nyabugogo TechHub" /></div>
            <div className="form-row"><label>Category</label>
              <select defaultValue="Electronics">
                <option>Electronics</option><option>Fashion</option><option>Food &amp; beverage</option><option>Beauty</option>
              </select>
            </div>
            <div className="form-row"><label>Description</label><textarea defaultValue="Your go-to shop for phones, accessories and gadgets in Kigali." /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row"><label>Opening time</label><input defaultValue="08:00" type="time" /></div>
              <div className="form-row"><label>Closing time</label><input defaultValue="20:00" type="time" /></div>
            </div>
            <div>
              {([['Show in mall guide','Customers can discover your shop',true],['Accept online orders','Receive orders through yoDeals',true],['Show promotions','Display deals on the homepage',false]] as [string,string,boolean][]).map(([lbl,hint,on]) => (
                <div key={lbl} className="toggle-row">
                  <div><div className="t-label">{lbl}</div><div className="t-hint">{hint}</div></div>
                  <div className={`switch ${on ? 'on' : ''}`}><div className="knob"></div></div>
                </div>
              ))}
            </div>
            <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center'}}>Save & publish changes</button>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="modal-overlay show" onClick={() => setPreviewOpen(false)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-head">
              <div className="pm-title">Live preview</div>
              <button className="pm-close" onClick={() => setPreviewOpen(false)}><X size={16} /></button>
            </div>
            <div className="preview-draft-banner show" style={{marginBottom:0,display:'flex',alignItems:'center',gap:6}}><TriangleAlert size={13} /> Previewing unpublished changes</div>
            <div style={{transform:'scale(0.95)', transformOrigin:'top center'}}>
              <PhonePreview shopName="Nyabugogo TechHub" shopCategory="Electronics" shopLocation="Unit G-14" isOpen={shopOpen} products={productsData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
