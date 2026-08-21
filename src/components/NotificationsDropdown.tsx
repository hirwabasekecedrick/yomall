'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CircleDot, PenLine, Wrench, ClipboardList, FileText, Package, Landmark, Hourglass, Building2, Siren } from 'lucide-react';

const NOTIFICATIONS: Record<string, { icon: React.ReactNode; title: string; time: string; view: string }[]> = {
  landlord: [
    { icon: <CircleDot size={15} />, title: 'Overdue rent — G-14 TechHub', time: '2h ago', view: 'rent' },
    { icon: <PenLine size={15} />, title: 'Draft storefront — 1F-06 Amasezerano', time: '5h ago', view: 'storefront' },
    { icon: <Wrench size={15} />, title: 'Maintenance request pending', time: '1d ago', view: 'staff' },
    { icon: <ClipboardList size={15} />, title: 'New vacancy inquiry for G-03', time: '1d ago', view: 'floormap' },
    { icon: <FileText size={15} />, title: 'Lease expiring soon — Café Umurava', time: '3d ago', view: 'renewals' },
  ],
  tenant: [
    { icon: <CircleDot size={15} />, title: 'Rent payment overdue', time: '1h ago', view: 'rent' },
    { icon: <Package size={15} />, title: 'New order received', time: '3h ago', view: 'orders' },
    { icon: <Wrench size={15} />, title: 'Maintenance request update', time: '6h ago', view: 'overview' },
    { icon: <FileText size={15} />, title: 'Insurance expiring soon', time: '2d ago', view: 'lease' },
  ],
  superadmin: [
    { icon: <Landmark size={15} />, title: 'New loan application pending', time: '30m ago', view: 'lending' },
    { icon: <Hourglass size={15} />, title: 'Deal awaiting moderation', time: '1h ago', view: 'moderation' },
    { icon: <Building2 size={15} />, title: 'KYB pending — Musanze Heritage', time: '4h ago', view: 'landlords' },
    { icon: <Siren size={15} />, title: 'Escalation raised', time: '6h ago', view: 'escalations' },
  ],
};

export default function NotificationsDropdown({ show, onClose, role, onNavigate }: { show: boolean; onClose: () => void; role: string; onNavigate?: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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
              onNavigate && onNavigate(n.view);
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
