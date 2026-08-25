'use client';
import React, { useState } from 'react';
import { X, Receipt, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useTenant } from '@/components/tenant/TenantContext';
import { useToast } from '@/components/Toast';
import { initialMwStock, initialMwInvoices, defaultMwTemplate, relTime } from '@/lib/data';
import PosSaleWizard, { StockItem, PosInvoice } from '../PosSaleWizard';
import PosInvoiceBuilder from '../PosInvoiceBuilder';
import CreditsTopUpModal from '@/components/CreditsTopUpModal';

type Tab = 'dashboard' | 'sales' | 'stock' | 'invoices' | 'tax' | 'settings';

export default function PosView() {
  const toast = useToast();
  const { creditsBalance, spendCredits, openTopUp, topUpOpen, closeTopUp, confirmTopUp } = useTenant();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stock, setStock] = useState<StockItem[]>(initialMwStock);
  const [invoices, setInvoices] = useState<PosInvoice[]>(initialMwInvoices);
  const [template, setTemplate] = useState(defaultMwTemplate);
  const [reconciled, setReconciled] = useState(false);

  const [saleOpen, setSaleOpen] = useState(false);
  const [invoiceBuilderOpen, setInvoiceBuilderOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [restockIndex, setRestockIndex] = useState<number | null>(null);
  const [viewInvoice, setViewInvoice] = useState<PosInvoice | null>(null);

  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('0');
  const [newPrice, setNewPrice] = useState('');
  const [restockQty, setRestockQty] = useState('10');

  const todaySales = invoices.filter(i => new Date(i.at).toDateString() === new Date().toDateString()).reduce((s, i) => s + i.total, 0);
  const todayVat = invoices.reduce((s, i) => s + i.vat, 0);
  const stockValue = stock.reduce((s, i) => s + i.qty * i.price, 0);
  const lowStockCount = stock.filter(s => s.qty <= 10).length;
  const salesTotal = invoices.reduce((s, i) => s + i.total, 0);
  const vatTotal = invoices.reduce((s, i) => s + i.vat, 0);

  function handleIssueSale(invoice: PosInvoice, itemIndex: number, qty: number) {
    setStock(prev => prev.map((s, i) => i === itemIndex ? { ...s, qty: s.qty - qty } : s));
    spendCredits(2);
    setInvoices(prev => [invoice, ...prev]);
  }
  function handleIssueInvoice(invoice: PosInvoice) {
    spendCredits(2);
    setInvoices(prev => [invoice, ...prev]);
    setInvoiceBuilderOpen(false);
    toast(`Invoice ${invoice.id} issued`);
  }
  function submitAddStock() {
    if (!newName.trim()) return;
    setStock(prev => [...prev, { name: newName.trim(), qty: parseInt(newQty, 10) || 0, price: parseInt(newPrice, 10) || 0 }]);
    toast(`"${newName.trim()}" added to stock`);
    setAddStockOpen(false); setNewName(''); setNewQty('0'); setNewPrice('');
  }
  function submitRestock() {
    if (restockIndex === null) return;
    const add = parseInt(restockQty, 10) || 0;
    setStock(prev => prev.map((s, i) => i === restockIndex ? { ...s, qty: s.qty + add } : s));
    toast(`Stock updated`);
    setRestockIndex(null); setRestockQty('10');
  }

  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>MSME Biz Wizard</h2><div className="hint">Stock, sales &amp; EBM invoices for Nyabugogo TechHub</div></div></div>

      <div className="subnav-chips">
        {(['dashboard','sales','stock','invoices','tax','settings'] as Tab[]).map(t => (
          <div key={t} className={`subnav-chip${tab===t?' active':''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>
        ))}
      </div>

      <div className="credits-bar">
        <div className="cr-ic">🪙</div>
        <div><div className="cr-label">Credits balance</div><div className="cr-value">{creditsBalance} credits</div></div>
        <button className="cr-topup" onClick={openTopUp}>+ Top up</button>
      </div>

      {tab === 'dashboard' && (
        <>
          <div className="kpi-scroll">
            <div className="kpi-chip"><div className="kc-label">Sales today</div><div className="kc-value">RWF {todaySales.toLocaleString()}</div><div className="kc-delta up">{invoices.length} invoices</div></div>
            <div className="kpi-chip"><div className="kc-label">Low stock items</div><div className="kc-value">{lowStockCount}</div><div className="kc-delta down">act soon</div></div>
            <div className="kpi-chip"><div className="kc-label">Stock value</div><div className="kc-value">RWF {(stockValue/1000).toFixed(0)}K</div><div className="kc-delta flat">{stock.length} items</div></div>
            <div className="kpi-chip"><div className="kc-label">VAT collected</div><div className="kc-value">RWF {(todayVat/1000).toFixed(0)}K</div><div className="kc-delta flat">this month</div></div>
          </div>
          <div className="grid grid-cols-2 gap-[12px] mb-[16px]" style={{maxWidth:400}}>
            <button className="btn primary" style={{justifyContent:'center',gap:6}} onClick={() => setSaleOpen(true)}><Banknote size={15} /> Record Sale</button>
            <button className="btn ghost" style={{justifyContent:'center',gap:6}} onClick={() => setInvoiceBuilderOpen(true)}><Receipt size={15} /> New Invoice</button>
          </div>
          <div className="card">
            <div className="card-head"><h3>Recent invoices</h3></div>
            <div className="card-body">
              {invoices.length === 0 && <div className="empty-state">No invoices yet.</div>}
              {invoices.slice(0,4).map(inv => (
                <div key={inv.id} className="list-row" style={{cursor:'pointer'}} onClick={() => setViewInvoice(inv)}>
                  <div className="lr-avatar" style={{background:'var(--color-cream-100)',color:'var(--color-ink-600)'}}>🧾</div>
                  <div><div className="lr-title">{inv.id}</div><div className="lr-sub">{inv.item} · {inv.customer}</div></div>
                  <div className="lr-right"><b className="mono" style={{fontSize:12}}>{inv.total.toLocaleString()}</b></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'sales' && (
        <div className="card">
          <div className="card-head"><h3>All sales</h3></div>
          <div className="card-body">
            <button className="btn primary" style={{width:'100%',justifyContent:'center',marginBottom:16}} onClick={() => setSaleOpen(true)}>+ Record a sale</button>
            {invoices.length === 0 && <div className="empty-state">No sales recorded yet.</div>}
            {invoices.map(inv => (
              <div key={inv.id} className="list-row">
                <div className="lr-avatar" style={{background:'var(--color-cream-100)',color:'var(--color-ink-600)'}}>💵</div>
                <div><div className="lr-title">{inv.item} × {inv.qty}</div><div className="lr-sub">{inv.customer} · {relTime(inv.at)}</div></div>
                <div className="lr-right"><b className="mono" style={{fontSize:12}}>{inv.total.toLocaleString()}</b></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'stock' && (
        <div className="card">
          <div className="card-head"><h3>Stock on hand</h3></div>
          <div className="card-body">
            <button className="btn primary" style={{width:'100%',justifyContent:'center',marginBottom:16}} onClick={() => setAddStockOpen(true)}>+ Add stock item</button>
            {stock.map((s, i) => (
              <div key={s.name} className="stock-row">
                <div className="stock-ic">📦</div>
                <div style={{flex:1,minWidth:0}}><div className="sr-name">{s.name}</div><div className="sr-sub">RWF {s.price.toLocaleString()} / unit · Value RWF {(s.qty*s.price).toLocaleString()}</div></div>
                <Badge type={s.qty<=5?'overdue':s.qty<=15?'due':'paid'} label={`${s.qty} left`} />
                <button className="btn ghost" style={{padding:'6px 9px',fontSize:10.5,marginLeft:8}} onClick={() => setRestockIndex(i)}>+ Restock</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="card">
          <div className="card-head"><h3>All invoices</h3></div>
          <div className="card-body">
            <button className="btn primary" style={{width:'100%',justifyContent:'center',marginBottom:16}} onClick={() => setInvoiceBuilderOpen(true)}>+ New Invoice</button>
            {invoices.length === 0 && <div className="empty-state">No invoices yet.</div>}
            {invoices.map(inv => (
              <div key={inv.id} className="list-row" style={{cursor:'pointer'}} onClick={() => setViewInvoice(inv)}>
                <div className="lr-avatar" style={{background:'var(--color-cream-100)',color:'var(--color-ink-600)'}}>🧾</div>
                <div><div className="lr-title">{inv.id}</div><div className="lr-sub">{inv.customer} · {relTime(inv.at)}</div></div>
                <div className="lr-right"><b className="mono" style={{fontSize:12}}>{inv.total.toLocaleString()}</b><div style={{marginTop:4}}><Badge type={inv.status==='Paid'?'paid':'transit'} label={inv.status} /></div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tax' && (
        <>
          <div className="kpi-scroll">
            <div className="kpi-chip"><div className="kc-label">Sales this period</div><div className="kc-value">{(salesTotal/1000).toFixed(0)}K</div><div className="kc-delta flat">RWF</div></div>
            <div className="kpi-chip"><div className="kc-label">VAT collected</div><div className="kc-value">{(vatTotal/1000).toFixed(0)}K</div><div className="kc-delta flat">18%</div></div>
            <div className="kpi-chip"><div className="kc-label">Est. tax due</div><div className="kc-value">{(vatTotal*0.9/1000).toFixed(0)}K</div><div className="kc-delta flat">to RRA</div></div>
          </div>
          <div className="card" style={{marginBottom:14}}>
            <div className="card-head"><h3>This period</h3></div>
            <div className="card-body">
              <div className="review-row"><span>Total sales recorded</span><b className="mono">RWF {salesTotal.toLocaleString()}</b></div>
              <div className="review-row"><span>VAT collected (18%)</span><b className="mono">RWF {vatTotal.toLocaleString()}</b></div>
              <div className="review-row"><span>Deductible expenses</span><b className="mono">RWF 320,000</b></div>
              <div className="review-row" style={{fontWeight:800}}><span>Estimated tax due</span><b className="mono">RWF {Math.max(0,Math.round(vatTotal*0.9-320000)).toLocaleString()}</b></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Reconciliation status</h3></div>
            <div className="card-body">
              <div className="review-row"><span>This period</span><Badge type={reconciled?'paid':'due'} label={reconciled?'Reconciled':'Not yet reconciled'} /></div>
              {!reconciled && <button className="btn primary" style={{marginTop:10,width:'100%',justifyContent:'center'}} onClick={() => { setReconciled(true); toast('Period marked as reconciled'); }}>Mark period as reconciled</button>}
              <p style={{fontSize:10.5,color:'#8A968D',marginTop:10,lineHeight:1.5}}>This is an estimate to help you prepare. Always confirm final figures with RRA or your accountant before filing.</p>
            </div>
          </div>
        </>
      )}

      {tab === 'settings' && (
        <div className="card" style={{maxWidth:500}}>
          <div className="card-head"><h3>Invoice template</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Business name</label><input value={template.name} onChange={e => setTemplate(t => ({...t, name: e.target.value}))} /></div>
            <div className="form-row"><label>Business TIN</label><input value={template.tin} onChange={e => setTemplate(t => ({...t, tin: e.target.value}))} placeholder="1XXXXXXXXX" /></div>
            <div className="form-row"><label>Address</label><input value={template.address} onChange={e => setTemplate(t => ({...t, address: e.target.value}))} placeholder="KG 360 ST 6, Kigali" /></div>
            <div className="form-row"><label>Footer note</label><input value={template.footer} onChange={e => setTemplate(t => ({...t, footer: e.target.value}))} /></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}} onClick={() => toast('Template saved')}>Save template</button>
          </div>
        </div>
      )}

      <PosSaleWizard show={saleOpen} onClose={() => setSaleOpen(false)} stock={stock} creditsBalance={creditsBalance} onOpenTopUp={openTopUp} onIssue={handleIssueSale} />
      <PosInvoiceBuilder show={invoiceBuilderOpen} onClose={() => setInvoiceBuilderOpen(false)} creditsBalance={creditsBalance} onOpenTopUp={openTopUp} onIssue={handleIssueInvoice} />
      <CreditsTopUpModal show={topUpOpen} onClose={closeTopUp} creditsBalance={creditsBalance} onConfirm={confirmTopUp} />

      {addStockOpen && (
        <div className="modal-overlay show" onClick={() => setAddStockOpen(false)}>
          <div className="onboard-modal" style={{maxWidth:380}} onClick={e => e.stopPropagation()}>
            <div className="pm-head"><div className="pm-head-left"><div className="pm-title">Add stock item</div></div><button aria-label="Close" className="pm-close" onClick={() => setAddStockOpen(false)}><X size={16} /></button></div>
            <div className="ob-body">
              <div className="form-row"><label>Item name</label><input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Screen Protector" /></div>
              <div className="form-row"><label>Qty on hand</label><input type="number" value={newQty} onChange={e => setNewQty(e.target.value)} /></div>
              <div className="form-row"><label>Unit price (RWF)</label><input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="2500" /></div>
              <button className="btn primary" style={{width:'100%',justifyContent:'center'}} onClick={submitAddStock}>+ Add item</button>
            </div>
          </div>
        </div>
      )}

      {restockIndex !== null && (
        <div className="modal-overlay show" onClick={() => setRestockIndex(null)}>
          <div className="onboard-modal" style={{maxWidth:380}} onClick={e => e.stopPropagation()}>
            <div className="pm-head"><div className="pm-head-left"><div className="pm-title">Restock — {stock[restockIndex].name}</div></div><button aria-label="Close" className="pm-close" onClick={() => setRestockIndex(null)}><X size={16} /></button></div>
            <div className="ob-body">
              <div style={{fontSize:11.5,color:'#8A968D',marginBottom:12}}>Currently {stock[restockIndex].qty} in stock</div>
              <div className="form-row"><label>Add quantity</label><input type="number" value={restockQty} onChange={e => setRestockQty(e.target.value)} /></div>
              <button className="btn primary" style={{width:'100%',justifyContent:'center'}} onClick={submitRestock}>+ Update stock</button>
            </div>
          </div>
        </div>
      )}

      {viewInvoice && (
        <div className="modal-overlay show" onClick={() => setViewInvoice(null)}>
          <div className="onboard-modal" style={{maxWidth:380}} onClick={e => e.stopPropagation()}>
            <div className="pm-head"><div className="pm-head-left"><div className="pm-title">Invoice {viewInvoice.id}</div></div><button aria-label="Close" className="pm-close" onClick={() => setViewInvoice(null)}><X size={16} /></button></div>
            <div className="ob-body">
              <div className="receipt-box">
                <div className="receipt-line"><span>{viewInvoice.item} × {viewInvoice.qty}</span><b>RWF {(viewInvoice.total-viewInvoice.vat).toLocaleString()}</b></div>
                <div className="receipt-line"><span>VAT (18%)</span><b>RWF {viewInvoice.vat.toLocaleString()}</b></div>
                <div className="receipt-total-line"><span>Total</span><b>RWF {viewInvoice.total.toLocaleString()}</b></div>
              </div>
              <div style={{fontSize:11,color:'#8A968D',marginTop:12}}>Customer: {viewInvoice.customer} · {viewInvoice.status} · {relTime(viewInvoice.at)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
