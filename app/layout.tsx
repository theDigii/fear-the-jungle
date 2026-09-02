import type { Metadata } from "next";
import { Metal_Mania, Spectral } from "next/font/google";
import "./globals.css";

const display = Metal_Mania({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fearthejungle.com"),
  title: "Fear the Jungle",
  description: "A PvP / PvE online game. In development at Primal Interactive.",
  openGraph: {
    title: "Fear the Jungle",
    description: "A PvP / PvE online game. In development at Primal Interactive.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Fear the Jungle" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preload" as="image" href="/bg-jungle-lush.webp" />
        <link rel="preload" as="image" href="/logo.webp" />
        <link rel="preload" as="image" href="/foliage-layer.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
