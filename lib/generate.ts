import type { PinConfig, ScrapedPost, TemplateMeta } from "./types";
import { TEMPLATES } from "./templates";

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

/** The headline is always the post's own title, cleaned of any " | Site" suffix. */
export function headlineFor(post: ScrapedPost): string {
  return cleanTitle(post.title, post.siteName);
}

export function siteLabelFor(post: ScrapedPost): string {
  const s = post.siteName.trim();
  return s && s.length <= 28 ? s : post.domain;
}

export type GenerateOptions = {
  /** Omit for a fresh random photo order each call. */
  seed?: number;
};

/**
 * One pin per template in the library, each carrying the post's title as its
 * headline and a random selection of the post's photos.
 */
export function generatePins(post: ScrapedPost, { seed: seedIn }: GenerateOptions = {}): PinConfig[] {
  const seed = seedIn ?? Date.now();
  const rand = rng(seed);
  const headline = headlineFor(post);
  const subtitle = truncate(post.description, 120);
  const siteLabel = siteLabelFor(post);
  const images = shuffle(post.images, rand);
  const ctas = shuffle(CTA_OPTIONS, rand);

  return TEMPLATES.map((template, i) => {
    const imgs: string[] = [];
    for (let k = 0; k < template.imagesUsed && images.length; k++) imgs.push(images[(i + k) % images.length]);
    return {
      id: `${seed}-${i}`,
      template: template.id,
      headline,
      subtitle,
      cta: ctas[i % ctas.length],
      siteLabel,
      images: imgs,
      showCta: true,
      showSite: true,
      showSubtitle: subtitle.length > 0,
    };
  });
}

/** Give a single pin a different photo (and template, if more than one exists) while keeping its copy. */
export function reshufflePin(pin: PinConfig, post: ScrapedPost, seed?: number): PinConfig {
  const rand = rng(seed ?? Date.now() + Math.floor(Math.random() * 1000));
  const template: TemplateMeta | undefined = TEMPLATES[Math.floor(rand() * TEMPLATES.length)];
  if (!template) return pin;
  const pool = post.images.length ? post.images : pin.images;
  const start = Math.floor(rand() * Math.max(1, pool.length));
  const imgs: string[] = [];
  for (let k = 0; k < template.imagesUsed && pool.length; k++) imgs.push(pool[(start + k) % pool.length]);
  return { ...pin, template: template.id, images: imgs };
}
