import { redirect } from 'next/navigation';

export default async function LandlordIndex({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const keep = new URLSearchParams();
  if (sp.mall) keep.set('mall', String(sp.mall));
  if (sp.sa === '1') keep.set('sa', '1');
  const qs = keep.toString();
  redirect(qs ? `/landlord/overview?${qs}` : '/landlord/overview');
}
