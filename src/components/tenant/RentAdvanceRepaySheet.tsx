'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTenant } from './TenantContext';

export default function RentAdvanceRepaySheet() {
  const { repaySheetOpen, closeRepaySheet, raSchedule, raSelectedSeqs, submitRepayment } = useTenant();
  const items = raSchedule.filter(s => raSelectedSeqs.includes(s.seq));
  const total = items.reduce((s, i) => s + i.amount, 0);
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (repaySheetOpen) {
      setAmount(String(total));
      setAccount('');
      setError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repaySheetOpen]);

  if (!repaySheetOpen) return null;

  function submit() {
    const amt = Number(amount);
    if (!amt || !account.trim()) { setError(true); return; }
    submitRepayment(amt, account.trim());
  }

  return (
    <div className="modal-overlay show" onClick={closeRepaySheet}>
      <div className="onboard-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left"><div className="pm-title">{items.length > 1 ? `Pay ${items.length} installments` : 'Repay installment'}</div></div>
          <button aria-label="Close" className="pm-close" onClick={closeRepaySheet}><X size={16} /></button>
        </div>
        <div className="ob-body" style={{ padding: '18px 24px 4px' }}>
          {items.map(it => (
            <div key={it.seq} className="cost-banner" style={{ marginBottom: 8 }}>
              <span>Installment {it.seq} of {raSchedule.length}</span>
              <b>RWF {it.amount.toLocaleString()}</b>
            </div>
          ))}
          {items.length > 1 && (
            <div className="review-row" style={{ fontWeight: 800, padding: '8px 2px' }}>
              <span>Total for {items.length} installments</span><b>RWF {total.toLocaleString()}</b>
            </div>
          )}
          <div className="form-row" style={{ marginTop: 10 }}>
            <label>Amount (RWF)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Paying number or card</label>
            <input value={account} onChange={e => setAccount(e.target.value)} placeholder="e.g. 07XX XXX XXX" />
          </div>
          {error && <div style={{ color: '#D64545', fontSize: 11.5, fontWeight: 600, margin: '2px 2px 10px' }}>Please enter an amount and a number or card.</div>}
        </div>
        <div className="ob-foot">
          <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>Confirm &amp; pay →</button>
        </div>
      </div>
    </div>
  );
}
