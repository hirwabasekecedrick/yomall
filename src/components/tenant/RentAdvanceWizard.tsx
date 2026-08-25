'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, IdCard, Camera, Check } from 'lucide-react';
import type { RentAdvanceApplication } from './TenantContext';

const FREQ_TERMS: Record<'daily' | 'weekly', string[]> = {
  daily: ['7 days', '14 days', '21 days', '30 days'],
  weekly: ['1 week', '2 weeks', '3 weeks', '4 weeks'],
};

const RENTADVANCE_TERMS = [
  '1. Nature of the advance. This is a short-term credit facility. Your landlord is paid in full today; you owe this amount back to our lending partner.',
  '2. Service fee. A 5% service fee is spread evenly across your chosen repayment period.',
  '3. Repayment. Collected automatically via Mobile Money on your chosen frequency.',
  '4. Late payment. Repayments over 7 days late may be reported to your landlord and affect future eligibility.',
  '5. Data use. Your ID documents are shared with our lending partner solely to verify this application.',
];

const STEP_LABELS = ['Loan details', 'Verify identity', 'Agreement', 'Review'];

type Step = 0 | 1 | 2 | 3;
type Stage = 'form' | 'submitting' | 'success';

interface Draft {
  amount: string;
  frequency: 'daily' | 'weekly';
  term: string;
  idNumber: string;
  idPhoto: string | null;
  selfie: string | null;
  signature: string;
  agreed: boolean;
}

function emptyDraft(): Draft {
  return { amount: '300,000', frequency: 'daily', term: '30 days', idNumber: '', idPhoto: null, selfie: null, signature: '', agreed: false };
}

export default function RentAdvanceWizard({ show, onClose, onSubmit }: {
  show: boolean;
  onClose: () => void;
  onSubmit: (app: RentAdvanceApplication) => void;
}) {
  const [stage, setStage] = useState<Stage>('form');
  const [step, setStep] = useState<Step>(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [error, setError] = useState('');
  const [ref, setRef] = useState('');
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setStage('form');
      setStep(0);
      setDraft(emptyDraft());
      setError('');
      setRef('');
    }
  }, [show]);

  const update = useCallback((patch: Partial<Draft>) => setDraft(d => ({ ...d, ...patch })), []);

  if (!show) return null;

  function setFreq(frequency: 'daily' | 'weekly') {
    update({ frequency, term: frequency === 'daily' ? '30 days' : '4 weeks' });
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>, field: 'idPhoto' | 'selfie') {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (field === 'idPhoto') update({ idPhoto: result });
      else update({ selfie: result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function next() {
    if (step === 0) {
      if (!draft.amount.trim()) { setError('Please enter an amount to continue.'); return; }
      setError(''); setStep(1);
    } else if (step === 1) {
      if (!draft.idNumber.trim() || !draft.idPhoto || !draft.selfie) { setError('Please add your ID number and both photos.'); return; }
      setError(''); setStep(2);
    } else if (step === 2) {
      if (!draft.agreed || !draft.signature.trim()) { setError('Please agree to the terms and sign with your full name.'); return; }
      setError(''); setStep(3);
    }
  }

  function back() {
    if (step > 0) { setError(''); setStep((step - 1) as Step); }
  }

  function submit() {
    setStage('submitting');
    const generatedRef = 'RA-' + Date.now().toString().slice(-6);
    window.setTimeout(() => {
      setRef(generatedRef);
      onSubmit({
        id: generatedRef,
        amount: draft.amount,
        frequency: draft.frequency,
        term: draft.term,
        idNumber: draft.idNumber,
        idPhoto: draft.idPhoto,
        selfie: draft.selfie,
        signature: draft.signature,
        agreedAt: Date.now(),
        submittedAt: Date.now(),
        status: 'pending',
        rejectionReason: null,
      });
      setStage('success');
    }, 1300);
  }

  return (
    <div className="modal-overlay show" onClick={stage === 'form' ? onClose : undefined}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        {stage === 'submitting' && (
          <div className="pm-processing" style={{ padding: '64px 24px' }}>
            <div className="spinner"></div>
            <div className="proc-title">Submitting your application…</div>
            <div className="proc-sub">Sending your KYC documents to our lending partner</div>
          </div>
        )}

        {stage === 'success' && (
          <div className="pm-success" style={{ padding: '40px 24px' }}>
            <div className="success-check"><Check size={26} /></div>
            <div className="suc-title">Application submitted</div>
            <div className="suc-sub">
              Reference <b style={{ fontFamily: 'var(--font-mono)', color: '#1C2B22' }}>{ref}</b> · under review<br />
              Typical review time is 24–48 hours.
            </div>
            <button className="btn primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={onClose}>Done</button>
          </div>
        )}

        {stage === 'form' && (
          <>
            <div className="pm-head">
              <div className="pm-head-left"><div className="pm-title">Apply for rentAdvance</div></div>
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
                  <h4>How much do you need?</h4>
                  <div className="amount-display">
                    <span className="cur">RWF</span>
                    <input inputMode="numeric" value={draft.amount} onChange={e => update({ amount: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Repayment frequency</label>
                    <div className="chip-row">
                      <div className={`chip${draft.frequency === 'daily' ? ' selected' : ''}`} style={{ fontFamily: 'var(--font-sans)' }} onClick={() => setFreq('daily')}>Daily</div>
                      <div className={`chip${draft.frequency === 'weekly' ? ' selected' : ''}`} style={{ fontFamily: 'var(--font-sans)' }} onClick={() => setFreq('weekly')}>Weekly</div>
                    </div>
                  </div>
                  <div className="form-row">
                    <label>Repayment term (max 30 days)</label>
                    <select value={draft.term} onChange={e => update({ term: e.target.value })}>
                      {FREQ_TERMS[draft.frequency].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ background: '#EDE9FE', borderRadius: 12, padding: '12px 14px', fontSize: 11.3, color: '#4B21A6', fontWeight: 600, lineHeight: 1.5 }}>
                    rentAdvance terms never exceed 30 days · includes a 5% service fee spread across your repayments.
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="ob-step-panel active">
                  <h4>Verify identity</h4>
                  <div className="ob-sub">Required by our lending partner</div>
                  <div className="form-row">
                    <label>National ID number</label>
                    <input value={draft.idNumber} onChange={e => update({ idNumber: e.target.value })} placeholder="1 1988 8 0123456 7 89" />
                  </div>
                  <div className="kyc-photo-row">
                    <div className="kyc-photo-col">
                      <label>Photo of ID card</label>
                      <div className={`kyc-photo-box${draft.idPhoto ? ' has-photo' : ''}`} style={{ cursor: 'pointer' }} onClick={() => idInputRef.current?.click()}>
                        {draft.idPhoto ? <img src={draft.idPhoto} alt="ID" /> : <IdCard size={26} color="#8A968D" />}
                      </div>
                      <input ref={idInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhoto(e, 'idPhoto')} />
                    </div>
                    <div className="kyc-photo-col">
                      <label>Selfie with ID</label>
                      <div className={`kyc-photo-box${draft.selfie ? ' has-photo' : ''}`} style={{ cursor: 'pointer' }} onClick={() => selfieInputRef.current?.click()}>
                        {draft.selfie ? <img src={draft.selfie} alt="Selfie" /> : <Camera size={26} color="#8A968D" />}
                      </div>
                      <input ref={selfieInputRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={e => handlePhoto(e, 'selfie')} />
                    </div>
                  </div>
                  <div style={{ fontSize: 10.8, color: '#8A968D', textAlign: 'center', marginTop: 8 }}>Tap a tile to take a photo or choose one from your gallery</div>
                </div>
              )}

              {step === 2 && (
                <div className="ob-step-panel active">
                  <h4>Loan agreement</h4>
                  <div className="tc-box">
                    {RENTADVANCE_TERMS.map(p => <p key={p}>{p}</p>)}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={draft.agreed} onChange={e => update({ agreed: e.target.checked })} style={{ marginTop: 3, width: 17, height: 17, accentColor: '#8B5CF6', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#4B5A50', lineHeight: 1.5 }}>I have read and agree to the rentAdvance terms and conditions above.</span>
                  </label>
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label>Type your full name as your signature</label>
                    <input value={draft.signature} onChange={e => update({ signature: e.target.value })} placeholder="e.g. Aline Uwera" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="ob-step-panel active">
                  <h4>Review your application</h4>
                  <div className="ob-sub" style={{ marginBottom: 6 }}>Loan</div>
                  <ReviewBlock rows={[['Amount', `RWF ${draft.amount || '0'}`], ['Frequency', draft.frequency === 'daily' ? 'Daily' : 'Weekly'], ['Term', draft.term]]} />
                  <div className="ob-sub" style={{ marginBottom: 6 }}>KYC</div>
                  <ReviewBlock rows={[['ID number', draft.idNumber], ['Documents', 'ID photo ✓ · Selfie ✓']]} />
                  <div className="ob-sub" style={{ marginBottom: 6 }}>Agreement</div>
                  <ReviewBlock rows={[['Signed by', draft.signature]]} />
                </div>
              )}

              {error && <div style={{ color: '#D64545', fontSize: 11.5, fontWeight: 600, margin: '12px 2px 0' }}>{error}</div>}
            </div>

            <div className="ob-foot">
              {step > 0 && <button className="btn" onClick={back}>Back</button>}
              {step < 3 && <button className="btn primary" onClick={next}>Continue</button>}
              {step === 3 && <button className="btn primary" onClick={submit}>Submit application</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewBlock({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ background: '#FAF8F3', borderRadius: 12, padding: '2px 14px', marginBottom: 16 }}>
      {rows.map(([label, value], i) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px dashed #E4E1D6' : 'none', fontSize: 12.3 }}>
          <span style={{ color: '#8A968D' }}>{label}</span>
          <b style={{ textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</b>
        </div>
      ))}
    </div>
  );
}
