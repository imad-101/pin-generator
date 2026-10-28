import type { TemplateMeta } from "./types";

export const TEMPLATES: TemplateMeta[] = [
  { id: "classic-split", name: "Classic Split", description: "Photo on top, headline on a clean block below.", imagesUsed: 1 },
  { id: "overlay-gradient", name: "Gradient Overlay", description: "Full-bleed photo with a bold headline over a dark fade.", imagesUsed: 1 },
  { id: "card-float", name: "Floating Card", description: "Centered white card floating over the photo.", imagesUsed: 1 },
  { id: "color-block", name: "Color Block", description: "Big colored headline block with the photo beneath.", imagesUsed: 1 },
  { id: "polaroid", name: "Polaroid", description: "Tilted polaroid photo on a solid background.", imagesUsed: 1 },
  { id: "minimal-serif", name: "Minimal Serif", description: "Airy layout with generous margins and serif type.", imagesUsed: 1 },
  { id: "magazine", name: "Magazine", description: "Editorial cover look with oversized headline.", imagesUsed: 1 },
  { id: "collage-band", name: "Collage Band", description: "Two photos with a headline band in between.", imagesUsed: 2 },
  { id: "arch", name: "Arch", description: "Photo in an arch window with headline and button.", imagesUsed: 1 },
  { id: "ribbon", name: "Ribbon", description: "Photo with a centered ribbon carrying the headline.", imagesUsed: 1 },
];

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
