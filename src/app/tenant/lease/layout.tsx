import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lease",
};

export default function LeaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
