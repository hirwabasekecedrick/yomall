'use client';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PACKAGES = [100, 250, 500, 1000];

export default function CreditsTopUpModal({ show, onClose, creditsBalance, onConfirm }: {
  show: boolean;
  onClose: () => void;
  creditsBalance: number;
  onConfirm: (amount: number, method: string) => void;
}) {
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState('MTN MoMo');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (show) { setAmount(100); setMethod('MTN MoMo'); setProcessing(false); }
  }, [show]);

  if (!show) return null;

  function submit() {
    setProcessing(true);
    window.setTimeout(() => {
      onConfirm(amount, method);
      setProcessing(false);
    }, 1100);
  }

  return (
    <div className="modal-overlay show" onClick={processing ? undefined : onClose}>
      <div className="onboard-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        {processing ? (
          <div className="pm-processing" style={{ padding: '54px 24px' }}>
            <div className="spinner"></div>
            <div className="proc-title">Processing payment via {method}…</div>
          </div>
        ) : (
          <>
            <div className="pm-head">
              <div className="pm-head-left"><div className="pm-title">Top up credits</div></div>
              <button aria-label="Close" className="pm-close" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="ob-body" style={{ padding: '18px 24px 4px' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 10.5, color: '#8A968D', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px' }}>Current balance</div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{creditsBalance} credits</div>
              </div>
              <div className="form-row">
                <label>Choose a package</label>
                <div className="chip-row">
                  {PACKAGES.map(v => (
                    <div key={v} className={`chip${amount === v ? ' selected' : ''}`} onClick={() => setAmount(v)}>{v}</div>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <label>Payment method</label>
                <select value={method} onChange={e => setMethod(e.target.value)}>
                  <option>MTN MoMo</option>
                  <option>Airtel Money</option>
                  <option>Card</option>
                </select>
              </div>
              <div className="card" style={{ background: 'var(--color-cream-100)', boxShadow: 'none', textAlign: 'center', marginBottom: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#8A968D', fontWeight: 700 }}>You&apos;ll pay</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>RWF {(amount * 100).toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#8A968D', marginTop: 2 }}>100 RWF = 1 credit</div>
              </div>
            </div>
            <div className="ob-foot">
              <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>Confirm &amp; pay →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
