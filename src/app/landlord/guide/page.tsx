'use client';
import GuideView from '@/components/landlord/views/Guide';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordGuidePage() {
  const ll = useLandlord();
  return (
    <GuideView
      announcements={ll.announcements}
      amenities={ll.amenities}
      onEditAmenity={ll.editAmenity}
      onNewAmenity={ll.newAmenity}
      onDeleteAmenity={ll.deleteAmenity}
      onEditAnnouncement={ll.editAnnouncement}
      onNewAnnouncement={ll.newAnnouncement}
      onDeleteAnnouncement={ll.deleteAnnouncement}
      onPublishAnnouncement={(a) => ll.saveAnnouncement({ id:0, title:a.title, body:a.body, meta:a.pinned ? 'Just now · Pinned' : 'Just now · Live' })}
    />
  );
}
