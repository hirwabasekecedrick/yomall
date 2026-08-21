'use client';
import TenantOverviewView from '@/components/tenant/views/Overview';
import { useTenant } from '@/components/tenant/TenantContext';

export default function TenantOverviewPage() {
  const t = useTenant();
  return <TenantOverviewView onPayNow={t.openPayment} onNewMaint={t.newMaintRequest} />;
}
