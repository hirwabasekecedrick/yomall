'use client';

export const DAY = 86400000;
export const MIN = 60000;

/* ──── helpers ──── */
export function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('');
}
export function relTime(ms) {
  const diff = Date.now() - ms;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + ' min ago';
  const hrs = Math.round(mins / 60);
  return hrs + (hrs === 1 ? ' hr ago' : ' hrs ago');
}
export function orderSubtotal(order) { return order.items.reduce((s, i) => s + i.qty * i.price, 0); }
export function orderTotal(order) { return orderSubtotal(order) + order.deliveryFee; }
export function orderItemsSummary(order) { return order.items.map(i => i.name + (i.qty > 1 ? ` ×${i.qty}` : '')).join(', '); }
export function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(cell => {
    const s = String(cell == null ? '' : cell).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  }).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ──── Floor data ──── */
export const initialFloors = {
  G: [
    { n: 'G-01', s: 'paid', t: 'Boutique' }, { n: 'G-02', s: 'paid', t: 'Café' }, { n: 'G-03', s: 'vacant', t: '' }, { n: 'G-04', s: 'paid', t: 'Electronics' },
    { n: 'G-05', s: 'due', t: 'Salon' }, { n: 'G-06', s: 'paid', t: 'Bakery' }, { n: 'G-07', s: 'paid', t: 'Pharmacy' }, { n: 'G-08', s: 'paid', t: 'Fashion' },
    { n: 'G-09', s: 'overdue', t: 'Phone repair' }, { n: 'G-10', s: 'paid', t: 'Bookshop' }, { n: 'G-11', s: 'paid', t: 'Toys' }, { n: 'G-12', s: 'vacant', t: '' },
    { n: 'G-13', s: 'due', t: 'Shoes' }, { n: 'G-14', s: 'overdue', t: 'TechHub' }, { n: 'G-15', s: 'paid', t: 'Jewelry' }, { n: 'G-16', s: 'paid', t: 'Stationery' },
  ],
  '1': [
    { n: '1F-01', s: 'paid', t: 'Boutique' }, { n: '1F-02', s: 'paid', t: 'Tailor' }, { n: '1F-03', s: 'paid', t: 'Perfume' }, { n: '1F-04', s: 'vacant', t: '' },
    { n: '1F-05', s: 'paid', t: 'Sports' }, { n: '1F-06', s: 'due', t: 'Amasezerano Boutique' }, { n: '1F-07', s: 'paid', t: 'Furniture' }, { n: '1F-08', s: 'paid', t: 'Optics' },
    { n: '1F-09', s: 'overdue', t: 'Salon' }, { n: '1F-10', s: 'paid', t: 'Gifts' }, { n: '1F-11', s: 'vacant', t: '' }, { n: '1F-12', s: 'paid', t: 'Kids wear' },
    { n: '1F-13', s: 'paid', t: 'Art studio' }, { n: '1F-14', s: 'paid', t: 'Watches' }, { n: '1F-15', s: 'due', t: 'Beauty' }, { n: '1F-16', s: 'paid', t: 'Home decor' },
  ],
  '2': [
    { n: '2F-01', s: 'paid', t: 'Cinema snacks' }, { n: '2F-02', s: 'paid', t: 'Café Umurava' }, { n: '2F-03', s: 'paid', t: 'Games lounge' }, { n: '2F-04', s: 'vacant', t: '' },
    { n: '2F-05', s: 'paid', t: 'Coworking' }, { n: '2F-06', s: 'paid', t: 'Print shop' }, { n: '2F-07', s: 'due', t: 'Fitness' }, { n: '2F-08', s: 'paid', t: 'Bank kiosk' },
    { n: '2F-09', s: 'paid', t: 'Kids play' }, { n: '2F-10', s: 'vacant', t: '' }, { n: '2F-11', s: 'paid', t: 'Bar' }, { n: '2F-12', s: 'paid', t: 'Restaurant' },
    { n: '2F-13', s: 'paid', t: 'Ice cream' }, { n: '2F-14', s: 'paid', t: 'Restaurant' }, { n: '2F-15', s: 'vacant', t: '' }, { n: '2F-16', s: 'paid', t: 'Barber' },
  ],
};

/* ──── Tenants ──── */
export const initialTenants = [
  { name: 'Nyabugogo TechHub', unit: 'G-14', cat: 'Electronics', plan: 'daily', store: 'published', rent: 'overdue', phone: '+250 78• ••• 214' },
  { name: 'Amasezerano Boutique', unit: '1F-06', cat: 'Fashion', plan: 'weekly', store: 'draft', rent: 'due', phone: '+250 72• ••• 890' },
  { name: 'Café Umurava', unit: '2F-02', cat: 'Food & beverage', plan: 'daily', store: 'published', rent: 'paid', phone: '+250 78• ••• 331' },
  { name: 'Muraho Electronics', unit: 'G-04', cat: 'Electronics', plan: 'weekly', store: 'published', rent: 'paid', phone: '+250 73• ••• 122' },
  { name: 'Ikirenga Salon', unit: 'G-05', cat: 'Beauty', plan: 'daily', store: 'published', rent: 'due', phone: '+250 78• ••• 045' },
  { name: 'Zamu Phone Repair', unit: 'G-09', cat: 'Electronics', plan: 'daily', store: 'draft', rent: 'overdue', phone: '+250 79• ••• 671' },
  { name: 'Coko Bookshop', unit: 'G-10', cat: 'Books & stationery', plan: 'weekly', store: 'published', rent: 'paid', phone: '+250 78• ••• 500' },
];

/* ──── Ledger ──── */
export const initialLedger = [
  { name: 'Nyabugogo TechHub', unit: 'G-14', plan: 'daily', per: '15,000', pct: 62, bal: '57,000', next: 'Tomorrow', status: 'overdue' },
  { name: 'Amasezerano Boutique', unit: '1F-06', plan: 'weekly', per: '180,000', pct: 80, bal: '144,000', next: 'Fri 24 Jul', status: 'due' },
  { name: 'Muraho Electronics', unit: 'G-04', plan: 'weekly', per: '260,000', pct: 100, bal: '0', next: 'Fri 24 Jul', status: 'paid' },
  { name: 'Ikirenga Salon', unit: 'G-05', plan: 'daily', per: '12,000', pct: 70, bal: '36,000', next: 'Today', status: 'due' },
  { name: 'Zamu Phone Repair', unit: 'G-09', plan: 'daily', per: '18,000', pct: 40, bal: '108,000', next: 'Overdue 4d', status: 'overdue' },
  { name: 'Coko Bookshop', unit: 'G-10', plan: 'weekly', per: '150,000', pct: 100, bal: '0', next: 'Fri 24 Jul', status: 'paid' },
];

/* ──── Orders ──── */
export const initialOrders = [
  { id: '#YD-3391', shop: 'Nyabugogo TechHub', item: 'Earbuds, charger, speaker', rider: 'E. Niyonzima', status: 'transit', val: '52,000', time: '3 min ago' },
  { id: '#YD-3390', shop: 'Café Umurava', item: '2x Cappuccino, muffin', rider: 'J. Uwase', status: 'delivered', val: '5,200', time: '12 min ago' },
  { id: '#YD-3389', shop: 'Muraho Electronics', item: 'Phone charger', rider: '—', status: 'transit', val: '9,000', time: '14 min ago' },
  { id: '#YD-3388', shop: 'Ikirenga Salon', item: 'Home braiding booking', rider: 'D. Habimana', status: 'delivered', val: '12,000', time: '29 min ago' },
  { id: '#YD-3387', shop: 'Coko Bookshop', item: 'Notebook set', rider: 'E. Niyonzima', status: 'transit', val: '4,800', time: '33 min ago' },
];

/* ──── Staff ──── */
export const initialStaff = [
  { name: 'Eugene Niyonzima', role: 'Electrician', status: 'Available', color: '#8B5CF6' },
  { name: 'Jeanne Uwase', role: 'Cleaning supervisor', status: 'On duty', color: '#8B5CF6' },
  { name: 'Didier Habimana', role: 'Plumber', status: 'Busy — G-09', color: '#F2A93B' },
  { name: 'Aline Mukamana', role: 'Security lead', status: 'On duty', color: '#8B5CF6' },
  { name: 'Patrick Ndayisenga', role: 'IT / POS support', status: 'Available', color: '#8B5CF6' },
  { name: 'Claudine Ingabire', role: 'HVAC technician', status: 'Off shift', color: '#8A968D' },
];

/* ──── Tenant profiles (extended data for management modal) ──── */
export const initialTenantProfiles = {
  'Nyabugogo TechHub': { email: 'nyabugogotech@tenant.yomall.africa', leaseStart: '2025-11-01', monthlyRent: 450000, cam: 32000, marketingFund: 12000, deposit: 450000, suspended: false, notes: [], insurance: { status: 'compliant', fileName: 'liability-insurance-2026.pdf', expiry: '2026-11-01' }, noticeStatus: null, rentNotices: [], messages: [{ id: 1, from: 'tenant', subject: 'Question about CAM charge', body: 'Hi, could you clarify what the CAM fee covers this month? Noticed it went up slightly.', at: Date.now() - 2 * DAY }, { id: 2, from: 'landlord', subject: 'Re: Question about CAM charge', body: 'Hi Aline — the increase covers the new security shift added to the east entrance. Happy to walk through the breakdown if useful.', at: Date.now() - DAY }] },
  'Amasezerano Boutique': { email: 'amasezerano@tenant.yomall.africa', leaseStart: '2025-06-15', monthlyRent: 520000, cam: 28000, marketingFund: 14000, deposit: 520000, suspended: false, notes: [], insurance: { status: 'expiring', fileName: 'insurance-cert-2025.pdf', expiry: '2026-08-20' }, noticeStatus: null, rentNotices: [], messages: [] },
  'Café Umurava': { email: 'cafeumurava@tenant.yomall.africa', leaseStart: '2024-09-01', monthlyRent: 380000, cam: 24000, marketingFund: 9000, deposit: 380000, suspended: false, notes: [], insurance: { status: 'compliant', fileName: 'cafe-umurava-insurance.pdf', expiry: '2027-02-01' }, noticeStatus: null, rentNotices: [], messages: [] },
  'Muraho Electronics': { email: 'murahoelectronics@tenant.yomall.africa', leaseStart: '2023-03-10', monthlyRent: 600000, cam: 38000, marketingFund: 16000, deposit: 600000, suspended: false, notes: [], insurance: { status: 'missing', fileName: null, expiry: null }, noticeStatus: null, rentNotices: [], messages: [] },
  'Ikirenga Salon': { email: 'ikirengasalon@tenant.yomall.africa', leaseStart: '2024-01-20', monthlyRent: 300000, cam: 20000, marketingFund: 7500, deposit: 300000, suspended: false, notes: [], insurance: { status: 'compliant', fileName: 'ikirenga-insurance.pdf', expiry: '2027-01-20' }, noticeStatus: null, rentNotices: [], messages: [] },
  'Zamu Phone Repair': { email: 'zamurepair@tenant.yomall.africa', leaseStart: '2025-02-05', monthlyRent: 340000, cam: 22000, marketingFund: 8500, deposit: 340000, suspended: false, notes: [], insurance: { status: 'missing', fileName: null, expiry: null }, noticeStatus: null, rentNotices: [], messages: [] },
  'Coko Bookshop': { email: 'cokobookshop@tenant.yomall.africa', leaseStart: '2022-11-01', monthlyRent: 410000, cam: 26000, marketingFund: 10000, deposit: 410000, suspended: false, notes: [], insurance: { status: 'compliant', fileName: 'coko-bookshop-insurance.pdf', expiry: '2026-10-15' }, noticeStatus: null, rentNotices: [], messages: [] },
};

/* ──── Tenant orders (with full lifecycle) ──── */
export const riderPool = [
  { name: 'E. Niyonzima', phone: '+250 78• ••• 214' },
  { name: 'D. Habimana', phone: '+250 78• ••• 665' },
  { name: 'J. Uwase', phone: '+250 78• ••• 830' },
];
export const orderStageDefs = [
  { key: 'placed', label: 'Order placed', icon: 'receipt' },
  { key: 'preparing', label: 'Preparing your order', icon: 'chef' },
  { key: 'assigned', label: 'Rider assigned', icon: 'rider' },
  { key: 'pickedup', label: 'Picked up by rider', icon: 'package' },
  { key: 'transit', label: 'On the way', icon: 'scooter' },
  { key: 'arrived', label: 'Rider arrived', icon: 'mappin' },
  { key: 'confirmed', label: 'Delivered & confirmed', icon: 'check' },
];
export const initialTenantOrders = [
  { id: 'YD-3392', items: [{ name: 'Wireless Earbuds', qty: 2, price: 25000 }, { name: 'Phone Charger (Type-C)', qty: 1, price: 5000 }], deliveryFee: 800, payment: 'MoMo', customerName: 'A. Keza', customerPhone: '+250 78• ••• 041', address: 'Nyamirambo, near the mosque', placedAt: Date.now() - 2 * MIN, stage: 1, deliveryPin: '7042', rider: null, confirmedAt: null },
  { id: 'YD-3391', items: [{ name: 'Wireless Earbuds', qty: 1, price: 25000 }, { name: 'Phone Charger (Type-C)', qty: 1, price: 5000 }, { name: 'Bluetooth Speaker', qty: 1, price: 22000 }], deliveryFee: 800, payment: 'MoMo', customerName: 'J. Mutoni', customerPhone: '+250 78• ••• 512', address: 'Kimisagara, near the KBC roundabout', placedAt: Date.now() - 12 * MIN, stage: 4, deliveryPin: '4821', rider: riderPool[0], confirmedAt: null },
  { id: 'YD-3387', items: [{ name: 'Power Bank 10,000mAh', qty: 2, price: 15000 }, { name: 'Phone Charger (Type-C)', qty: 1, price: 5000 }], deliveryFee: 800, payment: 'MoMo', customerName: 'P. Ndayisenga', customerPhone: '+250 73• ••• 902', address: 'Biryogo, Rugarama cell', placedAt: Date.now() - 33 * MIN, stage: 5, deliveryPin: '9016', rider: riderPool[1], confirmedAt: null },
  { id: 'YD-3384', items: [{ name: 'Power Bank 10,000mAh', qty: 1, price: 15000 }, { name: 'Wireless Earbuds', qty: 1, price: 25000 }], deliveryFee: 800, payment: 'MoMo', customerName: 'C. Ingabire', customerPhone: '+250 72• ••• 375', address: 'Kimisagara, block C', placedAt: Date.now() - 70 * MIN, stage: 6, deliveryPin: '2255', rider: riderPool[1], confirmedAt: Date.now() - 40 * MIN },
  { id: 'YD-3379', items: [{ name: 'Phone Charger (Type-C)', qty: 3, price: 5000 }], deliveryFee: 600, payment: 'MoMo', customerName: 'E. Uwimana', customerPhone: '+250 78• ••• 660', address: 'Nyamirambo, Rwezamenyo', placedAt: Date.now() - 125 * MIN, stage: 6, deliveryPin: '6631', rider: riderPool[2], confirmedAt: Date.now() - 95 * MIN },
];

/* ──── Maintenance requests ──── */
export const maintStageDefs = [
  { label: 'Request submitted', icon: 'receipt' },
  { label: 'Acknowledged by staff', icon: 'eye' },
  { label: 'Staff assigned & en route', icon: 'technician' },
  { label: 'Work in progress', icon: 'wrench' },
  { label: 'Completed', icon: 'check' },
];
export const initialMaintRequests = [
  { id: 'MR-2201', category: 'HVAC / Air conditioning', description: 'AC unit above the counter is not cooling and making a rattling noise.', urgency: 'urgent', photo: null, staff: { name: 'Claudine Ingabire', role: 'HVAC technician' }, stage: 3, submittedAt: Date.now() - 3 * 3600000, completedAt: null, rating: null },
  { id: 'MR-2196', category: 'Electrical', description: 'Ceiling light near the entrance flickers on and off.', urgency: 'normal', photo: null, staff: { name: 'Eugene Niyonzima', role: 'Electrician' }, stage: 4, submittedAt: Date.now() - 2 * DAY, completedAt: Date.now() - 2 * DAY + 3 * 3600000, rating: 5 },
];

/* ──── Assigned tasks ──── */
export const taskStageDefs = [
  { label: 'Task assigned', icon: 'receipt' },
  { label: 'Acknowledged by staff', icon: 'eye' },
  { label: 'En route / started', icon: 'technician' },
  { label: 'Work in progress', icon: 'wrench' },
  { label: 'Completed', icon: 'check' },
];

/* ──── Loan applications ──── */
export const initialLoanApplications = [
  { id: 'RA-1001', tenantName: 'Amasezerano Boutique', mall: 'Musanze Heritage Plaza', unit: '1F-06', ownerName: 'Delphine Mukamana', phone: '+250 78• ••• 903', idNumber: '1 1980 8 0012345 6 01', idPhoto: null, selfie: null, amount: 280000, frequency: 'weekly', term: '4 weeks', signature: 'Delphine Mukamana', agreedAt: Date.now() - 6 * DAY, status: 'approved', submittedAt: Date.now() - 6 * DAY, reviewedAt: Date.now() - 5 * DAY, disbursedAt: Date.now() - 5 * DAY, rejectionReason: null, isCurrentTenant: false },
  { id: 'RA-1002', tenantName: 'Huye Print & Copy', mall: 'Huye Trade Center', unit: 'G-08', ownerName: 'Eric Bizimana', phone: '+250 73• ••• 447', idNumber: '1 1985 7 0098765 4 22', idPhoto: null, selfie: null, amount: 150000, frequency: 'daily', term: '30 days', signature: 'Eric Bizimana', agreedAt: Date.now() - 2 * DAY, status: 'pending', submittedAt: Date.now() - 2 * DAY, reviewedAt: null, disbursedAt: null, rejectionReason: null, isCurrentTenant: false },
  { id: 'RA-1003', tenantName: 'Remera Fashion House', mall: 'Remera Business Arcade', unit: '2F-11', ownerName: 'Grace Uwamahoro', phone: '+250 72• ••• 118', idNumber: '1 1979 9 0011223 3 09', idPhoto: null, selfie: null, amount: 600000, frequency: 'weekly', term: '4 weeks', signature: 'Grace Uwamahoro', agreedAt: Date.now() - 9 * DAY, status: 'rejected', submittedAt: Date.now() - 9 * DAY, reviewedAt: Date.now() - 8 * DAY, disbursedAt: null, rejectionReason: 'Insufficient trading history — please reapply after 3 months of active sales.', isCurrentTenant: false },
];

/* ──── CMS deals ──── */
export const initialCmsDeals = [
  { id: 1, headline: '30% off Wireless Earbuds', details: 'This week only — while stocks last.', photo: null, badge: '-30%', validUntil: '2026-08-15', color: '#8B5CF6', promotions: ['homepage'], live: true, moderationStatus: 'approved', shopName: 'Nyabugogo TechHub' },
  { id: 2, headline: 'Buy a Power Bank, get a free cable', details: 'Free Type-C charging cable with every power bank purchase.', photo: null, badge: 'BOGO', validUntil: '', color: '#F5720A', promotions: [], live: true, moderationStatus: 'pending', shopName: 'Nyabugogo TechHub' },
];

/* ──── Mall amenities ──── */
export const initialMallAmenities = [
  { id: 1, icon: 'parking', name: 'Parking — Basement', sub: '120 bays · entrance off KN 3 Ave' },
  { id: 2, icon: 'elevator', name: 'Elevators & escalators', sub: '2 lifts, 2 escalator banks — all floors' },
  { id: 3, icon: 'restroom', name: 'Restrooms', sub: 'Ground & 2nd floor, near east wing' },
  { id: 4, icon: 'info', name: 'Information desk', sub: 'Ground floor, main atrium' },
];

/* ──── Mall announcements ──── */
export const initialMallAnnouncements = [
  { id: 1, title: 'Weekend market — Northern Province cooperatives', body: 'Pop-up stalls in the atrium, Sat–Sun.', expiresAt: '2026-08-01', live: true },
  { id: 2, title: 'Elevator B under maintenance', body: 'Use elevator A or the east escalator until further notice.', expiresAt: null, live: true },
];

/* ──── Vacancy data ──── */
export const initialVacancyInquiries = [
  { unit: 'G-03', name: 'Eric Mugisha', phone: '+250 78• ••• 552', message: 'Interested in this unit for a phone accessories shop — is it still available?', at: Date.now() - 2 * DAY },
  { unit: '1F-04', name: 'Solange Uwase', phone: '+250 72• ••• 810', message: 'Looking for a boutique space, can I schedule a viewing?', at: Date.now() - 5 * DAY },
];

/* ──── Team members ──── */
export const initialTeamMembers = [
  { id: 1, name: 'Shema Katende', email: 'shema@edupoto.rw', role: 'Owner — full access', isOwner: true },
  { id: 2, name: 'Claudine Mukamana', email: 'claudine@edupoto.rw', role: 'Manager — full access', isOwner: false },
];

/* ──── Building documents ──── */
export const initialBuildingDocuments = [
  { id: 1, name: 'Property Insurance Policy', category: 'Insurance', expiry: '2027-01-15', uploadedAt: Date.now() - 60 * DAY },
  { id: 2, name: 'Fire Safety Inspection Certificate', category: 'Safety & Compliance', expiry: '2026-12-01', uploadedAt: Date.now() - 120 * DAY },
  { id: 3, name: 'Business Operating License', category: 'Business License', expiry: null, uploadedAt: Date.now() - 200 * DAY },
];

/* ──── Handbook sections ──── */
export const initialHandbookSections = [
  { id: 1, title: 'Operating Hours', body: 'The mall is open daily from 7:00 AM to 10:00 PM. Individual storefront hours may vary but must be posted visibly at the entrance.' },
  { id: 2, title: 'Signage & Fit-out Rules', body: 'All exterior signage must be approved by property management before installation. Fit-out works must be completed within 30 days of lease start and are limited to non-business hours (10 PM–6 AM) unless otherwise agreed.' },
  { id: 3, title: 'Loading Dock Schedule', body: 'Deliveries are permitted at the rear loading dock between 6:00 AM and 9:00 AM daily. Vehicles must not exceed 30 minutes at the dock. Coordinate with security for after-hours deliveries.' },
  { id: 4, title: 'Prohibited Goods & Activities', body: 'Sale of counterfeit goods, open-flame cooking outside designated food court areas, and unauthorized use of common areas for events or promotions are strictly prohibited.' },
];

/* ──── Superadmin: Malls ──── */
export const initialMalls = [
  { name: 'Kigali Convention Mall', loc: 'Nyarugenge, Kigali', plan: 'Growth', tenants: 42, occ: '87%', gmv: '18.6M', color: 'var(--color-forest-500)', owner: 'Shema Katende', ownerEmail: 'shema@edupoto.rw', ownerPhone: '+250 78• ••• 001', kyb: 'verified', bank: 'Bank of Kigali •••• 4471', accountStatus: 'active', avgMaintHrs: 6.5, avgReplyHrs: 2.1, mrr: 2400000, nextInvoice: '2026-08-01', billingHistory: [{ date: '2026-07-01', amount: 2400000, status: 'Paid' }, { date: '2026-06-01', amount: 2400000, status: 'Paid' }] },
  { name: 'Musanze Heritage Plaza', loc: 'Musanze, Northern Province', plan: 'Starter', tenants: 24, occ: '71%', gmv: '6.2M', color: 'var(--color-amber-500)', owner: 'Jean Bosco Habimana', ownerEmail: 'jbosco@musanzeheritage.rw', ownerPhone: '+250 78• ••• 002', kyb: 'pending', bank: 'Equity Bank •••• 2210', accountStatus: 'active', avgMaintHrs: 14.2, avgReplyHrs: 6.8, mrr: 800000, nextInvoice: '2026-08-01', billingHistory: [{ date: '2026-07-01', amount: 800000, status: 'Paid' }] },
  { name: 'Huye Trade Center', loc: 'Huye, Southern Province', plan: 'Growth', tenants: 36, occ: '92%', gmv: '11.4M', color: 'var(--color-forest-500)', owner: 'Alice Uwimana', ownerEmail: 'alice@huyetrade.rw', ownerPhone: '+250 78• ••• 003', kyb: 'verified', bank: 'Bank of Kigali •••• 7734', accountStatus: 'active', avgMaintHrs: 5.1, avgReplyHrs: 1.8, mrr: 2400000, nextInvoice: '2026-08-01', billingHistory: [{ date: '2026-07-01', amount: 2400000, status: 'Paid' }] },
  { name: 'Remera Business Arcade', loc: 'Remera, Kigali', plan: 'Growth', tenants: 51, occ: '95%', gmv: '22.1M', color: 'var(--color-forest-500)', owner: 'Patrick Nsengimana', ownerEmail: 'patrick@remerabiz.rw', ownerPhone: '+250 78• ••• 004', kyb: 'verified', bank: 'I&M Bank •••• 5563', accountStatus: 'active', avgMaintHrs: 4.3, avgReplyHrs: 1.2, mrr: 2400000, nextInvoice: '2026-08-01', billingHistory: [{ date: '2026-07-01', amount: 2400000, status: 'Paid' }] },
  { name: 'Rubavu Lakeside Mall', loc: 'Rubavu, Western Province', plan: 'Starter', tenants: 19, occ: '64%', gmv: '4.8M', color: 'var(--color-amber-500)', owner: 'Marie Claire Ingabire', ownerEmail: 'marieclaire@rubavulakeside.rw', ownerPhone: '+250 78• ••• 005', kyb: 'verified', bank: 'Bank of Kigali •••• 9021', accountStatus: 'active', avgMaintHrs: 19.6, avgReplyHrs: 9.4, mrr: 800000, nextInvoice: '2026-08-01', billingHistory: [{ date: '2026-07-01', amount: 800000, status: 'Overdue' }] },
  { name: 'Nyamirambo Craft Market', loc: 'Nyamirambo, Kigali', plan: 'Trial', tenants: 11, occ: '38%', gmv: '1.1M', color: 'var(--color-ink-400)', owner: 'Eric Mugabo', ownerEmail: 'eric@nyamiramboarts.rw', ownerPhone: '+250 78• ••• 006', kyb: 'rejected', bank: 'Not yet linked', accountStatus: 'active', avgMaintHrs: 28.0, avgReplyHrs: 15.5, mrr: 0, nextInvoice: '—', billingHistory: [] },
];

/* ──── Products for storefront preview ──── */
export const productsData = [
  { name: 'iPhone 14 Pro', price: 'RWF 1.2M', icon: 'smartphone' },
  { name: 'AirPods Max', price: 'RWF 600K', icon: 'headphones' },
  { name: 'MacBook Air M2', price: 'RWF 1.5M', icon: 'laptop' },
  { name: 'iPad Pro', price: 'RWF 950K', icon: 'tablet' },
];

/* ──── Promo options for deal wizard ──── */
export const dealColorOptions = ['#8B5CF6', '#F5720A', '#149954', '#3572B0', '#D6409F', '#DB9426', '#1C2B22'];
export const dealPromoOptions = [
  { id: 'homepage', name: 'Feature on yoDeals homepage', sub: 'Top placement for 48 hours', price: 5000 },
  { id: 'push', name: 'Push notification to nearby shoppers', sub: 'Sent to shoppers within 2km', price: 3000 },
  { id: 'mallguide', name: 'Boost in Mall Guide search', sub: 'Appears above other results', price: 2000 },
  { id: 'newsletter', name: 'Weekly deals newsletter', sub: "Included in this week's email blast", price: 1500 },
];
export const ktPromoOptions = [
  { id: 'kt-press', name: 'KT Press', sub: 'Widget placement', price: 1000 },
  { id: 'kt-radio', name: 'KT Radio', sub: 'Radio promotion', price: 5000 },
  { id: 'kt-website', name: 'Kigali Today', sub: 'Website promotion', price: 5000 },
  { id: 'kt-social', name: 'All social channels', sub: 'Social media distribution', price: 3000 },
];
export const allPromoOptions = [...dealPromoOptions, ...ktPromoOptions];

/* ──── Editor filter presets ──── */
export const editorFilters = [
  { id: 'original', label: 'Original', css: 'none' },
  { id: 'bright', label: 'Bright', css: 'brightness(1.15) contrast(1.05)' },
  { id: 'vivid', label: 'Vivid', css: 'saturate(1.5) contrast(1.08)' },
  { id: 'warm', label: 'Warm', css: 'sepia(0.25) saturate(1.2) brightness(1.03)' },
  { id: 'cool', label: 'Cool', css: 'hue-rotate(-8deg) saturate(1.05) contrast(1.05) brightness(1.02)' },
  { id: 'mono', label: 'B&W', css: 'grayscale(1) contrast(1.08)' },
];

/* ──── Maintain role-to-category mapping ──── */
export const maintRoleToCategory = {
  'Electrician': 'Electrical', 'Plumber': 'Plumbing', 'HVAC technician': 'HVAC / Air conditioning',
  'Cleaning supervisor': 'Cleaning', 'Security lead': 'Security', 'IT / POS support': 'IT / POS support',
};

/* ──── CURRENT TENANT for tenant role ──── */
export const CURRENT_TENANT_NAME = 'Nyabugogo TechHub';
