'use client';
import { useRouter } from 'next/navigation';
import RegisterWizard from '@/components/RegisterWizard';

export default function RegisterPage() {
  const router = useRouter();
  return <RegisterWizard onDone={() => router.push('/tenant')} />;
}
