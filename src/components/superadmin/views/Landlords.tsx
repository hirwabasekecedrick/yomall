'use client';
import React from 'react';
import { Badge } from '@/components/ui';

export default function LandlordsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Landlords</h2><div className="hint">Landlord accounts, business verification and payout details across the platform</div></div></div>
      <div className="card">
        <div className="card-body pt-[16px] overflow-x-auto">
          {[
            {init:'SK',name:'Shema Katende',sub:'Kigali Convention Mall · shema@edupoto.rw · +250 78• ••• 001 · Bank of Kigali •••• 4471',status:'verified'},
            {init:'JB',name:'Jean Bosco Habimana',sub:'Musanze Heritage Plaza · jbosco@musanzeheritage.rw · +250 78• ••• 002 · Equity Bank •••• 2210',status:'kybpending'},
            {init:'AU',name:'Alice Uwimana',sub:'Huye Trade Center · alice@huyetrade.rw · +250 78• ••• 003 · Bank of Kigali •••• 7734',status:'verified'},
            {init:'PN',name:'Patrick Nsengimana',sub:'Remera Business Arcade · patrick@remerabiz.rw · +250 78• ••• 004 · I&M Bank •••• 5563',status:'verified'},
            {init:'MC',name:'Marie Claire Ingabire',sub:'Rubavu Lakeside Mall · marieclaire@rubavulakeside.rw · +250 78• ••• 005 · Bank of Kigali •••• 9021',status:'verified'},
            {init:'EM',name:'Eric Mugabo',sub:'Nyamirambo Craft Market · eric@nyamiramboarts.rw · +250 78• ••• 006 · Not yet linked',status:'rejected'}
          ].map((l, i) => (
            <div key={i} style={{display:'flex',gap:12,padding:'12px 0',borderBottom: i < 5 ? '1px solid #F2EFE6' : 'none',alignItems:'center'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'#FAF8F3',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>{l.init}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5}}>{l.name}</div>
                <div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{l.sub}</div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <Badge type={l.status === 'verified' ? 'published' : l.status === 'kybpending' ? 'due' : 'overdue'} label={l.status === 'verified' ? 'Verified' : l.status === 'kybpending' ? 'KYB pending' : 'Rejected'} />
                <button className="btn ghost" style={{padding:'6px 10px',fontSize:11,color:'#D64545',borderColor:'#FBE7E7'}}>Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
