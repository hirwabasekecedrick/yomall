import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landlord Overview",
};

export default function LandlordOverviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
