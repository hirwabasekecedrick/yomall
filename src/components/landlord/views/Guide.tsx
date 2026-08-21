'use client';
import React from 'react';
import { UtensilsCrossed, Glasses } from 'lucide-react';
import { AMENITY_ICONS } from '@/components/icons';

export default function GuideView({ onEditAmenity, onNewAmenity, onEditAnnouncement, onNewAnnouncement }: { onEditAmenity: (a: { icon: string; name: string; sub: string }) => void; onNewAmenity: () => void; onEditAnnouncement: (a: { title: string }) => void; onNewAnnouncement: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Mall Guide Content</h2><div className="hint">Wayfinding, amenities and customer announcements</div></div>
        <button className="btn primary" onClick={onNewAnnouncement}>+ New announcement</button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-[18px]">
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="card-head"><h3>Active announcements</h3></div>
            <div className="card-body">
              {[
                {icon:<UtensilsCrossed size={14} />,title:'Weekend food festival',body:'Enjoy discounts at all F&B tenants this Saturday from 12:00–18:00. Free entry.',meta:'Posted 2 days ago · Pinned'},
                {icon:<Glasses size={14} />,title:'New tenant: Amara Optics',body:'Welcome Amara Optics to Unit 1F-08! Stop by for prescription glasses and sunglasses.',meta:'Posted 5 days ago'},
              ].map(a => (
                <div key={a.title} className="announce-card">
                  <div><div className="a-title" style={{display:'flex',alignItems:'center',gap:6}}>{a.icon}{a.title}</div><div className="a-body">{a.body}</div><div className="a-meta">{a.meta}</div></div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}><button className="btn ghost" style={{padding:'6px 10px',fontSize:11}} onClick={() => onEditAnnouncement(a)}>Edit</button><button className="btn ghost" style={{padding:'6px 10px',fontSize:11,color:'#D64545'}}>Remove</button></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Amenities directory</h3></div>
            <div className="card-body">
              {[['parking','Car parking','Level B1 · 120 bays · RWF 500/hr'],['restroom','Restrooms','Every floor · east wing'],['atm','ATMs','Ground floor near main entrance'],['prayer','Prayer room','Floor 2 · open 06:00–22:00'],['foodcourt','Food court','Floor 2 · 8 F&B tenants']].map(([key,name,sub]) => (
                <div key={name} className="amenity-row">
                  <div className="amenity-left"><div className="amenity-ic">{AMENITY_ICONS[key]}</div><div><div className="amenity-name">{name}</div><div className="amenity-sub">{sub}</div></div></div>
                  <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}} onClick={() => onEditAmenity({icon:key,name,sub})}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Post an announcement</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Title</label><input placeholder="e.g. Weekend promotion" /></div>
            <div className="form-row"><label>Message</label><textarea placeholder="What do you want mall visitors to know?" /></div>
            <div className="form-row"><label>Pin to top?</label><select><option>No — show in order</option><option>Yes — pin to top</option></select></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Publish announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
}
