import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GREM | Feeds On Chaos",
  description: "Born from FOMO. Raised by rug pulls. Still somehow alive.",
  keywords: ["GREM", "$GREM", "memecoin", "Solana", "crypto", "chaos"],
  openGraph: {
    title: "GREM | Feeds On Chaos",
    description: "The creature that survives every crypto cycle.",
    siteName: "GREM",
    type: "website",
    images: [{ url: "/grem-hero.jpg", width: 1024, height: 1024, alt: "GREM, the creature that feeds on chaos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GREM | Feeds On Chaos",
    description: "Born from FOMO. Raised by rug pulls. Still somehow alive.",
    images: ["/grem-hero.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
