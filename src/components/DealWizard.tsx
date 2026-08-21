'use client';
import React, { useState, useRef } from 'react';

const STEP_LABELS = ['Essentials', 'Appearance', 'Promote', 'Review'];

export default function DealWizard({
  show,
  onClose,
  dealColorOptions = [],
  dealPromoOptions = [],
  ktPromoOptions = [],
  onComplete,
}) {
  const [step, setStep] = useState(0);
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedColor, setSelectedColor] = useState(dealColorOptions[0] || '#8B5CF6');
  const [selectedPromos, setSelectedPromos] = useState(new Set());
  const [ktExpanded, setKtExpanded] = useState(false);
  const [selectedKtPromos, setSelectedKtPromos] = useState(new Set());
  const fileRef = useRef(null);

  if (!show) return null;

  const togglePromo = (id) => {
    setSelectedPromos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleKtPromo = (id) => {
    setSelectedKtPromos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const totalPromoCost = [
    ...dealPromoOptions.filter((p) => selectedPromos.has(p.id)),
    ...ktPromoOptions.filter((p) => selectedKtPromos.has(p.id)),
  ].reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handlePublish = () => {
    onComplete({
      headline,
      description,
      originalPrice: Number(originalPrice) || 0,
      dealPrice: Number(dealPrice) || 0,
      badge,
      validUntil,
      photo,
      color: selectedColor,
      promos: dealPromoOptions.filter((p) => selectedPromos.has(p.id)),
      ktPromos: ktPromoOptions.filter((p) => selectedKtPromos.has(p.id)),
      totalPromoCost,
    });
    onClose();
  };

  const selectedPromoList = dealPromoOptions.filter((p) => selectedPromos.has(p.id));
  const selectedKtPromoList = ktPromoOptions.filter((p) => selectedKtPromos.has(p.id));

  return (
    <div className="deal-modal">
      <div className="ob-stepper">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={`ob-step-item${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
          >
            <div className="ob-step-circle">{i < step ? '\u2713' : i + 1}</div>
            <div className="ob-step-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="deal-modal-body">
        <div className="deal-form-col">
          <div className={`ob-step-panel${step === 0 ? ' active' : ''}`}>
            <h4>Deal essentials</h4>
            <div className="ob-sub">What&apos;s the offer?</div>

            <div className="form-row">
              <label>Headline</label>
              <input
                type="text"
                placeholder="e.g. 30% off all accessories"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                placeholder="Tell customers what this deal includes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-2col">
              <div className="form-row">
                <label>Original price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Deal price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={dealPrice}
                  onChange={(e) => setDealPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <label>Badge text</label>
              <input
                type="text"
                placeholder="e.g. -30%, BOGO, Free"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Valid until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div className={`ob-step-panel${step === 1 ? ' active' : ''}`}>
            <h4>Appearance</h4>
            <div className="ob-sub">Customize how your deal looks</div>

            <div className="form-row">
              <label>Photo</label>
              <div className="photo-picker">
                <div className={`photo-preview${photo ? ' has-photo' : ''}`}>
                  {photo ? <img src={photo} alt="Deal" /> : '\uD824\uDF7F'}
                </div>
                <div className="photo-actions">
                  <button
                    type="button"
                    className="btn photo-action-btn"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="btn photo-action-btn"
                    onClick={() => fileRef.current?.click()}
                  >
                    Take photo
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>Color</label>
              <div className="color-swatch-row">
                {dealColorOptions.map((color) => (
                  <div
                    key={color}
                    className={`color-swatch${selectedColor === color ? ' selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`ob-step-panel${step === 2 ? ' active' : ''}`}>
            <h4>Boost visibility</h4>
            <div className="ob-sub">Optional — increase reach with promotions</div>

            {dealPromoOptions.map((promo) => (
              <div
                key={promo.id}
                className={`promo-option${selectedPromos.has(promo.id) ? ' selected' : ''}`}
                onClick={() => togglePromo(promo.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedPromos.has(promo.id)}
                  readOnly
                />
                <div>
                  <div className="po-name">{promo.name}</div>
                  <div className="po-sub">{promo.sub}</div>
                </div>
                <div className="po-price">RWF {promo.price}</div>
              </div>
            ))}

            <div className={`kt-boost-box${!ktExpanded ? ' collapsed' : ''}`}>
              <div
                className="kt-boost-header"
                onClick={() => setKtExpanded((v) => !v)}
              >
                <div className="kbh-title">Promote with Kigali Today</div>
                <div className="kbh-chevron">{ktExpanded ? '\u25B2' : '\u25BC'}</div>
              </div>
              <div className="kt-boost-body">
                <div className="kt-optional-box">
                  <span className="kt-optional-tag">OPTIONAL</span>
                  Boost your deal reach across Kigali Today
                </div>
                <div className="kt-grid">
                  {ktPromoOptions.map((promo) => (
                    <div
                      key={promo.id}
                      className={`kt-option${selectedKtPromos.has(promo.id) ? ' selected' : ''}`}
                      onClick={() => toggleKtPromo(promo.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedKtPromos.has(promo.id)}
                        readOnly
                      />
                      <div>
                        <div className="kt-name-row">
                          <span className="kt-name">{promo.name}</span>
                          <span className="kt-price">RWF {promo.price}</span>
                        </div>
                        <div className="kt-sub">{promo.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`ob-step-panel${step === 3 ? ' active' : ''}`}>
            <h4>Review your deal</h4>
            <div className="ob-sub">Make sure everything looks right before publishing</div>

            <div style={{ background: '#FAF8F3', borderRadius: 14, overflow: 'hidden', border: '1px solid #E4E1D6' }}>
              <div style={{ height: 8, background: selectedColor }} />
              <div style={{ padding: '16px 18px' }}>
                {badge && (
                  <span className="badge" style={{ background: selectedColor, color: '#fff', marginBottom: 8, display: 'inline-block' }}>
                    {badge}
                  </span>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{headline || 'Your headline'}</div>
                <div style={{ fontSize: 12, color: '#4B5A50', marginBottom: 10, lineHeight: 1.5 }}>
                  {description || 'Your description will appear here.'}
                </div>
                {(originalPrice || dealPrice) && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                    {originalPrice && (
                      <span style={{ fontSize: 13, color: '#8A968D', textDecoration: 'line-through' }}>
                        RWF {originalPrice}
                      </span>
                    )}
                    {dealPrice && (
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#6D28D9', fontFamily: 'var(--font-mono)' }}>
                        RWF {dealPrice}
                      </span>
                    )}
                  </div>
                )}
                {validUntil && (
                  <div style={{ fontSize: 11, color: '#8A968D', marginBottom: 10 }}>
                    Valid until {new Date(validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}

                {(selectedPromoList.length > 0 || selectedKtPromoList.length > 0) && (
                  <div style={{ borderTop: '1px dashed #E4E1D6', paddingTop: 10, marginTop: 4 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A968D', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>
                      Promotions
                    </div>
                    {selectedPromoList.map((p) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', color: '#4B5A50' }}>
                        <span>{p.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>RWF {p.price}</span>
                      </div>
                    ))}
                    {selectedKtPromoList.map((p) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', color: '#4B5A50' }}>
                        <span>{p.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>RWF {p.price}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, borderTop: '1.5px solid #1C2B22', marginTop: 6, paddingTop: 8 }}>
                      <span>Total promotion cost</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>RWF {totalPromoCost}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`confirm-banner${step === 3 ? ' show' : ''}`}>
              Ready to publish? Your deal will be submitted for moderation.
            </div>
          </div>
        </div>

        <div className="deal-preview-col">
          <div className="deal-preview-label">
            <span>Live preview</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,.06)' }}>
            <div style={{ height: 10, background: selectedColor }} />
            <div style={{ padding: '14px 16px' }}>
              {badge && (
                <span
                  className="badge"
                  style={{
                    background: selectedColor,
                    color: '#fff',
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 99,
                    display: 'inline-block',
                    marginBottom: 8,
                  }}
                >
                  {badge}
                </span>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>
                {headline || 'Your headline'}
              </div>
              <div style={{ fontSize: 11, color: '#4B5A50', marginBottom: 10, lineHeight: 1.5 }}>
                {description || 'Description appears here.'}
              </div>
              {(originalPrice || dealPrice) && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  {originalPrice && (
                    <span style={{ fontSize: 12, color: '#8A968D', textDecoration: 'line-through' }}>
                      RWF {originalPrice}
                    </span>
                  )}
                  {dealPrice && (
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#6D28D9', fontFamily: 'var(--font-mono)' }}>
                      RWF {dealPrice}
                    </span>
                  )}
                </div>
              )}
              {validUntil && (
                <div style={{ fontSize: 10, color: '#8A968D', marginBottom: 6 }}>
                  Valid until {new Date(validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              {photo && (
                <div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid #E4E1D6' }}>
                  <img src={photo} alt="Deal" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ob-foot">
        {step > 0 && (
          <button type="button" className="btn ghost" onClick={back}>
            Back
          </button>
        )}
        {step < 3 && (
          <button type="button" className="btn primary" onClick={next}>
            Continue
          </button>
        )}
        {step === 3 && (
          <button type="button" className="btn primary" onClick={handlePublish}>
            Publish
          </button>
        )}
      </div>
    </div>
  );
}
