import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escalations",
};

export default function EscalationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
