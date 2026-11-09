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

export function buildHeadlines(post: ScrapedPost): string[] {
  const title = cleanTitle(post.title, post.siteName);
  const out = [title];
  for (const h of post.headings) {
    if (
      h.toLowerCase() !== title.toLowerCase() &&
      h.length >= 18 &&
      h.length <= 80 &&
      !/comments?|share|related|subscribe|newsletter|about|table of contents/i.test(h)
    ) {
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
  /** Maximum pins to produce. Omit for every template × every photo. */
  limit?: number;
  /** Omit for a fresh random order each call. */
  seed?: number;
  /** Photos per template. Default 3. */
  photosPerTemplate?: number;
};

/**
 * Fill every template in the library with the post. Each template is paired
 * with several of the post's photos so the set covers the whole article.
 */
export function generatePins(post: ScrapedPost, { limit, seed: seedIn, photosPerTemplate = 3 }: GenerateOptions = {}): PinConfig[] {
  const seed = seedIn ?? Date.now();
  const rand = rng(seed);
  const headlines = buildHeadlines(post);
  const subtitle = truncate(post.description, 120);
  const siteLabel = siteLabelFor(post);
  const images = shuffle(post.images, rand);
  const ctas = shuffle(CTA_OPTIONS, rand);

  const pins: PinConfig[] = [];
  const photoSets = Math.max(1, Math.min(photosPerTemplate, images.length));
  for (const template of TEMPLATES) {
    for (let p = 0; p < photoSets; p++) {
      const imgs: string[] = [];
      for (let k = 0; k < template.imagesUsed && images.length; k++) imgs.push(images[(p + k) % images.length]);
      const i = pins.length;
      pins.push({
        id: `${seed}-${i}`,
        template: template.id,
        headline: p > 0 && headlines.length > 1 ? headlines[p % headlines.length] : headlines[0],
        subtitle,
        cta: ctas[i % ctas.length],
        siteLabel,
        images: imgs,
        showCta: true,
        showSite: true,
        showSubtitle: subtitle.length > 0,
      });
    }
  }
  const ordered = shuffle(pins, rand);
  return limit ? ordered.slice(0, limit) : ordered;
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
