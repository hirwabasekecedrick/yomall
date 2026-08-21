'use client';
import { useRouter } from 'next/navigation';
import OverviewView from '@/components/landlord/views/Overview';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordOverviewPage() {
  const router = useRouter();
  return <OverviewView onOpenMap={() => router.push('/landlord/floormap')} />;
}
