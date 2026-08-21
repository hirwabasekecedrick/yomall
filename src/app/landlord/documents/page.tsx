'use client';
import DocumentsView from '@/components/landlord/views/Documents';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordDocumentsPage() {
  const ll = useLandlord();
  return <DocumentsView onUpload={ll.uploadDocument} />;
}
