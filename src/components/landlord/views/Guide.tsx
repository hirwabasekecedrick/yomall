'use client';
import React, { useState } from 'react';
import { UtensilsCrossed, Glasses, Megaphone } from 'lucide-react';
import { AMENITY_ICONS } from '@/components/icons';
import { AnnouncementItem, AmenityItem } from '@/components/landlord/LandlordContext';

const ANNOUNCE_ICONS: Record<string, React.ReactNode> = {
  food: <UtensilsCrossed size={14} />,
  optics: <Glasses size={14} />,
};

export default function GuideView({ announcements, amenities, onEditAmenity, onNewAmenity, onDeleteAmenity, onEditAnnouncement, onNewAnnouncement, onDeleteAnnouncement, onPublishAnnouncement }: {
  announcements: AnnouncementItem[];
  amenities: AmenityItem[];
  onEditAmenity: (a: AmenityItem) => void;
  onNewAmenity: () => void;
  onDeleteAmenity: (id: number) => void;
  onEditAnnouncement: (a: AnnouncementItem) => void;
  onNewAnnouncement: () => void;
  onDeleteAnnouncement: (id: number) => void;
  onPublishAnnouncement: (a: { title: string; body: string; pinned: boolean }) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState('no');

  function handlePublish() {
    if (!title.trim() || !body.trim()) return;
    onPublishAnnouncement({ title: title.trim(), body: body.trim(), pinned: pinned === 'yes' });
    setTitle(''); setBody(''); setPinned('no');
  }

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
              {announcements.length === 0 && (
                <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No live announcements.</div>
              )}
              {announcements.map(a => (
                <div key={a.id} className="announce-card">
                  <div><div className="a-title" style={{display:'flex',alignItems:'center',gap:6}}>{ANNOUNCE_ICONS[a.icon || ''] || <Megaphone size={14} />}{a.title}</div><div className="a-body">{a.body}</div><div className="a-meta">{a.meta}</div></div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <button className="btn ghost" style={{padding:'6px 10px',fontSize:11}} onClick={() => onEditAnnouncement(a)}>Edit</button>
                    <button className="btn ghost" style={{padding:'6px 10px',fontSize:11,color:'#D64545'}} onClick={() => onDeleteAnnouncement(a.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div><h3>Amenities directory</h3><button className="link-btn" onClick={onNewAmenity}>+ Add amenity</button></div></div>
            <div className="card-body">
              {amenities.map(a => (
                <div key={a.id} className="amenity-row">
                  <div className="amenity-left"><div className="amenity-ic">{AMENITY_ICONS[a.icon]}</div><div><div className="amenity-name">{a.name}</div><div className="amenity-sub">{a.sub}</div></div></div>
                  <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5,color:'#D64545'}} onClick={() => onDeleteAmenity(a.id)}>Remove</button>
                  <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}} onClick={() => onEditAmenity(a)}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Post an announcement</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Title</label><input placeholder="e.g. Weekend promotion" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="form-row"><label>Message</label><textarea placeholder="What do you want mall visitors to know?" value={body} onChange={e => setBody(e.target.value)} /></div>
            <div className="form-row"><label>Pin to top?</label><select value={pinned} onChange={e => setPinned(e.target.value)}><option value="no">No — show in order</option><option value="yes">Yes — pin to top</option></select></div>
            <button className="btn primary" disabled={!title.trim() || !body.trim()} style={{width:'100%',justifyContent:'center',opacity:(!title.trim() || !body.trim()) ? 0.5 : 1}} onClick={handlePublish}>Publish announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
}
