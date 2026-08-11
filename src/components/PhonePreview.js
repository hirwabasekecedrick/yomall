'use client';
import React from 'react';

export default function PhonePreview({ shopName, shopCategory, shopLocation, isOpen, products = [] }) {
  return (
    <div className="sticky top-[82px] flex flex-col items-center">
      <div className="w-[250px] h-[508px] bg-forest-900 rounded-[34px] p-[11px] shadow-[0_20px_40px_rgba(20,40,25,.25)]">
        <div className="bg-white rounded-[24px] h-full overflow-hidden relative flex flex-col">
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[60px] h-[16px] bg-forest-900 rounded-[10px] z-[2]"></div>
          
          <div className="h-[108px] bg-gradient-to-br from-forest-500 to-forest-700 relative">
            <div className="absolute bottom-[8px] left-[12px] bg-black/25 text-white text-[9px] px-[8px] py-[3px] rounded-full font-semibold">
              {shopCategory}
            </div>
          </div>
          
          <div className="mt-[-16px] mx-[12px] mb-0 bg-white rounded-[14px] shadow-[0_4px_14px_rgba(0,0,0,.08)] p-[11px_12px] relative z-[1]">
            <div className="font-sans font-extrabold text-[13.5px]">{shopName}</div>
            <div className="text-[9.5px] text-ink-400 mt-[2px] font-medium">{shopLocation}</div>
            {isOpen && (
              <div className="inline-flex items-center gap-[4px] bg-forest-100 text-forest-700 text-[8.5px] font-bold py-[2px] px-[7px] rounded-full mt-[6px]">
                <div className="w-[6px] h-[6px] rounded-full bg-forest-700"></div> Open now
              </div>
            )}
          </div>
          
          <div className="p-[10px_12px] overflow-y-auto flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[.4px] text-ink-400 mb-[7px]">Featured deals</div>
            <div className="grid grid-cols-2 gap-[8px] mb-[12px]">
              {products.map((p, i) => (
                <div key={i} className="bg-cream-50 rounded-[10px] p-[7px]">
                  <div className="w-full h-[44px] bg-cream-100 rounded-[7px] mb-[6px] flex items-center justify-center text-[16px]">
                    {p.icon}
                  </div>
                  <div className="text-[9.5px] font-bold">{p.name}</div>
                  <div className="text-[9px] text-forest-500 font-bold font-mono">{p.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-around py-[9px] border-t border-cream-100">
            <div className="w-[16px] h-[16px] bg-cream-100 rounded-[5px]"></div>
            <div className="w-[16px] h-[16px] bg-cream-100 rounded-[5px]"></div>
            <div className="w-[16px] h-[16px] bg-cream-100 rounded-[5px]"></div>
            <div className="w-[16px] h-[16px] bg-cream-100 rounded-[5px]"></div>
          </div>
        </div>
      </div>
      <div className="text-[11px] text-ink-400 mt-[12px] text-center font-medium">Live preview on yoApp</div>
    </div>
  );
}
