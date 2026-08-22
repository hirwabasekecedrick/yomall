'use client';
import React, { useState } from 'react';
import { Check, ArrowLeft, X } from 'lucide-react';
import { initials, orderItemsSummary, orderTotal, relTime } from '@/lib/data';
import { STAGE_ICONS } from './icons';

export default function OrderModal({ show, onClose, order, stages, onAdvanceStage, onAssignRider, onConfirmDelivery, riderPool }) {
  const [pin, setPin] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);
  const [showRiderSelect, setShowRiderSelect] = useState(false);
  const [pinError, setPinError] = useState(false);

  if (!show || !order) return null;

  const stage = order.stage;
  const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + order.deliveryFee;
  const statusKey = stages[stage]?.key || 'placed';

  function handlePinChange(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setPinError(false);
  }

  function handleConfirmDelivery() {
    if (pin === order.deliveryPin) {
      onConfirmDelivery(order.id, pin);
      setPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleAssignRider() {
    if (selectedRider) {
      onAssignRider(order.id, selectedRider);
      setShowRiderSelect(false);
      setSelectedRider(null);
    }
  }

  function handleAdvance() {
    onAdvanceStage(order.id, stage + 1);
  }

  return (
    <div className="order-modal">
      <div className="pm-head">
        <div className="pm-head-left">
          <button aria-label="Back" className="pm-back" onClick={onClose}><ArrowLeft size={15} /></button>
          <span className="pm-title">Order {order.id}</span>
        </div>
        <button aria-label="Close" className="pm-close" onClick={onClose}><X size={16} /></button>
      </div>

      <div className="od-body">
        <div className="od-meta-grid">
          <div className="od-meta-item">
            <span>Order ID</span>
            <b>{order.id}</b>
          </div>
          <div className="od-meta-item">
            <span>Placed</span>
            <b>{relTime(order.placedAt)}</b>
          </div>
          <div className="od-meta-item">
            <span>Payment</span>
            <b>{order.payment}</b>
          </div>
          <div className="od-meta-item">
            <span>Status</span>
            <span className={`badge ${statusKey}`}>{stages[stage]?.label}</span>
          </div>
        </div>

        <div className="od-section-label">Items</div>
        {order.items.map((item, idx) => (
          <div key={idx} className="charge-line">
            <span>{item.name} &times; {item.qty}</span>
            <b>{(item.qty * item.price).toLocaleString()} RWF</b>
          </div>
        ))}

        <div className="charge-line">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString()} RWF</span>
        </div>
        <div className="charge-line">
          <span>Delivery fee</span>
          <span>{order.deliveryFee.toLocaleString()} RWF</span>
        </div>
        <div className="charge-line total">
          <span>Total</span>
          <b>{total.toLocaleString()} RWF</b>
        </div>

        <div className="od-section-label">Delivery tracking</div>
        <div className="od-timeline">
          {stages.map((s, i) => {
            let cls = '';
            if (i < stage) cls = 'done';
            else if (i === stage) cls = 'current';

            return (
              <div key={s.key} className={`od-timeline-item ${cls}`}>
                <div className="od-timeline-dot">
                  {i < stage ? <Check size={12} /> : STAGE_ICONS[s.icon] || s.icon}
                </div>
                {i < stages.length - 1 && <div className="od-timeline-line" />}
                <div className="od-timeline-content">
                  <div className="od-timeline-label">{s.label}</div>
                  <div className="od-timeline-time">
                    {i < stage && order.placedAt && relTime(order.placedAt)}
                    {i === stage && 'In progress'}
                    {i > stage && 'Upcoming'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {order.rider && (
          <>
            <div className="od-section-label">Assigned rider</div>
            <div className="rider-card-mini">
              <div className="rc-av">{initials(order.rider.name)}</div>
              <div>
                <div className="rc-name">{order.rider.name}</div>
                <div className="rc-sub">{order.rider.phone}</div>
              </div>
              <button className="pm-btn rc-call" style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => window.location.href = `tel:${order.rider.phone}`}
              >Call</button>
            </div>
          </>
        )}

        {stage < 3 && (
          <div style={{ marginTop: '16px' }}>
            {!showRiderSelect && !order.rider && (
              <button className="pm-btn" onClick={() => setShowRiderSelect(true)}>
                Assign rider
              </button>
            )}
            {stage < 3 && order.rider && (
              <button className="pm-btn" onClick={handleAdvance}>
                Next: {stages[stage + 1]?.label}
              </button>
            )}
            {showRiderSelect && (
              <>
                <div className="od-section-label">Select a rider</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '12px' }}>
                  {riderPool.map((r) => (
                    <div
                      key={r.name}
                      className="rider-card-mini"
                      style={{ cursor: 'pointer', border: selectedRider?.name === r.name ? '2px solid #8B5CF6' : '2px solid transparent', background: selectedRider?.name === r.name ? '#EDE9FE' : '#FAF8F3' }}
                      onClick={() => setSelectedRider(r)}
                    >
                      <div className="rc-av">{initials(r.name)}</div>
                      <div>
                        <div className="rc-name">{r.name}</div>
                        <div className="rc-sub">{r.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="pm-btn" disabled={!selectedRider} onClick={handleAssignRider}>
                  Confirm assignment
                </button>
                <button className="pm-btn ghost3" onClick={() => { setShowRiderSelect(false); setSelectedRider(null); }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {stage >= 3 && stage < 6 && (
          <div style={{ marginTop: '16px' }}>
            <div className="pin-confirm-box">
              <div className="pcb-title">Enter delivery PIN</div>
              <div className="pcb-sub">Ask the customer for their 4-digit delivery PIN to confirm handoff.</div>
              <div className="pin-input-row">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={handlePinChange}
                />
                <button className="pm-btn" style={{ width: 'auto', padding: '9px 18px' }} onClick={handleConfirmDelivery}>
                  Confirm
                </button>
              </div>
              {pinError && (
                <div style={{ color: '#D64545', fontSize: '11px', fontWeight: '600', marginTop: '7px' }}>
                  Incorrect PIN. Please try again.
                </div>
              )}
              <div className="pin-demo-hint">Demo PIN: {order.deliveryPin}</div>
            </div>
            <button className="pm-btn ghost3" style={{ marginTop: '10px' }} onClick={handleAdvance}>
              Skip / Next stage
            </button>
          </div>
        )}

        {stage === 6 && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#EDE9FE', borderRadius: '12px', color: '#6D28D9', fontWeight: '700', fontSize: '13px' }}>
              <span style={{ fontSize: '18px', display: 'flex' }}><Check size={18} /></span>
              Delivered &amp; confirmed
            </div>
          </div>
        )}

        {stage === 6 && order.confirmedAt && (
          <div className="receipt-box" style={{ marginTop: '16px' }}>
            <div className="rb-check"><Check size={14} /></div>
            <div className="rb-head">
              <div className="rb-title">Order delivered</div>
              <div className="rb-sub">{order.id} &middot; {relTime(order.confirmedAt)}</div>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="receipt-line">
                <span>{item.name} &times; {item.qty}</span>
                <b>{(item.qty * item.price).toLocaleString()} RWF</b>
              </div>
            ))}
            <div className="receipt-total-line">
              <span>Total</span>
              <b>{total.toLocaleString()} RWF</b>
            </div>
            <div className="receipt-meta">
              Payment: {order.payment}<br />
              Customer: {order.customerName}<br />
              Address: {order.address}
            </div>
            <div className="receipt-foot-btns">
              <button className="pm-btn" style={{ flex: 1 }} onClick={() => window.print()}>
                Print receipt
              </button>
              <button className="pm-btn ghost3" style={{ flex: 1 }} onClick={() => {
                const lines = [
                  `Order ${order.id}`,
                  `Customer: ${order.customerName}`,
                  `Address: ${order.address}`,
                  '',
                  ...order.items.map(i => `${i.name} x${i.qty} — ${(i.qty * i.price).toLocaleString()} RWF`),
                  '',
                  `Subtotal: ${subtotal.toLocaleString()} RWF`,
                  `Delivery: ${order.deliveryFee.toLocaleString()} RWF`,
                  `Total: ${total.toLocaleString()} RWF`,
                  '',
                  `Payment: ${order.payment}`,
                ];
                const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `${order.id}-receipt.txt`;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
