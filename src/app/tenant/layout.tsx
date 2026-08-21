import TenantShell from '@/components/tenant/TenantShell';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <TenantShell>{children}</TenantShell>;
}
