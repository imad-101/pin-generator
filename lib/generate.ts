import type { PinConfig, ScrapedPost, TemplateId } from "./types";
import { TEMPLATES } from "./templates";
import { PALETTES } from "./palettes";
import { FONTS } from "./fonts";

export const CTA_OPTIONS = ["Read the post", "Read more", "Get the guide", "See how", "Learn more", "Save for later"];

/** Small deterministic PRNG so "shuffle" is reproducible for a given seed. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:\-–—]+$/, "") + "…";
}

/** Strip trailing " | Site name" / " - Site name" suffixes that many blogs add to titles. */
export function cleanTitle(title: string, siteName: string): string {
  let t = title.trim();
  const parts = t.split(/\s[|\-–—·]\s/);
  if (parts.length > 1) {
    const last = parts[parts.length - 1].trim().toLowerCase();
    if (last === siteName.toLowerCase() || last.length < 25) {
      t = parts.slice(0, -1).join(" - ").trim();
    }
  }
  return t;
}

export function buildHeadlines(post: ScrapedPost): string[] {
  const title = cleanTitle(post.title, post.siteName);
  const out = [title];
  for (const h of post.headings) {
    if (h.toLowerCase() !== title.toLowerCase() && h.length >= 18 && h.length <= 80 && !/comments?|share|related|subscribe|newsletter|about|table of contents/i.test(h)) {
      out.push(h);
    }
    if (out.length >= 4) break;
  }
  return out;
}

export function siteLabelFor(post: ScrapedPost): string {
  const s = post.siteName.trim();
  return s && s.length <= 28 ? s : post.domain;
}

export type GenerateOptions = {
  count: number;
  seed: number;
};

export function generatePins(post: ScrapedPost, { count, seed }: GenerateOptions): PinConfig[] {
  const rand = rng(seed);
  const headlines = buildHeadlines(post);
  const subtitle = truncate(post.description, 120);
  const siteLabel = siteLabelFor(post);
  const images = post.images;

  const templateOrder = shuffle(TEMPLATES, rand);
  const paletteOrder = shuffle(PALETTES, rand);
  const fontOrder = shuffle(FONTS, rand);
  const imageOrder = shuffle(images, rand);
  const ctaOrder = shuffle(CTA_OPTIONS, rand);

  const pins: PinConfig[] = [];
  for (let i = 0; i < count; i++) {
    const template = templateOrder[i % templateOrder.length];
    const palette = paletteOrder[i % paletteOrder.length];
    const font = fontOrder[i % fontOrder.length];
    // Lead with the real title most of the time, sprinkle in section headings.
    const headline = i % 3 === 2 && headlines.length > 1 ? headlines[1 + ((i >> 1) % (headlines.length - 1))] : headlines[0];
    const imgs: string[] = [];
    for (let k = 0; k < template.imagesUsed && imageOrder.length; k++) {
      imgs.push(imageOrder[(i + k) % imageOrder.length]);
    }
    pins.push({
      id: `${seed}-${i}`,
      template: template.id as TemplateId,
      paletteId: palette.id,
      fontId: font.id,
      headline,
      subtitle,
      cta: ctaOrder[i % ctaOrder.length],
      siteLabel,
      images: imgs,
      showCta: true,
      showSite: true,
      showSubtitle: subtitle.length > 0 && i % 4 !== 3,
    });
  }
  return pins;
}

/** Re-roll a single pin's look while keeping its copy. */
export function reshufflePin(pin: PinConfig, post: ScrapedPost, seed: number): PinConfig {
  const rand = rng(seed);
  const template = TEMPLATES[Math.floor(rand() * TEMPLATES.length)];
  const palette = PALETTES[Math.floor(rand() * PALETTES.length)];
  const font = FONTS[Math.floor(rand() * FONTS.length)];
  const imgs: string[] = [];
  const pool = post.images.length ? post.images : pin.images;
  const start = Math.floor(rand() * Math.max(1, pool.length));
  for (let k = 0; k < template.imagesUsed && pool.length; k++) imgs.push(pool[(start + k) % pool.length]);
  return { ...pin, template: template.id as TemplateId, paletteId: palette.id, fontId: font.id, images: imgs };
}
