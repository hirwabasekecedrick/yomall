'use client';
import StaffDirectoryView from '@/components/views/StaffDirectory';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordStaffPage() {
  const ll = useLandlord();
  return <StaffDirectoryView onAssignTask={ll.assignTask} />;
}
