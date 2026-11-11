import type { Metadata } from "next";
import {
  Inter,
  Barlow_Condensed,
  Anton,
  Bebas_Neue,
  Oswald,
  Fjalla_One,
  League_Gothic,
  Big_Shoulders,
  Passion_One,
  Fredoka,
  Lilita_One,
  Luckiest_Guy,
  Titan_One,
  Bangers,
  Montserrat,
  Poppins,
  Archivo_Black,
  Alfa_Slab_One,
  Lora,
  Playfair_Display,
  Zilla_Slab,
} from "next/font/google";
import "./globals.css";

// UI font plus every headline font offered in the pin editor (see lib/fonts.ts).
// next/font requires each loader to be its own module-scope const.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["900"], variable: "--font-barlow-condensed" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const oswald = Oswald({ subsets: ["latin"], weight: ["700"], variable: "--font-oswald" });
const fjalla = Fjalla_One({ subsets: ["latin"], weight: "400", variable: "--font-fjalla" });
const leagueGothic = League_Gothic({ subsets: ["latin"], weight: "400", variable: "--font-league-gothic" });
const bigShoulders = Big_Shoulders({ subsets: ["latin"], weight: ["900"], variable: "--font-big-shoulders" });
const passionOne = Passion_One({ subsets: ["latin"], weight: ["700"], variable: "--font-passion-one" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-fredoka" });
const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita" });
const luckiest = Luckiest_Guy({ subsets: ["latin"], weight: "400", variable: "--font-luckiest" });
const titan = Titan_One({ subsets: ["latin"], weight: "400", variable: "--font-titan" });
const bangers = Bangers({ subsets: ["latin"], weight: "400", variable: "--font-bangers" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["900"], variable: "--font-montserrat" });
const poppins = Poppins({ subsets: ["latin"], weight: ["900"], variable: "--font-poppins" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black" });
const alfaSlab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-alfa-slab" });
const lora = Lora({ subsets: ["latin"], weight: ["700"], variable: "--font-lora" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-playfair" });
const zilla = Zilla_Slab({ subsets: ["latin"], weight: ["700"], variable: "--font-zilla" });

const fonts = [
  inter,
  barlowCondensed,
  anton,
  bebas,
  oswald,
  fjalla,
  leagueGothic,
  bigShoulders,
  passionOne,
  fredoka,
  lilita,
  luckiest,
  titan,
  bangers,
  montserrat,
  poppins,
  archivoBlack,
  alfaSlab,
  lora,
  playfair,
  zilla,
];

const PRELOAD: [string, number][] = [
  ["--font-barlow-condensed", 900],
  ["--font-anton", 400],
  ["--font-bebas", 400],
  ["--font-oswald", 700],
  ["--font-fjalla", 400],
  ["--font-league-gothic", 400],
  ["--font-big-shoulders", 900],
  ["--font-passion-one", 700],
  ["--font-fredoka", 700],
  ["--font-lilita", 400],
  ["--font-luckiest", 400],
  ["--font-titan", 400],
  ["--font-bangers", 400],
  ["--font-montserrat", 900],
  ["--font-poppins", 900],
  ["--font-archivo-black", 400],
  ["--font-alfa-slab", 400],
  ["--font-lora", 700],
  ["--font-playfair", 700],
  ["--font-playfair", 900],
  ["--font-zilla", 700],
];

export const metadata: Metadata = {
  title: "PinForge · Blog to Pinterest pin generator",
  description: "Paste a blog post URL and get a set of ready-to-publish Pinterest pins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fonts.map((f) => f.variable).join(" ")} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        {/* Touch every headline font once so the browser fetches it before the first export. */}
        <div aria-hidden className="font-preload">
          {PRELOAD.map(([v, w]) => (
            <span key={v} style={{ fontFamily: `var(${v})`, fontWeight: w }}>
              a
            </span>
          ))}
        </div>
      </body>
    </html>
  );
}
