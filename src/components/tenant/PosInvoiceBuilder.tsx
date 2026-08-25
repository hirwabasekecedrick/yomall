'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { PosInvoice } from './PosSaleWizard';

interface Line { desc: string; qty: string; price: string }

export default function PosInvoiceBuilder({ show, onClose, creditsBalance, onOpenTopUp, onIssue }: {
  show: boolean;
  onClose: () => void;
  creditsBalance: number;
  onOpenTopUp: () => void;
  onIssue: (invoice: PosInvoice) => void;
}) {
  const [client, setClient] = useState('');
  const [tin, setTin] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Line[]>([{ desc: '', qty: '1', price: '' }]);

  useEffect(() => {
    if (show) { setClient(''); setTin(''); setNotes(''); setLines([{ desc: '', qty: '1', price: '' }]); }
  }, [show]);

  if (!show) return null;

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0), 0);
  const vat = Math.round(subtotal * 0.18);
  const total = subtotal + vat;
  const cost = 2;

  function updateLine(i: number, patch: Partial<Line>) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }
  function removeLine(i: number) {
    if (lines.length <= 1) return;
    setLines(prev => prev.filter((_, idx) => idx !== i));
  }

  function issue() {
    if (!client.trim()) return;
    onIssue({
      id: 'EBM-' + Date.now().toString().slice(-6),
      item: lines.map(l => l.desc).filter(Boolean).join(', ') || 'Line items',
      qty: 1,
      total,
      vat,
      customer: client,
      status: 'Sent',
      at: Date.now(),
    });
  }

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left"><div className="pm-title">New invoice</div></div>
          <button aria-label="Close" className="pm-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="ob-body">
          <div className="form-row"><label>Client name</label><input value={client} onChange={e => setClient(e.target.value)} placeholder="Golden Bakery Ltd" /></div>
          <div className="form-row"><label>Client TIN</label><input value={tin} onChange={e => setTin(e.target.value)} placeholder="1XXXXXXXXX" /></div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8A968D', textTransform: 'uppercase', letterSpacing: '.3px', margin: '14px 0 8px' }}>Line items</div>
          {lines.map((l, i) => (
            <div key={i} className="line-item-row">
              <input placeholder="Description" value={l.desc} onChange={e => updateLine(i, { desc: e.target.value })} />
              <input placeholder="Qty" value={l.qty} onChange={e => updateLine(i, { qty: e.target.value })} />
              <input placeholder="Price" value={l.price} onChange={e => updateLine(i, { price: e.target.value })} />
              <button className="li-remove" aria-label="Remove line" onClick={() => removeLine(i)}>✕</button>
            </div>
          ))}
          <button className="btn ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }} onClick={() => setLines(prev => [...prev, { desc: '', qty: '1', price: '' }])}>+ Add line item</button>
          <div className="form-row"><label>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, thank-you note, etc." /></div>
          <div className="receipt-box">
            <div className="receipt-line"><span>Subtotal</span><b>RWF {subtotal.toLocaleString()}</b></div>
            <div className="receipt-line"><span>VAT (18%)</span><b>RWF {vat.toLocaleString()}</b></div>
            <div className="receipt-total-line"><span>Total due</span><b>RWF {total.toLocaleString()}</b></div>
          </div>
          <div className="cost-banner" style={{ marginTop: 12 }}><span>Issuing via EBM costs</span><b>{cost} credits</b></div>
          {cost > creditsBalance ? (
            <>
              <div className="insufficient-note" style={{ marginTop: 10 }}>Not enough credits to issue this invoice.</div>
              <button className="btn amber" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={onOpenTopUp}>+ Top up credits</button>
            </>
          ) : (
            <button className="btn primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} disabled={!client.trim()} onClick={issue}>Issue invoice (EBM) — {cost} credits</button>
          )}
        </div>
      </div>
    </div>
  );
}
