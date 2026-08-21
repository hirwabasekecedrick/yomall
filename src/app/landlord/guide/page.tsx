'use client';
import GuideView from '@/components/landlord/views/Guide';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordGuidePage() {
  const ll = useLandlord();
  return (
    <GuideView
      onEditAmenity={ll.editAmenity}
      onNewAmenity={ll.newAmenity}
      onEditAnnouncement={ll.editAnnouncement}
      onNewAnnouncement={ll.newAnnouncement}
    />
  );
}
