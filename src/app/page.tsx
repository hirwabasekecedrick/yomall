'use client';
import { useRouter } from 'next/navigation';
import LoginScreen from '@/components/StyledLogin';

const roleRoutes = { landlord: '/landlord', tenant: '/tenant', superadmin: '/superadmin' };

export default function Page() {
  const router = useRouter();
  return (
    <LoginScreen
      onLogin={(role) => {
        router.push(roleRoutes[role] || '/landlord');
      }}
    />
  );
}
