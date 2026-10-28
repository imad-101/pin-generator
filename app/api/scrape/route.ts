import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { ScrapedPost } from "@/lib/types";
import { isSafeHttpUrl, BROWSER_UA } from "@/lib/url-safety";

const IMAGE_SKIP = /(logo|icon|avatar|sprite|pixel|badge|button|spinner|loading|placeholder|emoji|gravatar|\.svg|\.gif)/i;

function pickFromSrcset(srcset: string): string | null {
  // choose the largest candidate
  let best: { url: string; w: number } | null = null;
  for (const part of srcset.split(",")) {
    const [u, d] = part.trim().split(/\s+/);
    if (!u) continue;
    const w = d ? parseFloat(d) : 0;
    if (!best || w > best.w) best = { url: u, w };
  }
  return best?.url ?? null;
}

function clean(s: string | undefined | null): string {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const raw = (body.url ?? "").trim();
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = isSafeHttpUrl(withScheme);
  if (!url) return NextResponse.json({ error: "Please enter a valid public http(s) URL." }, { status: 400 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let html: string;
  let finalUrl = url.toString();
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": BROWSER_UA,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "upgrade-insecure-requests": "1",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    finalUrl = res.url || finalUrl;
    if (!res.ok) {
      return NextResponse.json({ error: `The site responded with status ${res.status}.` }, { status: 502 });
    }
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) {
      return NextResponse.json({ error: "That URL does not point to an HTML page." }, { status: 415 });
    }
    html = await res.text();
  } catch (e) {
    const msg = e instanceof Error && e.name === "AbortError" ? "The site took too long to respond." : "Could not fetch that URL.";
    return NextResponse.json({ error: msg }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }

  const $ = cheerio.load(html);
  const base = new URL(finalUrl);
  const abs = (u: string | undefined | null): string | null => {
    if (!u) return null;
    const t = u.trim();
    if (!t || t.startsWith("data:")) return null;
    try {
      return new URL(t, base).toString();
    } catch {
      return null;
    }
  };

  const meta = (sel: string) => clean($(sel).first().attr("content"));
  const title =
    meta('meta[property="og:title"]') || meta('meta[name="twitter:title"]') || clean($("h1").first().text()) || clean($("title").text());
  const description =
    meta('meta[property="og:description"]') ||
    meta('meta[name="description"]') ||
    meta('meta[name="twitter:description"]') ||
    clean($("article p, main p, p").filter((_, el) => clean($(el).text()).length > 60).first().text());
  const siteName = meta('meta[property="og:site_name"]') || base.hostname.replace(/^www\./, "");
  const author = meta('meta[name="author"]') || meta('meta[property="article:author"]') || clean($('[rel="author"]').first().text()) || null;

  const favicon =
    abs($('link[rel="apple-touch-icon"]').attr("href")) ||
    abs($('link[rel="icon"]').attr("href")) ||
    abs($('link[rel="shortcut icon"]').attr("href")) ||
    `${base.origin}/favicon.ico`;

  const images: string[] = [];
  const seen = new Set<string>();
  const push = (u: string | null, force = false) => {
    if (!u) return;
    if (!/^https?:/.test(u)) return;
    if (!force && IMAGE_SKIP.test(u)) return;
    const key = u.split("?")[0];
    if (seen.has(key)) return;
    seen.add(key);
    images.push(u);
  };

  push(abs(meta('meta[property="og:image"]')), true);
  push(abs(meta('meta[property="og:image:secure_url"]')), true);
  push(abs(meta('meta[name="twitter:image"]')), true);

  const scope = $("article").length ? $("article") : $("main").length ? $("main") : $("body");
  scope.find("img").each((_, el) => {
    const $el = $(el);
    const w = parseInt($el.attr("width") ?? "0", 10);
    const h = parseInt($el.attr("height") ?? "0", 10);
    if ((w && w < 200) || (h && h < 200)) return;
    const srcset = $el.attr("srcset") || $el.attr("data-srcset");
    const candidate =
      (srcset && pickFromSrcset(srcset)) ||
      $el.attr("data-src") ||
      $el.attr("data-lazy-src") ||
      $el.attr("data-original") ||
      $el.attr("src");
    push(abs(candidate));
  });

  const headings: string[] = [];
  scope.find("h2, h3").each((_, el) => {
    const $h = $(el).clone();
    // Drop "#" / permalink anchors that many blogs nest inside headings.
    $h.find("a").each((_, a) => {
      if (clean($(a).text()).length <= 2) $(a).remove();
    });
    const t = clean($h.text()).replace(/^[#¶§🔗\s]+|[#¶§🔗\s]+$/g, "");
    if (t.length >= 12 && t.length <= 90 && !headings.includes(t)) headings.push(t);
  });

  const post: ScrapedPost = {
    url: finalUrl,
    title: title || base.hostname,
    description,
    siteName,
    domain: base.hostname.replace(/^www\./, ""),
    favicon,
    author,
    images: images.slice(0, 16),
    headings: headings.slice(0, 12),
  };
  return NextResponse.json(post);
}
