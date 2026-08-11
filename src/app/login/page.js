import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_460px] bg-cream-50">
      <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white p-[40px] flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-[10px] mb-[60px]">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-amber-500 flex items-center justify-center font-sans font-extrabold text-forest-900 text-[16px]">
              yM
            </div>
            <div>
              <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
              <div className="text-[10.5px] text-[#D8CBF2] tracking-[.4px] uppercase mt-[1px]">Mall &amp; Building OS</div>
            </div>
          </div>
          
          <div className="max-w-[480px]">
            <h2 className="text-[32px] font-extrabold mb-[16px] leading-[1.1] tracking-[-.5px]">One platform running every mall on the network.</h2>
            <p className="text-[15px] leading-[1.6] text-[#D8CBF2]">Storefront content, mall guide navigation, rent advances and daily repayments, deliveries and maintenance — for every building, from one login.</p>
          </div>
          
          <div className="flex gap-[40px] mt-[60px]">
            <div>
              <div className="text-[24px] font-bold">12</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Malls live</div>
            </div>
            <div>
              <div className="text-[24px] font-bold">486</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Tenants onboarded</div>
            </div>
            <div>
              <div className="text-[24px] font-bold font-mono">RWF 210M</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Rent advanced</div>
            </div>
          </div>
        </div>
        
        <div className="text-[11.5px] text-[#D8CBF2]">© 2026 Edupoto Rwanda Ltd · yoMall is part of the yoGuide platform</div>
      </div>
      
      <div className="bg-white p-[40px_32px] flex flex-col justify-center">
        <div className="text-[12px] font-bold uppercase tracking-[.6px] text-ink-400 mb-[8px]">Sign in</div>
        <h1 className="text-[28px] font-extrabold m-0 mb-[6px] tracking-[-.5px]">Welcome back</h1>
        <div className="text-[14px] text-ink-600 mb-[32px]">Choose how you're accessing yoMall</div>
        
        <div className="flex gap-[12px] mb-[32px]">
          <div className="flex-1 border-[2px] border-forest-500 bg-forest-100 rounded-[12px] p-[12px] cursor-pointer relative overflow-hidden">
            <div className="text-[20px] mb-[6px]">🏢</div>
            <div className="text-[13px] font-bold text-forest-900">Landlord</div>
            <div className="text-[10px] text-forest-700 mt-[2px]">Manage your building</div>
          </div>
          <div className="flex-1 border border-line bg-white rounded-[12px] p-[12px] cursor-pointer hover:border-ink-400 transition-colors">
            <div className="text-[20px] mb-[6px]">🛍️</div>
            <div className="text-[13px] font-bold text-ink-900">Tenant</div>
            <div className="text-[10px] text-ink-400 mt-[2px]">Run your shop</div>
          </div>
          <div className="flex-1 border border-line bg-white rounded-[12px] p-[12px] cursor-pointer hover:border-ink-400 transition-colors">
            <div className="text-[20px] mb-[6px]">🛡️</div>
            <div className="text-[13px] font-bold text-ink-900">Superadmin</div>
            <div className="text-[10px] text-ink-400 mt-[2px]">Manage the platform</div>
          </div>
        </div>
        
        <div className="mb-[20px]">
          <label className="block text-[11.5px] font-bold text-ink-600 mb-[6px]">Work email</label>
          <input 
            type="email" 
            defaultValue="shema@edupoto.rw" 
            className="w-full border border-line rounded-[9px] p-[11px_14px] text-[13.5px] font-sans text-ink-900 bg-cream-50 outline-none focus:border-forest-500 transition-colors"
          />
        </div>
        
        <div className="mb-[20px]">
          <label className="block text-[11.5px] font-bold text-ink-600 mb-[6px]">Password</label>
          <div className="relative">
            <input 
              type="password" 
              defaultValue="1234" 
              className="w-full border border-line rounded-[9px] p-[11px_14px] text-[13.5px] font-sans text-ink-900 bg-cream-50 outline-none focus:border-forest-500 transition-colors pr-[40px]"
            />
            <button className="absolute right-[12px] top-[12px] bg-transparent border-none text-[14px] text-ink-400 cursor-pointer">👁</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-[32px]">
          <label className="flex items-center gap-[6px] text-[12.5px] font-medium text-ink-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-[16px] h-[16px] rounded-[4px] accent-forest-500" />
            Keep me signed in
          </label>
          <a href="#" className="text-[12.5px] font-bold text-forest-500 hover:text-forest-700">Forgot password?</a>
        </div>
        
        <Link href="/">
          <button className="w-full bg-forest-500 text-white font-sans font-bold text-[14px] p-[14px] rounded-[10px] border-none cursor-pointer hover:bg-forest-700 transition-colors shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
            Sign in to yoMall →
          </button>
        </Link>
        
        <div className="mt-[32px] p-[14px] bg-cream-100 rounded-[10px] text-[11.5px] text-ink-600 leading-[1.6]">
          Demo credentials — any email works. Password is always <b>1234</b>.<br/>
          Switch the toggle above to try either <b>Landlord</b> (single mall) or <b>Superadmin</b> (whole platform) view.
        </div>
      </div>
    </div>
  );
}
