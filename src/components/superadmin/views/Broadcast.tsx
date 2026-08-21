'use client';
import React from 'react';
import { Megaphone } from 'lucide-react';

export default function BroadcastView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Broadcast</h2><div className="hint">Send a notice to every landlord or every tenant on the platform</div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div className="card">
          <div className="card-head"><h3>Compose broadcast</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Send to</label><select><option>All landlords</option><option>All tenants</option><option>Everyone</option></select></div>
            <div className="form-row"><label>Subject</label><input placeholder="e.g. Scheduled maintenance this weekend" /></div>
            <div className="form-row"><label>Message</label><textarea placeholder="Write your announcement..." /></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center',gap:6}}><Megaphone size={15} /> Send broadcast</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Broadcast history</h3></div>
          <div className="card-body">
            <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No broadcasts sent yet.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
