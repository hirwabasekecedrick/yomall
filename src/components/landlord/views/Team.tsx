'use client';
import React from 'react';
import { TeamMember } from '@/components/landlord/LandlordContext';

export default function TeamView({ members, onInvite, onRemove }: { members: TeamMember[]; onInvite: () => void; onRemove: (email: string) => void }) {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Team</h2><div className="hint">People with access to manage this building</div></div>
        <button className="btn primary" onClick={onInvite}>+ Invite team member</button>
      </div>
      <div className="card">
        <div className="card-body">
          {members.map(m => (
            <div key={m.email} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="avatar-sm" style={{width:36,height:36,fontSize:13}}>{m.av}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{m.name}</div><div style={{fontSize:11.5,color:'#8A968D'}}>{m.email} · {m.role}</div></div>
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5,color:'#D64545'}} onClick={() => onRemove(m.email)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
