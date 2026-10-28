import type { FontPairing } from "./types";

// CSS variables are defined by next/font in app/layout.tsx
export const FONTS: FontPairing[] = [
  { id: "editorial", name: "Editorial", heading: "var(--font-playfair)", body: "var(--font-inter)", headingWeight: 700, headingScale: 1 },
  { id: "modern", name: "Modern", heading: "var(--font-poppins)", body: "var(--font-inter)", headingWeight: 700, headingScale: 0.95 },
  { id: "classic", name: "Classic", heading: "var(--font-lora)", body: "var(--font-inter)", headingWeight: 700, headingScale: 0.98 },
  { id: "bold", name: "Bold", heading: "var(--font-bebas)", body: "var(--font-inter)", headingWeight: 400, headingScale: 1.35, uppercase: true },
  { id: "clean", name: "Clean", heading: "var(--font-inter)", body: "var(--font-inter)", headingWeight: 800, headingScale: 0.92 },
];

export const SCRIPT_FONT = "var(--font-script)";

export function getFont(id: string): FontPairing {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

/** Headline size in px for a 1000x1500 canvas, based on text length. */
export function headlineSize(text: string, base = 84): number {
  const len = text.trim().length;
  if (len > 110) return base * 0.6;
  if (len > 80) return base * 0.72;
  if (len > 55) return base * 0.85;
  if (len > 35) return base;
  return base * 1.12;
}
