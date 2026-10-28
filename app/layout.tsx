import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins, Lora, Bebas_Neue, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const script = Dancing_Script({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "PinForge · Blog to Pinterest pin generator",
  description: "Paste a blog post URL and get a set of ready-to-publish Pinterest pins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${lora.variable} ${bebas.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        {/* Touch every font family once so the browser fetches them before the first export. */}
        <div aria-hidden className="font-preload">
          <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}>a</span>
          <span style={{ fontFamily: "var(--font-poppins)", fontWeight: 700 }}>a</span>
          <span style={{ fontFamily: "var(--font-lora)", fontWeight: 700 }}>a</span>
          <span style={{ fontFamily: "var(--font-bebas)" }}>a</span>
          <span style={{ fontFamily: "var(--font-script)" }}>a</span>
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800 }}>a</span>
        </div>
      </body>
    </html>
  );
}
