import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GREM | The Creature That Survives Every Crypto Cycle",
description:
  "GREM is a confused creature born from crypto chaos. Raised by rug pulls, powered by coffee, and somehow still alive.",

  keywords: [
    "GREM",
    "memecoin",
    "meme",
    "solana",
    "chaos",
    "crypto",
  ],

  openGraph: {
    title: "GREM | Feeds On Chaos",
description:
  "A confused creature that somehow survives every crypto cycle.",
    siteName: "GREM",
    type: "website",
    images: [
      {
        url: "/grem-hero.jpg",
        width: 1200,
        height: 630,
        alt: "GREM",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GREM",
    description: "feeds on chaos.",
    images: ["/grem-hero.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}