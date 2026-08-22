import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building Guide",
};

export default function BuildingGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
