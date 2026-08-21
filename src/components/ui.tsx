'use client';
import React from 'react';
import { Construction, TrendingUp } from 'lucide-react';

export function Badge({ type, label }: { type: string; label: string }) {
  return <span className={`badge ${type}`}>{label}</span>;
}

export function KPI({ label, value, delta, deltaClass }: { label: string; value: string; delta?: string; deltaClass?: string }) {
  return (
    <div className="kpi-card">
      <div className="k-label">{label}</div>
      <div className="k-value">{value}</div>
      {delta && (
        <div className={`k-delta ${deltaClass}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {deltaClass === 'up' && <TrendingUp size={11} />} {delta}
        </div>
      )}
    </div>
  );
}

export function PlaceholderView({ icon, title, sub }: { icon?: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="placeholder-view">
      <div className="pv-icon" style={{ display: 'flex', justifyContent: 'center' }}>{icon || <Construction size={40} />}</div>
      <div className="pv-title">{title}</div>
      <div className="pv-sub">{sub}</div>
    </div>
  );
}
