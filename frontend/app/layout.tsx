import type { Metadata } from "next";
import { Chakra_Petch, Manrope, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Chakra_Petch({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});
const body = Manrope({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--ff-mono", display: "swap" });
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--ff-pixel", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://goblin-tracker.cluster-12.preview.emergentcf.cloud"),
  title: "GREM | The Wallet Goblin",
  description: "You trade. GREM watches. Solana-native wallet & token intelligence.",
  keywords: ["GREM", "$GREM", "Solana", "wallet analyzer", "token analyzer", "crypto intelligence", "Pump.fun"],
  openGraph: {
    title: "GREM | The Wallet Goblin",
    description: "Every wallet leaves a trace. GREM finds the patterns.",
    siteName: "GREM",
    type: "website",
    images: [{ url: "/grem.jpg", width: 1024, height: 1024, alt: "GREM, the Wallet Goblin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GREM | The Wallet Goblin",
    description: "You trade. GREM watches.",
    images: ["/grem.jpg"],
  },
  icons: { icon: "/grem.jpg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${pixel.variable}`}>
      <body>
        <div className="grem-noise" aria-hidden />
        <Navbar />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
