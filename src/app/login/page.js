'use client';
import { useRouter } from 'next/navigation';
import YoMallApp from '@/components/YoMallApp';
import LoginScreen from '@/components/StyledLogin';

const roleRoutes = { landlord: '/landlord', tenant: '/tenant', superadmin: '/superadmin' };

export default function Login() {
  const router = useRouter();
  return (
    <YoMallApp
      renderLogin={(onLogin) => (
        <LoginScreen
          onLogin={(role) => {
            onLogin(role);
            router.push(roleRoutes[role] || '/landlord');
          }}
        />
      )}
    />
  );
}
