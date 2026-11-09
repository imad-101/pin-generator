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
  },
];

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
