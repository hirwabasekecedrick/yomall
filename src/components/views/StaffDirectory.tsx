'use client';
import React from 'react';
import { initialStaff } from '@/lib/data';

export default function StaffDirectoryView({ onAssignTask }: { onAssignTask?: () => void }) {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Maintenance &amp; Support</h2><div className="hint">Directory of on-call building staff</div></div>
        <button className="btn primary">+ Add staff member</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
        {initialStaff.map(s => (
          <div key={s.name} className="staff-card">
            <div className="staff-top">
              <div className="staff-av">{s.name.split(' ').map(w=>w[0]).join('')}</div>
              <div><div className="staff-name">{s.name}</div><div className="staff-role">{s.role}</div></div>
            </div>
            <div className="staff-status"><span className="sdot" style={{background:s.color}}></span>{s.status}</div>
            <div className="staff-foot">
              <button className="btn ghost" style={{flex:1,justifyContent:'center',padding:'7px',fontSize:11.5}}>Call</button>
              <button className="btn primary" style={{flex:1,justifyContent:'center',padding:'7px',fontSize:11.5}} onClick={onAssignTask}>Assign task</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
