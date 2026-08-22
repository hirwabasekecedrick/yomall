import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent",
};

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
