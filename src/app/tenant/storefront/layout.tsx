import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storefront",
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return children;
}
