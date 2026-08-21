'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function TenantLeaseView() {
  return (
    <div className="view-panel">
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-[18px]">
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="card-head"><h3>Lease terms</h3></div>
            <div className="card-body">
              {[['Tenant','Nyabugogo TechHub'],['Unit','G-14 · Ground Floor'],['Lease start','1 November 2025'],['Base rent','RWF 450,000 / month'],['CAM charges','RWF 32,000 / month'],['Marketing fund','RWF 12,000 / month'],['Security deposit','RWF 450,000 (held)'],['Payment plan','Daily · RWF 15,000/day']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #F2EFE6',fontSize:12.8}}>
                  <span style={{color:'#8A968D',fontWeight:600}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Insurance compliance</h3></div>
            <div className="card-body">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{color:'#6D28D9',display:'flex'}}><ShieldCheck size={22} /></div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12.8}}>liability-insurance-2026.pdf</div>
                  <div style={{fontSize:11,color:'#8A968D',marginTop:2}}>Expires 1 Nov 2026</div>
                </div>
                <span className="badge compliant">Compliant</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><h3>Submit a notice</h3></div>
            <div className="card-body">
              <p style={{fontSize:12.5,color:'#4B5A50',margin:'0 0 14px'}}>Need to give notice to vacate or renew? Submit it here and your property manager will be notified.</p>
              <div className="form-row"><label>Notice type</label><select><option>Notice to renew lease</option><option>Notice to vacate</option></select></div>
              <div className="form-row"><label>Effective date</label><input type="date" /></div>
              <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Submit notice</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
