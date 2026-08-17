'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { initials } from '@/lib/data';

export default function PaymentModal({ show, onClose, tenantName, balance, dailyRate, onPay }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (show) {
      setStep(1);
      setAmount('');
      setMethod('');
      setPin('');
      setPinError('');
      setProcessing(false);
    }
  }, [show]);

  const handleClose = useCallback(() => {
    setStep(1);
    setAmount('');
    setMethod('');
    setPin('');
    setPinError('');
    setProcessing(false);
    onClose();
  }, [onClose]);

  const handleKey = useCallback((val) => {
    if (val === 'back') {
      setPin(p => p.slice(0, -1));
      setPinError('');
    } else if (pin.length < 4) {
      setPin(p => p + val);
      setPinError('');
    }
  }, [pin.length]);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === '1234') {
        setStep(3);
        setProcessing(true);
        setTimeout(() => {
          setStep(4);
          setProcessing(false);
        }, 2000);
      } else {
        setPinError('Incorrect PIN. Please try again.');
        setTimeout(() => setPin(''), 600);
      }
    }
  }, [pin]);

  if (!show) return null;

  const chips = [dailyRate, '25,000', '50,000', balance];

  return (
    <div className="payment-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        {/* Step 1: Amount & Method */}
        <div className={`pm-step${step === 1 ? ' active' : ''}`}>
          <div className="pm-head">
            <div className="pm-head-left">
              <div className="pm-title">Top-up / Repayment</div>
            </div>
            <button className="pm-close" onClick={handleClose}>&times;</button>
          </div>
          <div className="pm-body">
            <div className="pm-context">
              <strong>{tenantName}</strong> &mdash; Balance: <strong>Frw {balance}</strong>
            </div>

            <div className="amount-display">
              <span className="cur">Frw</span>
              <input
                type="text"
                placeholder="0"
                value={amount}
                onChange={e => {
                  const v = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(v ? Number(v).toLocaleString() : '');
                }}
                style={{ border: 'none', outline: 'none', fontSize: '28px', fontWeight: 700, width: '100%', background: 'transparent', textAlign: 'center' }}
              />
            </div>

            <div className="chip-row">
              {chips.map(c => (
                <button
                  key={c}
                  className={`chip${amount === c ? ' selected' : ''}`}
                  onClick={() => setAmount(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="sr">Select payment method</div>

            <div className="pm-summary" style={{ gap: '10px' }}>
              <button
                className={`method-opt${method === 'momo' ? ' selected' : ''}`}
                onClick={() => setMethod('momo')}
              >
                <span className="mo-ic">📱</span>
                <div>
                  <div className="mo-name">MoMo</div>
                  <div className="mo-sub">MTN Mobile Money</div>
                </div>
                {method === 'momo' && <span className="mo-check">&#10003;</span>}
              </button>
              <button
                className={`method-opt${method === 'airtel' ? ' selected' : ''}`}
                onClick={() => setMethod('airtel')}
              >
                <span className="mo-ic">🔴</span>
                <div>
                  <div className="mo-name">Airtel Money</div>
                  <div className="mo-sub">Airtel Rwanda</div>
                </div>
                {method === 'airtel' && <span className="mo-check">&#10003;</span>}
              </button>
            </div>

            <button
              className="pm-btn"
              disabled={!amount || !method}
              style={{ opacity: (!amount || !method) ? 0.5 : 1 }}
              onClick={() => setStep(2)}
            >
              Continue to PIN
            </button>
          </div>
        </div>

        {/* Step 2: PIN Entry */}
        <div className={`pm-step${step === 2 ? ' active' : ''}`}>
          <div className="pm-head">
            <div className="pm-head-left">
              <button className="pm-back" onClick={() => { setStep(1); setPin(''); setPinError(''); }}>&larr;</button>
              <div className="pm-title">Enter PIN</div>
            </div>
            <button className="pm-close" onClick={handleClose}>&times;</button>
          </div>
          <div className="pm-body">
            <div className="pin-phone">
              {method === 'momo' ? '+250 78• ••• 214' : '+250 73• ••• 671'}
            </div>

            <div className="pin-dots">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`pin-dot${i < pin.length ? ' filled' : ''}`} />
              ))}
            </div>

            {pinError && <div className="pin-error">{pinError}</div>}

            <div className="pin-hint">Enter your 4-digit {method === 'momo' ? 'MoMo' : 'Airtel Money'} PIN</div>

            <div className="keypad">
              {['1','2','3','4','5','6','7','8','9','*','0','back'].map(k => (
                <button
                  key={k}
                  className={`key${k === '*' ? ' empty' : ''}`}
                  onClick={() => {
                    if (k === 'back') handleKey('back');
                    else if (k !== '*') handleKey(k);
                  }}
                >
                  {k === 'back' ? '⌫' : k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Processing */}
        <div className={`pm-step${step === 3 ? ' active' : ''}`}>
          <div className="pm-body" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
            <div className="pm-processing">
              <div className="spinner" />
            </div>
            <div className="proc-title">Processing your payment...</div>
            <div className="proc-sub">Please wait while we confirm with {method === 'momo' ? 'MoMo' : 'Airtel Money'}</div>
          </div>
        </div>

        {/* Step 4: Success / Receipt */}
        <div className={`pm-step${step === 4 ? ' active' : ''}`}>
          <div className="pm-body">
            <div className="pm-success">
              <div className="success-check">&#10003;</div>
              <div className="suc-title">Payment Successful</div>
              <div className="suc-amount">Frw {amount}</div>
              <div className="suc-sub">Your rent top-up has been processed</div>
            </div>

            <div className="receipt">
              <div className="receipt-box">
                <div className="rb-check">&#10003;</div>
                <div className="rb-head">
                  <div className="rb-title">Payment Receipt</div>
                  <div className="rb-sub">yoMall Rent Payment</div>
                </div>

                <div className="receipt-line">
                  <span>Tenant</span>
                  <span>{tenantName}</span>
                </div>
                <div className="receipt-line">
                  <span>Unit</span>
                  <span>G-14</span>
                </div>
                <div className="receipt-line">
                  <span>Amount</span>
                  <span>Frw {amount}</span>
                </div>
                <div className="receipt-line">
                  <span>Method</span>
                  <span>{method === 'momo' ? 'MTN MoMo' : 'Airtel Money'}</span>
                </div>
                <div className="receipt-line">
                  <span>Reference</span>
                  <span>RNT-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="receipt-line">
                  <span>Date</span>
                  <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="receipt-total-line">
                  <span>Total Paid</span>
                  <span>Frw {amount}</span>
                </div>

                <div className="receipt-line">
                  <span>Transaction ID</span>
                  <span>TXN-{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
                </div>
                <div className="receipt-line">
                  <span>Confirmation</span>
                  <span>Confirmed</span>
                </div>
              </div>
            </div>

            <div className="receipt-foot-btns">
              <button className="pm-btn" onClick={() => { if (onPay) onPay(amount, method); handleClose(); }}>
                Print receipt
              </button>
              <button className="pm-btn ghost3" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
