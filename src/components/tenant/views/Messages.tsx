'use client';
import React, { useState } from 'react';

export default function TenantMessagesView() {
  const [reply, setReply] = useState('');
  const [msgs, setMsgs] = useState([
    {from:'tenant',subject:'Question about CAM charge',body:'Hi, could you clarify what the CAM fee covers this month? Noticed it went up slightly.',at:'2 days ago'},
    {from:'landlord',subject:'Re: Question about CAM charge',body:"Hi Aline — the increase covers the new security shift added to the east entrance. Happy to walk through the breakdown if useful.",at:'1 day ago'},
  ]);
  return (
    <div className="view-panel">
      <div className="card">
        <div className="card-head"><h3>Messages with property manager</h3></div>
        <div className="card-body">
          <div style={{maxHeight:360,overflowY:'auto',marginBottom:14,display:'flex',flexDirection:'column',gap:10}}>
            {msgs.map((m,i) => (
              <div key={i} style={{alignSelf: m.from === 'tenant' ? 'flex-start' : 'flex-end',maxWidth:'75%',background: m.from === 'tenant' ? '#F2EFE6' : '#EDE9FE',borderRadius:12,padding:'10px 13px'}}>
                <div style={{fontSize:10.5,fontWeight:700,color: m.from === 'tenant' ? '#4B5A50' : '#6D28D9',marginBottom:4}}>{m.subject}</div>
                <div style={{fontSize:12.8}}>{m.body}</div>
                <div style={{fontSize:10,color:'#8A968D',marginTop:5}}>{m.from === 'tenant' ? 'You' : 'Shema Katende'} · {m.at}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid #F2EFE6',paddingTop:12}}>
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to your property manager..." style={{width:'100%',border:'1px solid #E4E1D6',borderRadius:9,padding:'9px 11px',fontSize:12.8,fontFamily:'inherit',background:'#FAF8F3',outline:'none',resize:'vertical',minHeight:64,marginBottom:8}} />
            <button className="btn primary" onClick={() => { if(reply.trim()){setMsgs(p=>[...p,{from:'tenant',subject:'Re: your message',body:reply,at:'Just now'}]);setReply('');}}}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
