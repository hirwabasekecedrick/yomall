'use client';
import React from 'react';

export default function KPICard({ label, value, delta, deltaType = 'up', deltaText }) {
  const deltaColors = {
    up: 'text-forest-500',
    down: 'text-red-500',
    flat: 'text-ink-400',
  };

  return (
    <div className="bg-white border border-line rounded-[var(--radius-custom)] p-[16px_17px] shadow-[var(--shadow-custom)]">
      <div className="text-[11px] text-ink-400 font-semibold uppercase tracking-[.4px] flex items-center gap-[6px]">
        {label}
      </div>
      <div className="font-sans text-[22px] font-extrabold mt-[8px] tracking-[-.3px]">
        {value}
      </div>
      {deltaText && (
        <div className={`text-[11.5px] mt-[5px] font-semibold ${deltaColors[deltaType]}`}>
          {delta} {deltaText}
        </div>
      )}
    </div>
  );
}
