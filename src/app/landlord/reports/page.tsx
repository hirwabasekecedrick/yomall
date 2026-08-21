'use client';
import ReportsView from '@/components/landlord/views/Reports';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordReportsPage() {
  const ll = useLandlord();
  return <ReportsView onExport={ll.exportCSV} />;
}
