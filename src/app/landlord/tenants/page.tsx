'use client';
import TenantsView from '@/components/landlord/views/Tenants';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordTenantsPage() {
  const ll = useLandlord();
  return <TenantsView onManage={ll.manageTenant} onOnboard={ll.startOnboarding} />;
}
