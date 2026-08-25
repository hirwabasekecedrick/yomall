'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import {
  registerMalls,
  REG_TENANT_CODE,
  REG_OTP,
  regStepTitles,
  registerCategories,
} from '@/lib/data';

type RegData = {
  mall: string;
  tenantCode: string;
  unit: string;
  phone: string;
  otpSent: boolean;
  otpVerified: boolean;
  shopName: string;
  category: string;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function freshRegData(): RegData {
  return {
    mall: '', tenantCode: '', unit: '', phone: '', otpSent: false, otpVerified: false,
    shopName: '', category: registerCategories[0], ownerName: '', email: '', password: '', confirmPassword: '',
  };
}

export default function RegisterWizard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegData>(freshRegData());
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function patch(p: Partial<RegData>) {
    setData(prev => ({ ...prev, ...p }));
  }
  function clearError(key: string) {
    setErrors(prev => { if (!prev[key]) return prev; const n = { ...prev }; delete n[key]; return n; });
  }

  function back() {
    if (step > 1) { setStep(step - 1); return; }
    onDone();
  }

  function next1() {
    if (!data.mall) { setErrors({ mall: 'Please choose a mall to continue.' }); return; }
    setErrors({});
    setStep(2);
  }

  function next2() {
    if (data.tenantCode.trim() !== REG_TENANT_CODE) {
      setErrors({ tenantCode: "That tenant code doesn't match our records. Check with your landlord and try again." });
      return;
    }
    setErrors({});
    setStep(3);
  }

  function sendOtp() {
    if (!data.phone.trim()) { setErrors({ phone: 'Please enter your phone number.' }); return; }
    setErrors({});
    patch({ otpSent: true });
  }

  function resendOtp() {
    setOtpDigits(['', '', '', '']);
  }

  function otpDigit(i: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return;
    setOtpDigits(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
    if (val && i < 3) {
      const el = document.getElementById(`reg-otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  }

  function verifyOtp() {
    const code = otpDigits.join('');
    if (code !== REG_OTP) { setErrors({ otp: 'Incorrect code. Please try again.' }); return; }
    setErrors({});
    patch({ otpVerified: true });
    setStep(4);
  }

  function next4() {
    const { shopName, ownerName, email, password, confirmPassword } = data;
    if (!shopName.trim() || !ownerName.trim() || !email.trim() || !password || password !== confirmPassword || password.length < 4) {
      setErrors({ step4: 'Please fill in all fields — passwords must match and be at least 4 characters.' });
      return;
    }
    setErrors({});
    setStep(5);
  }

  function submit() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1400);
  }

  const stepLabels = ['Mall', 'Tenant code', 'Phone', 'Shop & account', 'Review'];

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_520px] bg-cream-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 text-white p-[40px] flex-col justify-between hidden md:flex">
        <Image
          src="/building.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, 55vw"
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
          <div className="max-w-[440px]">
            <h2 className="text-[32px] font-extrabold mb-[16px] leading-[1.1] tracking-[-.5px]">Bring your shop onto yoMall.</h2>
            <p className="text-[15px] leading-[1.6] text-[#D8CBF2]">Verify your tenant code once, and unlock rent payments, your storefront, the MSME Biz Wizard and ChinaTown sourcing — all from one account.</p>
          </div>
          <div className="flex flex-col gap-[10px] mt-[48px]">
            {['Verify with the tenant code your landlord gave you', 'Confirm your phone number by OTP', 'Set up your shop profile and password'].map((t, i) => (
              <div key={i} className="flex items-center gap-[10px] bg-white/10 backdrop-blur-md border border-white/40 rounded-[12px] p-[12px_16px]">
                <div className="w-[22px] h-[22px] rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold flex-shrink-0">{i + 1}</div>
                <div className="text-[12.5px] text-[#EDE6FA] font-medium">{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-[11.5px] text-[#D8CBF2]">© 2026 Edupoto Rwanda Ltd · yoMall is part of the yoGuide platform</div>
      </div>

      <div className="bg-white flex flex-col min-h-screen">
        <div className="p-[24px_32px_0]">
          <button
            onClick={back}
            className="flex items-center gap-[6px] text-[12.5px] font-bold text-ink-400 hover:text-ink-600 bg-transparent border-none cursor-pointer p-0 mb-[18px]"
          >
            <ArrowLeft size={15} /> {step > 1 ? 'Back' : 'Back to sign in'}
          </button>

          {!done && (
            <>
              <div className="text-[12px] font-bold uppercase tracking-[.6px] text-ink-400">Step {step} of 5</div>
              <h1 className="text-[24px] font-extrabold m-0 mt-[2px] tracking-[-.4px]">{regStepTitles[step - 1]}</h1>
            </>
          )}
        </div>

        {!done && (
          <div className="ob-stepper">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              let cls = 'ob-step-item';
              if (n < step) cls += ' done';
              else if (n === step) cls += ' active';
              return (
                <div key={label} className={cls}>
                  <div className="ob-step-circle">{n < step ? <Check size={13} /> : n}</div>
                  <div className="ob-step-label">{label}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="ob-body" style={{ flex: 1 }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '48px 8px 10px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}>
                <Check size={30} />
              </div>
              <h4 style={{ fontSize: 19, marginBottom: 6 }}>Account created!</h4>
              <div className="ob-sub" style={{ marginBottom: 24 }}>
                Welcome, {data.shopName}. Your account is verified and ready — rent payments, storefront management and the MSME Biz Wizard are now unlocked.
              </div>
              <button className="btn primary" style={{ padding: '12px 28px', justifyContent: 'center', margin: '0 auto' }} onClick={onDone}>
                Go to my dashboard
              </button>
            </div>
          ) : submitting ? (
            <div style={{ textAlign: 'center', padding: '60px 8px 10px' }}>
              <div className="ct-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#8B5CF6' }} />
              <h4 style={{ fontSize: 16 }}>Creating your account…</h4>
              <div className="ob-sub">Verifying with {data.mall} and setting up your dashboard.</div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <div className="ob-sub" style={{ marginBottom: 14 }}>Select the mall where your shop is located. Only participating yoMall malls are listed.</div>
                  {registerMalls.map(m => (
                    <div
                      key={m.name}
                      className={`reg-mall-row${data.mall === m.name ? ' selected' : ''}`}
                      onClick={() => { patch({ mall: m.name }); clearError('mall'); }}
                    >
                      <div>
                        <div className="rm-name">{m.name}</div>
                        <div className="rm-loc">{m.loc}</div>
                      </div>
                      <div className="rm-check"></div>
                    </div>
                  ))}
                  {errors.mall && <div className="insufficient-note" style={{ marginTop: 8 }}>{errors.mall}</div>}
                  <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={next1}>Continue</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="ob-sub" style={{ marginBottom: 14 }}>
                    Your landlord or mall management gave you a tenant code when you signed your lease. Enter it here to verify you&apos;re a real tenant at {data.mall || 'this mall'}.
                  </div>
                  <div className="form-row">
                    <label>Tenant code</label>
                    <input value={data.tenantCode} onChange={e => { patch({ tenantCode: e.target.value }); clearError('tenantCode'); }} placeholder="e.g. TC-4821" />
                  </div>
                  <div className="form-row">
                    <label>Unit number</label>
                    <input value={data.unit} onChange={e => patch({ unit: e.target.value })} placeholder="e.g. G-14" />
                  </div>
                  {errors.tenantCode && <div className="insufficient-note" style={{ marginBottom: 10 }}>{errors.tenantCode}</div>}
                  <div className="reg-security-note">
                    <Lock size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>This code confirms you&apos;re a verified tenant before you can manage rent, your storefront or the MSME Wizard.</span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 11, color: '#8A968D', margin: '10px 0 4px' }}>
                    Demo tenant code: <b style={{ fontFamily: 'var(--font-mono)', color: '#6D28D9' }}>TC-4821</b>
                  </div>
                  <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={next2}>Verify &amp; continue</button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="ob-sub" style={{ marginBottom: 14 }}>We&apos;ll text a one-time code to confirm this number is yours.</div>
                  <div className="form-row">
                    <label>Phone number</label>
                    <input
                      value={data.phone}
                      disabled={data.otpSent}
                      onChange={e => { patch({ phone: e.target.value }); clearError('phone'); }}
                      placeholder="07XX XXX XXX"
                      style={data.otpSent ? { background: '#FAF8F3' } : undefined}
                    />
                  </div>
                  {!data.otpSent ? (
                    <>
                      {errors.phone && <div className="insufficient-note" style={{ marginBottom: 10 }}>{errors.phone}</div>}
                      <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={sendOtp}>Send OTP</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: '#8A968D', textAlign: 'center', margin: '10px 0 4px' }}>Enter the 4-digit code sent to {data.phone}</div>
                      <div className="reg-otp-row">
                        {otpDigits.map((d, i) => (
                          <input
                            key={i}
                            id={`reg-otp-${i}`}
                            maxLength={1}
                            inputMode="numeric"
                            value={d}
                            onChange={e => otpDigit(i, e.target.value)}
                          />
                        ))}
                      </div>
                      {errors.otp && <div className="insufficient-note" style={{ textAlign: 'center', marginBottom: 10 }}>{errors.otp}</div>}
                      <div style={{ textAlign: 'center', fontSize: 11, color: '#8A968D', marginBottom: 12 }}>
                        Demo OTP: <b style={{ fontFamily: 'var(--font-mono)', color: '#6D28D9' }}>1234</b>{' '}
                        · <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={resendOtp}>Resend code</span>
                      </div>
                      <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={verifyOtp}>Verify code</button>
                    </>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="ob-sub" style={{ marginBottom: 14 }}>Tell us about your shop — this sets up your storefront, rent account and MSME Wizard.</div>
                  <div className="form-row">
                    <label>Shop name</label>
                    <input value={data.shopName} onChange={e => patch({ shopName: e.target.value })} placeholder="e.g. Aline's Fashion Corner" />
                  </div>
                  <div className="form-row">
                    <label>Category</label>
                    <select value={data.category} onChange={e => patch({ category: e.target.value })}>
                      {registerCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Owner full name</label>
                    <input value={data.ownerName} onChange={e => patch({ ownerName: e.target.value })} placeholder="e.g. Aline Uwera" />
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input type="email" value={data.email} onChange={e => patch({ email: e.target.value })} placeholder="e.g. aline@example.com" />
                  </div>
                  <div className="form-row">
                    <label>Create password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPw ? 'text' : 'password'} value={data.password} onChange={e => patch({ password: e.target.value })} placeholder="Minimum 4 characters" style={{ paddingRight: 36 }} />
                      <button type="button" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', color: '#8A968D', cursor: 'pointer', padding: 2 }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-row">
                    <label>Confirm password</label>
                    <input type={showPw ? 'text' : 'password'} value={data.confirmPassword} onChange={e => patch({ confirmPassword: e.target.value })} placeholder="Re-enter password" />
                  </div>
                  {errors.step4 && <div className="insufficient-note" style={{ marginBottom: 10 }}>{errors.step4}</div>}
                  <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={next4}>Continue</button>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div className="ob-sub" style={{ marginBottom: 14 }}>Check everything looks right before we create your account.</div>
                  <div className="ob-review">
                    <div className="rv-section">
                      <div className="rv-title">Mall &amp; unit</div>
                      <div className="rv-grid">
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}><span style={{ color: '#8A968D' }}>Mall</span><span style={{ fontWeight: 600 }}>{data.mall}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Unit</span><span style={{ fontWeight: 600 }}>{data.unit || '—'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Tenant code</span><span style={{ fontWeight: 600 }}>{data.tenantCode}</span></div>
                      </div>
                    </div>
                    <div className="rv-section">
                      <div className="rv-title">Shop &amp; contact</div>
                      <div className="rv-grid">
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5 }}><span style={{ color: '#8A968D' }}>Shop name</span><span style={{ fontWeight: 600 }}>{data.shopName}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Category</span><span style={{ fontWeight: 600 }}>{data.category}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Owner</span><span style={{ fontWeight: 600 }}>{data.ownerName}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Phone</span><span style={{ fontWeight: 600 }}>{data.phone} ✓ verified</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderTop: '1px solid #F2EFE6' }}><span style={{ color: '#8A968D' }}>Email</span><span style={{ fontWeight: 600 }}>{data.email}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="reg-security-note">
                    <Lock size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Your account will control rent payments, your storefront and the MSME Wizard — keep your password private.</span>
                  </div>
                  <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={submit}>Create my account</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
