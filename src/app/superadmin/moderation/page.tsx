'use client';
import { useToast } from '@/components/Toast';
import ModerationView from '@/components/superadmin/views/Moderation';

export default function SuperadminModerationPage() {
  const toast = useToast();
  return <ModerationView onRejectDeal={(d) => toast(`Deal "${d.headline}" rejected`)} />;
}
