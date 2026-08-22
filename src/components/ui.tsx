'use client';
import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

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

export function RelTime({ ts }: { ts: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { setNow(Date.now()); }, []);
  return <span suppressHydrationWarning>{relTimeLabel(ts, now)}</span>;
}

function relTimeLabel(ms: number, now: number): string {
  const diff = Math.max(0, now - ms);
  if (diff < 60000) return 'just now';
  if (diff < 3600000) { const m = Math.round(diff / 60000); return `${m} min ago`; }
  if (diff < 86400000) { const h = Math.round(diff / 3600000); return h === 1 ? '1 hr ago' : `${h} hrs ago`; }
  const d = Math.round(diff / 86400000);
  return d === 1 ? '1 day ago' : `${d} days ago`;
}

export function TodayDate() {
  const [label, setLabel] = useState<string>('');
  useEffect(() => {
    setLabel(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);
  return <span suppressHydrationWarning>{label}</span>;
}
