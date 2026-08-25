import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChinaTown",
};

export default function ChinaTownLayout({ children }: { children: React.ReactNode }) {
  return children;
}
