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

export type Palette = {
  id: string;
  name: string;
  bg: string;
  accent: string;
  text: string;
  onAccent: string;
  muted: string;
};

export type FontPairing = {
  id: string;
  name: string;
  heading: string; // CSS font-family value
  body: string;
  headingWeight: number;
  headingScale: number; // multiplier applied to computed headline size
  uppercase?: boolean;
};

export type TemplateId =
  | "classic-split"
  | "overlay-gradient"
  | "card-float"
  | "color-block"
  | "polaroid"
  | "minimal-serif"
  | "magazine"
  | "collage-band"
  | "arch"
  | "ribbon";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  imagesUsed: number; // how many images the template consumes
};

export type PinConfig = {
  id: string;
  template: TemplateId;
  paletteId: string;
  fontId: string;
  headline: string;
  subtitle: string;
  cta: string;
  siteLabel: string;
  images: string[]; // original (unproxied) URLs, resolved through proxy at render time
  showCta: boolean;
  showSite: boolean;
  showSubtitle: boolean;
};

export const PIN_WIDTH = 1000;
export const PIN_HEIGHT = 1500;
