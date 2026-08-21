'use client';
import React from 'react';

export default function TeamView({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Team</h2><div className="hint">People with access to manage this building</div></div>
        <button className="btn primary" onClick={onInvite}>+ Invite team member</button>
      </div>
      <div className="card">
        <div className="card-body">
          {[['Shema Katende','shema@edupoto.rw','SK','Owner · full access'],['Marie Uwimana','marie@edupoto.rw','MU','Manager · can view & edit'],['Paul Nshimiyimana','paul@edupoto.rw','PN','Finance · read-only']].map(([name,email,av,role]) => (
            <div key={name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="avatar-sm" style={{width:36,height:36,fontSize:13}}>{av}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{name}</div><div style={{fontSize:11.5,color:'#8A968D'}}>{email} · {role}</div></div>
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
