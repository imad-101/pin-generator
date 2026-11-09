# PinForge

Paste a blog post URL and get a set of Pinterest pins built from a library of hand-cloned templates.

## How it works

1. **Template library** (`lib/templates.ts`, `components/pins/templates/`): each template is a React component that reproduces a reference pin exactly, including fonts, sizes, spacing and colours. Templates are written by hand from a reference image and registered in `components/pins/PinRenderer.tsx`.
2. **Generate** (`components/dashboard/Dashboard.tsx`): paste a post URL. `app/api/scrape/route.ts` pulls the title, description, headings and images; `lib/generate.ts` fills every template with that content, pairing each layout with several of the post's photos.
3. **Tweak and export**: the pin editor changes copy, swaps photos (including uploads), switches layouts, and offers alternative colour schemes (`lib/palettes.ts`) and headline fonts (`lib/fonts.ts`). Generated pins always start with the reference's exact colours and font. `lib/export.tsx` rasterises pins off-screen at 2000 × 3000 px and can zip a whole set.

Remote images go through `app/api/image-proxy/route.ts` so they can be drawn to canvas. Private hosts are rejected. Nothing needs an API key.

## Run

```bash
npm install
npm run dev
```

Deep links: `/?url=https://yourblog.com/post` generates straight away; `/?view=templates` opens the library.

## Add a template (cloning a reference pin)

1. Create `components/pins/templates/<Name>.tsx` using the primitives in `components/pins/shared.tsx`: `Canvas` (the 1000 × 1500 surface), `PinImage`, and `FitText` (keeps the exact font size and only shrinks when a long headline would overflow its box).
2. Position elements absolutely in px on the 1000 × 1500 canvas, matching the reference's proportions. Use the config fields: `headline`, `subtitle`, `cta`, `siteLabel`, `images[]`, and the `show*` flags.
3. Read the colour scheme with `getPalette(config.paletteId)` and the font with `getFontOption(config.fontId)` so the editor's choices apply; the defaults are the reference look. If the reference uses a font not yet loaded, add a `next/font` declaration in `app/layout.tsx` and an entry in `lib/fonts.ts`.
4. Register the component in `components/pins/PinRenderer.tsx` and add its metadata (`id`, `name`, `description`, `imagesUsed`) to `lib/templates.ts`.
