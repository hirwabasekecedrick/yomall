import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yoDeals",
};

export default function yoDealsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
