import LandlordShell from '@/components/landlord/LandlordShell';

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <LandlordShell>{children}</LandlordShell>;
}
