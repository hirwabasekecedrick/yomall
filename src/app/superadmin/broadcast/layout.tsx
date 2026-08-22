import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broadcast Center",
};

export default function BroadcastCenterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
