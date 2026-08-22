'use client';
import OverviewView from '@/components/landlord/views/Overview';
import { useLandlord } from '@/components/landlord/LandlordContext';
import { useToast } from '@/components/Toast';

export default function LandlordOverviewPage() {
  const ll = useLandlord();
  const toast = useToast();

  return (
    <OverviewView
      onOpenMap={() => ll.navigate('floormap')}
      onUnitClick={(u) => {
        const tenant = ll.tenants.find(t => t.unit.endsWith(u.n));
        if (u.s === 'vacant') ll.navigate('floormap');
        else if (tenant) ll.manageTenant(tenant);
      }}
      onNudge={() => toast('Payment reminder sent to Nyabugogo TechHub (SMS + app)')}
      onReview={() => ll.navigate('storefront')}
      onAssign={ll.assignTask}
    />
  );
}
