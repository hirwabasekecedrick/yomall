import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storefront Editor",
};

export default function StorefrontEditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
