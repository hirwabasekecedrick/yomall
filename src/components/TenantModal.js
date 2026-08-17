'use client';
import React, { useState, useEffect } from 'react';
import { initials, relTime, DAY } from '@/lib/data';

const TABS = ['Overview', 'Payments', 'Receipts', 'Documents', 'Messages', 'Notes'];

export default function TenantModal({ show, onClose, tenant, profile, onSave }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [localProfile, setLocalProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocalProfile({ ...profile });
      setNotes(profile.notes ? [...profile.notes] : []);
      setMessages(profile.messages ? [...profile.messages] : []);
      setSuspended(profile.suspended || false);
    }
  }, [profile]);

  if (!show || !tenant || !localProfile) return null;

  const leaseDays = Math.floor((Date.now() - new Date(localProfile.leaseStart).getTime()) / DAY);

  function handleSuspend() {
    const next = !suspended;
    setSuspended(next);
    const updated = { ...localProfile, suspended: next };
    setLocalProfile(updated);
    onSave(updated);
  }

  function handleSaveNote() {
    if (!newNote.trim()) return;
    const note = { text: newNote.trim(), at: Date.now() };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    setNewNote('');
    const updated = { ...localProfile, notes: updatedNotes };
    setLocalProfile(updated);
    onSave(updated);
  }

  function handleSendMessage() {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      from: 'landlord',
      subject: 'Message',
      body: newMessage.trim(),
      at: Date.now(),
    };
    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    setNewMessage('');
    const updated = { ...localProfile, messages: updatedMessages };
    setLocalProfile(updated);
    onSave(updated);
  }

  function balanceClass() {
    if (suspended) return 'warn';
    if (tenant.rent === 'overdue') return 'bad';
    if (tenant.rent === 'due') return 'warn';
    return 'ok';
  }

  function balanceLabel() {
    if (suspended) return 'Suspended';
    if (tenant.rent === 'overdue') return 'Overdue';
    if (tenant.rent === 'due') return 'Due Soon';
    return 'Up to Date';
  }

  function insuranceBadge(status) {
    if (status === 'compliant') return <span className="badge paid">Compliant</span>;
    if (status === 'expiring') return <span className="badge due">Expiring Soon</span>;
    return <span className="badge overdue">Missing</span>;
  }

  const mockPayments = [
    { date: 'Jul 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, method: 'MoMo', status: tenant.rent === 'paid' ? 'paid' : 'overdue' },
    { date: 'Jun 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, method: 'Bank Transfer', status: 'paid' },
    { date: 'May 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, method: 'MoMo', status: 'paid' },
    { date: 'Apr 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, method: 'Cash', status: 'paid' },
  ];

  const mockReceipts = [
    { date: 'Jul 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, name: `Receipt-${tenant.unit}-Jul2026.pdf` },
    { date: 'Jun 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, name: `Receipt-${tenant.unit}-Jun2026.pdf` },
    { date: 'May 1, 2026', amount: `${localProfile.monthlyRent.toLocaleString()}`, name: `Receipt-${tenant.unit}-May2026.pdf` },
  ];

  const mockDocuments = [
    { icon: '📄', name: 'Lease Agreement', sub: `Signed ${localProfile.leaseStart}` },
    { icon: '🛡️', name: localProfile.insurance?.fileName || 'Insurance Certificate', sub: localProfile.insurance?.expiry ? `Expires ${localProfile.insurance.expiry}` : 'Not uploaded' },
    { icon: '💰', name: 'Deposit Receipt', sub: `RWF ${localProfile.deposit?.toLocaleString()}` },
  ];

  return (
    <div className="tenant-modal" onClick={onClose}>
      <div className="tm-panel" onClick={e => e.stopPropagation()}>
        <div className="tm-header">
          <div className="tm-header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="tm-avatar">{initials(tenant.name)}</div>
              <div>
                <div className="tm-tenant-name">{tenant.name}</div>
                <div className="tm-tenant-sub">
                  Unit {tenant.unit} · {tenant.cat} · <span className="tm-tenant-id">{tenant.plan}</span>
                </div>
              </div>
            </div>
            <div className="tm-quick-actions">
              <button className={`btn-sm ${suspended ? 'btn-warn' : 'btn-outline'}`} onClick={handleSuspend}>
                {suspended ? 'Resume' : 'Suspend'}
              </button>
              <button className="btn-sm btn-danger" onClick={onClose}>Remove</button>
              <div style={{ position: 'relative' }}>
                <button className="btn-sm btn-outline" onClick={() => setMoreMenuOpen(!moreMenuOpen)}>
                  ⋯
                </button>
                <div className={`tm-more-dropdown${moreMenuOpen ? ' show' : ''}`}>
                  <button onClick={() => { setMoreMenuOpen(false); }}>Send Notice</button>
                  <button onClick={() => { setMoreMenuOpen(false); }}>View Lease</button>
                  <button onClick={() => { setMoreMenuOpen(false); }}>Export Data</button>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-contact-row">
            <div className="tcr-item">✉ {localProfile.email}</div>
            <div className="tcr-item">☎ {tenant.phone}</div>
            <div className="tcr-item">📅 Lease start: {localProfile.leaseStart}</div>
          </div>
        </div>

        <div className="tm-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tm-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => { setActiveTab(tab); setMoreMenuOpen(false); }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tm-body">
          {/* Overview */}
          {activeTab === 'Overview' && (
            <div className="tm-panel active">
              <div className={`tm-balance-card ${balanceClass()}`}>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Balance Status</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{balanceLabel()}</div>
                {tenant.rent !== 'paid' && (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    Balance: RWF {localProfile.monthlyRent.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="tm-stat-row">
                <div className="tm-stat-box">
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Monthly Rent</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    RWF {localProfile.monthlyRent.toLocaleString()}
                  </div>
                </div>
                <div className="tm-stat-box">
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Days Since Lease Start</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {leaseDays}
                  </div>
                </div>
                <div className="tm-stat-box">
                  <div style={{ fontSize: 12, opacity: 0.7 }}>CAM Charges</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    RWF {localProfile.cam.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="tm-stat-row" style={{ marginTop: 12 }}>
                <div className="tm-stat-box" style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Insurance Compliance</div>
                  {insuranceBadge(localProfile.insurance?.status || 'missing')}
                  {localProfile.insurance?.expiry && (
                    <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>
                      Expires: {localProfile.insurance.expiry}
                    </div>
                  )}
                </div>
                <div className="tm-stat-box" style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Marketing Fund</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    RWF {localProfile.marketingFund.toLocaleString()}
                  </div>
                </div>
                <div className="tm-stat-box" style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Deposit Held</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    RWF {localProfile.deposit.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === 'Payments' && (
            <div className="tm-panel active">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-ink-100)', fontSize: 13, opacity: 0.7 }}>
                    <th style={{ padding: '10px 8px' }}>Date</th>
                    <th style={{ padding: '10px 8px' }}>Amount (RWF)</th>
                    <th style={{ padding: '10px 8px' }}>Method</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-ink-100)' }}>
                      <td style={{ padding: '12px 8px', fontSize: 14 }}>{p.date}</td>
                      <td style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600 }}>{p.amount}</td>
                      <td style={{ padding: '12px 8px', fontSize: 14 }}>{p.method}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={`badge ${p.status}`}>{p.status === 'paid' ? 'Paid' : 'Overdue'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Receipts */}
          {activeTab === 'Receipts' && (
            <div className="tm-panel active">
              {mockReceipts.map((r, i) => (
                <div key={i} className="tm-doc-row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', borderBottom: '1px solid var(--color-ink-100)' }}>
                  <div>
                    <div className="tm-doc-name">{r.name}</div>
                    <div className="tm-doc-sub">{r.date} · RWF {r.amount}</div>
                  </div>
                  <button className="btn-sm btn-outline" onClick={() => alert(`Downloading ${r.name}`)}>
                    ↓ Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          {activeTab === 'Documents' && (
            <div className="tm-panel active">
              {mockDocuments.map((d, i) => (
                <div key={i} className="tm-doc-row">
                  <div className="tm-doc-ic">{d.icon}</div>
                  <div>
                    <div className="tm-doc-name">{d.name}</div>
                    <div className="tm-doc-sub">{d.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'Messages' && (
            <div className="tm-panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', opacity: 0.5, padding: 32, fontSize: 14 }}>
                    No messages yet
                  </div>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.from === 'landlord' ? 'flex-end' : 'flex-start',
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: msg.from === 'landlord' ? 'var(--color-forest-500)' : 'var(--color-ink-100)',
                        color: msg.from === 'landlord' ? '#fff' : 'var(--color-ink-800)',
                      }}
                    >
                      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                        {msg.from === 'landlord' ? 'You' : tenant.name} · {relTime(msg.at)}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, padding: '12px 0', borderTop: '1px solid var(--color-ink-100)' }}>
                <textarea
                  className="tm-note-add"
                  placeholder="Type a reply..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  rows={2}
                  style={{ flex: 1, resize: 'none' }}
                />
                <button className="btn-primary" onClick={handleSendMessage} style={{ alignSelf: 'flex-end' }}>
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          {activeTab === 'Notes' && (
            <div className="tm-panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {notes.length === 0 && (
                  <div style={{ textAlign: 'center', opacity: 0.5, padding: 32, fontSize: 14 }}>
                    No notes yet
                  </div>
                )}
                {notes.map((note, i) => (
                  <div key={i} className="tm-note">
                    <div className="tn-meta">
                      <span>Landlord</span>
                      <span>{new Date(note.at).toLocaleDateString()}</span>
                    </div>
                    <div className="tn-text">{note.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 0', borderTop: '1px solid var(--color-ink-100)' }}>
                <textarea
                  className="tm-note-add"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows={3}
                  style={{ width: '100%', resize: 'none', marginBottom: 8 }}
                />
                <button className="btn-primary" onClick={handleSaveNote}>
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
