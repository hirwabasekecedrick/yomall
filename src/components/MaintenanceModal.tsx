'use client';
import React, { useState } from 'react';
import { X, Check, Camera, Star } from 'lucide-react';
import { initials, maintRoleToCategory } from '@/lib/data';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'HVAC / Air conditioning',
  'Cleaning',
  'IT / POS support',
  'Other',
];

/* ═══════════════════════════════════════════════
   MaintenanceRequestModal
   ═══════════════════════════════════════════════ */
export function MaintenanceRequestModal({ show, onClose, onSubmit, staffList }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const suggestedStaff = staffList?.filter((s) => {
    const mapped = maintRoleToCategory[s.role];
    return mapped && mapped === category;
  }) || [];

  function handleSubmit() {
    if (!category || !description.trim()) return;
    onSubmit({ category, description: description.trim(), urgency, photo });
    setSubmitted(true);
  }

  function handleClose() {
    setCategory('');
    setDescription('');
    setUrgency('normal');
    setPhoto(null);
    setSubmitted(false);
    onClose();
  }

  if (!show) return null;

  return (
    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
      <div className="pm-head">
        <span className="pm-title">New maintenance request</span>
        <button aria-label="Close" className="pm-close" onClick={handleClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        {submitted ? (
          <div className="pm-success">
            <div className="success-check"><Check size={26} /></div>
            <div className="suc-title">Request submitted</div>
            <div className="suc-sub">
              Our team will review your request and get back to you shortly.
            </div>
            <button
              className="pm-btn"
              style={{ marginTop: 18 }}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="form-row">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Urgency</label>
              <div className="freq-select">
                <div
                  className={`fo${urgency === 'normal' ? ' selected' : ''}`}
                  onClick={() => setUrgency('normal')}
                >
                  Normal
                </div>
                <div
                  className={`fo${urgency === 'urgent' ? ' selected' : ''}`}
                  onClick={() => setUrgency('urgent')}
                >
                  Urgent
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>Photo</label>
              <div className="photo-picker">
                <div className={`photo-preview${photo ? ' has-photo' : ''}`}>
                  {photo ? (
                    <img src={photo} alt="Preview" />
                  ) : (
                    <span style={{ display: 'flex' }}><Camera size={22} /></span>
                  )}
                </div>
                <div className="photo-actions">
                  <button
                    className="pm-btn photo-action-btn"
                    onClick={() => setPhoto('demo-photo-url')}
                  >
                    Take photo
                  </button>
                  <button
                    className="pm-btn photo-action-btn ghost3"
                    onClick={() => setPhoto('demo-photo-url')}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {suggestedStaff.length > 0 && (
              <div className="form-row">
                <label>Suggested staff</label>
                {suggestedStaff.map((s) => (
                  <div className="rider-card-mini" key={s.name}>
                    <div
                      className="rc-av"
                      style={{ background: s.color + '22', color: s.color }}
                    >
                      {initials(s.name)}
                    </div>
                    <div>
                      <div className="rc-name">{s.name}</div>
                      <div className="rc-sub">{s.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="pm-btn"
              disabled={!category || !description.trim()}
              onClick={handleSubmit}
            >
              Submit request
            </button>
          </>
        )}
      </div>
    </div>
  );
}
