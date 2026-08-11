import { Montserrat, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "yoMall — Property Manager Dashboard",
  description: "Property Manager Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream-50 text-ink-900">{children}</body>
    </html>
  );
}
