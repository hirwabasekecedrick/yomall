'use client';
import LendingView from '@/components/superadmin/views/Lending';
import { useSuperadmin } from '@/components/superadmin/SuperadminContext';

export default function SuperadminLendingPage() {
  const sa = useSuperadmin();
  return <LendingView onReviewLoan={sa.reviewLoan} />;
}
