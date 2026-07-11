import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GREM",
  description: "feeds on chaos.",

  keywords: [
    "GREM",
    "memecoin",
    "meme",
    "solana",
    "chaos",
    "crypto",
  ],

  openGraph: {
    title: "GREM",
    description: "feeds on chaos.",
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