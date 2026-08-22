import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handbook",
};

export default function HandbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
