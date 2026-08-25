'use client';
import React, { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';

export interface StockItem { name: string; qty: number; price: number }
export interface PosInvoice { id: string; item: string; qty: number; total: number; vat: number; customer: string; status: string; at: number }

const STEP_LABELS = ['Item & quantity', 'Customer & payment', 'Review & issue'];

export default function PosSaleWizard({ show, onClose, stock, creditsBalance, onOpenTopUp, onIssue }: {
  show: boolean;
  onClose: () => void;
  stock: StockItem[];
  creditsBalance: number;
  onOpenTopUp: () => void;
  onIssue: (invoice: PosInvoice, itemIndex: number, qty: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('MoMo');
  const [issuing, setIssuing] = useState(false);
  const [done, setDone] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<PosInvoice | null>(null);

  useEffect(() => {
    if (show) { setStep(0); setItemIndex(0); setQty(1); setCustomer(''); setPhone(''); setPayment('MoMo'); setIssuing(false); setDone(false); }
  }, [show]);

  if (!show) return null;

  const item = stock[itemIndex];
  const subtotal = item ? item.price * qty : 0;
  const vat = Math.round(subtotal * 0.18);
  const total = subtotal + vat;
  const cost = 2;

  function submit() {
    setIssuing(true);
    window.setTimeout(() => {
      const invoice: PosInvoice = { id: 'EBM-' + Date.now().toString().slice(-6), item: item.name, qty, total, vat, customer: customer || 'Walk-in customer', status: 'Paid', at: Date.now() };
      onIssue(invoice, itemIndex, qty);
      setLastInvoice(invoice);
      setIssuing(false);
      setDone(true);
    }, 1300);
  }

  return (
    <div className="modal-overlay show" onClick={issuing ? undefined : onClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        {issuing ? (
          <div className="pm-processing" style={{ padding: '60px 24px' }}>
            <div className="spinner"></div>
            <div className="proc-title">Issuing EBM invoice…</div>
            <div className="proc-sub">Recording sale and updating stock</div>
          </div>
        ) : done && lastInvoice ? (
          <div className="pm-success" style={{ padding: '40px 24px' }}>
            <div className="success-check"><Check size={26} /></div>
            <div className="suc-title">Invoice issued</div>
            <div className="suc-sub">Reference <b style={{ fontFamily: 'var(--font-mono)' }}>{lastInvoice.id}</b><br />Stock, sales and credits balance have all been updated.</div>
            <div className="receipt-box" style={{ textAlign: 'left', marginTop: 16 }}>
              <div className="receipt-line"><span>{lastInvoice.item} × {lastInvoice.qty}</span><b>RWF {(lastInvoice.total - lastInvoice.vat).toLocaleString()}</b></div>
              <div className="receipt-line"><span>VAT (18%)</span><b>RWF {lastInvoice.vat.toLocaleString()}</b></div>
              <div className="receipt-total-line"><span>Total paid</span><b>RWF {lastInvoice.total.toLocaleString()}</b></div>
            </div>
            <button className="btn primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="pm-head">
              <div className="pm-head-left"><div className="pm-title">Record a sale</div></div>
              <button aria-label="Close" className="pm-close" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="ob-stepper">
              {STEP_LABELS.map((label, i) => {
                let cls = 'ob-step-item';
                if (i < step) cls += ' done'; else if (i === step) cls += ' active';
                return (
                  <div key={label} className={cls}>
                    <div className="ob-step-circle">{i < step ? <Check size={13} /> : i + 1}</div>
                    <div className="ob-step-label">{label}</div>
                  </div>
                );
              })}
            </div>
            <div className="ob-body">
              {step === 0 && (
                <div className="ob-step-panel active">
                  <h4>Choose an item</h4>
                  {stock.map((s, i) => (
                    <div key={s.name} className={`method-opt${itemIndex === i ? ' selected' : ''}`} style={{ marginBottom: 8, cursor: 'pointer' }}
                      onClick={() => { setItemIndex(i); if (qty > s.qty) setQty(Math.max(1, s.qty)); }}
                    >
                      <div className="mo-ic">📦</div>
                      <div style={{ flex: 1 }}><div className="mo-name">{s.name}</div><div className="mo-sub">RWF {s.price.toLocaleString()} · {s.qty} in stock</div></div>
                      {itemIndex === i && <span className="mo-check"></span>}
                    </div>
                  ))}
                  <div className="form-row" style={{ marginTop: 14 }}>
                    <label>Quantity</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <button className="btn ghost" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                      <button className="btn ghost" onClick={() => setQty(q => Math.min(item?.qty || 1, q + 1))}>+</button>
                    </div>
                  </div>
                  <div className="cost-banner"><span>Subtotal</span><b>RWF {subtotal.toLocaleString()}</b></div>
                </div>
              )}
              {step === 1 && (
                <div className="ob-step-panel active">
                  <h4>Customer &amp; payment</h4>
                  <div className="form-row"><label>Customer name (optional)</label><input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Walk-in customer" /></div>
                  <div className="form-row"><label>Phone (optional)</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+250 78• ••• •••" /></div>
                  <div className="form-row">
                    <label>Payment method</label>
                    <div className="chip-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                      {['MoMo', 'Airtel', 'Cash'].map(m => <div key={m} className={`chip${payment === m ? ' selected' : ''}`} onClick={() => setPayment(m)}>{m}</div>)}
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="ob-step-panel active">
                  <h4>EBM invoice preview</h4>
                  <div className="receipt-box">
                    <div className="receipt-line"><span>{item?.name} × {qty}</span><b>RWF {subtotal.toLocaleString()}</b></div>
                    <div className="receipt-line"><span>VAT (18%)</span><b>RWF {vat.toLocaleString()}</b></div>
                    <div className="receipt-total-line"><span>Total</span><b>RWF {total.toLocaleString()}</b></div>
                  </div>
                  <div className="review-block" style={{ marginTop: 14 }}>
                    <div className="review-row"><span>Name</span><b>{customer || 'Walk-in customer'}</b></div>
                    <div className="review-row"><span>Payment</span><b>{payment}</b></div>
                  </div>
                  <div className="cost-banner"><span>Issuing this EBM invoice costs</span><b>{cost} credits</b></div>
                  <div style={{ textAlign: 'right', fontSize: 10.5, color: '#8A968D', fontWeight: 600, marginTop: 6 }}>Your balance: {creditsBalance} credits</div>
                  {cost > creditsBalance && (
                    <>
                      <div className="insufficient-note" style={{ marginTop: 10 }}>Not enough credits to issue this invoice.</div>
                      <button className="btn amber" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={onOpenTopUp}>+ Top up credits</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="ob-foot">
              {step > 0 && <button className="btn" onClick={() => setStep(s => s - 1)}>Back</button>}
              {step < 2 && <button className="btn primary" onClick={() => setStep(s => s + 1)}>Continue</button>}
              {step === 2 && <button className="btn primary" disabled={cost > creditsBalance} style={cost > creditsBalance ? { opacity: .5 } : undefined} onClick={submit}>Issue EBM invoice — {cost} credits →</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
