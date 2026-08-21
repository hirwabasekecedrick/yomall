'use client';
import RentView from '@/components/landlord/views/Rent';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordRentPage() {
  const ll = useLandlord();
  return <RentView onExport={ll.exportCSV} />;
}
