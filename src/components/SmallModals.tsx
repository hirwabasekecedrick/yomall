'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { relTime } from '@/lib/data';
import { AMENITY_ICONS, AMENITY_ICON_KEYS } from './icons';

function Overlay({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function VacancyModal({ show, onClose, unit, inquiries, onListUnit, onRemoveListing }) {
  const [listed, setListed] = useState(false);
  const [desc, setDesc] = useState('');

  function handleList() {
    if (onListUnit) onListUnit(unit, desc);
    setListed(true);
  }

  function handleRemove() {
    if (onRemoveListing) onRemoveListing(unit);
    setListed(false);
    setDesc('');
  }

  return (
    <Overlay show={show} onClose={onClose}>
      <div className="pm-head">
        <div className="pm-title">Unit {unit} — Vacant</div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        {!listed ? (
          <>
            <div className="form-row">
              <label>Description</label>
              <input
                type="text"
                placeholder="Brief description of the unit..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
            <button className="pm-btn" onClick={handleList}>List this unit</button>
          </>
        ) : (
          <>
            <div className="form-row">
              <label>Inquiries ({inquiries?.length || 0})</label>
            </div>
            {(!inquiries || inquiries.length === 0) && (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: 24, fontSize: 13 }}>
                No inquiries yet
              </div>
            )}
            {inquiries?.map((inq, i) => (
              <div className="inquiry-row" key={i}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{inq.name}</div>
                <div style={{ fontSize: 12.5, color: '#4B5A50' }}>{inq.phone}</div>
                <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>{inq.message}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>{relTime(inq.at)}</div>
              </div>
            ))}
            <button className="pm-btn ghost3" onClick={handleRemove} style={{ marginTop: 12 }}>
              Remove listing
            </button>
          </>
        )}
      </div>
    </Overlay>
  );
}

export function AmenityModal({ show, onClose, amenity, onSave, onDelete }) {
  const [icon, setIcon] = useState(amenity?.icon || '');
  const [name, setName] = useState(amenity?.name || '');
  const [sub, setSub] = useState(amenity?.sub || '');

  function handleSave() {
    if (!name.trim()) return;
    if (onSave) onSave({ id: amenity?.id, icon, name: name.trim(), sub: sub.trim() });
    onClose();
  }

  function handleDelete() {
    if (onDelete && amenity?.id) onDelete(amenity.id);
    onClose();
  }

  return (
    <Overlay show={show} onClose={onClose}>
      <div className="pm-head">
        <div className="pm-title">{amenity ? 'Edit amenity' : 'Add amenity'}</div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        <div className="emoji-grid">
          {AMENITY_ICON_KEYS.map(key => (
            <button
              key={key}
              className={`emoji-opt${icon === key ? ' selected' : ''}`}
              onClick={() => setIcon(key)}
              title={key}
            >
              {AMENITY_ICONS[key]}
            </button>
          ))}
        </div>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            placeholder="Amenity name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <input
            type="text"
            placeholder="Brief description"
            value={sub}
            onChange={e => setSub(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pm-btn" onClick={handleSave} style={{ flex: 1 }}>Save</button>
          {amenity && (
            <button className="pm-btn ghost3" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </Overlay>
  );
}

export function AnnouncementModal({ show, onClose, announcement, onSave, onDelete }) {
  const [title, setTitle] = useState(announcement?.title || '');
  const [body, setBody] = useState(announcement?.body || '');
  const [expiresAt, setExpiresAt] = useState(announcement?.expiresAt || '');
  const [live, setLive] = useState(announcement?.live ?? true);

  function handleSave() {
    if (!title.trim() || !body.trim()) return;
    if (onSave) onSave({
      id: announcement?.id,
      title: title.trim(),
      body: body.trim(),
      expiresAt,
      live,
    });
    onClose();
  }

  function handleDelete() {
    if (onDelete && announcement?.id) onDelete(announcement.id);
    onClose();
  }

  return (
    <Overlay show={show} onClose={onClose}>
      <div className="pm-head">
        <div className="pm-title">{announcement ? 'Edit announcement' : 'New announcement'}</div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        <div className="form-row">
          <label>Title</label>
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Message</label>
          <textarea
            placeholder="Write your announcement..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
          />
        </div>
        <div className="form-row">
          <label>Expiry date</label>
          <input
            type="date"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Live</label>
          <button
            className={`switch${live ? ' on' : ''}`}
            onClick={() => setLive(!live)}
          >
            <div className="switch-toggle" />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="pm-btn"
            onClick={handleSave}
            disabled={!title.trim() || !body.trim()}
            style={{ flex: 1, opacity: (!title.trim() || !body.trim()) ? 0.5 : 1 }}
          >
            Save
          </button>
          {announcement && (
            <button className="pm-btn ghost3" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </Overlay>
  );
}

export function TeamInviteModal({ show, onClose, onInvite }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager');

  function handleInvite() {
    if (!name.trim() || !email.trim()) return;
    if (onInvite) onInvite({ name: name.trim(), email: email.trim(), role });
    setName('');
    setEmail('');
    setRole('manager');
    onClose();
  }

  return (
    <Overlay show={show} onClose={onClose}>
      <div className="pm-head">
        <div className="pm-title">Invite team member</div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="manager">Manager — full access</option>
            <option value="finance">Finance — read-only</option>
            <option value="viewer">Viewer — read-only</option>
          </select>
        </div>
        <button
          className="pm-btn"
          onClick={handleInvite}
          disabled={!name.trim() || !email.trim()}
          style={{ opacity: (!name.trim() || !email.trim()) ? 0.5 : 1 }}
        >
          Send invite
        </button>
      </div>
    </Overlay>
  );
}

export function DocumentUploadModal({ show, onClose, onUpload }) {
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [fileName, setFileName] = useState('');

  function handleUpload() {
    if (!docName.trim() || !category) return;
    if (onUpload) onUpload({
      name: docName.trim(),
      category,
      expiry: expiryDate,
      fileName,
    });
    setDocName('');
    setCategory('');
    setExpiryDate('');
    setFileName('');
    onClose();
  }

  return (
    <Overlay show={show} onClose={onClose}>
      <div className="pm-head">
        <div className="pm-title">Upload document</div>
        <button className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-body">
        <div className="form-row">
          <label>Document name</label>
          <input
            type="text"
            placeholder="e.g. Fire Safety Certificate"
            value={docName}
            onChange={e => setDocName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select category…</option>
            <option value="insurance">Insurance</option>
            <option value="safety">Safety &amp; Compliance</option>
            <option value="license">Business License</option>
            <option value="lease">Lease</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label>Expiry date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>File</label>
          <div className="photo-picker">
            <button
              className="pm-btn"
              onClick={() => setFileName('document.pdf')}
              style={{ marginBottom: 8 }}
            >
              Choose file
            </button>
            {fileName && (
              <div className="photo-preview">
                <span className="badge">{fileName}</span>
              </div>
            )}
          </div>
        </div>
        <button
          className="pm-btn"
          onClick={handleUpload}
          disabled={!docName.trim() || !category}
          style={{ opacity: (!docName.trim() || !category) ? 0.5 : 1 }}
        >
          Upload
        </button>
      </div>
    </Overlay>
  );
}
