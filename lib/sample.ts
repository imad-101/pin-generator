import type { ScrapedPost } from "./types";

/** Built-in example so the dashboard can be demoed without scraping anything. */
export const SAMPLE_POST: ScrapedPost = {
  url: "https://example.com/blog/cozy-fall-living-room-ideas",
  title: "15 Cozy Fall Living Room Ideas You Can Pull Off This Weekend",
  description:
    "Warm textures, layered lighting and a few thrifted finds are all it takes to make your living room feel like autumn. Here are the ideas we keep coming back to.",
  siteName: "The Nesting Edit",
  domain: "example.com",
  favicon: null,
  author: "Maya",
  images: [
    "https://picsum.photos/seed/pinforge-1/1000/1400",
    "https://picsum.photos/seed/pinforge-2/1000/1400",
    "https://picsum.photos/seed/pinforge-3/1000/1400",
    "https://picsum.photos/seed/pinforge-4/1000/1400",
  ],
  headings: [
    "Layer Throws and Pillows in Warm Tones",
    "Swap Overhead Lights for Lamps",
    "Bring in Dried Florals and Branches",
  ],
};
