'use client';
import React, { useState } from 'react';
import { X, Check, Camera, Star } from 'lucide-react';
import { initials, relTime, maintRoleToCategory } from '@/lib/data';
import { STAGE_ICONS } from './icons';

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
        <button className="pm-close" onClick={handleClose}><X size={16} /></button>
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

/* ═══════════════════════════════════════════════
   MaintenanceDetailModal
   ═══════════════════════════════════════════════ */
export function MaintenanceDetailModal({ show, onClose, request, stages, onRate }) {
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!show || !request) return null;

  const isCompleted = request.stage === stages.length - 1;
  const alreadyRated = request.rating != null || ratingSubmitted;

  function handleRate() {
    if (!rating) return;
    onRate(request.id, rating);
    setRatingSubmitted(true);
  }

  function urgencyBadgeClass() {
    return `badge ${request.urgency === 'urgent' ? 'overdue' : 'transit'}`;
  }

  function stageStatus(idx) {
    if (idx < request.stage) return 'done';
    if (idx === request.stage) return 'current';
    return '';
  }

  function stageTime(idx) {
    if (idx < request.stage) {
      if (idx === 0) return relTime(request.submittedAt);
      if (isCompleted && idx === stages.length - 1 && request.completedAt) {
        return relTime(request.completedAt);
      }
      return '';
    }
    return '';
  }

  return (
    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
      <div className="pm-head">
        <div className="pm-head-left">
          <span className="pm-title">{request.id}</span>
          <span className={urgencyBadgeClass()}>{request.urgency}</span>
        </div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>

      <div className="od-body">
        <div className="od-section-label">Issue</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
          {request.category}
        </div>
        <div style={{ fontSize: 12.2, color: '#4B5A50', marginBottom: 16, lineHeight: 1.55 }}>
          {request.description}
        </div>

        <div className="od-section-label">Assigned staff</div>
        <div className="rider-card-mini">
          <div
            className="rc-av"
            style={{
              background: request.staff.role === 'Electrician' ? '#8B5CF622' : '#EDE9FE',
              color: request.staff.role === 'Electrician' ? '#8B5CF6' : '#6D28D9',
            }}
          >
            {initials(request.staff.name)}
          </div>
          <div>
            <div className="rc-name">{request.staff.name}</div>
            <div className="rc-sub">{request.staff.role}</div>
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

        {isCompleted && (
          <div style={{ marginTop: 20 }}>
            {alreadyRated ? (
              <div
                style={{
                  textAlign: 'center',
                  background: '#EDE9FE',
                  borderRadius: 12,
                  padding: '16px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#6D28D9',
                }}
              >
                Thank you for your feedback
              </div>
            ) : (
              <>
                <div className="od-section-label">Rate this service</div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        cursor: 'pointer',
                        color: star <= rating ? '#F2A93B' : '#E4E1D6',
                        transition: 'color .12s',
                        display: 'flex',
                      }}
                    >
                      <Star size={26} fill={star <= rating ? '#F2A93B' : 'none'} />
                    </span>
                  ))}
                </div>
                <button
                  className="pm-btn"
                  disabled={!rating}
                  onClick={handleRate}
                >
                  Submit rating
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
