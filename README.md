# PinForge

Paste a blog post URL, get a set of Pinterest-ready pins.

## What it does

1. **Scrapes the post** (`app/api/scrape/route.ts`): title, description, site name, favicon, author, up to 16 content images and up to 12 headings. Relative URLs, `srcset` and lazy-loaded images are handled.
2. **Generates a pin set** (`lib/generate.ts`): combines 10 layouts × 10 palettes × 5 font pairings with the post copy. Headlines come from the title and section headings; the description becomes the subtitle.
3. **Renders pins in React** (`components/pins/`): each template is a plain React component drawn at 1000 × 1500 px and scaled for previews.
4. **Exports PNGs** (`lib/export.tsx`): pins are rendered off-screen and rasterised with `html-to-image` at 2× (2000 × 3000 px). "Download all" bundles the set into a zip.

Remote images are routed through `app/api/image-proxy/route.ts` so they can be drawn to a canvas without CORS tainting. Private/internal hosts are rejected.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Deep links work too: `/?url=https://yourblog.com/post`.

## Add a template

1. Create a component in `components/pins/templates/` using the primitives in `components/pins/shared.tsx`.
2. Register it in `components/pins/PinRenderer.tsx` and add metadata to `lib/templates.ts`.
3. Add the id to `TemplateId` in `lib/types.ts`.

Palettes live in `lib/palettes.ts`, font pairings in `lib/fonts.ts` (fonts are loaded in `app/layout.tsx` via `next/font`).
