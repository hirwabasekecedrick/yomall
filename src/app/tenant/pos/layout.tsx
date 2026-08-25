import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MSME Biz Wizard",
};

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
