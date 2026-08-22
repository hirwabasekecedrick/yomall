import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handbook Editor",
};

export default function HandbookEditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
