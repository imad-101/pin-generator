import type { TemplateMeta } from "./types";

/**
 * The template library. Every entry is a hand-built clone of a reference pin,
 * implemented as a component in components/pins/templates/ and registered in
 * components/pins/PinRenderer.tsx. Add new templates here when a new reference
 * pin is cloned.
 */
export const TEMPLATES: TemplateMeta[] = [
  {
    id: "laundry-collage",
    name: "Collage grid",
    description: "Five-photo collage (wide photo behind the headline) with a big outlined number and heavy caps.",
    imagesUsed: 5,
    defaultFontId: "barlow",
  },
  {
    id: "band-badge",
    name: "Band & badge",
    description: "Four photos around a solid headline band, with a bordered number badge and the site URL at the bottom.",
    imagesUsed: 4,
    defaultFontId: "fredoka",
  },
  {
    id: "moodboard-card",
    name: "Moodboard card",
    description: "2 × 2 photo grid with a cream centre card and a bold serif title-case headline.",
    imagesUsed: 4,
    defaultFontId: "lora",
  },
  {
    id: "linen-band",
    name: "Linen band",
    description: "Four photos around a tan band with an outlined slab title, tracked caps line, tagline pill and a number circle.",
    imagesUsed: 4,
    defaultFontId: "zilla",
  },
  {
    id: "framed-gallery",
    name: "Framed gallery",
    description: "Cream canvas with four dark-framed photos around a framed title card in heavy serif, site name below.",
    imagesUsed: 4,
    defaultFontId: "playfair-black",
  },
];

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
