'use client';
import TenantOrdersView from '@/components/tenant/views/Orders';
import { useTenant } from '@/components/tenant/TenantContext';

export default function TenantOrdersPage() {
  const t = useTenant();
  return <TenantOrdersView onOrderClick={t.openOrder} />;
}
