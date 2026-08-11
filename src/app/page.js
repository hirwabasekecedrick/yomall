'use client';
import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import PhonePreview from '@/components/PhonePreview';

/* ─────────────── DATA ─────────────── */
const floors = {
  G: [
    {n:'G-01',s:'paid',t:'Boutique'},{n:'G-02',s:'paid',t:'Café'},{n:'G-03',s:'vacant',t:''},{n:'G-04',s:'paid',t:'Electronics'},
    {n:'G-05',s:'due',t:'Salon'},{n:'G-06',s:'paid',t:'Bakery'},{n:'G-07',s:'paid',t:'Pharmacy'},{n:'G-08',s:'paid',t:'Fashion'},
    {n:'G-09',s:'overdue',t:'Phone repair'},{n:'G-10',s:'paid',t:'Bookshop'},{n:'G-11',s:'paid',t:'Toys'},{n:'G-12',s:'vacant',t:''},
    {n:'G-13',s:'due',t:'Shoes'},{n:'G-14',s:'overdue',t:'TechHub'},{n:'G-15',s:'paid',t:'Jewelry'},{n:'G-16',s:'paid',t:'Stationery'},
  ],
  '1': [
    {n:'1F-01',s:'paid',t:'Boutique'},{n:'1F-02',s:'paid',t:'Tailor'},{n:'1F-03',s:'paid',t:'Perfume'},{n:'1F-04',s:'vacant',t:''},
    {n:'1F-05',s:'paid',t:'Sports'},{n:'1F-06',s:'due',t:'Amasezerano Boutique'},{n:'1F-07',s:'paid',t:'Furniture'},{n:'1F-08',s:'paid',t:'Optics'},
    {n:'1F-09',s:'overdue',t:'Salon'},{n:'1F-10',s:'paid',t:'Gifts'},{n:'1F-11',s:'vacant',t:''},{n:'1F-12',s:'paid',t:'Kids wear'},
    {n:'1F-13',s:'paid',t:'Art studio'},{n:'1F-14',s:'paid',t:'Watches'},{n:'1F-15',s:'due',t:'Beauty'},{n:'1F-16',s:'paid',t:'Home decor'},
  ],
  '2': [
    {n:'2F-01',s:'paid',t:'Cinema snacks'},{n:'2F-02',s:'paid',t:'Café Umurava'},{n:'2F-03',s:'paid',t:'Games lounge'},{n:'2F-04',s:'vacant',t:''},
    {n:'2F-05',s:'paid',t:'Coworking'},{n:'2F-06',s:'paid',t:'Print shop'},{n:'2F-07',s:'due',t:'Fitness'},{n:'2F-08',s:'paid',t:'Bank kiosk'},
    {n:'2F-09',s:'paid',t:'Kids play'},{n:'2F-10',s:'vacant',t:''},{n:'2F-11',s:'paid',t:'Bar'},{n:'2F-12',s:'paid',t:'Restaurant'},
    {n:'2F-13',s:'paid',t:'Ice cream'},{n:'2F-14',s:'paid',t:'Restaurant'},{n:'2F-15',s:'vacant',t:''},{n:'2F-16',s:'paid',t:'Barber'},
  ],
};

const tenants = [
  {name:'Nyabugogo TechHub',unit:'G-14',cat:'Electronics',plan:'daily',store:'published',rent:'overdue',phone:'+250 78• ••• 214'},
  {name:'Amasezerano Boutique',unit:'1F-06',cat:'Fashion',plan:'weekly',store:'draft',rent:'due',phone:'+250 72• ••• 890'},
  {name:'Café Umurava',unit:'2F-02',cat:'Food & beverage',plan:'daily',store:'published',rent:'paid',phone:'+250 78• ••• 331'},
  {name:'Muraho Electronics',unit:'G-04',cat:'Electronics',plan:'weekly',store:'published',rent:'paid',phone:'+250 73• ••• 122'},
  {name:'Ikirenga Salon',unit:'G-05',cat:'Beauty',plan:'daily',store:'published',rent:'due',phone:'+250 78• ••• 045'},
  {name:'Zamu Phone Repair',unit:'G-09',cat:'Electronics',plan:'daily',store:'draft',rent:'overdue',phone:'+250 79• ••• 671'},
  {name:'Coko Bookshop',unit:'G-10',cat:'Books & stationery',plan:'weekly',store:'published',rent:'paid',phone:'+250 78• ••• 500'},
];

const ledger = [
  {name:'Nyabugogo TechHub',unit:'G-14',plan:'daily',per:'15,000',pct:62,bal:'57,000',next:'Tomorrow',status:'overdue'},
  {name:'Amasezerano Boutique',unit:'1F-06',plan:'weekly',per:'180,000',pct:80,bal:'144,000',next:'Fri 24 Jul',status:'due'},
  {name:'Muraho Electronics',unit:'G-04',plan:'weekly',per:'260,000',pct:100,bal:'0',next:'Fri 24 Jul',status:'paid'},
  {name:'Ikirenga Salon',unit:'G-05',plan:'daily',per:'12,000',pct:70,bal:'36,000',next:'Today',status:'due'},
  {name:'Zamu Phone Repair',unit:'G-09',plan:'daily',per:'18,000',pct:40,bal:'108,000',next:'Overdue 4d',status:'overdue'},
  {name:'Coko Bookshop',unit:'G-10',plan:'weekly',per:'150,000',pct:100,bal:'0',next:'Fri 24 Jul',status:'paid'},
];

const orders = [
  {id:'#YD-3391',shop:'Nyabugogo TechHub',item:'Earbuds, charger, speaker',rider:'E. Niyonzima',status:'transit',val:'52,000',time:'3 min ago'},
  {id:'#YD-3390',shop:'Café Umurava',item:'2x Cappuccino, muffin',rider:'J. Uwase',status:'delivered',val:'5,200',time:'12 min ago'},
  {id:'#YD-3389',shop:'Muraho Electronics',item:'Phone charger',rider:'—',status:'transit',val:'9,000',time:'14 min ago'},
  {id:'#YD-3388',shop:'Ikirenga Salon',item:'Home braiding booking',rider:'D. Habimana',status:'delivered',val:'12,000',time:'29 min ago'},
  {id:'#YD-3387',shop:'Coko Bookshop',item:'Notebook set',rider:'E. Niyonzima',status:'transit',val:'4,800',time:'33 min ago'},
];

const staffList = [
  {name:'Eugene Niyonzima',role:'Electrician',status:'Available',color:'#8B5CF6'},
  {name:'Jeanne Uwase',role:'Cleaning supervisor',status:'On duty',color:'#8B5CF6'},
  {name:'Didier Habimana',role:'Plumber',status:'Busy — G-09',color:'#F2A93B'},
  {name:'Aline Mukamana',role:'Security lead',status:'On duty',color:'#8B5CF6'},
  {name:'Patrick Ndayisenga',role:'IT / POS support',status:'Available',color:'#8B5CF6'},
  {name:'Claudine Ingabire',role:'HVAC technician',status:'Off shift',color:'#8A968D'},
];

const malls = [
  {name:'Kigali Convention Mall',loc:'Nyarugenge, Kigali',plan:'Growth',tenants:42,occ:'87%',gmv:'18.6M',color:'var(--color-forest-500)'},
  {name:'Musanze Heritage Plaza',loc:'Musanze, Northern Province',plan:'Starter',tenants:24,occ:'71%',gmv:'6.2M',color:'var(--color-amber-500)'},
  {name:'Huye Trade Center',loc:'Huye, Southern Province',plan:'Growth',tenants:36,occ:'92%',gmv:'11.4M',color:'var(--color-forest-500)'},
  {name:'Remera Business Arcade',loc:'Remera, Kigali',plan:'Growth',tenants:51,occ:'95%',gmv:'22.1M',color:'var(--color-forest-500)'},
  {name:'Rubavu Lakeside Mall',loc:'Rubavu, Western Province',plan:'Starter',tenants:19,occ:'64%',gmv:'4.8M',color:'var(--color-amber-500)'},
  {name:'Nyamirambo Craft Market',loc:'Nyamirambo, Kigali',plan:'Trial',tenants:11,occ:'38%',gmv:'1.1M',color:'var(--color-ink-400)'},
];

const productsData = [
  {name:'iPhone 14 Pro',price:'RWF 1.2M',icon:'📱'},
  {name:'AirPods Max',price:'RWF 600K',icon:'🎧'},
  {name:'MacBook Air M2',price:'RWF 1.5M',icon:'💻'},
  {name:'iPad Pro',price:'RWF 950K',icon:'🖥️'},
];

/* ─────────────── VIEW TITLES ─────────────── */
const titles = {
  console:['Platform Console','yoMall SaaS · every mall on the network'],
  lending:['Lending Partner Console','Loan applications, KYC review & disbursement'],
  landlords:['Landlords','Landlord accounts, verification and payout details'],
  performance:['Mall Performance','Operational SLA metrics across every mall'],
  moderation:['Deal Moderation','Review deals before they go live on yoDeals'],
  escalations:['Escalations','Disputes escalated from tenant-landlord messaging'],
  broadcast:['Broadcast','Send a platform-wide notice to landlords or tenants'],
  privacy:['Privacy & Data','Manage stored KYC data — export or delete on request'],
  audit:['Audit Log','Every administrative action taken on the platform'],
  overview:['Overview','Kigali Convention Mall · Sunday, 19 July 2026'],
  floormap:['Floor & Unit Map','48 units across 3 floors'],
  tenants:['Tenant Directory','Manage leases, contacts and storefront status'],
  storefront:['Storefront','Manage how each tenant\'s shop profile appears on the mall guide app'],
  yodeals:['Post to yoDeals','Special offers and discounts — not a full product catalogue'],
  guide:['Mall Guide Content','Wayfinding, amenities and customer announcements'],
  rent:['Rent & Payments','Landlord advances and tenant repayment plans'],
  deliveries:['Deliveries & yoDeals Sales','Monitor online orders and rider status'],
  staff:['Maintenance & Support','Directory of on-call building staff'],
  renewals:['Lease Renewals','Upcoming lease expirations across your building'],
  reports:['Reports','Export building data for your own records'],
  team:['Team','People with access to manage this building'],
  documents:['Documents','Compliance certificates and building documents'],
  handbook:['Tenant Handbook','Building operating rules for all tenants'],
  't-overview':['My Shop','Nyabugogo TechHub · Unit G-14'],
  't-orders':['My Orders','Online orders placed through yoDeals'],
  't-rent':['My Rent','Your repayment plan and payment history'],
  't-lease':['My Lease','Your lease terms, charges, deposit and compliance'],
  't-messages':['Messages','Contact your property manager directly'],
};

/* ─────────────── HELPERS ─────────────── */
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('');
}
function Badge({ type, label }) {
  return <span className={`badge ${type}`}>{label}</span>;
}
function KPI({ label, value, delta, deltaClass }) {
  return (
    <div className="kpi-card">
      <div className="k-label">{label}</div>
      <div className="k-value">{value}</div>
      {delta && <div className={`k-delta ${deltaClass}`}>{delta}</div>}
    </div>
  );
}

/* ─────────────── PLACEHOLDER VIEW ─────────────── */
function PlaceholderView({ icon, title, sub }) {
  return (
    <div className="placeholder-view">
      <div className="pv-icon">{icon}</div>
      <div className="pv-title">{title}</div>
      <div className="pv-sub">{sub}</div>
    </div>
  );
}

/* ─────────────── FLOOR MAP VIEW ─────────────── */
function FloorMapView({ setView }) {
  const [activeFloor, setActiveFloor] = useState('G');
  const units = floors[activeFloor] || [];
  return (
    <div className="view-panel">
      <div className="section-title">
        <div>
          <h2>Floor &amp; Unit Map</h2>
          <div className="hint">The same layout tenants see in the customer-facing mall guide — colour reflects rent status</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {['G','1','2'].map(f => (
            <button key={f} onClick={() => setActiveFloor(f)}
              style={{padding:'6px 13px',borderRadius:8,fontSize:12,fontWeight:600,border:'1px solid #E4E1D6',cursor:'pointer',
                background: activeFloor===f ? '#2E1065' : '#fff',
                color: activeFloor===f ? '#fff' : '#4B5A50',
                borderColor: activeFloor===f ? '#2E1065' : '#E4E1D6'}}>
              {f === 'G' ? 'Ground' : `Floor ${f}`}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:10}}>
            {units.map(u => (
              <div key={u.n} className={`unit ${u.s}`} style={{height:70}} title={`${u.n} — ${u.t || 'Vacant'}`}>
                <div className="u-name">{u.n}</div>
                <div className="u-tag">{u.t || 'Vacant'}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
            {[['#8B5CF6','Paid up'],['#F2A93B','Due this week'],['#D64545','Overdue'],['#DDD9CC','Vacant']].map(([bg,lbl]) => (
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'#4B5A50',fontWeight:500}}>
                <span style={{width:10,height:10,borderRadius:3,background:bg,display:'inline-block'}}></span> {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:18,marginTop:18}}>
        <div className="card">
          <div className="card-head"><h3>Listed vacancies</h3><div className="hint" style={{marginTop:0}}>Units currently marketed to prospective tenants</div></div>
          <div className="card-body">
            <div className="maint-req-empty" style={{color:'#8A968D',fontSize:12.5,padding:'12px 0'}}>No vacancies listed yet — click a vacant unit on the map to list it.</div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Prospective tenant inquiries</h3><div className="hint" style={{marginTop:0}}>People who reached out about a listed unit</div></div>
          <div className="card-body">
            {[
              {name:'Eric Mugisha',unit:'G-03',msg:'Interested in this unit for a phone accessories shop — is it still available?',meta:'+250 78• ••• 552 · 48 hrs ago'},
              {name:'Solange Uwase',unit:'1F-04',msg:'Looking for a boutique space, can I schedule a viewing?',meta:'+250 72• ••• 810 · 120 hrs ago'},
            ].map(inq => (
              <div key={inq.name} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                <div className="amenity-ic">👤</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.8,fontWeight:600}}>{inq.name} <span style={{fontWeight:500,color:'#8A968D'}}>— Unit {inq.unit}</span></div>
                  <div style={{fontSize:11.5,color:'#4B5A50',marginTop:2}}>{inq.msg}</div>
                  <div style={{fontSize:10.5,color:'#8A968D',marginTop:4}}>{inq.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── OVERVIEW VIEW ─────────────── */
function OverviewView({ setView }) {
  const miniUnits = floors['G'].slice(0, 8);
  return (
    <div className="view-panel">
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:22}}>
        <KPI label="Occupancy" value="42 / 48" delta="▲ 87% units let" deltaClass="up" />
        <KPI label="Rent Collected Today" value="RWF 1.24M" delta="▲ 12% vs yesterday" deltaClass="up" />
        <KPI label="Overdue Balance" value="RWF 380K" delta="5 tenants overdue" deltaClass="down" />
        <KPI label="Deliveries In Progress" value="18" delta="via yoDeals riders" deltaClass="flat" />
        <KPI label="Online Sales Today" value="RWF 2.1M" delta="▲ across 27 storefronts" deltaClass="up" />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:18}}>
        <div className="card">
          <div className="card-head">
            <div><h3>Mall Rent Health — Ground Floor</h3><div className="hint">Live snapshot · click a unit to open its ledger</div></div>
            <button className="link-btn" onClick={() => setView('floormap')}>Open full map →</button>
          </div>
          <div className="card-body">
            <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:8}}>
              {miniUnits.map(u => (
                <div key={u.n} className={`unit ${u.s}`} style={{height:58}} title={`${u.n} — ${u.t || 'Vacant'}`}>
                  <div className="u-name">{u.n}</div>
                  <div className="u-tag">{u.t || 'Vacant'}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
              {[['#8B5CF6','Paid up'],['#F2A93B','Due this week'],['#D64545','Overdue'],['#DDD9CC','Vacant']].map(([bg,lbl]) => (
                <div key={lbl} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'#4B5A50',fontWeight:500}}>
                  <span style={{width:10,height:10,borderRadius:3,background:bg,display:'inline-block'}}></span> {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div><h3>Attention needed</h3><div className="hint">Auto-flagged today</div></div></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            <div className="announce-card" style={{borderColor:'#FBE7E7',background:'#FBE7E7'}}>
              <div><div className="a-title" style={{color:'#D64545'}}>G-14 · Nyabugogo TechHub</div><div className="a-body">Daily repayment overdue by 3 days — RWF 45,000 outstanding.</div></div>
              <button className="btn" style={{background:'#fff'}}>Nudge</button>
            </div>
            <div className="announce-card" style={{borderColor:'#FDF1DC',background:'#FDF1DC'}}>
              <div><div className="a-title" style={{color:'#DB9426'}}>1F-06 · Amasezerano Boutique</div><div className="a-body">Storefront draft not published — invisible on mall guide app.</div></div>
              <button className="btn" style={{background:'#fff'}}>Review</button>
            </div>
            <div className="announce-card">
              <div><div className="a-title">2F-02 · Café Umurava</div><div className="a-body">Maintenance request: AC unit — awaiting technician assignment.</div></div>
              <button className="btn" style={{background:'#fff'}}>Assign</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:18}}>
        <div className="card-head"><div><h3>Rent collection health</h3><div className="hint">Read-only summary — full ledger and payouts are managed by yoMall's platform team</div></div></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'conic-gradient(#8B5CF6 0% 76%, #F2EFE6 76% 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'#FAF8F3',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>76%</div>
            </div>
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              {[['Collected this month','RWF 14.1M'],['Outstanding','RWF 4.5M'],['Tenants overdue','5 of 42']].map(([label,val]) => (
                <div key={label}>
                  <div style={{fontSize:11,color:'#8A968D',fontWeight:600,textTransform:'uppercase',letterSpacing:'.4px'}}>{label}</div>
                  <div style={{fontSize:18,fontWeight:800,marginTop:4}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:12,fontSize:12,color:'#8A968D',borderTop:'1px solid #F2EFE6',paddingTop:10}}>Need the full breakdown or to run a payout? That's handled by yoMall's platform team on your behalf.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── TENANT DIRECTORY VIEW ─────────────── */
function TenantsView() {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Tenant Directory</h2><div className="hint">42 active tenants across 3 floors</div></div>
        <button className="btn primary">+ Onboard tenant</button>
      </div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead>
              <tr><th>Tenant</th><th>Category</th><th>Repayment plan</th><th>Storefront</th><th>Rent status</th><th>Contact</th><th></th></tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(t.name)}</div><div><div className="tname">{t.name}</div><div className="tunit">{t.unit}</div></div></div></td>
                  <td>{t.cat}</td>
                  <td><span className={`freq-pill ${t.plan}`}>{t.plan === 'daily' ? 'Daily' : 'Weekly'}</span></td>
                  <td><Badge type={t.store} label={t.store === 'published' ? 'Published' : 'Draft'} /></td>
                  <td><Badge type={t.rent} label={t.rent === 'paid' ? 'Paid up' : t.rent === 'due' ? 'Due soon' : 'Overdue'} /></td>
                  <td className="mono" style={{fontSize:11.5,color:'#4B5A50'}}>{t.phone}</td>
                  <td><button className="btn ghost" style={{padding:'6px 10px',fontSize:11.5}}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── RENT & PAYMENTS VIEW ─────────────── */
function RentView() {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Rent &amp; Payments</h2><div className="hint">Landlord advances and tenant repayment plans</div></div>
      </div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead>
              <tr><th>Tenant</th><th>Plan</th><th>Per instalment</th><th>Progress</th><th>Balance</th><th>Next due</th><th>Status</th></tr>
            </thead>
            <tbody>
              {ledger.map(l => (
                <tr key={l.name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(l.name)}</div><div><div className="tname">{l.name}</div><div className="tunit">{l.unit}</div></div></div></td>
                  <td><span className={`freq-pill ${l.plan}`}>{l.plan === 'daily' ? 'Daily' : 'Weekly'}</span></td>
                  <td className="mono">RWF {l.per}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className="progress"><div className="fill" style={{width:`${l.pct}%`}}></div></div>
                      <span style={{fontSize:11,color:'#8A968D'}}>{l.pct}%</span>
                    </div>
                  </td>
                  <td className="mono">{l.bal === '0' ? '—' : `RWF ${l.bal}`}</td>
                  <td style={{fontSize:12}}>{l.next}</td>
                  <td><Badge type={l.status} label={l.status === 'paid' ? 'Settled' : l.status === 'due' ? 'Due soon' : 'Overdue'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DELIVERIES VIEW ─────────────── */
function DeliveriesView() {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Deliveries &amp; yoDeals Sales</h2><div className="hint">Monitor online orders and rider status</div></div>
      </div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead>
              <tr><th>Order ID</th><th>Shop</th><th>Item(s)</th><th>Rider</th><th>Status</th><th>Value</th><th>Time</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="rowhover">
                  <td className="mono">{o.id}</td>
                  <td>{o.shop}</td>
                  <td style={{color:'#4B5A50'}}>{o.item}</td>
                  <td>{o.rider}</td>
                  <td><Badge type={o.status === 'transit' ? 'transit' : 'delivered'} label={o.status === 'transit' ? 'In transit' : 'Delivered'} /></td>
                  <td className="mono">RWF {o.val}</td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── STAFF VIEW ─────────────── */
function StaffView() {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>Maintenance &amp; Support</h2><div className="hint">Directory of on-call building staff</div></div>
        <button className="btn primary">+ Add staff member</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {staffList.map(s => (
          <div key={s.name} className="staff-card">
            <div className="staff-top">
              <div className="staff-av">{s.name.split(' ').map(w=>w[0]).join('')}</div>
              <div><div className="staff-name">{s.name}</div><div className="staff-role">{s.role}</div></div>
            </div>
            <div className="staff-status"><span className="sdot" style={{background:s.color}}></span>{s.status}</div>
            <div className="staff-foot">
              <button className="btn ghost" style={{flex:1,justifyContent:'center',padding:'7px',fontSize:11.5}}>Call</button>
              <button className="btn primary" style={{flex:1,justifyContent:'center',padding:'7px',fontSize:11.5}}>Assign task</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── PLATFORM CONSOLE VIEW ─────────────── */
function ConsoleView({ onEnterMall }) {
  return (
    <div className="view-panel">
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:22}}>
        <KPI label="Malls on platform" value="12" delta="▲ 2 onboarded this month" deltaClass="up" />
        <KPI label="Total tenants" value="486" delta="▲ 34 this month" deltaClass="up" />
        <KPI label="Rent advanced platform-wide" value="RWF 210M" delta="across all landlords" deltaClass="flat" />
        <KPI label="Platform MRR" value="RWF 9.6M" delta="▲ 8% MoM" deltaClass="up" />
        <KPI label="Landlord accounts" value="6" delta="1 pending verification" deltaClass="flat" />
      </div>
      <div className="section-title">
        <div><h2>Malls &amp; buildings</h2><div className="hint">Every property running on yoMall — open any of them as if you were the landlord</div></div>
        <button className="btn primary">+ Onboard new mall</button>
      </div>
      <div className="mall-grid">
        {malls.map(m => (
          <div key={m.name} className="mall-card">
            <div className="mall-cover" style={{background:`linear-gradient(135deg, ${m.color}, #2E1065)`}}>
              <div className="mc-plan">{m.plan} plan</div>
            </div>
            <div className="mall-body">
              <div className="mall-name">{m.name}</div>
              <div className="mall-loc">{m.loc}</div>
              <div className="mall-stats">
                <div className="ms"><b>{m.tenants}</b><span>Tenants</span></div>
                <div className="ms"><b>{m.occ}</b><span>Occupied</span></div>
                <div className="ms"><b>{m.gmv}</b><span>GMV RWF</span></div>
              </div>
              <div className="mall-foot">
                <button className="btn ghost" style={{flex:0}}>⋯</button>
                <button className="btn primary" style={{flex:1,justifyContent:'center'}} onClick={() => onEnterMall(m.name)}>Enter dashboard →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── STOREFRONT VIEW ─────────────── */
function StorefrontView() {
  const [shopOpen, setShopOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <div className="view-panel">
      <div className="section-title">
        <div>
          <h2 style={{display:'flex',alignItems:'center'}}>Storefront <Badge type="published" label="Live" /></h2>
          <div className="hint">Editing: <b>Nyabugogo TechHub</b> — G-14 · content publishes straight to the mall guide app</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn ghost" onClick={() => setPreviewOpen(true)}>Preview</button>
          <button className="btn primary">Publish changes</button>
        </div>
      </div>
      <div style={{maxWidth:600}}>
        <div className="card" style={{marginBottom:18}}>
          <div className="card-head"><h3>Shop profile</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Shop name</label><input defaultValue="Nyabugogo TechHub" /></div>
            <div className="form-row"><label>Category</label>
              <select defaultValue="Electronics">
                <option>Electronics</option><option>Fashion</option><option>Food &amp; beverage</option><option>Beauty</option>
              </select>
            </div>
            <div className="form-row"><label>Description</label><textarea defaultValue="Your go-to shop for phones, accessories and gadgets in Kigali." /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row"><label>Opening time</label><input defaultValue="08:00" type="time" /></div>
              <div className="form-row"><label>Closing time</label><input defaultValue="20:00" type="time" /></div>
            </div>
            <div>
              {[['Show in mall guide','Customers can discover your shop',true],['Accept online orders','Receive orders through yoDeals',true],['Show promotions','Display deals on the homepage',false]].map(([lbl,hint,on]) => (
                <div key={lbl} className="toggle-row">
                  <div><div className="t-label">{lbl}</div><div className="t-hint">{hint}</div></div>
                  <div className={`switch ${on ? 'on' : ''}`}><div className="knob"></div></div>
                </div>
              ))}
            </div>
            <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center'}}>Save & publish changes</button>
          </div>
        </div>
      </div>
      
      {previewOpen && (
        <div className="modal-overlay show" onClick={() => setPreviewOpen(false)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-head">
              <div className="pm-title">Live preview</div>
              <button className="pm-close" onClick={() => setPreviewOpen(false)}>✕</button>
            </div>
            <div className="preview-draft-banner show" style={{marginBottom:0}}>⚠ Previewing unpublished changes</div>
            <div style={{transform:'scale(0.95)', transformOrigin:'top center'}}>
              <PhonePreview shopName="Nyabugogo TechHub" shopCategory="Electronics" shopLocation="Unit G-14" isOpen={shopOpen} products={productsData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── TENANT OVERVIEW VIEW ─────────────── */
function TenantOverviewView() {
  return (
    <div className="view-panel">
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        <KPI label="Today's sales" value="RWF 88,400" delta="▲ 14% vs yesterday" deltaClass="up" />
        <KPI label="Orders today" value="11" delta="via yoDeals" deltaClass="flat" />
        <KPI label="Rent balance" value="RWF 57,000" delta="Overdue by 3 days" deltaClass="down" />
        <KPI label="Storefront status" value="Published" delta="Live on mall guide" deltaClass="up" />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:18}}>
        <div className="card">
          <div className="card-head"><div><h3>Recent orders</h3><div className="hint">Latest yoDeals activity for your shop</div></div></div>
          <div className="card-body" style={{paddingTop:10}}>
            <table>
              <thead><tr><th>Order</th><th>Item</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>
                {[['#YD-3391','Earbuds, charger, speaker','52,000','transit'],['#YD-3387','USB-C cable x3','8,400','delivered'],['#YD-3381','Screen protector','3,500','delivered']].map(([id,item,val,status]) => (
                  <tr key={id} className="rowhover">
                    <td className="mono">{id}</td>
                    <td style={{color:'#4B5A50'}}>{item}</td>
                    <td className="mono">RWF {val}</td>
                    <td><Badge type={status === 'transit' ? 'transit' : 'delivered'} label={status === 'transit' ? 'In transit' : 'Delivered'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Rent reminder</h3></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            <div className="announce-card" style={{borderColor:'#FBE7E7',background:'#FBE7E7'}}>
              <div><div className="a-title" style={{color:'#D64545'}}>3 days overdue</div><div className="a-body">RWF 57,000 owed on your daily repayment plan.</div></div>
              <button className="btn" style={{background:'#fff'}}>Pay now</button>
            </div>
            <div className="announce-card">
              <div><div className="a-title">Need a repair?</div><div className="a-body">Request maintenance from our on-call directory.</div></div>
              <button className="btn" style={{background:'#fff'}}>Directory</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── TENANT RENT VIEW ─────────────── */
function TenantRentView() {
  const l = ledger[0];
  return (
    <div className="view-panel">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}}>
        <div className="card" style={{border:'2px solid #FBE7E7',background:'#fffafa'}}>
          <div className="card-body">
            <div className="k-label">Balance owed</div>
            <div className="k-value mono" style={{color:'#D64545'}}>RWF {l.bal}</div>
            <div className="k-delta down">Overdue · next due: {l.next}</div>
            <button className="btn primary" style={{marginTop:14,width:'100%',justifyContent:'center'}}>💳 Pay now via MoMo</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="k-label">Monthly charge breakdown</div>
            {[['Base rent','RWF 450,000'],['CAM charges','RWF 32,000'],['Marketing fund','RWF 12,000'],['Total','RWF 494,000']].map(([label,val],i) => (
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop: i > 0 ? '1px solid #F2EFE6' : 'none',fontWeight: label === 'Total' ? 700 : 500,fontSize:12.8}}>
                <span>{label}</span><span className="mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Repayment plan — Daily</h3><div className="hint" style={{marginTop:2}}>RWF 15,000 per day · 30-day advance</div></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:14}}>
            <div className="progress" style={{width:200,height:8}}><div className="fill" style={{width:`${l.pct}%`}}></div></div>
            <span style={{fontSize:12,fontWeight:600}}>{l.pct}% repaid</span>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {[['Today','15,000','MoMo','overdue'],['Yesterday','15,000','MoMo','paid'],['2 days ago','15,000','MoMo','paid'],['3 days ago','15,000','MoMo','paid']].map(([date,amt,method,status]) => (
                <tr key={date}><td>{date}</td><td className="mono">RWF {amt}</td><td>{status === 'overdue' ? '—' : method}</td><td><Badge type={status === 'paid' ? 'paid' : 'overdue'} label={status === 'paid' ? 'Paid' : 'Missed'} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── TENANT MESSAGES VIEW ─────────────── */
function TenantMessagesView() {
  const [reply, setReply] = useState('');
  const [msgs, setMsgs] = useState([
    {from:'tenant',subject:'Question about CAM charge',body:'Hi, could you clarify what the CAM fee covers this month? Noticed it went up slightly.',at:'2 days ago'},
    {from:'landlord',subject:'Re: Question about CAM charge',body:"Hi Aline — the increase covers the new security shift added to the east entrance. Happy to walk through the breakdown if useful.",at:'1 day ago'},
  ]);
  return (
    <div className="view-panel">
      <div className="card">
        <div className="card-head"><h3>Messages with property manager</h3></div>
        <div className="card-body">
          <div style={{maxHeight:360,overflowY:'auto',marginBottom:14,display:'flex',flexDirection:'column',gap:10}}>
            {msgs.map((m,i) => (
              <div key={i} style={{alignSelf: m.from === 'tenant' ? 'flex-start' : 'flex-end',maxWidth:'75%',background: m.from === 'tenant' ? '#F2EFE6' : '#EDE9FE',borderRadius:12,padding:'10px 13px'}}>
                <div style={{fontSize:10.5,fontWeight:700,color: m.from === 'tenant' ? '#4B5A50' : '#6D28D9',marginBottom:4}}>{m.subject}</div>
                <div style={{fontSize:12.8}}>{m.body}</div>
                <div style={{fontSize:10,color:'#8A968D',marginTop:5}}>{m.from === 'tenant' ? 'You' : 'Shema Katende'} · {m.at}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid #F2EFE6',paddingTop:12}}>
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to your property manager..." style={{width:'100%',border:'1px solid #E4E1D6',borderRadius:9,padding:'9px 11px',fontSize:12.8,fontFamily:'inherit',background:'#FAF8F3',outline:'none',resize:'vertical',minHeight:64,marginBottom:8}} />
            <button className="btn primary" onClick={() => { if(reply.trim()){setMsgs(p=>[...p,{from:'tenant',subject:'Re: your message',body:reply,at:'Just now'}]);setReply('');}}}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── TENANT LEASE VIEW ─────────────── */
function TenantLeaseView() {
  return (
    <div className="view-panel">
      <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:18}}>
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="card-head"><h3>Lease terms</h3></div>
            <div className="card-body">
              {[['Tenant','Nyabugogo TechHub'],['Unit','G-14 · Ground Floor'],['Lease start','1 November 2025'],['Base rent','RWF 450,000 / month'],['CAM charges','RWF 32,000 / month'],['Marketing fund','RWF 12,000 / month'],['Security deposit','RWF 450,000 (held)'],['Payment plan','Daily · RWF 15,000/day']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #F2EFE6',fontSize:12.8}}>
                  <span style={{color:'#8A968D',fontWeight:600}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Insurance compliance</h3></div>
            <div className="card-body">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{fontSize:22}}>🛡️</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12.8}}>liability-insurance-2026.pdf</div>
                  <div style={{fontSize:11,color:'#8A968D',marginTop:2}}>Expires 1 Nov 2026</div>
                </div>
                <span className="badge compliant">Compliant</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><h3>Submit a notice</h3></div>
            <div className="card-body">
              <p style={{fontSize:12.5,color:'#4B5A50',margin:'0 0 14px'}}>Need to give notice to vacate or renew? Submit it here and your property manager will be notified.</p>
              <div className="form-row"><label>Notice type</label><select><option>Notice to renew lease</option><option>Notice to vacate</option></select></div>
              <div className="form-row"><label>Effective date</label><input type="date" /></div>
              <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Submit notice</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── TENANT ORDERS VIEW ─────────────── */
function TenantOrdersView() {
  return (
    <div className="view-panel">
      <div className="section-title">
        <div><h2>My Orders</h2><div className="hint">Online orders placed through yoDeals</div></div>
      </div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead><tr><th>Order ID</th><th>Item(s)</th><th>Customer</th><th>Value</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {[['#YD-3391','Earbuds, charger, speaker','Amina K.','52,000','transit','3 min ago'],['#YD-3387','USB-C cable x3','Jean P.','8,400','delivered','2 hrs ago'],['#YD-3381','Screen protector','Grace M.','3,500','delivered','5 hrs ago'],['#YD-3374','Bluetooth speaker','Eric N.','24,000','delivered','Yesterday']].map(([id,item,cust,val,status,time]) => (
                <tr key={id} className="rowhover">
                  <td className="mono">{id}</td>
                  <td style={{color:'#4B5A50'}}>{item}</td>
                  <td>{cust}</td>
                  <td className="mono">RWF {val}</td>
                  <td><Badge type={status === 'transit' ? 'transit' : 'delivered'} label={status === 'transit' ? 'In transit' : 'Delivered'} /></td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── HANDBOOK VIEW ─────────────── */
function HandbookView() {
  const sections = [
    {title:'Operating hours',body:'The mall is open to the public from 08:00 to 21:00 Monday through Saturday, and 10:00 to 19:00 on Sundays. Tenants must be ready to trade by opening time and must not close early without prior written approval.'},
    {title:'Waste & cleanliness',body:"Each tenant is responsible for keeping their unit and immediate surroundings clean at all times. Waste should be disposed of in designated bins only. Waste collection is carried out at 07:00 and 20:30 daily."},
    {title:'Deliveries & loading bay',body:'All deliveries must be coordinated through the loading bay on the east side of the building. Deliveries are permitted between 06:00 and 09:00 only to avoid disruption during trading hours.'},
    {title:'Noise & conduct',body:'Loud music, megaphones, or any audio equipment that disturbs other tenants or customers is not permitted. All staff must maintain professional conduct at all times.'},
    {title:'Emergency procedures',body:'In the event of a fire or emergency, activate the nearest alarm and proceed to the designated muster point at the north car park. Do not use lifts during emergencies. Familiarise yourself with the evacuation map posted in every unit.'},
  ];
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Tenant Handbook</h2><div className="hint">Building operating rules for all tenants</div></div></div>
      <div className="card">
        <div className="card-body">
          {sections.map((s,i) => (
            <div key={s.title} style={{padding:'14px 0',borderTop: i > 0 ? '1px solid #F2EFE6' : 'none'}}>
              <div style={{fontSize:13.5,fontWeight:700,marginBottom:6}}>📋 {s.title}</div>
              <div style={{fontSize:12.8,color:'#4B5A50',lineHeight:1.7}}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── GUIDE VIEW ─────────────── */
function GuideView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Mall Guide Content</h2><div className="hint">Wayfinding, amenities and customer announcements</div></div>
        <button className="btn primary">+ New announcement</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:18}}>
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="card-head"><h3>Active announcements</h3></div>
            <div className="card-body">
              {[
                {title:'Weekend food festival 🍴',body:'Enjoy discounts at all F&B tenants this Saturday from 12:00–18:00. Free entry.',meta:'Posted 2 days ago · Pinned'},
                {title:'New tenant: Amara Optics 👓',body:'Welcome Amara Optics to Unit 1F-08! Stop by for prescription glasses and sunglasses.',meta:'Posted 5 days ago'},
              ].map(a => (
                <div key={a.title} className="announce-card">
                  <div><div className="a-title">{a.title}</div><div className="a-body">{a.body}</div><div className="a-meta">{a.meta}</div></div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}><button className="btn ghost" style={{padding:'6px 10px',fontSize:11}}>Edit</button><button className="btn ghost" style={{padding:'6px 10px',fontSize:11,color:'#D64545'}}>Remove</button></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Amenities directory</h3></div>
            <div className="card-body">
              {[['🅿️','Car parking','Level B1 · 120 bays · RWF 500/hr'],['🚻','Restrooms','Every floor · east wing'],['🏧','ATMs','Ground floor near main entrance'],['🔒','Prayer room','Floor 2 · open 06:00–22:00'],['🍽️','Food court','Floor 2 · 8 F&B tenants']].map(([ic,name,sub]) => (
                <div key={name} className="amenity-row">
                  <div className="amenity-left"><div className="amenity-ic">{ic}</div><div><div className="amenity-name">{name}</div><div className="amenity-sub">{sub}</div></div></div>
                  <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Post an announcement</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Title</label><input placeholder="e.g. Weekend promotion" /></div>
            <div className="form-row"><label>Message</label><textarea placeholder="What do you want mall visitors to know?" /></div>
            <div className="form-row"><label>Pin to top?</label><select><option>No — show in order</option><option>Yes — pin to top</option></select></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Publish announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── RENEWALS VIEW ─────────────── */
function RenewalsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Lease Renewals</h2><div className="hint">Upcoming lease expirations across your building</div></div></div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead><tr><th>Tenant</th><th>Unit</th><th>Lease expiry</th><th>Days remaining</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {[['Coko Bookshop','G-10','1 Nov 2026',90,'on-track'],['Café Umurava','2F-02','1 Sep 2026',29,'due-soon'],['Muraho Electronics','G-04','10 Mar 2027',219,'on-track'],['Amasezerano Boutique','1F-06','15 Jun 2027',315,'on-track']].map(([name,unit,exp,days,status]) => (
                <tr key={name} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(name)}</div><div className="tname">{name}</div></div></td>
                  <td className="mono">{unit}</td>
                  <td>{exp}</td>
                  <td><span style={{fontWeight:700,color: days < 60 ? '#D64545' : '#8A968D'}}>{days} days</span></td>
                  <td><Badge type={days < 60 ? 'due' : 'paid'} label={days < 60 ? 'Expiring soon' : 'On track'} /></td>
                  <td><button className="btn ghost" style={{padding:'6px 10px',fontSize:11.5}}>Send renewal</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── REPORTS VIEW ─────────────── */
function ReportsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Reports</h2><div className="hint">Export building data for your own records</div></div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        {[
          {icon:'📊',title:'Rent collection report',sub:'Monthly rent collected, outstanding balances and payment plan progress',btn:'Export CSV'},
          {icon:'🏢',title:'Occupancy report',sub:'Current occupancy by floor, unit status and vacancy summary',btn:'Export CSV'},
          {icon:'📦',title:'Delivery & sales report',sub:'yoDeals order volumes, GMV and rider performance for this month',btn:'Export CSV'},
          {icon:'📋',title:'Tenant directory export',sub:'Full list of tenants with contact info, lease dates and rent status',btn:'Export CSV'},
        ].map(r => (
          <div key={r.title} className="card">
            <div className="card-body" style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{fontSize:28,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5,marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:12,color:'#4B5A50',marginBottom:12}}>{r.sub}</div>
                <button className="btn primary">{r.btn}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── TEAM VIEW ─────────────── */
function TeamView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Team</h2><div className="hint">People with access to manage this building</div></div>
        <button className="btn primary">+ Invite team member</button>
      </div>
      <div className="card">
        <div className="card-body">
          {[['Shema Katende','shema@edupoto.rw','SK','Owner · full access'],['Marie Uwimana','marie@edupoto.rw','MU','Manager · can view & edit'],['Paul Nshimiyimana','paul@edupoto.rw','PN','Finance · read-only']].map(([name,email,av,role]) => (
            <div key={name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="avatar-sm" style={{width:36,height:36,fontSize:13}}>{av}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{name}</div><div style={{fontSize:11.5,color:'#8A968D'}}>{email} · {role}</div></div>
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DOCUMENTS VIEW ─────────────── */
function DocumentsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Documents</h2><div className="hint">Compliance certificates and building documents</div></div>
        <button className="btn primary">+ Upload document</button>
      </div>
      <div className="card">
        <div className="card-body">
          {[['📄','Building occupancy certificate','Issued by City of Kigali · Expires Dec 2026','compliant','Compliant'],['🔥','Fire safety certificate','Issued by Rwanda National Police · Expires Jun 2026','compliant','Compliant'],['⚡','Electrical compliance certificate','Issued by RURA · Expires Oct 2025','overdue','Expired'],['🛡️','Insurance policy','Building & public liability · Expires Jan 2027','compliant','Compliant']].map(([ic,name,sub,badgeType,badgeLabel]) => (
            <div key={name} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F2EFE6'}}>
              <div className="amenity-ic" style={{flexShrink:0}}>{ic}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{name}</div><div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{sub}</div></div>
              <Badge type={badgeType} label={badgeLabel} />
              <button className="btn ghost" style={{padding:'5px 10px',fontSize:11.5}}>⬇</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── YODEALS VIEW ─────────────── */
function YoDealsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Post to yoDeals</h2><div className="hint">Special offers and discounts — not a full product catalogue</div></div></div>
      <div style={{display:'grid',gridTemplateColumns:'1.3fr 0.9fr',gap:18}}>
        <div className="card">
          <div className="card-head"><h3>New deal</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Headline</label><input placeholder="e.g. 20% off all accessories today only" /></div>
            <div className="form-row"><label>Description</label><textarea placeholder="Describe what's on offer and any terms..." /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-row"><label>Original price (RWF)</label><input type="number" placeholder="50000" /></div>
              <div className="form-row"><label>Deal price (RWF)</label><input type="number" placeholder="40000" /></div>
            </div>
            <div className="form-row"><label>Valid until</label><input type="date" /></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>🏷️ Post deal</button>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-head"><h3>Active deals</h3></div>
            <div className="card-body">
              {[['20% off all chargers','Valid until 25 Jul','2 days left'],['Free delivery over RWF 20K','Ongoing','No expiry']].map(d => (
                <div key={d[0]} style={{padding:'10px 0',borderBottom:'1px solid #F2EFE6'}}>
                  <div style={{fontWeight:700,fontSize:12.8}}>{d[0]}</div>
                  <div style={{fontSize:11,color:'#8A968D',marginTop:2}}>{d[1]} · {d[2]}</div>
                  <button className="btn ghost" style={{padding:'4px 8px',fontSize:11,marginTop:6,color:'#D64545'}}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── LOGIN SCREEN ─────────────── */
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('landlord');
  const [pw, setPw] = useState('1234');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const emails = { landlord: 'shema@edupoto.rw', tenant: 'nyabugogotech@tenant.yomall.africa', superadmin: 'admin@yomall.africa' };
  const labels = { landlord: 'Work email', tenant: 'Shop email', superadmin: 'Admin email' };

  function attempt() {
    if (pw !== '1234') { setError(true); return; }
    setError(false);
    onLogin(role);
  }

  return (
    <div style={{minHeight:'100vh',width:'100%',display:'grid',gridTemplateColumns:'1fr 460px',background:'#FAF8F3'}}>
      {/* Left brand panel */}
      <div style={{background:'linear-gradient(165deg, rgba(46,16,101,0.94), rgba(76,29,149,0.87) 45%, rgba(109,40,217,0.74)), #2E1065',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'48px 56px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:42,height:42,borderRadius:11,background:'#F2A93B',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,color:'#2E1065'}}>yM</div>
          <div style={{fontWeight:700,fontSize:20,color:'#fff'}}>yoMall</div>
        </div>
        <div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:16,fontWeight:600}}>Property Management Platform</div>
          <div style={{fontSize:40,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:20}}>The smarter way to run your mall.</div>
          <div style={{fontSize:15,color:'rgba(255,255,255,0.7)',lineHeight:1.7}}>From rent collection to storefront management — everything your building needs, in one place.</div>
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>© 2026 Edupoto Rwanda Ltd · yoMall is part of the yoGuide platform</div>
      </div>

      {/* Right login panel */}
      <div style={{background:'#fff',display:'flex',flexDirection:'column',justifyContent:'center',padding:'48px 44px'}}>
        <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'#8A968D',marginBottom:8}}>Sign in</div>
        <h1 style={{fontSize:28,fontWeight:800,margin:'0 0 4px',color:'#1C2B22'}}>Welcome back</h1>
        <div style={{fontSize:14,color:'#8A968D',marginBottom:28}}>Choose how you're accessing yoMall</div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:22}}>
          {[['landlord','🏢','Landlord','Manage your building'],['tenant','🛍️','Tenant','Run your shop'],['superadmin','🛡️','Superadmin','Manage the platform']].map(([r,ic,lbl,sub]) => (
            <div key={r} onClick={() => setRole(r)} style={{border:`1.5px solid ${role===r ? '#8B5CF6' : '#E4E1D6'}`,borderRadius:10,padding:'12px 10px',textAlign:'center',cursor:'pointer',background: role===r ? '#F5F3FF' : '#fff',transition:'all .15s'}}>
              <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
              <div style={{fontWeight:700,fontSize:13}}>{lbl}</div>
              <div style={{fontSize:10.5,color:'#8A968D',marginTop:2}}>{sub}</div>
            </div>
          ))}
        </div>

        {error && <div style={{background:'#FBE7E7',color:'#D64545',padding:'10px 13px',borderRadius:9,fontSize:12.5,marginBottom:14}}>Incorrect password. Use <b>1234</b> for this demo.</div>}

        <div className="form-row">
          <label>{labels[role]}</label>
          <input value={emails[role]} readOnly style={{color:'#8A968D'}} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <div style={{position:'relative'}}>
            <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => { setPw(e.target.value); setError(false); }} onKeyDown={e => e.key === 'Enter' && attempt()} style={{paddingRight:44}} />
            <button type="button" onClick={() => setShowPw(p => !p)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16}}>👁</button>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12.5,cursor:'pointer'}}>
            <input type="checkbox" defaultChecked /> Keep me signed in
          </label>
          <a href="#" style={{fontSize:12.5,color:'#8B5CF6',fontWeight:600,textDecoration:'none'}}>Forgot password?</a>
        </div>

        <button onClick={attempt} style={{width:'100%',padding:'12px',background:'#8B5CF6',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',transition:'background .15s'}}
          onMouseEnter={e => e.target.style.background='#6D28D9'} onMouseLeave={e => e.target.style.background='#8B5CF6'}>
          Sign in to yoMall →
        </button>

        <div style={{marginTop:18,background:'#F2EFE6',borderRadius:10,padding:'12px 14px',fontSize:12,color:'#4B5A50'}}>
          Demo credentials — any email works. Password is always <b>1234</b>.<br/>
          Switch the toggle above to try <b>Landlord</b> (single mall) or <b>Superadmin</b> (whole platform) view.
        </div>
      </div>
    </div>
  );
}

/* ─────────────── LANDLORDS VIEW ─────────────── */
function LandlordsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Landlords</h2><div className="hint">Landlord accounts, business verification and payout details across the platform</div></div></div>
      <div className="card">
        <div className="card-body" style={{paddingTop:16}}>
          {[
            {init:'SK',name:'Shema Katende',sub:'Kigali Convention Mall · shema@edupoto.rw · +250 78• ••• 001 · Bank of Kigali •••• 4471',status:'verified'},
            {init:'JB',name:'Jean Bosco Habimana',sub:'Musanze Heritage Plaza · jbosco@musanzeheritage.rw · +250 78• ••• 002 · Equity Bank •••• 2210',status:'kybpending'},
            {init:'AU',name:'Alice Uwimana',sub:'Huye Trade Center · alice@huyetrade.rw · +250 78• ••• 003 · Bank of Kigali •••• 7734',status:'verified'},
            {init:'PN',name:'Patrick Nsengimana',sub:'Remera Business Arcade · patrick@remerabiz.rw · +250 78• ••• 004 · I&M Bank •••• 5563',status:'verified'},
            {init:'MC',name:'Marie Claire Ingabire',sub:'Rubavu Lakeside Mall · marieclaire@rubavulakeside.rw · +250 78• ••• 005 · Bank of Kigali •••• 9021',status:'verified'},
            {init:'EM',name:'Eric Mugabo',sub:'Nyamirambo Craft Market · eric@nyamiramboarts.rw · +250 78• ••• 006 · Not yet linked',status:'rejected'}
          ].map((l, i) => (
            <div key={i} style={{display:'flex',gap:12,padding:'12px 0',borderBottom: i < 5 ? '1px solid #F2EFE6' : 'none',alignItems:'center'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'#FAF8F3',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>{l.init}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5}}>{l.name}</div>
                <div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>{l.sub}</div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <Badge type={l.status === 'verified' ? 'published' : l.status === 'kybpending' ? 'due' : 'overdue'} label={l.status === 'verified' ? 'Verified' : l.status === 'kybpending' ? 'KYB pending' : 'Rejected'} />
                <button className="btn ghost" style={{padding:'6px 10px',fontSize:11,color:'#D64545',borderColor:'#FBE7E7'}}>Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── LENDING VIEW ─────────────── */
function LendingView() {
  return (
    <div className="view-panel">
      <div className="context-banner sa-flex" style={{background:'#3A2E12'}}>
        <div className="cb-left" style={{color:'#FDF1DC',fontSize:12.5}}>🏦 Lending partner module — visible to superadmin only. Not accessible by landlords or tenants.</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22,marginTop:18}}>
        <KPI label="Portfolio disbursed" value="RWF 280,000" delta="across all malls" deltaClass="flat" />
        <KPI label="Active loans" value="1" delta="approved & disbursed" deltaClass="flat" />
        <KPI label="Pending review" value="1" delta="awaiting KYC decision" deltaClass="down" />
        <KPI label="Rejected" value="1" delta="did not meet criteria" deltaClass="flat" />
      </div>
      <div className="section-title">
        <div><h2>Loan applications</h2><div className="hint">rentAdvance requests submitted by tenants across every mall on the platform</div></div>
      </div>
      <div className="card" style={{marginBottom:22}}>
        <div className="card-body" style={{paddingTop:16}}>
          <table>
            <thead><tr><th>Applicant</th><th>Mall / Unit</th><th>Amount</th><th>Term</th><th>KYC</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
            <tbody>
              {[['Amasezerano Boutique','Musanze Heritage Plaza · 1F-06','280,000','4 weeks · Weekly','Partial','Approved','144 hrs ago'],
                ['Huye Print & Copy','Huye Trade Center · G-08','150,000','30 days · Daily','Partial','Pending review','48 hrs ago'],
                ['Remera Fashion House','Remera Business Arcade · 2F-11','600,000','4 weeks · Weekly','Partial','Rejected','216 hrs ago']
              ].map((r,i) => (
                <tr key={i} className="rowhover">
                  <td><div className="cell-tenant"><div className="avatar-sm">{initials(r[0])}</div><div className="tname">{r[0]}</div></div></td>
                  <td>{r[1]}</td>
                  <td className="mono">RWF {r[2]}</td>
                  <td>{r[3]}</td>
                  <td><Badge type="due" label={r[4]} /></td>
                  <td><Badge type={r[5] === 'Approved' ? 'paid' : r[5] === 'Rejected' ? 'overdue' : 'due'} label={r[5]} /></td>
                  <td style={{fontSize:11.5,color:'#8A968D'}}>{r[6]}</td>
                  <td><button className="btn ghost" style={{padding:'5px 10px',fontSize:11}}>Review →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-title"><div><h2>Portfolio risk &amp; exposure</h2><div className="hint">Capital currently outstanding, by how overdue it is</div></div></div>
      <div className="card">
        <div className="card-body">
          {[['Current (not yet due)','0%','#8B5CF6','0'],['1–30 days overdue','100%','#F2A93B','280,000'],['31–60 days overdue','0%','#F5720A','0'],['60+ days overdue','0%','#D64545','0']].map((e,i) => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'150px 1fr 100px',gap:16,alignItems:'center',padding:'8px 0'}}>
              <div style={{fontSize:12.8,fontWeight:600}}>{e[0]}</div>
              <div style={{height:8,background:'#F2EFE6',borderRadius:4,overflow:'hidden'}}><div style={{width:e[1],height:'100%',background:e[2]}}></div></div>
              <div className="mono" style={{textAlign:'right',fontSize:12.8}}>RWF {e[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── PERFORMANCE VIEW ─────────────── */
function PerformanceView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Mall Performance</h2><div className="hint">Operational SLA metrics — spot which malls need help before it becomes a problem</div></div></div>
      <div className="card">
        <div className="card-body">
          {[
            {name:'Kigali Convention Mall',occ:'87%',maint:'6.5h',msg:'2.1h',t:42,ms:'paid',msgs:'paid'},
            {name:'Musanze Heritage Plaza',occ:'71%',maint:'14.2h',msg:'6.8h',t:24,ms:'due',msgs:'due'},
            {name:'Huye Trade Center',occ:'92%',maint:'5.1h',msg:'1.8h',t:36,ms:'paid',msgs:'paid'},
            {name:'Remera Business Arcade',occ:'95%',maint:'4.3h',msg:'1.2h',t:51,ms:'paid',msgs:'paid'},
            {name:'Rubavu Lakeside Mall',occ:'64%',maint:'19.6h',msg:'9.4h',t:19,ms:'overdue',msgs:'overdue'},
            {name:'Nyamirambo Craft Market',occ:'38%',maint:'28h',msg:'15.5h',t:11,ms:'overdue',msgs:'overdue'}
          ].map((p,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom: i < 5 ? '1px solid #F2EFE6' : 'none'}}>
              <div style={{flex:1.5,fontWeight:700,fontSize:13.5}}>{p.name}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}>{p.occ}</div><div style={{fontSize:11,color:'#8A968D'}}>Occupancy</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}><Badge type={p.ms} label={p.maint} /></div><div style={{fontSize:11,color:'#8A968D'}}>Avg. maintenance</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}><Badge type={p.msgs} label={p.msg} /></div><div style={{fontSize:11,color:'#8A968D'}}>Avg. response</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14.5}}>{p.t}</div><div style={{fontSize:11,color:'#8A968D'}}>Tenants</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MODERATION VIEW ─────────────── */
function ModerationView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Deal Moderation</h2><div className="hint">Every deal is reviewed before it appears live on yoDeals</div></div></div>
      <div className="card">
        <div className="card-body">
          <div style={{display:'flex',gap:12,padding:'12px 0',alignItems:'center'}}>
            <div style={{width:40,height:40,borderRadius:9,background:'#FBE7E7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🏷️</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13.5}}>Buy a Power Bank, get a free cable</div>
              <div style={{fontSize:11.5,color:'#8A968D',marginTop:2}}>Nyabugogo TechHub · BOGO</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn ghost" style={{color:'#D64545',borderColor:'#FBE7E7',padding:'6px 10px',fontSize:11}}>Reject</button>
              <button className="btn primary" style={{padding:'6px 10px',fontSize:11}}>Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── ESCALATIONS VIEW ─────────────── */
function EscalationsView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Escalations</h2><div className="hint">Disputes raised by a landlord when tenant-landlord messaging doesn't resolve things</div></div></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No escalations — all tenant-landlord issues are resolving directly.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── BROADCAST VIEW ─────────────── */
function BroadcastView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Broadcast</h2><div className="hint">Send a notice to every landlord or every tenant on the platform</div></div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div className="card">
          <div className="card-head"><h3>Compose broadcast</h3></div>
          <div className="card-body">
            <div className="form-row"><label>Send to</label><select><option>All landlords</option><option>All tenants</option><option>Everyone</option></select></div>
            <div className="form-row"><label>Subject</label><input placeholder="e.g. Scheduled maintenance this weekend" /></div>
            <div className="form-row"><label>Message</label><textarea placeholder="Write your announcement..." /></div>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>📣 Send broadcast</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Broadcast history</h3></div>
          <div className="card-body">
            <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No broadcasts sent yet.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── PRIVACY VIEW ─────────────── */
function PrivacyView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Privacy &amp; Data</h2><div className="hint">Manage KYC documents stored on the platform — export or delete on request</div></div></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No KYC documents currently stored.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── AUDIT VIEW ─────────────── */
function AuditView() {
  return (
    <div className="view-panel">
      <div className="section-title"><div><h2>Audit Log</h2><div className="hint">Every administrative action taken on the platform, most recent first</div></div><button className="btn ghost">⬇ Export CSV</button></div>
      <div className="card">
        <div className="card-body">
          <div style={{color:'#8A968D',fontSize:12.5,padding:'12px 0',textAlign:'center'}}>No administrative actions recorded yet.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN APP ─────────────── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState('landlord');
  const [currentView, setCurrentView] = useState('overview');
  const [viewHistory, setViewHistory] = useState([]);
  const [mallName, setMallName] = useState('Kigali Convention Mall');

  const navigate = useCallback((view) => {
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, [currentView]);

  const goBack = useCallback(() => {
    if (viewHistory.length === 0) return;
    const prev = viewHistory[viewHistory.length - 1];
    setViewHistory(p => p.slice(0, -1));
    setCurrentView(prev);
    window.scrollTo(0, 0);
  }, [viewHistory]);

  const handleLogin = (role) => {
    setCurrentRole(role);
    setCurrentView(role === 'superadmin' ? 'console' : role === 'tenant' ? 't-overview' : 'overview');
    setViewHistory([]);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentRole('landlord');
    setCurrentView('overview');
    setViewHistory([]);
  };

  const enterMall = (name) => {
    setMallName(name);
    navigate('overview');
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  const titleEntry = titles[currentView] || ['yoMall', ''];
  const showBanner = currentRole === 'superadmin' && currentView !== 'console' && currentView !== 'landlords' && currentView !== 'lending' && currentView !== 'performance' && currentView !== 'moderation' && currentView !== 'escalations' && currentView !== 'broadcast' && currentView !== 'privacy' && currentView !== 'audit';

  function renderView() {
    switch (currentView) {
      case 'overview':     return <OverviewView setView={navigate} />;
      case 'floormap':     return <FloorMapView setView={navigate} />;
      case 'tenants':      return <TenantsView />;
      case 'rent':         return <RentView />;
      case 'deliveries':   return <DeliveriesView />;
      case 'staff':        return <StaffView />;
      case 'guide':        return <GuideView />;
      case 'renewals':     return <RenewalsView />;
      case 'reports':      return <ReportsView />;
      case 'team':         return <TeamView />;
      case 'documents':    return <DocumentsView />;
      case 'handbook':     return <HandbookView />;
      case 'storefront':   return <StorefrontView />;
      case 'yodeals':      return <YoDealsView />;
      case 'console':      return <ConsoleView onEnterMall={enterMall} />;
      case 't-overview':   return <TenantOverviewView />;
      case 't-orders':     return <TenantOrdersView />;
      case 't-rent':       return <TenantRentView />;
      case 't-lease':      return <TenantLeaseView />;
      case 't-messages':   return <TenantMessagesView />;
      case 'landlords':    return <LandlordsView />;
      case 'lending':      return <LendingView />;
      case 'performance':  return <PerformanceView />;
      case 'moderation':   return <ModerationView />;
      case 'escalations':  return <EscalationsView />;
      case 'broadcast':    return <BroadcastView />;
      case 'privacy':      return <PrivacyView />;
      case 'audit':        return <AuditView />;
      default:             return <PlaceholderView icon="🏗️" title="Coming soon" sub="This view is under construction." />;
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar currentRole={currentRole} currentView={currentView} setView={navigate} onLogout={handleLogout} />
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
        <Topbar
          title={titleEntry[0]}
          subtitle={currentView === 'overview' ? `${mallName} · Sunday, 19 July 2026` : titleEntry[1]}
          canGoBack={viewHistory.length > 0}
          onBack={goBack}
        />
        <main style={{padding:'24px 26px 60px'}}>
          {showBanner && (
            <div className="context-banner">
              <div>🛡️ Superadmin session — currently viewing <b>{mallName}</b>'s dashboard as the platform operator.</div>
              <button onClick={() => navigate('console')}>← Back to Platform Console</button>
            </div>
          )}
          {renderView()}
        </main>
      </div>
    </div>
  );
}
