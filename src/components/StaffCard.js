'use client';
import React from 'react';

export default function StaffCard({ name, initials, role, statusText, statusColor, onMessage, onCall }) {
  return (
    <div className="bg-white border border-line rounded-[var(--radius-custom)] p-[15px] shadow-[var(--shadow-custom)]">
      <div className="flex gap-[10px] items-center">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-forest-100 text-forest-700 flex items-center justify-center font-bold font-sans text-[13px] shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-[13px] font-bold">{name}</div>
          <div className="text-[11px] text-ink-400 font-medium">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-[5px] text-[11px] font-semibold mt-[10px]">
        <div className={`w-[7px] h-[7px] rounded-full ${statusColor}`}></div>
        {statusText}
      </div>
      <div className="flex gap-[8px] mt-[12px]">
        <button 
          onClick={onMessage}
          className="flex-1 justify-center p-[7px] text-[11.5px] font-sans font-semibold rounded-[9px] border border-line bg-white cursor-pointer inline-flex items-center gap-[6px] text-ink-900 hover:brightness-95 transition-all"
        >
          Message
        </button>
        <button 
          onClick={onCall}
          className="flex-1 justify-center p-[7px] text-[11.5px] font-sans font-semibold rounded-[9px] border border-line bg-white cursor-pointer inline-flex items-center gap-[6px] text-ink-900 hover:brightness-95 transition-all"
        >
          Call
        </button>
      </div>
    </div>
  );
}
