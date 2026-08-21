'use client';
import React, { useState } from 'react';
import { Check, IdCard, Camera } from 'lucide-react';

const PENDING_STEPS = ['Applicant', 'KYC', 'Agreement', 'Decision'];

const LOAN_TERMS = `
1. DEFINITIONS
This Rent Advance Loan Agreement ("Agreement") is entered into between the Lending Partner ("Lender") and the Tenant ("Borrower").

2. LOAN AMOUNT
The Lender agrees to advance the Borrower the principal amount specified in this application, to be used exclusively for rent payment to the property owner.

3. REPAYMENT TERMS
The Borrower shall repay the loan in equal installments according to the selected frequency (daily or weekly) starting from the date of disbursement. All payments must be made on or before the due date.

4. INTEREST & FEES
No interest shall be charged on this loan. A processing fee of 2% of the principal amount may apply and will be deducted from the disbursement amount.

5. DEFAULT
Failure to make payments for more than 7 consecutive days shall constitute a default. Upon default, the full outstanding balance becomes immediately due, and the Lender reserves the right to report the default to credit reference bureaus.

6. EARLY REPAYMENT
The Borrower may repay the full outstanding amount at any time without penalty.

7. USE OF FUNDS
The loan proceeds shall be used solely for rent advance payment as specified in this application. Any alternative use constitutes a breach of this agreement.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the Republic of Rwanda.
`;

export default function LoanWizard({ show, onClose, application, onApprove, onReject }) {
  const [step, setStep] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  if (!show || !application) return null;

  const { id, tenantName, mall, unit, ownerName, phone, idNumber, idPhoto, selfie, amount, frequency, term, signature, agreedAt, status, submittedAt, reviewedAt, disbursedAt, rejectionReason, isCurrentTenant } = application;

  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  const refNumber = id ? `LN-${String(id).slice(-8).toUpperCase()}` : 'LN-00000000';

  function next() {
    if (step < 3) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleApprove() {
    onApprove(id);
  }

  function handleReject() {
    onReject(id, rejectReason.trim());
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function renderStepper() {
    if (isPending) {
      return (
        <div className="ob-stepper">
          {PENDING_STEPS.map((label, i) => {
            let cls = 'ob-step-item';
            if (i < step) cls += ' done';
            else if (i === step) cls += ' active';
            return (
              <div key={i} className={cls}>
                <div className="ob-step-circle">
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <div className="ob-step-label">{label}</div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="ob-stepper">
        <div className="ob-step-item active">
          <div className="ob-step-circle"><Check size={13} /></div>
          <div className="ob-step-label">Status</div>
        </div>
      </div>
    );
  }

  function renderPendingSteps() {
    return (
      <>
        {step === 0 && (
          <div className="ob-step-panel active">
            <h4>Applicant Information</h4>
            <div className="form-row">
              <label>Owner Name</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{ownerName || '—'}</div>
            </div>
            <div className="form-row">
              <label>Phone</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{phone || '—'}</div>
            </div>
            <div className="form-row">
              <label>ID Number</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{idNumber || '—'}</div>
            </div>
            <div className="form-row">
              <label>Mall</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{mall || '—'}</div>
            </div>
            <div className="form-row">
              <label>Unit</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{unit || '—'}</div>
            </div>
            <div className="form-row">
              <label>Amount Requested</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>RWF {Number(amount || 0).toLocaleString()}</div>
            </div>
            <div className="form-row">
              <label>Repayment Frequency</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0', textTransform: 'capitalize' }}>{frequency || '—'}</div>
            </div>
            <div className="form-row">
              <label>Term (months)</label>
              <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{term || '—'}</div>
            </div>
            <div className="form-row">
              <label>Tenant Status</label>
              <div style={{ padding: '8px 0' }}>
                <span className={`badge ${isCurrentTenant ? 'paid' : 'overdue'}`}>
                  {isCurrentTenant ? 'Current Tenant' : 'Not a Tenant'}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="ob-step-panel active">
            <h4>KYC Documents</h4>
            <div className="kyc-photo-row">
              <div className="kyc-photo-col">
                <div className="kyc-photo-box">
                  {idPhoto ? (
                    <img src={idPhoto} alt="ID Photo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#8A968D', fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IdCard size={28} /></div>
                      Photo not uploaded
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginTop: 6, textAlign: 'center' }}>ID Photo</div>
              </div>
              <div className="kyc-photo-col">
                <div className="kyc-photo-box">
                  {selfie ? (
                    <img src={selfie} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#8A968D', fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><Camera size={28} /></div>
                      Photo not uploaded
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginTop: 6, textAlign: 'center' }}>Selfie</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step-panel active">
            <h4>Loan Agreement</h4>
            <div className="tc-box">
              {LOAN_TERMS}
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="form-row">
                <label>Signature</label>
                {signature ? (
                  <div style={{ padding: '8px 0' }}>
                    <img src={signature} alt="Signature" style={{ maxHeight: 60, borderRadius: 6, border: '1px solid #E4E1D6', padding: 4 }} />
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#8A968D', padding: '8px 0' }}>No signature provided</div>
                )}
              </div>
              <div className="form-row">
                <label>Agreed At</label>
                <div style={{ fontSize: 13, fontWeight: 600, padding: '8px 0' }}>{formatDate(agreedAt)}</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ob-step-panel active">
            <h4>Decision</h4>
            <div className="lending-decision-box">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                {tenantName || 'Applicant'}
              </div>
              <div style={{ fontSize: 12, color: '#4B5A50', marginBottom: 4 }}>
                {mall} · Unit {unit}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1C2B22', margin: '10px 0' }}>
                RWF {Number(amount || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#4B5A50', marginBottom: 14 }}>
                {frequency} repayment · {term} months
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn"
                  onClick={handleApprove}
                  style={{ flex: 1, padding: '11px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve &amp; disburse
                </button>
                <button
                  className="btn danger-style"
                  onClick={() => setShowRejectBox(!showRejectBox)}
                  style={{ flex: 1, padding: '11px', background: showRejectBox ? '#FEE2E2' : '#fff', color: '#DC2626', border: '1.5px solid #FECACA', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>

              <div className={`reject-reason-box${showRejectBox ? ' show' : ''}`}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Rejection reason</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Provide a reason for rejecting this application..."
                  rows={4}
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                />
                <button
                  className="btn"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  style={{ marginTop: 8, width: '100%', padding: '10px', background: rejectReason.trim() ? '#DC2626' : '#E4E1D6', color: rejectReason.trim() ? '#fff' : '#8A968D', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: rejectReason.trim() ? 'pointer' : 'not-allowed' }}
                >
                  Confirm rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderStatusCard() {
    if (isApproved) {
      return (
        <div className="loan-status-card approved">
          <div className="lsc-title">Loan Approved &amp; Disbursed</div>
          <div className="lsc-body">Amount disbursed on {formatDate(reviewedAt || disbursedAt)}</div>
          <div className="lsc-ref">{refNumber}</div>
        </div>
      );
    }

    if (isRejected) {
      return (
        <div className="loan-status-card rejected">
          <div className="lsc-title">Application Rejected</div>
          <div className="lsc-body">{rejectionReason || 'No reason provided.'}</div>
          <div className="lsc-ref">{refNumber}</div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="onboard-modal">
      {renderStepper()}

      <div className="ob-body">
        {isPending && renderPendingSteps()}
        {!isPending && (
          <div className="ob-step-panel active">
            {renderStatusCard()}
          </div>
        )}
      </div>

      {isPending && (
        <div className="ob-foot">
          {step > 0 && (
            <button
              className="btn"
              onClick={back}
              style={{ padding: '11px', border: '1.5px solid #E4E1D6', borderRadius: 10, fontSize: 12.5, fontWeight: 600, background: '#fff', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              className="btn"
              onClick={next}
              style={{ padding: '11px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flex: 1, justifyContent: 'center' }}
            >
              Continue
            </button>
          )}
        </div>
      )}

      {!isPending && (
        <div className="ob-foot">
          <button
            className="btn"
            onClick={onClose}
            style={{ padding: '11px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flex: 1, justifyContent: 'center' }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
