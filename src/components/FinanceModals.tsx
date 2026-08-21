'use client';
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

/* ═══════════════════════════════════════════════
   PayoutModal
   ═══════════════════════════════════════════════ */
export function PayoutModal({ show, onClose, pendingAmount, bankInfo, onProcess }) {
  const [step, setStep] = useState('form');

  if (!show) return null;

  function handleClose() {
    setStep('form');
    onClose();
  }

  function handleProcess() {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      if (onProcess) onProcess();
    }, 2000);
  }

  return (
    <div className="payment-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        {/* Form State */}
        {step === 'form' && (
          <div className="pm-body">
            <div className="pm-head">
              <span className="pm-title">Process payout</span>
              <button className="pm-close" onClick={handleClose}><X size={16} /></button>
            </div>

            <div className="tm-balance-card ok">
              <div>
                <div className="tbc-label">Available for payout</div>
                <div className="tbc-amount">Frw {pendingAmount}</div>
              </div>
              <div className="tbc-sub">{bankInfo}</div>
            </div>

            <div className="pm-summary">
              <div className="sr">
                <span>Total collected this month</span>
                <b>Frw {pendingAmount}</b>
              </div>
              <div className="sr">
                <span>Platform fee (2%)</span>
                <b>Frw {(() => {
                  const num = parseInt(pendingAmount.replace(/,/g, ''), 10) || 0;
                  const fee = Math.round(num * 0.02);
                  return fee.toLocaleString();
                })()}</b>
              </div>
              <div className="sr total">
                <span>Net payout</span>
                <b>Frw {(() => {
                  const num = parseInt(pendingAmount.replace(/,/g, ''), 10) || 0;
                  const net = num - Math.round(num * 0.02);
                  return net.toLocaleString();
                })()}</b>
              </div>
            </div>

            <button className="pm-btn" onClick={handleProcess}>
              Process payout
            </button>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="pm-body" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
            <div className="pm-processing">
              <div className="spinner" />
            </div>
            <div className="proc-title">Processing payout...</div>
            <div className="proc-sub">Please wait while we transfer to your bank account</div>
          </div>
        )}

        {/* Success / Receipt State */}
        {step === 'success' && (
          <div className="pm-body">
            <div className="pm-success">
              <div className="success-check"><Check size={26} /></div>
              <div className="suc-title">Payout processed</div>
              <div className="suc-sub">Your payout has been sent to your bank account</div>
            </div>

            <div className="receipt">
              <div className="receipt-box">
                <div className="rb-check"><Check size={14} /></div>
                <div className="rb-head">
                  <div className="rb-title">Payout Receipt</div>
                  <div className="rb-sub">yoMall Landlord Payout</div>
                </div>

                <div className="receipt-line">
                  <span>Amount</span>
                  <span>Frw {pendingAmount}</span>
                </div>
                <div className="receipt-line">
                  <span>Bank account</span>
                  <span>{bankInfo}</span>
                </div>
                <div className="receipt-line">
                  <span>Reference</span>
                  <span>PAY-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="receipt-line">
                  <span>Date</span>
                  <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="receipt-foot-btns">
              <button className="pm-btn" onClick={handleClose}>
                Print receipt
              </button>
              <button className="pm-btn ghost3" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EscalationModal
   ═══════════════════════════════════════════════ */
export function EscalationModal({ show, onClose, tenantName, tenantUnit, currentMessage, onEscalate }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState(currentMessage || '');
  const [confirmed, setConfirmed] = useState(false);

  if (!show) return null;

  function handleClose() {
    setReason('');
    setDescription('');
    setConfirmed(false);
    onClose();
  }

  function handleEscalate() {
    if (onEscalate) onEscalate({ reason, description: description.trim() });
    setConfirmed(true);
    setTimeout(handleClose, 1500);
  }

  return (
    <div className="payment-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <span className="pm-title">Escalate to dispute</span>
          <button className="pm-close" onClick={handleClose}><X size={16} /></button>
        </div>
        <div className="pm-body">
          {confirmed ? (
            <div className="pm-success">
              <div className="success-check"><Check size={26} /></div>
              <div className="suc-title">Issue escalated</div>
              <div className="suc-sub">This issue has been sent to the yoMall platform team for review</div>
            </div>
          ) : (
            <>
              <div className="notice-banner warn">
                <div className="nb-title">Escalating will send this issue to the yoMall platform team for review</div>
                <div className="nb-sub">The tenant and superadmin will be notified</div>
              </div>

              <div className="pm-summary">
                <div className="sr">
                  <span>Tenant</span>
                  <b>{tenantName}</b>
                </div>
                <div className="sr">
                  <span>Unit</span>
                  <b>{tenantUnit}</b>
                </div>
              </div>

              <div className="form-row">
                <label>Reason for escalation</label>
                <select value={reason} onChange={e => setReason(e.target.value)}>
                  <option value="">Select reason...</option>
                  <option value="Non-payment">Non-payment</option>
                  <option value="Lease violation">Lease violation</option>
                  <option value="Property damage">Property damage</option>
                  <option value="Noise complaint">Noise complaint</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <label>Description</label>
                <textarea
                  placeholder="Describe the issue..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Evidence</label>
                <div className="photo-picker">
                  <button className="pm-btn ghost3" type="button">
                    Upload evidence
                  </button>
                </div>
              </div>

              <button
                className="pm-btn"
                disabled={!reason || !description.trim()}
                style={{ opacity: (!reason || !description.trim()) ? 0.5 : 1 }}
                onClick={handleEscalate}
              >
                Escalate issue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
