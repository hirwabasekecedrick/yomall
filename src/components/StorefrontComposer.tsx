'use client';
import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { uwCtaOptions, uwChannelCosts } from '@/lib/data';

export interface StorefrontPost {
  id: string;
  type: 'update' | 'deal';
  headline: string;
  badge: string;
  validUntil: string;
  channels: string[];
  cost: number;
  publishedAt: number;
}

interface Draft {
  type: 'update' | 'deal';
  headline: string;
  badge: string;
  validUntil: string;
  body: string;
  link: string;
  cta: string;
  photo: string | null;
  filter: string;
  channels: { instagram: boolean; facebook: boolean; tiktok: boolean };
  schedule: 'now' | 'later';
  schedTime: string;
}

function emptyDraft(): Draft {
  return { type: 'update', headline: '', badge: '', validUntil: '', body: '', link: '', cta: uwCtaOptions[0], photo: null, filter: 'none', channels: { instagram: false, facebook: false, tiktok: false }, schedule: 'now', schedTime: '' };
}

const STEP_LABELS = ['Content', 'Creative', 'Channels', 'Review'];

export default function StorefrontComposer({ show, onClose, creditsBalance, onSpendCredits, onOpenTopUp, onPublish }: {
  show: boolean;
  onClose: () => void;
  creditsBalance: number;
  onSpendCredits: (n: number) => void;
  onOpenTopUp: () => void;
  onPublish: (post: StorefrontPost) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (show) { setStep(0); setDraft(emptyDraft()); setError(''); setPublishing(false); setDone(false); }
  }, [show]);

  if (!show) return null;

  const update = (patch: Partial<Draft>) => setDraft(d => ({ ...d, ...patch }));
  const cost = (draft.channels.instagram ? uwChannelCosts.instagram : 0) + (draft.channels.facebook ? uwChannelCosts.facebook : 0) + (draft.channels.tiktok ? uwChannelCosts.tiktok : 0);
  const channelNames = ['yoInfo Fliiper', ...(draft.channels.instagram ? ['Instagram'] : []), ...(draft.channels.facebook ? ['Facebook'] : []), ...(draft.channels.tiktok ? ['TikTok'] : [])];

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ photo: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function next() {
    if (step === 0) {
      if (!draft.headline.trim()) { setError('Please give your post a headline.'); return; }
      setError(''); setStep(1);
    } else if (step < 3) { setError(''); setStep(step + 1); }
  }
  function back() { if (step > 0) setStep(step - 1); }

  function submit() {
    if (cost > creditsBalance) return;
    setPublishing(true);
    window.setTimeout(() => {
      onSpendCredits(cost);
      onPublish({ id: 'UW-' + Date.now().toString().slice(-6), type: draft.type, headline: draft.headline, badge: draft.badge, validUntil: draft.validUntil, channels: channelNames, cost, publishedAt: Date.now() });
      setPublishing(false);
      setDone(true);
    }, 1200);
  }

  return (
    <div className="modal-overlay show" onClick={publishing ? undefined : onClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        {publishing ? (
          <div className="pm-processing" style={{ padding: '60px 24px' }}>
            <div className="spinner"></div>
            <div className="proc-title">{draft.schedule === 'now' ? 'Publishing…' : 'Scheduling…'}</div>
            <div className="proc-sub">Sending to {channelNames.join(', ')}</div>
          </div>
        ) : done ? (
          <div className="pm-success" style={{ padding: '48px 24px' }}>
            <div className="success-check"><Check size={26} /></div>
            <div className="suc-title">{draft.schedule === 'now' ? 'Published' : 'Scheduled'}</div>
            <div className="suc-sub">Your {draft.type === 'deal' ? 'deal' : 'update'} {draft.schedule === 'now' ? 'is now live' : 'will publish at the scheduled time'} on {channelNames.join(', ')}.</div>
            <button className="btn primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="pm-head">
              <div className="pm-head-left"><div className="pm-title">New update</div></div>
              <button aria-label="Close" className="pm-close" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="ob-stepper">
              {STEP_LABELS.map((label, i) => {
                let cls = 'ob-step-item';
                if (i < step) cls += ' done'; else if (i === step) cls += ' active';
                return (
                  <div key={label} className={cls}>
                    <div className="ob-step-circle">{i < step ? <Check size={13} /> : i + 1}</div>
                    <div className="ob-step-label">{label}</div>
                  </div>
                );
              })}
            </div>
            <div className="ob-body">
              {step === 0 && (
                <div className="ob-step-panel active">
                  <h4>What are you posting?</h4>
                  <div className="type-toggle">
                    <div className={`type-opt${draft.type === 'update' ? ' selected' : ''}`} onClick={() => update({ type: 'update' })}><div className="to-ic">📣</div><div className="to-label">Social Update</div></div>
                    <div className={`type-opt${draft.type === 'deal' ? ' selected' : ''}`} onClick={() => update({ type: 'deal' })}><div className="to-ic">🏷️</div><div className="to-label">Deal</div></div>
                  </div>
                  <div className="form-row"><label>Headline</label><input value={draft.headline} onChange={e => update({ headline: e.target.value })} placeholder={draft.type === 'deal' ? 'e.g. 30% off Wireless Earbuds' : 'e.g. New stock arrived this week'} /></div>
                  {draft.type === 'deal' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div className="form-row" style={{ flex: 1 }}><label>Badge (optional)</label><input value={draft.badge} onChange={e => update({ badge: e.target.value })} placeholder="e.g. -20%" /></div>
                      <div className="form-row" style={{ flex: 1 }}><label>Valid until</label><input type="date" value={draft.validUntil} onChange={e => update({ validUntil: e.target.value })} /></div>
                    </div>
                  )}
                  <div className="form-row"><label>Details</label><textarea value={draft.body} onChange={e => update({ body: e.target.value })} placeholder="Tell your audience what's happening..." /></div>
                  <div className="form-row"><label>Link (optional)</label><input value={draft.link} onChange={e => update({ link: e.target.value })} placeholder="https://..." /></div>
                  <div className="form-row">
                    <label>Call-to-action</label>
                    <select value={draft.cta} onChange={e => update({ cta: e.target.value })}>
                      {uwCtaOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {error && <div style={{ color: '#D64545', fontSize: 11.5, fontWeight: 600, margin: '10px 2px' }}>{error}</div>}
                </div>
              )}

              {step === 1 && (
                <div className="ob-step-panel active">
                  <h4>Make it look good</h4>
                  <label htmlFor="uw-photo-input" className="photo-tile">
                    {draft.photo ? <img src={draft.photo} alt="" /> : <span><ImageIcon size={20} style={{ marginBottom: 6 }} /><br />Tap to add a photo</span>}
                  </label>
                  <input id="uw-photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                  <div className="m-section-label" style={{ fontSize: 11, fontWeight: 700, margin: '12px 0 8px', color: '#8A968D', textTransform: 'uppercase', letterSpacing: '.3px' }}>Filter</div>
                  <div className="chip-row">
                    {['none', 'vivid', 'bw', 'warm', 'cool'].map(f => (
                      <div key={f} className={`chip${draft.filter === f ? ' selected' : ''}`} style={{ flex: 1, fontSize: 10.5, padding: '8px 4px' }} onClick={() => update({ filter: f })}>{f === 'none' ? 'None' : f === 'bw' ? 'B&W' : f.charAt(0).toUpperCase() + f.slice(1)}</div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="ob-step-panel active">
                  <h4>Channels</h4>
                  <div className="card" style={{ background: 'var(--color-forest-100)', boxShadow: 'none', marginBottom: 12, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11.3, color: 'var(--color-forest-700)', fontWeight: 700 }}>🎉 Fliiper is free — no credits needed to post there.</div>
                  </div>
                  <div className="channel-row">
                    <div className="ch-left"><div className="ch-ic">📰</div><div><div className="ch-name">yoInfo Fliiper</div><div className="ch-sub">Always included · Free</div></div></div>
                    <div className="switch on locked"><div className="knob"></div></div>
                  </div>
                  {([['instagram','📷','Instagram',uwChannelCosts.instagram],['facebook','👍','Facebook',uwChannelCosts.facebook],['tiktok','🎵','TikTok',uwChannelCosts.tiktok]] as [keyof Draft['channels'], string, string, number][]).map(([key, icon, name, price]) => (
                    <div key={key} className="channel-row">
                      <div className="ch-left"><div className="ch-ic">{icon}</div><div><div className="ch-name">{name}</div><div className="ch-sub">{price} credits</div></div></div>
                      <button className={`switch${draft.channels[key] ? ' on' : ''}`} aria-label={`Toggle ${name}`} onClick={() => update({ channels: { ...draft.channels, [key]: !draft.channels[key] } })}><div className="knob"></div></button>
                    </div>
                  ))}
                  <div className="type-toggle" style={{ marginTop: 14 }}>
                    <div className={`type-opt${draft.schedule === 'now' ? ' selected' : ''}`} onClick={() => update({ schedule: 'now' })}><div className="to-ic">⚡</div><div className="to-label">Post now</div></div>
                    <div className={`type-opt${draft.schedule === 'later' ? ' selected' : ''}`} onClick={() => update({ schedule: 'later' })}><div className="to-ic">🕓</div><div className="to-label">Schedule later</div></div>
                  </div>
                  {draft.schedule === 'later' && (
                    <div className="form-row"><label>Publish date &amp; time</label><input type="datetime-local" value={draft.schedTime} onChange={e => update({ schedTime: e.target.value })} /></div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="ob-step-panel active">
                  <h4>Review</h4>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{draft.headline || 'Your headline appears here'}</div>
                  <div style={{ fontSize: 12, color: '#4B5A50', lineHeight: 1.5, marginBottom: 14 }}>{draft.body || 'Post details will show up here.'}</div>
                  <div className="review-block">
                    <div className="review-row"><span>Channels</span><b>{channelNames.join(', ')}</b></div>
                    <div className="review-row"><span>When</span><b>{draft.schedule === 'now' ? 'Immediately' : (draft.schedTime || 'Scheduled')}</b></div>
                    <div className="review-row"><span>Call-to-action</span><b>{draft.cta}</b></div>
                  </div>
                  <div className="cost-banner"><span>Estimated cost</span><b>{cost} credits</b></div>
                  <div style={{ textAlign: 'right', fontSize: 10.5, color: '#8A968D', fontWeight: 600, marginTop: 6 }}>Your balance: {creditsBalance} credits</div>
                  {cost > creditsBalance && (
                    <>
                      <div className="insufficient-note" style={{ marginTop: 10 }}>Not enough credits for these channels.</div>
                      <button className="btn amber" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={onOpenTopUp}>+ Top up credits</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="ob-foot">
              {step > 0 && <button className="btn" onClick={back}>Back</button>}
              {step < 3 && <button className="btn primary" onClick={next}>Continue</button>}
              {step === 3 && <button className="btn primary" disabled={cost > creditsBalance} style={cost > creditsBalance ? { opacity: .5 } : undefined} onClick={submit}>{draft.schedule === 'now' ? 'Publish' : 'Schedule'} →</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
