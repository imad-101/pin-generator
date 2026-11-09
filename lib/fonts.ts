/**
 * Headline fonts selectable in the pin editor. Each is loaded with next/font in
 * app/layout.tsx and exposed as a CSS variable. The first entry matches the
 * reference pin; `scale` compensates for differing cap heights so swapping the
 * font keeps the headline the same visual size.
 */
export type FontOption = {
  id: string;
  name: string;
  family: string;
  weight: number;
  /** Multiplier applied to the template's font sizes. */
  scale: number;
  letterSpacing: string;
};

export const FONT_OPTIONS: FontOption[] = [
  { id: "barlow", name: "Barlow Condensed", family: "var(--font-barlow-condensed)", weight: 900, scale: 1, letterSpacing: "0em" },
  { id: "anton", name: "Anton", family: "var(--font-anton)", weight: 400, scale: 0.92, letterSpacing: "0.01em" },
  { id: "bebas", name: "Bebas Neue", family: "var(--font-bebas)", weight: 400, scale: 1.02, letterSpacing: "0.02em" },
  { id: "oswald", name: "Oswald", family: "var(--font-oswald)", weight: 700, scale: 0.9, letterSpacing: "0em" },
  { id: "passion", name: "Passion One", family: "var(--font-passion-one)", weight: 700, scale: 0.98, letterSpacing: "0em" },
  { id: "league", name: "League Gothic", family: "var(--font-league-gothic)", weight: 400, scale: 1.04, letterSpacing: "0.01em" },
];

export const DEFAULT_FONT_ID = FONT_OPTIONS[0].id;

export function getFontOption(id: string | undefined): FontOption {
  return FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0];
}

/** UI font */
export const UI_FONT = "var(--font-inter)";
