'use client';
import HandbookView from '@/components/views/Handbook';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordHandbookPage() {
  const ll = useLandlord();
  return <HandbookView onEditSection={ll.editHandbookSection} />;
}
