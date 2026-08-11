'use client';
import React, { useState } from 'react';

export default function FloorMap({ floors = [], defaultFloor = 0 }) {
  const [activeFloor, setActiveFloor] = useState(defaultFloor);

  const unitStyles = {
    paid: 'bg-forest-500 text-white',
    due: 'bg-amber-500 text-forest-900',
    overdue: 'bg-red-500 text-white',
    vacant: 'bg-[#DDD9CC] text-ink-600',
  };

  const currentFloor = floors[activeFloor];

  return (
    <div>
      <div className="flex gap-[6px] mb-[12px]">
        {floors.map((floor, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFloor(idx)}
            className={`p-[6px_13px] rounded-[8px] text-[12px] font-semibold border cursor-pointer transition-colors ${
              activeFloor === idx
                ? 'bg-forest-900 text-white border-forest-900'
                : 'bg-white text-ink-600 border-line hover:bg-cream-50'
            }`}
          >
            {floor.name}
          </button>
        ))}
      </div>

      <div className="bg-white border border-line p-[16px] rounded-[var(--radius-custom)] shadow-[var(--shadow-custom)]">
        {/* Placeholder grid for units - adjust grid template based on actual map design */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[8px]">
          {currentFloor?.units?.map((unit, i) => (
            <div 
              key={i} 
              className={`rounded-[8px] flex flex-col justify-center items-center font-mono text-[10.5px] font-semibold cursor-pointer transition-transform hover:-translate-y-[2px] border-[1.5px] border-transparent h-[60px] ${unitStyles[unit.status]}`}
            >
              <div className="text-[11px]">{unit.name}</div>
              <div className="text-[8.5px] opacity-85 font-medium mt-[1px] capitalize">{unit.status}</div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-[16px] mt-[16px] flex-wrap border-t border-line pt-[12px]">
          <div className="flex items-center gap-[6px] text-[11.5px] text-ink-600 font-medium">
            <div className="w-[10px] h-[10px] rounded-[3px] bg-forest-500"></div> Paid
          </div>
          <div className="flex items-center gap-[6px] text-[11.5px] text-ink-600 font-medium">
            <div className="w-[10px] h-[10px] rounded-[3px] bg-amber-500"></div> Due
          </div>
          <div className="flex items-center gap-[6px] text-[11.5px] text-ink-600 font-medium">
            <div className="w-[10px] h-[10px] rounded-[3px] bg-red-500"></div> Overdue
          </div>
          <div className="flex items-center gap-[6px] text-[11.5px] text-ink-600 font-medium">
            <div className="w-[10px] h-[10px] rounded-[3px] bg-[#DDD9CC]"></div> Vacant
          </div>
        </div>
      </div>
    </div>
  );
}
