import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floor Map",
};

export default function FloorMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
