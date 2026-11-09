export type ScrapedPost = {
  url: string;
  title: string;
  description: string;
  siteName: string;
  domain: string;
  favicon: string | null;
  author: string | null;
  images: string[];
  headings: string[];
};

/** A template in the library: a hand-coded React component that clones a reference pin exactly. */
export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  imagesUsed: number; // how many photos the layout consumes
  /** Font option id used when a pin has none chosen (the reference pin's font). */
  defaultFontId: string;
};

export type PinConfig = {
  id: string;
  template: string; // TemplateMeta id
  headline: string;
  subtitle: string;
  cta: string;
  siteLabel: string;
  images: string[]; // original (unproxied) URLs, resolved through proxy at render time
  /** Colour scheme from lib/palettes.ts. Omit for the template's exact reference colours. */
  paletteId?: string;
  /** Headline font from lib/fonts.ts. Omit for the template's exact reference font. */
  fontId?: string;
  showCta: boolean;
  showSite: boolean;
  showSubtitle: boolean;
};

export const PIN_WIDTH = 1000;
export const PIN_HEIGHT = 1500;
