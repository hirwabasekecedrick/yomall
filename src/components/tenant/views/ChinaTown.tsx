'use client';
import React, { useRef, useState } from 'react';
import { Lock, Camera, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  CT_ACCESS_CODE, ctCatalog, ctCategories, initialCtContainer, ctSourceCatalog,
  CT_CLIENT_CODE, CT_LENDERS, CT_SHIPPING_RATE_PER_M3, relTime,
} from '@/lib/data';

interface CartItem { id: string; name: string; icon: string; qty: number; rwf: number; vol: number }
interface CtOrder { id: string; items: CartItem[]; total: number; trackingCode: string; eta: string; stage: number; stageDates: string[]; taxPaid: boolean }
interface CtInvoice { id: string; total: number; at: number }
interface SourceResult { icon: string; name: string; source: string; price: number; overBudget: boolean }
interface SourceRequest { desc: string; cat: string; qty: string; budget: string; results: SourceResult[]; status: 'matched' | 'escalated'; at: number }

type Screen = 'gate' | 'home' | 'product' | 'container' | 'tracking' | 'pickup' | 'source' | 'source-results' | 'account';

const TRACKING_STAGES = ['Order confirmed', 'Loaded in China', 'In transit (sea freight)', 'Arrived Kigali warehouse', 'Ready for pickup'];

export default function ChinaTownView() {
  const toast = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const [screen, setScreen] = useState<Screen>('gate');
  const [gateCode, setGateCode] = useState('');
  const [gateError, setGateError] = useState(false);
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);

  const [activeCat, setActiveCat] = useState('All');
  const [detailProduct, setDetailProduct] = useState<typeof ctCatalog[number] | null>(null);
  const [detailQty, setDetailQty] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [container, setContainer] = useState(initialCtContainer);
  const [containerDone, setContainerDone] = useState(false);
  const [payingShipping, setPayingShipping] = useState(false);

  const [orders, setOrders] = useState<CtOrder[]>([]);
  const [invoices, setInvoices] = useState<CtInvoice[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<CtOrder | null>(null);
  const [pickupOrder, setPickupOrder] = useState<CtOrder | null>(null);
  const [showingLoan, setShowingLoan] = useState(false);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [taxMomo, setTaxMomo] = useState('');
  const [payingTax, setPayingTax] = useState(false);

  const [sourceForm, setSourceForm] = useState({ photo: null as string | null, desc: '', cat: '', qty: '', budget: '' });
  const [sourceRequests, setSourceRequests] = useState<SourceRequest[]>([]);
  const [currentSourceReq, setCurrentSourceReq] = useState<SourceRequest | null>(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState(false);

  const [accountTab, setAccountTab] = useState<'orders' | 'invoices' | 'requests'>('orders');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const productCost = cart.reduce((s, c) => s + c.qty * c.rwf, 0);
  const myVolume = cart.reduce((s, c) => s + c.qty * c.vol, 0);
  const shippingCost = Math.round(myVolume * CT_SHIPPING_RATE_PER_M3);

  function enter() {
    if (unlocked) { setScreen('home'); return; }
    setScreen('gate');
  }
  function gateSubmit() {
    if (gateCode.trim() === CT_ACCESS_CODE) {
      setGateError(false); setUnlocked(true); setScreen('home');
    } else setGateError(true);
  }
  function openProduct(id: string) {
    const p = ctCatalog.find(c => c.id === id) || null;
    setDetailProduct(p);
    setDetailQty(p ? p.moq : 0);
    setScreen('product');
  }
  function addToContainer() {
    if (!detailProduct || detailQty <= 0) { toast('Choose a quantity first'); return; }
    setCart(prev => {
      const existing = prev.find(c => c.id === detailProduct.id);
      if (existing) return prev.map(c => c.id === detailProduct.id ? { ...c, qty: c.qty + detailQty } : c);
      return [...prev, { id: detailProduct.id, name: detailProduct.name, icon: detailProduct.icon, qty: detailQty, rwf: detailProduct.rwf, vol: detailProduct.vol }];
    });
    toast(`Added ${detailQty} cartons of ${detailProduct.name}`);
    setContainerDone(false);
    setScreen('container');
  }
  function paySharing() {
    setPayingShipping(true);
    window.setTimeout(() => {
      const total = productCost + shippingCost;
      const order: CtOrder = {
        id: 'CTO-' + Date.now().toString().slice(-6),
        items: cart.slice(),
        total,
        trackingCode: 'CT' + Math.floor(100000 + Math.random() * 900000),
        eta: '18–24 days',
        stage: 1,
        stageDates: ['Today', 'Today'],
        taxPaid: false,
      };
      setOrders(prev => [order, ...prev]);
      setInvoices(prev => [{ id: 'CTI-' + Date.now().toString().slice(-6), total, at: Date.now() }, ...prev]);
      setContainer(prev => {
        const filledVol = Math.min(prev.capVol, +(prev.filledVol + myVolume).toFixed(1));
        return { ...prev, filledVol, fillPct: Math.min(100, Math.round(filledVol / prev.capVol * 100)) };
      });
      setCart([]);
      setContainerDone(true);
      setPayingShipping(false);
    }, 1400);
  }
  function openTrackingFor(order: CtOrder) { setTrackingOrder(order); setContainerDone(false); setScreen('tracking'); }
  function openPickupFor(order: CtOrder) { setPickupOrder(order); setShowingLoan(false); setSelectedLender(null); setScreen('pickup'); }
  function confirmPickup() { toast('Pickup confirmed — see you at the Kigali warehouse'); setScreen('home'); }
  function payTaxMomo() {
    if (!taxMomo.trim() || !pickupOrder) { toast('Enter your MoMo number first'); return; }
    setPayingTax(true);
    window.setTimeout(() => {
      setPickupOrder(prev => prev ? { ...prev, taxPaid: true, stage: 4, stageDates: [...prev.stageDates.slice(0,4), 'Today'] } : prev);
      setOrders(prev => prev.map(o => pickupOrder && o.id === pickupOrder.id ? { ...o, taxPaid: true, stage: 4 } : o));
      setPayingTax(false);
      toast('Import tax settled');
    }, 1300);
  }
  function acceptLoan() {
    if (!pickupOrder || !selectedLender) return;
    setPayingTax(true);
    window.setTimeout(() => {
      setPickupOrder(prev => prev ? { ...prev, taxPaid: true, stage: 4, stageDates: [...prev.stageDates.slice(0,4), 'Today'] } : prev);
      setOrders(prev => prev.map(o => pickupOrder && o.id === pickupOrder.id ? { ...o, taxPaid: true, stage: 4 } : o));
      setShowingLoan(false);
      setPayingTax(false);
      toast(`Loan accepted via ${selectedLender} — tax cleared`);
    }, 1400);
  }
  function sourcePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSourceForm(f => ({ ...f, photo: reader.result as string }));
    reader.readAsDataURL(file);
  }
  function sourceSubmit() {
    if (!sourceForm.photo && !sourceForm.desc.trim()) { setSourceError(true); return; }
    setSourceError(false);
    const budget = parseFloat((sourceForm.budget || '').replace(/,/g, '')) || null;
    const results: SourceResult[] = ctSourceCatalog.map(r => ({ ...r, overBudget: budget ? r.price > budget : false }));
    const req: SourceRequest = { desc: sourceForm.desc, cat: sourceForm.cat, qty: sourceForm.qty, budget: sourceForm.budget, results, status: 'matched', at: Date.now() };
    setCurrentSourceReq(req);
    setSourceRequests(prev => [req, ...prev]);
    setSourceLoading(true);
    setScreen('source-results');
    window.setTimeout(() => setSourceLoading(false), 1800);
  }
  function widenSearch() {
    toast('Widening search — checking more Alibaba factories…');
    setSourceLoading(true);
    window.setTimeout(() => { setSourceLoading(false); toast('Found 2 more matches'); }, 1500);
  }
  function escalateToTeam() {
    if (currentSourceReq) {
      setSourceRequests(prev => prev.map(r => r === currentSourceReq ? { ...r, status: 'escalated' } : r));
    }
    toast("Sent to our sourcing team — we'll follow up on WhatsApp");
    setScreen('home');
  }

  const filteredCatalog = ctCatalog.filter(p => activeCat === 'All' || p.cat === activeCat);

  return (
    <div className="view-panel ct-scope">
      <div className="section-title"><div><h2>ChinaTown</h2><div className="hint">Phygital showroom &amp; shared-container sourcing for verified agents</div></div></div>

      {!unlocked && screen === 'gate' && (
        <div className="ct-gatewrap" style={{maxWidth:420}}>
          <div className="ct-mark">CT</div>
          <div className="ct-wordmark">ChinaTown</div>
          <div className="ct-gatetag">Restricted · Wholesale Agents Only</div>
          <div className="ct-gatelock"><Lock size={26} /></div>
          <h3>Agent access required</h3>
          <p>ChinaTown is a closed wholesale platform for verified ChinaTown agents and retailers only. Enter your agent access code to continue.</p>
          <input className="ct-gateinput" type="password" maxLength={20} placeholder="Agent access code" value={gateCode} onChange={e => { setGateCode(e.target.value); setGateError(false); }} />
          {gateError && <div className="ct-gateerr show">Invalid access code. Contact your ChinaTown account manager.</div>}
          <button className="ct-btn primary" onClick={gateSubmit}>Enter ChinaTown</button>
          <div className="ct-gatehint">Demo access code: <b>1234</b></div>
          <button className="ct-gateapply" onClick={() => setRequestAccessOpen(true)}>Don&apos;t have a code? Request agent access</button>
        </div>
      )}

      {unlocked && (
        <>
          {screen !== 'home' && (
            <button className="btn ghost" style={{marginBottom:14}} onClick={() => setScreen('home')}>← Back to ChinaTown home</button>
          )}

          {screen === 'home' && (
            <div style={{maxWidth:760}}>
              <div className="ct-hero">
                <div className="ct-brandrow"><div className="ct-mark">CT</div><div><div className="ct-wordmark">ChinaTown</div><div className="ct-byline" style={{color:'#F4CFD4'}}>Phygital Showroom · Shared LCL</div></div></div>
                <h2>Foreign brands exhibit. Local retailers buy. We handle the rest.</h2>
                <p>A physical showroom in your city, a mobile ordering app, and a shared container-shipping engine. China factory prices, no travel, no minimum container.</p>
                <div className="ct-pillrow">
                  <div className="ct-pill">🏬 Physical<br/>Showroom</div>
                  <div className="ct-pill">📱 Buyer<br/>App</div>
                  <div className="ct-pill">🚢 Shared<br/>Container</div>
                </div>
              </div>
              <div className="ct-statstrip">
                <div className="ct-statbox"><b>12</b><span>Brands live</span></div>
                <div className="ct-statbox"><b>{container.buyers}</b><span>Buyers pooling</span></div>
                <div className="ct-statbox"><b>{container.capVol}m³</b><span>Container size</span></div>
              </div>
              <button className="ct-progresscard" onClick={() => setScreen('container')}>
                <div className="toprow"><b>Current container · 20ft LCL to Kigali</b><span>{container.fillPct}%</span></div>
                <div className="ct-barwrap"><div className="ct-barfill" style={{width:`${container.fillPct}%`}}></div></div>
                <div className="sub"><span>{container.filledVol} / {container.capVol} m³ filled</span><span>Tap to view my container →</span></div>
              </button>
              <button className="ct-sourcecard" onClick={() => { setSourceForm({ photo: null, desc: '', cat: '', qty: '', budget: '' }); setSourceError(false); setScreen('source'); }}>
                <div className="ic">✨</div>
                <div style={{flex:1}}><div className="t1">Can&apos;t find it? Request sourcing</div><div className="t2">Send a photo or description — AI searches Alibaba + our supplier list</div></div>
                <ChevronRight size={16} />
              </button>
              <button className="ct-sourcecard" onClick={() => { setAccountTab('orders'); setScreen('account'); }}>
                <div className="ic">👤</div>
                <div style={{flex:1}}><div className="t1">My CT Account</div><div className="t2">Orders, invoices, and payment status in one place</div></div>
                <ChevronRight size={16} />
              </button>
              <div className="ct-catchips">
                {ctCategories.map(c => <div key={c} className={`ct-chip${activeCat===c?' on':''}`} onClick={() => setActiveCat(c)}>{c}</div>)}
              </div>
              <div className="m-section-label" style={{fontSize:11,fontWeight:700,color:'#8A968D',textTransform:'uppercase',letterSpacing:'.3px',marginBottom:6}}>Showroom catalogue</div>
              <div className="ct-catalogloc">Available in our showrooms — Kigali, Rusizi &amp; Rubavu</div>
              <div className="ct-grid">
                {filteredCatalog.map(p => (
                  <div key={p.id} className="ct-card" onClick={() => openProduct(p.id)}>
                    <div className="th">{p.icon}</div>
                    <div className="bd"><div className="n">{p.name}</div><div className="p">RWF {p.rwf.toLocaleString()}</div><div className="moq">MOQ {p.moq} cartons</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === 'product' && detailProduct && (
            <div style={{maxWidth:420}}>
              <div className="ct-card" style={{cursor:'default',marginBottom:16}}><div className="th" style={{aspectRatio:'16/9',fontSize:52}}>{detailProduct.icon}</div></div>
              <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{detailProduct.name}</div>
              <div style={{fontSize:11,color:'#8A968D',marginBottom:12}}>📍 {detailProduct.loc}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
                <span style={{fontSize:12,color:'#8A968D',textDecoration:'line-through'}}>¥{detailProduct.cny}</span>
                <span style={{fontSize:22,fontWeight:800,color:'var(--ct-red-dark)'}}>RWF {detailProduct.rwf.toLocaleString()}</span>
              </div>
              <div style={{fontSize:10.5,color:'#8A968D',marginBottom:10}}>per carton, landed price</div>
              <div className="ct-infochips">
                <div className="ct-infochip">🧮<div className="t">{detailProduct.pcs} pcs/carton</div></div>
                <div className="ct-infochip">📦<div className="t">{detailProduct.vol} m³/carton</div></div>
                <div className="ct-infochip">🧱<div className="t">MOQ {detailProduct.moq} cartons</div></div>
              </div>
              <p style={{fontSize:12,color:'#4B5A50',lineHeight:1.6}}>Verified factory listing, physically available to inspect in our showroom before you order. What you see is what you get.</p>
              <div style={{textAlign:'center',fontSize:11,fontWeight:700,color:'#8A968D',textTransform:'uppercase',margin:'10px 0 4px'}}>Order quantity (cartons)</div>
              <div className="ct-qtyrow">
                <button onClick={() => setDetailQty(q => Math.max(0, q - 1))}>−</button>
                <div className="val">{detailQty}</div>
                <button onClick={() => setDetailQty(q => q + 1)}>+</button>
              </div>
              <div style={{textAlign:'center',fontSize:10.5,color:'#8A968D',marginBottom:16}}>{detailQty > 0 ? `${(detailQty*detailProduct.vol).toFixed(2)} m³ · ${detailQty*detailProduct.pcs} pieces` : `Minimum order ${detailProduct.moq} cartons`}</div>
              <div style={{display:'flex',gap:9}}>
                <button className="ct-btn ghost" style={{flex:1}} onClick={() => setScreen('container')}>View container</button>
                <button className="ct-btn primary" style={{flex:1}} onClick={addToContainer}>Add to container</button>
              </div>
            </div>
          )}

          {screen === 'container' && (
            <div style={{maxWidth:460}}>
              {payingShipping ? (
                <div className="ct-loadwrap"><div className="ct-spinner"></div><h3>Processing MoMo payment…</h3><p>Confirming your product cost and container share.</p></div>
              ) : containerDone ? (
                <>
                  <div className="ct-success-wrap">
                    <div className="ct-success-check"><Check size={22} /></div>
                    <h3>Order paid!</h3>
                    <p>Your product cost and shipping are both settled. This container dispatches from our partner warehouse in China once it&apos;s full — track it door-to-door from the app.</p>
                  </div>
                  <button className="ct-btn ghost" style={{marginBottom:10}} onClick={() => setScreen('home')}>Close</button>
                  {orders[0] && <button className="ct-btn primary" onClick={() => openTrackingFor(orders[0])}>View tracking</button>}
                </>
              ) : (
                <>
                  <div className="ct-fillbanner">
                    <div className="flbl"><span>20ft LCL container · shared with other buyers</span><span className="pct">{container.fillPct}%</span></div>
                    <div className="ct-barwrap"><div className="ct-barfill" style={{width:`${container.fillPct}%`}}></div></div>
                    <div className="fmeta"><span>{container.filledVol} / {container.capVol} m³</span><span>{container.buyers} buyers pooling</span></div>
                  </div>
                  <p style={{fontSize:11.5,color:'#4B5A50',lineHeight:1.55}}>This container is shared with other ChinaTown agents — you pay your product cost and your shipping share together now, no waiting for it to fill.</p>
                  <div className="m-section-label" style={{fontSize:11,fontWeight:700,color:'#8A968D',textTransform:'uppercase',margin:'12px 0 6px'}}>My items in this container</div>
                  <div className="ct-card" style={{cursor:'default',padding:'4px 14px'}}>
                    {cart.length === 0 ? <div className="empty-state">No items yet — add products from the catalogue.</div> : cart.map(c => (
                      <div key={c.id} className="ct-cartitem"><div className="th">{c.icon}</div><div><div className="n">{c.name}</div><div className="m">{c.qty} cartons · RWF {(c.qty*c.rwf).toLocaleString()}</div></div></div>
                    ))}
                  </div>
                  <div className="ct-summarybox">
                    <div className="ct-sumrow"><span className="dim">My product cost</span><span>RWF {productCost.toLocaleString()}</span></div>
                    <div className="ct-sumrow"><span className="dim">My container share</span><span>{myVolume.toFixed(2)} m³ ({myVolume>0?Math.round(myVolume/container.capVol*100):0}%)</span></div>
                    <div className="ct-sumrow"><span className="dim">Shipping (fixed rate/m³)</span><span>RWF {shippingCost.toLocaleString()}</span></div>
                    <div className="ct-sumrow total"><span>Total due now</span><span>RWF {(productCost+shippingCost).toLocaleString()}</span></div>
                  </div>
                  <div className="ct-note">⚠ Shipping is charged upfront at a fixed rate per m³, paid together with your product cost in one MoMo payment. The container dispatches once it&apos;s full — you don&apos;t pay again later.</div>
                  <div style={{display:'flex',gap:9,marginTop:16}}>
                    <button className="ct-btn ghost" style={{flex:1}} onClick={() => setScreen('home')}>Keep browsing</button>
                    <button className="ct-btn primary" style={{flex:1,opacity:cart.length?1:.5}} disabled={!cart.length} onClick={paySharing}>{cart.length?'Pay & confirm order':'Add items to pay'}</button>
                  </div>
                </>
              )}
            </div>
          )}

          {screen === 'tracking' && trackingOrder && (
            <div style={{maxWidth:460}}>
              <div className="ct-cartitem" style={{background:'#fff',border:'1px solid var(--color-line)',borderRadius:12,padding:'11px 12px',marginBottom:14}}>
                <div className="th">{trackingOrder.items[0]?.icon}</div>
                <div><div className="n">{trackingOrder.items.length>1?`${trackingOrder.items.length} items`:trackingOrder.items[0]?.name}</div><div className="m">RWF {trackingOrder.total.toLocaleString()}</div></div>
              </div>
              <div className="ct-codebox">
                <div><div className="l">Tracking code</div><div className="v">{trackingOrder.trackingCode}</div></div>
                <div className="eta"><div className="l">Est. arrival</div><div className="v">{trackingOrder.eta}</div></div>
              </div>
              <div className="ct-timeline">
                {TRACKING_STAGES.map((s, i) => (
                  <div key={s} className={`ct-tl-item${i<trackingOrder.stage?' done':i===trackingOrder.stage?' current':''}`}>
                    <div className="ct-tl-line"></div>
                    <div className="ct-tl-dot">{i<trackingOrder.stage ? <Check size={11} /> : i+1}</div>
                    <div><div className="ct-tl-label">{s}</div>{i<=trackingOrder.stage && <div className="ct-tl-time">{trackingOrder.stageDates[i]||''}</div>}</div>
                  </div>
                ))}
              </div>
              {trackingOrder.stage >= 3 && (
                <button className="ct-progresscard" style={{marginTop:16}} onClick={() => openPickupFor(trackingOrder)}>
                  <div className="toprow"><b>Ready for pickup</b><span>{trackingOrder.taxPaid?'Confirm pickup':'Action needed'}</span></div>
                  <div className="sub"><span>{trackingOrder.taxPaid?'Import tax settled':"Settle your RRA import tax to release your goods"}</span><span>Tap to manage →</span></div>
                </button>
              )}
              <button className="ct-btn primary" style={{marginTop:16}} onClick={() => setScreen('home')}>Done</button>
            </div>
          )}

          {screen === 'pickup' && pickupOrder && (() => {
            const duty = Math.round(pickupOrder.total * 0.25);
            const vat = Math.round((pickupOrder.total + duty) * 0.18);
            const totalTax = duty + vat;
            const loanRepay = Math.round(totalTax * 1.06);
            return (
              <div style={{maxWidth:460}}>
                <div className="ct-codebox">
                  <div><div className="l">Tracking code</div><div className="v">{pickupOrder.trackingCode}</div></div>
                  <div className="eta"><div className="l">Declared value</div><div className="v">RWF {pickupOrder.total.toLocaleString()}</div></div>
                </div>
                <div className="m-section-label" style={{fontSize:11,fontWeight:700,color:'#8A968D',textTransform:'uppercase',margin:'4px 0 6px'}}>Rwanda Revenue Authority — import tax estimate</div>
                <div className="ct-summarybox">
                  <div className="ct-sumrow"><span className="dim">Customs value (CIF)</span><span>RWF {pickupOrder.total.toLocaleString()}</span></div>
                  <div className="ct-sumrow"><span className="dim">Import duty (25%)</span><span>RWF {duty.toLocaleString()}</span></div>
                  <div className="ct-sumrow"><span className="dim">VAT (18%)</span><span>RWF {vat.toLocaleString()}</span></div>
                  <div className="ct-sumrow total"><span>Total tax due</span><span>RWF {totalTax.toLocaleString()}</span></div>
                </div>
                <p style={{fontSize:11,color:'#8A968D',lineHeight:1.55,margin:'10px 0'}}>This is an in-app estimate based on your declared customs value. Our licensed clearing agent confirms the final RRA assessment before your goods are released.</p>
                {payingTax ? (
                  <div className="ct-loadwrap"><div className="ct-spinner"></div><h3>Processing…</h3><p>Confirming with RRA and releasing your goods.</p></div>
                ) : pickupOrder.taxPaid ? (
                  <>
                    <div className="ct-note" style={{background:'var(--ct-surface)',borderColor:'var(--ct-red)',color:'var(--ct-red-dark)',fontWeight:700}}>✓ Tax settled.</div>
                    <button className="ct-btn primary" style={{marginTop:16}} onClick={confirmPickup}>Confirm pickup</button>
                  </>
                ) : showingLoan ? (
                  <>
                    <div className="m-section-label" style={{fontSize:11,fontWeight:700,color:'#8A968D',textTransform:'uppercase',margin:'8px 0 6px'}}>Short-term tax financing · ChinaTown lending partners</div>
                    {CT_LENDERS.map(l => (
                      <div key={l} className={`ct-lendercard${selectedLender===l?' on':''}`} onClick={() => setSelectedLender(l)}>
                        <div className="prow"><div><div className="pname">{l}</div><div className="pdesc">6% flat interest · repay in 30 days</div></div><div className="pprice">RWF {loanRepay.toLocaleString()}</div></div>
                      </div>
                    ))}
                    <div className="ct-note">The loan is disbursed straight to RRA to clear your tax so your goods can be released today. Repayment of <b>RWF {loanRepay.toLocaleString()}</b> is due in 30 days to your selected lending partner.</div>
                    <button className="ct-btn primary" style={{marginTop:14,opacity:selectedLender?1:.5}} disabled={!selectedLender} onClick={acceptLoan}>Accept loan &amp; clear tax</button>
                  </>
                ) : (
                  <>
                    <div className="form-row"><label>MTN MoMo number</label><input value={taxMomo} onChange={e => setTaxMomo(e.target.value)} placeholder="07XX XXX XXX" /></div>
                    <button className="ct-btn primary" onClick={payTaxMomo}>Pay tax now</button>
                    <button className="ct-gateapply" style={{color:'var(--ct-red-dark)',width:'100%',textAlign:'center',display:'block',marginTop:12}} onClick={() => setShowingLoan(true)}>Don&apos;t have the money right now? See loan options</button>
                  </>
                )}
              </div>
            );
          })()}

          {screen === 'source' && (
            <div style={{maxWidth:460}}>
              <p style={{fontSize:11.5,color:'#4B5A50',lineHeight:1.55,marginBottom:14}}>Tell us what you need — a photo, a description, or both. Our AI checks Alibaba and our verified supplier list and comes back with matches.</p>
              <div className="form-row">
                <label>Photo of the product (optional)</label>
                <div className="photo-tile" style={{aspectRatio:'16/9'}} onClick={() => photoInputRef.current?.click()}>
                  {sourceForm.photo ? <img src={sourceForm.photo} alt="" /> : <span>📷 Tap to add a photo</span>}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={sourcePhotoChange} />
              </div>
              <div className="form-row"><label>What do you need?</label><textarea value={sourceForm.desc} onChange={e => setSourceForm(f => ({...f, desc: e.target.value}))} placeholder="e.g. Stainless steel insulated water bottles, 500ml, with custom logo printing" /></div>
              <div className="form-row">
                <label>Category</label>
                <div className="chip-row" style={{flexWrap:'wrap',gridTemplateColumns:'none',display:'flex'}}>
                  {['Not sure','Electronics','Textiles','Hardware','Household','Furniture','Cosmetics'].map(c => (
                    <div key={c} className={`chip${(sourceForm.cat===c||(c==='Not sure'&&!sourceForm.cat))?' selected':''}`} style={{flex:'0 0 auto',padding:'8px 12px'}} onClick={() => setSourceForm(f => ({...f, cat: c==='Not sure'?'':c}))}>{c}</div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <div className="form-row" style={{flex:1}}><label>Target quantity (cartons)</label><input value={sourceForm.qty} onChange={e => setSourceForm(f => ({...f, qty: e.target.value}))} placeholder="e.g. 5" /></div>
                <div className="form-row" style={{flex:1}}><label>Max RWF / piece</label><input value={sourceForm.budget} onChange={e => setSourceForm(f => ({...f, budget: e.target.value}))} placeholder="e.g. 5,000" /></div>
              </div>
              <div style={{fontSize:10,color:'#8A968D',margin:'-8px 0 12px'}}>Optional — we&apos;ll flag any match priced above this so you can compare quickly.</div>
              {sourceError && <div style={{display:'block',color:'#D64545',fontSize:11.5,fontWeight:600,margin:'6px 2px 12px'}}>Add a photo or a short description so we know what to source.</div>}
              <button className="ct-gateapply" style={{color:'var(--ct-red-dark)',width:'100%',textAlign:'center',display:'block',marginBottom:16}} onClick={() => { setAccountTab('requests'); setScreen('account'); }}>View my past requests</button>
              <button className="ct-btn primary" onClick={sourceSubmit}>Continue</button>
            </div>
          )}

          {screen === 'source-results' && (
            <div style={{maxWidth:460}}>
              {sourceLoading ? (
                <div className="ct-loadwrap">
                  <div className="ct-spinner"></div>
                  <h3>AI is sourcing this for you…</h3>
                  <p>Scanning Alibaba listings and cross-checking our verified ChinaTown supplier network for the closest matches.</p>
                  <div className="ct-loadsteps">
                    <div className="ct-loadstep"><span className="dot"></span>Reading your request</div>
                    <div className="ct-loadstep"><span className="dot"></span>Searching Alibaba suppliers</div>
                    <div className="ct-loadstep"><span className="dot"></span>Checking our ChinaTown catalog</div>
                  </div>
                </div>
              ) : currentSourceReq && (
                <>
                  <div style={{fontSize:12,color:'#4B5A50',fontWeight:600,marginBottom:14}}>Found {currentSourceReq.results.length} possible matches for &quot;{currentSourceReq.desc || currentSourceReq.cat || 'your request'}&quot;</div>
                  {currentSourceReq.results.map((r,i) => (
                    <div key={i} className="ct-resultcard">
                      <div className="th">{r.icon}</div>
                      <div style={{flex:1}}>
                        <div className="n">{r.name}</div>
                        <div className="src">{r.source}</div>
                        <div className="p">RWF {r.price.toLocaleString()} / piece</div>
                        {r.overBudget && <div className="flag">⚠ Above your target budget</div>}
                      </div>
                    </div>
                  ))}
                  <p style={{fontSize:11.5,color:'#4B5A50',lineHeight:1.55,margin:'16px 0 10px'}}>Not quite right? Widen the AI search for more factory options, or hand this request to our sourcing team to chase down suppliers directly.</p>
                  <div style={{display:'flex',gap:8,marginBottom:16}}>
                    <button className="ct-btn ghost" style={{flex:1}} onClick={widenSearch}>Widen the search</button>
                    <button className="ct-btn primary" style={{flex:1}} onClick={escalateToTeam}>Ask our team</button>
                  </div>
                  <button className="ct-gateapply" style={{color:'var(--ct-red-dark)',width:'100%',textAlign:'center',display:'block'}} onClick={() => { setAccountTab('requests'); setScreen('account'); }}>View my past requests</button>
                </>
              )}
            </div>
          )}

          {screen === 'account' && (
            <div style={{maxWidth:520}}>
              <div className="ct-codebox"><div><div className="l">Your ChinaTown client code</div><div className="v">{CT_CLIENT_CODE}</div></div></div>
              <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>Nyabugogo TechHub</div>
              <div style={{fontSize:10.5,color:'#8A968D',marginBottom:16}}>Verified agent · Kigali</div>
              <div className="subnav-chips">
                <div className={`subnav-chip${accountTab==='orders'?' active':''}`} onClick={() => setAccountTab('orders')}>Orders</div>
                <div className={`subnav-chip${accountTab==='invoices'?' active':''}`} onClick={() => setAccountTab('invoices')}>Invoices</div>
                <div className={`subnav-chip${accountTab==='requests'?' active':''}`} onClick={() => setAccountTab('requests')}>Sourcing requests</div>
              </div>
              {accountTab === 'orders' && (orders.length ? orders.map(o => (
                <div key={o.id} className="list-row" style={{cursor:'pointer'}} onClick={() => openTrackingFor(o)}>
                  <div className="lr-avatar" style={{background:'var(--ct-surface)',color:'var(--ct-red-dark)'}}>📦</div>
                  <div><div className="lr-title">{o.trackingCode}</div><div className="lr-sub">{o.items.length} item(s) · RWF {o.total.toLocaleString()}</div></div>
                  <span className={`badge ${o.stage>=4?'ok':'info'}`}>{o.stage>=4?'Delivered':'In progress'}</span>
                </div>
              )) : <div className="empty-state">No orders yet.</div>)}
              {accountTab === 'invoices' && (invoices.length ? invoices.map(inv => (
                <div key={inv.id} className="list-row">
                  <div className="lr-avatar" style={{background:'var(--ct-surface)',color:'var(--ct-red-dark)'}}>🧾</div>
                  <div><div className="lr-title">{inv.id}</div><div className="lr-sub">{relTime(inv.at)}</div></div>
                  <b className="mono" style={{fontSize:12}}>{inv.total.toLocaleString()}</b>
                </div>
              )) : <div className="empty-state">No invoices yet.</div>)}
              {accountTab === 'requests' && (sourceRequests.length ? sourceRequests.map((r,i) => (
                <div key={i} className="list-row">
                  <div className="lr-avatar" style={{background:'var(--ct-surface)',color:'var(--ct-red-dark)'}}>✨</div>
                  <div><div className="lr-title">{r.desc || r.cat || 'Sourcing request'}</div><div className="lr-sub">{relTime(r.at)}</div></div>
                  <span className={`badge ${r.status==='escalated'?'warn':'info'}`}>{r.status==='escalated'?'With our team':'AI matched'}</span>
                </div>
              )) : <div className="empty-state">No sourcing requests yet.</div>)}
            </div>
          )}
        </>
      )}

      {requestAccessOpen && (
        <RequestAccessSheet onClose={() => setRequestAccessOpen(false)} onGranted={(code) => { setRequestAccessOpen(false); setUnlocked(true); setScreen('home'); toast(`Welcome to ChinaTown, agent ${code}`); }} />
      )}
    </div>
  );
}

function RequestAccessSheet({ onClose, onGranted }: { onClose: () => void; onGranted: (code: string) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState('Nyabugogo TechHub');
  const [city, setCity] = useState('');
  const [sells, setSells] = useState('');
  const [error, setError] = useState(false);
  const [stage, setStage] = useState<'form' | 'loading' | 'success'>('form');
  const [code, setCode] = useState('');

  function submit() {
    if (!name.trim() || !phone.trim()) { setError(true); return; }
    setStage('loading');
    window.setTimeout(() => {
      setCode('CT-' + Math.floor(1000 + Math.random() * 9000));
      setStage('success');
    }, 1600);
  }

  return (
    <div className="modal-overlay show" onClick={stage === 'form' ? onClose : undefined}>
      <div className="onboard-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="pm-head"><div className="pm-head-left"><div className="pm-title">Request agent access code</div></div><button aria-label="Close" className="pm-close" onClick={onClose}>✕</button></div>
        <div className="ob-body">
          {stage === 'loading' && (
            <div className="ct-loadwrap">
              <div className="ct-spinner"></div>
              <h3>Reviewing your request…</h3>
              <p>Our ChinaTown team is verifying your business details.</p>
            </div>
          )}
          {stage === 'success' && (
            <div className="ct-success-wrap">
              <div className="ct-success-check"><Check size={22} /></div>
              <h3>You&apos;re approved!</h3>
              <p>Your ChinaTown agent access code has been generated and sent to your phone via SMS.</p>
              <div style={{fontSize:24,fontWeight:800,color:'var(--ct-red-dark)',marginBottom:8}}>{code}</div>
              <div style={{fontSize:10.5,color:'#8A968D',marginBottom:18}}>Sent via SMS to {phone}</div>
              <button className="ct-btn primary" onClick={() => onGranted(code)}>Use this code now</button>
            </div>
          )}
          {stage === 'form' && (
            <>
              <p style={{fontSize:11.5,color:'#4B5A50',lineHeight:1.5,marginBottom:14}}>Tell us about your business and we&apos;ll issue you a ChinaTown access code.</p>
              <div className="form-row"><label>Full name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jean Claude Uwimana" /></div>
              <div className="form-row"><label>Phone number (WhatsApp)</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0788 123 456" /></div>
              <div className="form-row"><label>Business / shop name</label><input value={business} onChange={e => setBusiness(e.target.value)} /></div>
              <div className="form-row"><label>City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Kigali" /></div>
              <div className="form-row"><label>What do you sell or plan to import?</label><input value={sells} onChange={e => setSells(e.target.value)} placeholder="e.g. Phone accessories, electronics" /></div>
              {error && <div style={{color:'#D64545',fontSize:11.5,fontWeight:600,margin:'8px 2px 4px'}}>Please fill in your name and phone number.</div>}
              <button className="ct-btn primary" style={{marginTop:8}} onClick={submit}>Submit request</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
