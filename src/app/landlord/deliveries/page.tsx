'use client';
import DeliveriesView from '@/components/landlord/views/Deliveries';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordDeliveriesPage() {
  const ll = useLandlord();
  return <DeliveriesView onOrderClick={ll.openOrder} />;
}
