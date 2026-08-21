'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Building2, ShoppingBag, ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';

type Role = 'landlord' | 'tenant' | 'superadmin';

export default function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>('landlord');
  const [pw, setPw] = useState('1234');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const emails: Record<Role, string> = { landlord: 'shema@edupoto.rw', tenant: 'nyabugogotech@tenant.yomall.africa', superadmin: 'admin@yomall.africa' };
  const labels: Record<Role, string> = { landlord: 'Work email', tenant: 'Shop email', superadmin: 'Admin email' };
  const roles: [Role, React.ReactNode, string, string][] = [
    ['landlord', <Building2 size={20} />, 'Landlord', 'Manage your building'],
    ['tenant', <ShoppingBag size={20} />, 'Tenant', 'Run your shop'],
    ['superadmin', <ShieldCheck size={20} />, 'Superadmin', 'Manage the platform'],
  ];

  function attempt() {
    if (pw !== '1234') { setError(true); return; }
    setError(false);
    onLogin(role);
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_460px] bg-cream-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white p-[40px] flex flex-col justify-between hidden md:flex">
        <Image
          src="/building.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, 60vw"
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-forest-900/85 via-forest-800/55 to-forest-700/35"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-[10px] mb-[60px]">
            <Image src="/logo.png" alt="yoMall logo" width={34} height={34} priority className="rounded-[9px]" />
            <div>
              <div className="font-sans font-bold text-[16.5px] tracking-[.2px]">yoMall</div>
              <div className="text-[10.5px] text-[#D8CBF2] tracking-[.4px] uppercase mt-[1px]">Mall &amp; Building OS</div>
            </div>
          </div>

          <div className="max-w-[480px]">
            <h2 className="text-[32px] font-extrabold mb-[16px] leading-[1.1] tracking-[-.5px]">One platform running every mall on the network.</h2>
            <p className="text-[15px] leading-[1.6] text-[#D8CBF2]">Storefront content, mall guide navigation, rent advances and daily repayments, deliveries and maintenance — for every building, from one login.</p>
          </div>

          <div className="flex gap-[16px] mt-[60px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/40 rounded-[14px] p-[16px_22px]">
              <div className="text-[24px] font-bold">12</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Malls live</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/40 rounded-[14px] p-[16px_22px]">
              <div className="text-[24px] font-bold">486</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Tenants onboarded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/40 rounded-[14px] p-[16px_22px]">
              <div className="text-[24px] font-bold font-mono">RWF 210M</div>
              <div className="text-[12px] text-[#D8CBF2] uppercase tracking-[1px] font-medium mt-[4px]">Rent advanced</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11.5px] text-[#D8CBF2]">© 2026 Edupoto Rwanda Ltd · yoMall is part of the yoGuide platform</div>
      </div>

      <div className="bg-white p-[40px_32px] flex flex-col justify-center">
        <div className="text-[12px] font-bold uppercase tracking-[.6px] text-ink-400">Sign in</div>
        <h1 className="text-[28px] font-extrabold m-0 tracking-[-.5px]">Welcome back</h1>
        <div className="text-[14px] text-ink-600 mb-[12px]">Choose how you're accessing yoMall</div>

        <div className="flex gap-[12px] mb-[24px]">
          {roles.map(([r, ic, lbl, sub]) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 rounded-[12px] p-[12px] cursor-pointer relative overflow-hidden transition-colors ${role === r ? 'border-[2px] border-forest-500 bg-forest-100' : 'border border-line bg-white hover:border-ink-400'}`}
            >
              <div className={`mb-[6px] ${role === r ? 'text-forest-700' : 'text-ink-400'}`}>{ic}</div>
              <div className={`text-[13px] font-bold ${role === r ? 'text-forest-900' : 'text-ink-900'}`}>{lbl}</div>
              <div className={`text-[10px] mt-[2px] ${role === r ? 'text-forest-700' : 'text-ink-400'}`}>{sub}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-500 p-[10px_13px] rounded-[9px] text-[12.5px] mb-[14px]">
            Incorrect password. Use <b>1234</b> for this demo.
          </div>
        )}

        <div className="mb-[20px]">
          <label className="block text-[11.5px] font-bold text-ink-600 mb-[6px]">{labels[role]}</label>
          <input
            type="email"
            value={emails[role]}
            readOnly
            className="w-full border border-line rounded-[9px] p-[11px_14px] text-[13.5px] font-sans text-ink-400 bg-cream-50 outline-none cursor-default"
          />
        </div>

        <div className="mb-[20px]">
          <label className="block text-[11.5px] font-bold text-ink-600 mb-[6px]">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              className="w-full border border-line rounded-[9px] p-[11px_14px] text-[13.5px] font-sans text-ink-900 bg-cream-50 outline-none focus:border-forest-500 transition-colors pr-[40px]"
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-[10px] top-[10px] bg-transparent border-none text-ink-400 hover:text-ink-600 cursor-pointer p-[2px]"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-[32px]">
          <label className="flex items-center gap-[6px] text-[12.5px] font-medium text-ink-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-[16px] h-[16px] rounded-[4px] accent-forest-500" />
            Keep me signed in
          </label>
          <a href="#" className="text-[12.5px] font-bold text-forest-500 hover:text-forest-700">Forgot password?</a>
        </div>

        <button
          onClick={attempt}
          className="w-full bg-forest-500 text-white font-sans font-bold text-[14px] p-[14px] rounded-[10px] border-none cursor-pointer hover:bg-forest-700 transition-colors shadow-[0_4px_12px_rgba(139,92,246,0.3)] flex items-center justify-center gap-[8px]"
        >
          Sign in to yoMall <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
