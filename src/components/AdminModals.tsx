'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { initials } from '@/lib/data';
import { STAGE_ICONS } from './icons';

/* ═══════════════════════════════════════════════
   HandbookEditModal
   ═══════════════════════════════════════════════ */
export function HandbookEditModal({ show, onClose, section, onSave, onDelete }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (show) {
      setTitle(section ? section.title : '');
      setBody(section ? section.body : '');
    }
  }, [show, section]);

  if (!show) return null;

  const isEdit = !!section;

  function handleSave() {
    if (!title.trim() || !body.trim()) return;
    onSave({ id: section?.id || null, title: title.trim(), body: body.trim() });
  }

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left">
            <span className="pm-title">{isEdit ? 'Edit section' : 'Add section'}</span>
          </div>
          <button className="pm-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="pm-body">
          <div className="form-row">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>

          <div className="form-row">
            <label>Body</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write the section content here..."
              style={{ minHeight: 120 }}
            />
          </div>

          <button
            className="pm-btn"
            disabled={!title.trim() || !body.trim()}
            onClick={handleSave}
          >
            {isEdit ? 'Save changes' : 'Add section'}
          </button>

          {isEdit && (
            <button
              className="pm-btn ghost3"
              style={{ color: '#D64545', marginTop: 8 }}
              onClick={() => onDelete(section.id)}
            >
              Delete section
            </button>
          )}

          <button className="pm-btn ghost3" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BillingModal
   ═══════════════════════════════════════════════ */
export function BillingModal({ show, onClose, mall }) {
  if (!show || !mall) return null;

  const history = mall.billingHistory || [];

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left">
            <span className="pm-title">Billing &mdash; {mall.name}</span>
          </div>
          <button className="pm-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="pm-body">
          <div className="pm-context" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A968D', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>MRR</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#6D28D9' }}>Frw {mall.mrr?.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A968D', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>Next invoice</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{mall.nextInvoice}</div>
            </div>
          </div>

          <div className="od-section-label">Billing history</div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#8A968D', fontSize: 12.5 }}>
              No billing history yet.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Frw {row.amount?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${row.status === 'Paid' ? 'paid' : 'overdue'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className="pm-btn ghost3" onClick={onClose} style={{ marginTop: 16 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OnboardMallWizard
   ═══════════════════════════════════════════════ */
const MALL_STEPS = ['Mall Info', 'Address', 'Manager', 'Review'];
const MALL_CATEGORIES = ['Shopping mall', 'Office complex', 'Mixed-use'];

export function OnboardMallWizard({ show, onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [street, setStreet] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  useEffect(() => {
    if (show) {
      setStep(0);
      setName('');
      setCategory('');
      setCountry('');
      setProvince('');
      setStreet('');
      setOwnerName('');
      setOwnerEmail('');
      setOwnerPhone('');
    }
  }, [show]);

  if (!show) return null;

  function canAdvance() {
    if (step === 0) return name.trim().length > 0 && category.length > 0;
    if (step === 1) return country.trim().length > 0 && province.trim().length > 0;
    if (step === 2) return ownerName.trim().length > 0 && ownerEmail.trim().length > 0;
    return true;
  }

  function next() {
    if (step < 3 && canAdvance()) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleComplete() {
    onComplete({
      name: name.trim(),
      category,
      address: { country: country.trim(), province: province.trim(), street: street.trim() },
      manager: { name: ownerName.trim(), email: ownerEmail.trim(), phone: ownerPhone.trim() },
    });
  }

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        <div className="ob-stepper">
          {MALL_STEPS.map((label, i) => {
            let cls = 'ob-step-item';
            if (i < step) cls += ' done';
            else if (i === step) cls += ' active';
            return (
              <div key={i} className={cls}>
                <div className="ob-step-circle">
                  {i < step ? '\u2713' : i + 1}
                </div>
                <div className="ob-step-label">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="ob-body">
          {step === 0 && (
            <div className="ob-step-panel active">
              <h4>Mall information</h4>
              <div className="ob-sub">Basic details about the new mall</div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Mall name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kigali Grand Mall"
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
                  {MALL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="ob-step-panel active">
              <h4>Address</h4>
              <div className="ob-sub">Physical location of the mall</div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g. Rwanda"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Province / District</label>
                <input
                  type="text"
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  placeholder="e.g. Kigali City"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Street address</label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="e.g. KN 5 Rd, 123"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="ob-step-panel active">
              <h4>Manager</h4>
              <div className="ob-sub">Mall owner / manager contact information</div>
              <div className="form-row">
                <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Owner name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="Full name"
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-2col">
                <div className="form-row">
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Email</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={e => setOwnerEmail(e.target.value)}
                    placeholder="owner@email.com"
                    style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                  />
                </div>
                <div className="form-row">
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#4B5A50', marginBottom: 4, display: 'block' }}>Phone</label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    placeholder="+250 78\u2022 \u2022\u2022\u2022 \u2022\u2022\u2022"
                    style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E4E1D6', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ob-step-panel active">
              <h4>Review &amp; confirm</h4>
              <div className="ob-sub">Verify all details before completing onboarding</div>
              <div className="ob-review">
                <div className="rv-section">
                  <div className="rv-title">Mall</div>
                  <div className="rv-grid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                      <span style={{ color: '#8A968D' }}>Name</span>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                      <span style={{ color: '#8A968D' }}>Category</span>
                      <span style={{ fontWeight: 600 }}>{category}</span>
                    </div>
                  </div>
                </div>
                <div className="rv-section">
                  <div className="rv-title">Address</div>
                  <div className="rv-grid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                      <span style={{ color: '#8A968D' }}>Country</span>
                      <span style={{ fontWeight: 600 }}>{country || '\u2014'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                      <span style={{ color: '#8A968D' }}>Province / District</span>
                      <span style={{ fontWeight: 600 }}>{province || '\u2014'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                      <span style={{ color: '#8A968D' }}>Street</span>
                      <span style={{ fontWeight: 600 }}>{street || '\u2014'}</span>
                    </div>
                  </div>
                </div>
                <div className="rv-section">
                  <div className="rv-title">Manager</div>
                  <div className="rv-grid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}>
                      <span style={{ color: '#8A968D' }}>Name</span>
                      <span style={{ fontWeight: 600 }}>{ownerName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                      <span style={{ color: '#8A968D' }}>Email</span>
                      <span style={{ fontWeight: 600 }}>{ownerEmail}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}>
                      <span style={{ color: '#8A968D' }}>Phone</span>
                      <span style={{ fontWeight: 600 }}>{ownerPhone || '\u2014'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {step < 4 && (
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
            <button
              className="btn"
              onClick={step === 3 ? handleComplete : next}
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
              {step === 3 ? 'Complete onboarding' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   AssignTaskModal
   ═══════════════════════════════════════════════ */
const TASK_CATEGORIES = ['Electrical', 'Plumbing', 'HVAC', 'Cleaning', 'IT/POS', 'Other'];

export function AssignTaskModal({ show, onClose, staff, onSubmit }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (show) {
      setCategory('');
      setDescription('');
      setSelectedStaff(null);
    }
  }, [show]);

  if (!show) return null;

  function handleSubmit() {
    if (!category || !description.trim() || !selectedStaff) return;
    onSubmit({
      category,
      description: description.trim(),
      staff: selectedStaff,
    });
  }

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left">
            <span className="pm-title">Assign task</span>
          </div>
          <button className="pm-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="pm-body">
          <div className="form-row">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {TASK_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              placeholder="Describe the maintenance task..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="form-row">
            <label>Assign to staff</label>
            <div style={{ display: 'grid', gap: 8 }}>
              {(staff || []).map((s, idx) => {
                const isSelected = selectedStaff?.name === s.name;
                return (
                  <div
                    key={idx}
                    className="rider-card-mini"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #8B5CF6' : '2px solid transparent',
                      background: isSelected ? '#EDE9FE' : '#FAF8F3',
                    }}
                    onClick={() => setSelectedStaff(s)}
                  >
                    <div
                      className="rc-av"
                      style={{ background: (s.color || '#8B5CF6') + '22', color: s.color || '#6D28D9' }}
                    >
                      {initials(s.name)}
                    </div>
                    <div>
                      <div className="rc-name">{s.name}</div>
                      <div className="rc-sub">{s.role}</div>
                    </div>
                    {s.status && (
                      <span
                        className={`badge ${s.status === 'available' ? 'paid' : s.status === 'busy' ? 'due' : 'transit'}`}
                        style={{ marginLeft: 'auto' }}
                      >
                        {s.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="pm-btn"
            disabled={!category || !description.trim() || !selectedStaff}
            onClick={handleSubmit}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TaskDetailModal
   ═══════════════════════════════════════════════ */
export function TaskDetailModal({ show, onClose, task, stages, onAdvanceStage }) {
  if (!show || !task) return null;

  const isCompleted = task.stage === stages.length - 1;

  function stageStatus(idx) {
    if (idx < task.stage) return 'done';
    if (idx === task.stage) return 'current';
    return '';
  }

  function stageTime(idx) {
    if (idx < task.stage) {
      if (idx === 0 && task.assignedAt) return task.assignedAt;
      if (isCompleted && idx === stages.length - 1 && task.completedAt) return task.completedAt;
      return '';
    }
    return '';
  }

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="order-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <div className="pm-head-left">
            <span className="pm-title">{task.id}</span>
            <span className="badge transit">{task.category}</span>
          </div>
          <button className="pm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="od-body">
          <div className="od-section-label">Description</div>
          <div style={{ fontSize: 12.5, color: '#4B5A50', lineHeight: 1.55, marginBottom: 16 }}>
            {task.description}
          </div>

          <div className="od-section-label">Assigned staff</div>
          <div className="rider-card-mini">
            <div
              className="rc-av"
              style={{ background: '#8B5CF622', color: '#6D28D9' }}
            >
              {initials(task.staff.name)}
            </div>
            <div>
              <div className="rc-name">{task.staff.name}</div>
              <div className="rc-sub">{task.staff.role}</div>
            </div>
          </div>

          <div className="od-section-label">Timeline</div>
          <div className="od-timeline">
            {stages.map((st, idx) => {
              const status = stageStatus(idx);
              return (
                <div className={`od-timeline-item${status ? ' ' + status : ''}`} key={idx}>
                  <div className="od-timeline-dot">{STAGE_ICONS[st.icon] || st.icon}</div>
                  <div className="od-timeline-line" />
                  <div className="od-timeline-content">
                    <div className="od-timeline-label">{st.label}</div>
                    {stageTime(idx) && (
                      <div className="od-timeline-time">{stageTime(idx)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            {!isCompleted ? (
              <button
                className="pm-btn"
                onClick={() => onAdvanceStage(task.id, task.stage + 1)}
              >
                Advance stage
              </button>
            ) : (
              <div style={{ textAlign: 'center', background: '#EDE9FE', borderRadius: 12, padding: '14px', fontSize: 13, fontWeight: 700, color: '#6D28D9' }}>
                Task completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
