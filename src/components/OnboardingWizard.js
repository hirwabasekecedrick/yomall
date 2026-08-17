'use client';
import React, { useState } from 'react';
import { initials } from '@/lib/data';

const STEPS = ['Details', 'Unit', 'Plan', 'Review', 'Done'];
const FLOOR_KEYS = ['G', '1', '2'];
const FLOOR_LABELS = ['Ground', 'Floor 1', 'Floor 2'];
const CATEGORIES = ['Electronics', 'Fashion', 'Food & beverage', 'Beauty', 'Books & stationery', 'Other'];

export default function OnboardingWizard({ show, onClose, floors, onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('G');
  const [planType, setPlanType] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [agreed, setAgreed] = useState(false);

  if (!show) return null;

  const currentUnits = floors[selectedFloor] || [];
  const computedEmail = name ? name.toLowerCase().replace(/\s+/g, '') + '@tenant.yomall.africa' : '';
  const perPeriod = planType === 'rentAdvance' && monthlyRent
    ? frequency === 'daily'
      ? Math.round(Number(monthlyRent) / 30)
      : Math.round(Number(monthlyRent) / 4)
    : 0;

  function canAdvance() {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return selectedUnit !== null;
    if (step === 2) return planType !== '';
    return true;
  }

  function next() {
    if (step < 4 && canAdvance()) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleComplete() {
    const newTenant = {
      name,
      unit: selectedUnit,
      cat: category,
      phone,
      email: computedEmail,
      plan: planType === 'rentAdvance' ? frequency : 'wallet',
      monthlyRent: Number(monthlyRent) || 0,
      perPeriod,
      store: 'draft',
      rent: 'due',
    };
    onComplete(newTenant);
  }

  function getFloorLabel(key) {
    if (key === 'G') return 'Ground';
    return 'Floor ' + key;
  }

  return (
    <div className="onboard-modal">
      <div className="ob-stepper">
        {STEPS.map((label, i) => {
          let cls = 'ob-step-item';
          if (i < step) cls += ' done';
          else if (i === step) cls += ' active';
          return (
            <div key={i} className={cls}>
              <div className="ob-step-circle">
                {i < step ? '✓' : i + 1}
              </div>
              <div className="ob-step-label">{label}</div>
            </div>
          );
        })}
      </div>

      <div className="ob-body">
        {step === 0 && (
          <div className="ob-step-panel active">
            <h4>Tenant details</h4>
            <div className="ob-sub">Basic information about the new tenant</div>
            <div className="form-2col">
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Nyabugogo TechHub"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit', background: '#fff' }}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-2col" style={{ marginTop: 12 }}>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+250 78• ••• •••"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tenant@email.com"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="ob-step-panel active">
            <h4>Assign a unit</h4>
            <div className="ob-sub">Select a vacant unit from the floor map</div>
            <div className="ob-unit-picker">
              <div className="floor-tabs" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {FLOOR_KEYS.map((key, i) => (
                  <button
                    key={key}
                    className={`ob-ftab${selectedFloor === key ? ' active' : ''}`}
                    onClick={() => { setSelectedFloor(key); setSelectedUnit(null); }}
                  >
                    {FLOOR_LABELS[i]}
                  </button>
                ))}
              </div>
              <div className="ob-unit-grid">
                {currentUnits.map((u, i) => {
                  const isVacant = u.s === 'vacant';
                  const isChosen = selectedUnit === u.n;
                  let cls = 'unit';
                  if (u.s === 'paid' || u.s === 'due' || u.s === 'overdue') cls += ' ' + u.s;
                  if (isVacant) cls += ' vacant';
                  if (isChosen) cls += ' chosen';
                  return (
                    <div
                      key={i}
                      className={cls}
                      onClick={() => { if (isVacant) setSelectedUnit(u.n); }}
                    >
                      <div className="u-name">{u.n}</div>
                      <div className="u-tag">{u.s}</div>
                    </div>
                  );
                })}
              </div>
              <div className={`ob-selected-unit${selectedUnit ? ' show' : ''}`}>
                Selected: <strong>{selectedUnit}</strong> — {getFloorLabel(selectedFloor)}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step-panel active">
            <h4>Rent plan</h4>
            <div className="ob-sub">Choose how the tenant will repay their advance</div>
            <div className="ob-plan-grid">
              <div
                className={`method-opt${planType === 'rentAdvance' ? ' selected' : ''}`}
                onClick={() => setPlanType('rentAdvance')}
              >
                <div className="mo-ic">💰</div>
                <div>
                  <div className="mo-name">Rent advance</div>
                  <div className="mo-sub">Monthly advance → daily/weekly repayments</div>
                </div>
                <div className="mo-check"></div>
              </div>
              <div
                className={`method-opt${planType === 'wallet' ? ' selected' : ''}`}
                onClick={() => setPlanType('wallet')}
              >
                <div className="mo-ic">👛</div>
                <div>
                  <div className="mo-name">Digital wallet</div>
                  <div className="mo-sub">Pre-paid balance for rent</div>
                </div>
                <div className="mo-check"></div>
              </div>
            </div>
            <div className={`ob-sub-panel${planType === 'rentAdvance' ? ' active' : ''}`}>
              <div className="form-row" style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Monthly rent amount (RWF)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(e.target.value)}
                  placeholder="e.g. 450000"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 6, display: 'block' }}>Repayment frequency</label>
                <div className="freq-select">
                  <div
                    className={`fo${frequency === 'daily' ? ' selected' : ''}`}
                    onClick={() => setFrequency('daily')}
                  >
                    Daily
                  </div>
                  <div
                    className={`fo${frequency === 'weekly' ? ' selected' : ''}`}
                    onClick={() => setFrequency('weekly')}
                  >
                    Weekly
                  </div>
                </div>
              </div>
              {monthlyRent > 0 && (
                <div className="ob-calc-note">
                  Per-period amount: <strong>RWF {perPeriod.toLocaleString()}</strong> {frequency === 'daily' ? '/ day' : '/ week'}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ob-step-panel active">
            <h4>Review & confirm</h4>
            <div className="ob-sub">Verify the tenant details before onboarding</div>
            <div className="ob-review">
              <div className="rv-section">
                <div className="rv-title">Tenant</div>
                <div className="rv-grid">
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                    <span style={{ color: '#8A968D' }}>Name</span>
                    <span style={{ fontWeight: 600 }}>{name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                    <span style={{ color: '#8A968D' }}>Category</span>
                    <span style={{ fontWeight: 600 }}>{category || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                    <span style={{ color: '#8A968D' }}>Phone</span>
                    <span style={{ fontWeight: 600 }}>{phone || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                    <span style={{ color: '#8A968D' }}>Email</span>
                    <span style={{ fontWeight: 600 }}>{email || '—'}</span>
                  </div>
                </div>
              </div>
              <div className="rv-section">
                <div className="rv-title">Unit</div>
                <div className="rv-grid">
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                    <span style={{ color: '#8A968D' }}>Unit</span>
                    <span style={{ fontWeight: 600 }}>{selectedUnit}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                    <span style={{ color: '#8A968D' }}>Floor</span>
                    <span style={{ fontWeight: 600 }}>{getFloorLabel(selectedFloor)}</span>
                  </div>
                </div>
              </div>
              <div className="rv-section">
                <div className="rv-title">Rent</div>
                <div className="rv-grid">
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                    <span style={{ color: '#8A968D' }}>Plan</span>
                    <span style={{ fontWeight: 600 }}>{planType === 'rentAdvance' ? 'Rent advance' : 'Digital wallet'}</span>
                  </div>
                  {planType === 'rentAdvance' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                        <span style={{ color: '#8A968D' }}>Monthly rent</span>
                        <span style={{ fontWeight: 600 }}>RWF {Number(monthlyRent).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                        <span style={{ color: '#8A968D' }}>Per-period</span>
                        <span style={{ fontWeight: 600 }}>RWF {perPeriod.toLocaleString()} / {frequency === 'daily' ? 'day' : 'week'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="ob-cred-card">
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6D28D9', marginBottom: 8 }}>Generated credentials</div>
              <div className="cc-row">
                <span>Login email</span>
                <b>{computedEmail}</b>
              </div>
              <div className="cc-row">
                <span>Password</span>
                <b>1234</b>
              </div>
              <div style={{ fontSize: 10.5, color: '#8A968D', marginTop: 4 }}>Change after first login</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="ob-step-panel active" style={{ textAlign: 'center', padding: '30px 0 10px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 30, color: '#fff' }}>
              ✓
            </div>
            <h4 style={{ fontSize: 18, marginBottom: 6 }}>Tenant onboarded!</h4>
            <div className="ob-sub" style={{ marginBottom: 24 }}>Credentials have been sent to {email || computedEmail}</div>
            <button
              className="btn"
              onClick={handleComplete}
              style={{ padding: '11px 32px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="ob-foot">
          {step > 0 && (
            <button className="btn" onClick={back} style={{ padding: '11px', border: '1.5px solid #E4E1D6', borderRadius: 10, fontSize: 12.5, fontWeight: 600, background: '#fff', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
              Back
            </button>
          )}
          <button
            className="btn"
            onClick={next}
            disabled={!canAdvance()}
            style={{
              padding: '11px',
              background: canAdvance() ? '#8B5CF6' : '#E4E1D6',
              color: canAdvance() ? '#fff' : '#8A968D',
              border: 'none',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
              flex: 1,
              justifyContent: 'center',
              opacity: canAdvance() ? 1 : 0.6,
            }}
          >
            {step === 3 ? 'Finish' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
}
