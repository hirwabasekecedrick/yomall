import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Overview",
};

export default function TenantOverviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
