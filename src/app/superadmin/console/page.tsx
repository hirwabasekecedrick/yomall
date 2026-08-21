'use client';
import ConsoleView from '@/components/superadmin/views/Console';
import { useSuperadmin } from '@/components/superadmin/SuperadminContext';

export default function SuperadminConsolePage() {
  const sa = useSuperadmin();
  return <ConsoleView onEnterMall={sa.enterMall} onOnboardMall={sa.onboardMall} />;
}
