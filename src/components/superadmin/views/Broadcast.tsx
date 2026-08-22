'use client';
import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { useSuperadmin } from '@/components/superadmin/SuperadminContext';

export default function BroadcastView() {
  const { broadcasts, sendBroadcast } = useSuperadmin();
  const [to, setTo] = useState('All landlords');
  const [subject, setSubject] = useState('');

  function handleSend() {
    if (!subject.trim()) return;
    sendBroadcast({ to, subject: subject.trim() });
    setSubject('');
  }

  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Broadcast</h2><div className="hint">Send a notice to every landlord or every tenant on the platform</div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div className="card">
          <div className="card-head"><h3>Compose broadcast</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Send to</label><select value={to} onChange={e => setTo(e.target.value)}><option>All landlords</option><option>All tenants</option><option>Everyone</option></select></div>
            <div className="form-row"><label>Subject</label><input placeholder="e.g. Scheduled maintenance this weekend" value={subject} onChange={e => setSubject(e.target.value)} /></div>
            <button className="btn primary" disabled={!subject.trim()} style={{width:'100%',justifyContent:'center',gap:6,opacity:!subject.trim() ? .5 : 1}} onClick={handleSend}><Megaphone size={15} /> Send broadcast</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Broadcast history</h3></div>
          <div className="card-body">
            {broadcasts.length === 0 && (
              <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No broadcasts sent yet.</div>
            )}
            {broadcasts.map(b => (
              <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{b.subject}</div>
                  <div style={{fontSize:11,color:'#8A968D',marginTop:2}}>To: {b.to}</div>
                </div>
                <span className="badge published">Sent</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
