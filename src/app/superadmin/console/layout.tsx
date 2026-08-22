import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Superadmin Console",
};

export default function SuperadminConsoleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
