import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Anton, Bebas_Neue, Oswald, Passion_One, League_Gothic } from "next/font/google";
import "./globals.css";

// UI font plus every headline font offered in the pin editor (see lib/fonts.ts).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["900"], variable: "--font-barlow-condensed" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const oswald = Oswald({ subsets: ["latin"], weight: ["700"], variable: "--font-oswald" });
const passionOne = Passion_One({ subsets: ["latin"], weight: ["700"], variable: "--font-passion-one" });
const leagueGothic = League_Gothic({ subsets: ["latin"], weight: "400", variable: "--font-league-gothic" });

const fontVars = [inter, barlowCondensed, anton, bebas, oswald, passionOne, leagueGothic].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: "PinForge · Blog to Pinterest pin generator",
  description: "Paste a blog post URL and get a set of ready-to-publish Pinterest pins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        {/* Touch every headline font once so the browser fetches it before the first export. */}
        <div aria-hidden className="font-preload">
          <span style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 900 }}>a</span>
          <span style={{ fontFamily: "var(--font-anton)" }}>a</span>
          <span style={{ fontFamily: "var(--font-bebas)" }}>a</span>
          <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700 }}>a</span>
          <span style={{ fontFamily: "var(--font-passion-one)", fontWeight: 700 }}>a</span>
          <span style={{ fontFamily: "var(--font-league-gothic)" }}>a</span>
        </div>
      </body>
    </html>
  );
}
