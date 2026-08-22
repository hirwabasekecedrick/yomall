import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Directory",
};

export default function StaffDirectoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
