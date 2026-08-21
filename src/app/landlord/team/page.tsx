'use client';
import TeamView from '@/components/landlord/views/Team';
import { useLandlord } from '@/components/landlord/LandlordContext';

export default function LandlordTeamPage() {
  const ll = useLandlord();
  return <TeamView onInvite={ll.inviteMember} />;
}
