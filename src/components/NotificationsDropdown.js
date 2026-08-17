'use client';
import React, { useState, useEffect, useRef } from 'react';

const NOTIFICATIONS = {
  landlord: [
    { icon: '🔴', title: 'Overdue rent — G-14 TechHub', time: '2h ago', view: 'rent' },
    { icon: '📝', title: 'Draft storefront — 1F-06 Amasezerano', time: '5h ago', view: 'storefront' },
    { icon: '🔧', title: 'Maintenance request pending', time: '1d ago', view: 'staff' },
    { icon: '📋', title: 'New vacancy inquiry for G-03', time: '1d ago', view: 'floormap' },
    { icon: '📄', title: 'Lease expiring soon — Café Umurava', time: '3d ago', view: 'renewals' },
  ],
  tenant: [
    { icon: '🔴', title: 'Rent payment overdue', time: '1h ago', view: 't-rent' },
    { icon: '📦', title: 'New order received', time: '3h ago', view: 't-orders' },
    { icon: '🔧', title: 'Maintenance request update', time: '6h ago', view: 't-overview' },
    { icon: '📄', title: 'Insurance expiring soon', time: '2d ago', view: 't-lease' },
  ],
  superadmin: [
    { icon: '🏦', title: 'New loan application pending', time: '30m ago', view: 'lending' },
    { icon: '⏳', title: 'Deal awaiting moderation', time: '1h ago', view: 'moderation' },
    { icon: '🏢', title: 'KYB pending — Musanze Heritage', time: '4h ago', view: 'landlords' },
    { icon: '🚨', title: 'Escalation raised', time: '6h ago', view: 'escalations' },
  ],
};

export default function NotificationsDropdown({ show, onClose, role, onNavigate }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    if (show) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  const notifications = NOTIFICATIONS[role] || [];

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 8px)',
        background: '#fff',
        border: '1px solid #E4E1D6',
        borderRadius: 10,
        boxShadow: '0 10px 26px rgba(20,8,50,.16)',
        width: 320,
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      <div className="notif-head">Notifications</div>
      {notifications.length === 0 ? (
        <div className="notif-empty">No notifications</div>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            className="notif-item"
            onClick={() => {
              onNavigate(n.view);
              onClose();
            }}
          >
            <div className="notif-ic">{n.icon}</div>
            <div>
              <div className="notif-title">{n.title}</div>
              <div className="notif-sub">{n.time}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
