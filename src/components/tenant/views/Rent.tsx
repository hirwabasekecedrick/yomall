'use client';
import React, { useState } from 'react';
import { CreditCard, Download, Clock, Package } from 'lucide-react';
import { Badge } from '@/components/ui';
import { initialLedger, rentPaymentHistory, initialTenantOrders } from '@/lib/data';
import { useTenant } from '@/components/tenant/TenantContext';

const STATUS_COPY: Record<string, { title: string; body: (amount: string, frequency: 'daily' | 'weekly', reason: string | null) => string }> = {
  pending: {
    title: '⏳ Application under review',
    body: (amount, frequency) => `RWF ${amount} requested · ${frequency === 'daily' ? 'Daily' : 'Weekly'} repayment. Our lending partner typically responds within 24–48 hours.`,
  },
  approved: {
    title: '✓ Advance approved & disbursed',
    body: (amount) => `RWF ${amount} was paid to your landlord.`,
  },
  rejected: {
    title: '✕ Application not approved',
    body: (_amount, _frequency, reason) => reason || 'Please contact support for details.',
  },
};

type Tab = 'rent' | 'advance' | 'orders';

export default function TenantRentView() {
  const l = initialLedger[0];
  const { rentAdvanceApp, openRentAdvance, openPayment, raSchedule, raBalance, raSelectedSeqs, toggleSelectInstallment, paySingle, quickPayDue, openRepaySheet, downloadReceipt } = useTenant();
  const [tab, setTab] = useState<Tab>('rent');

  const dueInstallment = raSchedule.find(s => s.status === 'due');
  const selectedTotal = raSchedule.filter(s => raSelectedSeqs.includes(s.seq)).reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="view-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-[18px]">
        <div className="card" style={{border:'2px solid #FBE7E7',background:'#fffafa'}}>
          <div className="card-body">
            <div className="k-label">Balance owed</div>
            <div className="k-value mono" style={{color:'#D64545'}}>RWF {l.bal}</div>
            <div className="k-delta down">Overdue · next due: {l.next}</div>
            <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center',gap:6}} onClick={openPayment}><CreditCard size={15} /> Pay now via MoMo</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="k-label">Monthly charge breakdown</div>
            {[['Base rent','RWF 450,000'],['CAM charges','RWF 32,000'],['Marketing fund','RWF 12,000'],['Total','RWF 494,000']].map(([label,val],i) => (
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop: i > 0 ? '1px solid #F2EFE6' : 'none',fontWeight: label === 'Total' ? 700 : 500,fontSize:12.8}}>
                <span>{label}</span><span className="mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!rentAdvanceApp && (
        <div className="card" style={{marginBottom:18}}>
          <div className="card-body">
            <div style={{fontSize:12.8,fontWeight:700,marginBottom:4}}>Need help covering rent?</div>
            <div style={{fontSize:11.5,color:'#8A968D',lineHeight:1.5,marginBottom:12}}>Apply for a rentAdvance — we pay your landlord in full today, you repay daily or weekly. Takes about 3 minutes.</div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center',gap:6}} onClick={openRentAdvance}>Apply for rentAdvance →</button>
          </div>
        </div>
      )}

      {rentAdvanceApp && (
        <div className={`loan-status-card ${rentAdvanceApp.status}`} style={{marginBottom:14}}>
          <div className="lsc-title">{STATUS_COPY[rentAdvanceApp.status].title}</div>
          <div className="lsc-body">{STATUS_COPY[rentAdvanceApp.status].body(rentAdvanceApp.amount, rentAdvanceApp.frequency, rentAdvanceApp.rejectionReason)}</div>
          <div className="lsc-ref">Ref {rentAdvanceApp.id}</div>
          {rentAdvanceApp.status === 'approved' && (
            <button className="btn ghost" style={{marginTop:10,width:'100%',justifyContent:'center',gap:6}} onClick={downloadReceipt}><Download size={13} /> Download settlement receipt</button>
          )}
          {rentAdvanceApp.status === 'rejected' && (
            <button className="btn primary" style={{marginTop:12}} onClick={openRentAdvance}>Apply again →</button>
          )}
        </div>
      )}

      {rentAdvanceApp?.status === 'approved' && (
        dueInstallment ? (
          <div className="reminder-banner">
            <div className="rb-ic"><Clock size={18} /></div>
            <div>
              <b>Repayment due — RWF {dueInstallment.amount.toLocaleString()}</b>
              <span>Installment {dueInstallment.seq} of {raSchedule.length} · {dueInstallment.dueDate.toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</span>
            </div>
            <button className="btn primary" style={{marginLeft:'auto',flexShrink:0}} onClick={quickPayDue}>Repay →</button>
          </div>
        ) : (
          <div className="card" style={{background:'var(--color-forest-100)',boxShadow:'none',textAlign:'center',marginBottom:16,padding:'14px'}}>
            <b style={{fontSize:12.5,color:'var(--color-forest-700)'}}>🎉 rentAdvance fully repaid!</b>
          </div>
        )
      )}

      <div className="subnav-chips">
        <div className={`subnav-chip${tab==='rent'?' active':''}`} onClick={() => setTab('rent')}>Rent</div>
        <div className={`subnav-chip${tab==='advance'?' active':''}`} onClick={() => setTab('advance')}>rentAdvance</div>
        <div className={`subnav-chip${tab==='orders'?' active':''}`} onClick={() => setTab('orders')}>Orders</div>
      </div>

      {tab === 'rent' && (
        <div className="card">
          <div className="card-head"><h3>Repayment plan — Daily</h3><div className="hint" style={{marginTop:2}}>RWF 15,000 per day · 30-day advance</div></div>
          <div className="card-body">
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:14}}>
              <div className="progress" style={{width:200,height:8}}><div className="fill" style={{width:`${l.pct}%`}}></div></div>
              <span style={{fontSize:12,fontWeight:600}}>{l.pct}% repaid</span>
            </div>
            <table>
              <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>
                {rentPaymentHistory.map(p => (
                  <tr key={p.date}>
                    <td>{p.date}{p.month ? ` · ${p.month}` : ''}</td>
                    <td className="mono">{p.amount ? `RWF ${p.amount.toLocaleString()}` : '—'}</td>
                    <td>{p.status === 'paid' ? p.account : '—'}</td>
                    <td><Badge type={p.status === 'paid' ? 'paid' : 'overdue'} label={p.status === 'paid' ? 'Paid' : 'Missed'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'advance' && (
        <div className="card">
          <div className="card-head"><h3>Repayment schedule &amp; history</h3><div className="hint" style={{marginTop:2}}>Tick more than one to pay ahead of schedule</div></div>
          <div className="card-body">
            {!raSchedule.length ? (
              <div className="empty-state">No active rentAdvance. Apply from the card above to see your repayment schedule here.</div>
            ) : (
              <>
                {raSchedule.map(s => (
                  <div key={s.seq} className="schedule-row">
                    {s.status !== 'paid' ? (
                      <input type="checkbox" checked={raSelectedSeqs.includes(s.seq)} onChange={() => toggleSelectInstallment(s.seq)} />
                    ) : (
                      <div className="sq-badge" style={{background:'var(--color-forest-100)',color:'var(--color-forest-700)'}}>✓</div>
                    )}
                    {s.status === 'paid' && <div style={{width:0}} />}
                    <div className="sq-badge" style={{background: s.status==='paid'?'var(--color-forest-100)':s.status==='due'?'var(--color-amber-100)':'var(--color-cream-100)', color: s.status==='paid'?'var(--color-forest-700)':s.status==='due'?'var(--color-amber-600)':'var(--color-ink-400)'}}>{s.seq}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12.6,fontWeight:700}}>Installment {s.seq} of {raSchedule.length}</div>
                      <div style={{fontSize:10.8,color:'#8A968D'}}>{s.dueDate.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <b className="mono" style={{fontSize:12}}>{s.amount.toLocaleString()}</b>
                      {s.status === 'paid' ? (
                        <div style={{marginTop:4}}><Badge type="paid" label="Paid" /></div>
                      ) : (
                        <button className="btn ghost" style={{padding:'5px 10px',fontSize:10,marginTop:4}} onClick={() => paySingle(s.seq)}>Pay</button>
                      )}
                    </div>
                  </div>
                ))}
                {raSelectedSeqs.length > 0 && (
                  <>
                    <div className="cost-banner" style={{marginTop:12}}><span>{raSelectedSeqs.length} installment{raSelectedSeqs.length>1?'s':''} selected</span><b>RWF {selectedTotal.toLocaleString()}</b></div>
                    <button className="btn primary" style={{width:'100%',justifyContent:'center',marginTop:10}} onClick={openRepaySheet}>Pay selected — RWF {selectedTotal.toLocaleString()} →</button>
                  </>
                )}
                <div className="cost-banner" style={{marginTop: raSelectedSeqs.length ? 10 : 14}}><span>Remaining balance</span><b>RWF {raBalance.toLocaleString()}</b></div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="card">
          <div className="card-head"><h3>Recent orders</h3></div>
          <div className="card-body">
            {initialTenantOrders.map(o => (
              <div key={o.id} className="list-row">
                <div className="lr-avatar" style={{background:'var(--color-cream-100)',color:'var(--color-ink-600)'}}><Package size={16} /></div>
                <div><div className="lr-title">#{o.id}</div><div className="lr-sub">{o.items.length} item(s) · {new Date(o.placedAt).toLocaleString()}</div></div>
                <div className="lr-right"><b className="mono" style={{fontSize:11.5}}>RWF {o.items.reduce((s,i)=>s+i.qty*i.price,0).toLocaleString()}</b></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
