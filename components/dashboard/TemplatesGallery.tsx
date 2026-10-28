"use client";

import type { PinConfig, ScrapedPost, TemplateId } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { PALETTES } from "@/lib/palettes";
import { FONTS } from "@/lib/fonts";
import { SAMPLE_POST } from "@/lib/sample";
import { buildHeadlines, siteLabelFor, truncate } from "@/lib/generate";
import { PinFrame } from "@/components/pins/PinFrame";
import { PinRenderer } from "@/components/pins/PinRenderer";
import { Icon } from "./icons";

export function TemplatesGallery({ post, onUse }: { post: ScrapedPost | null; onUse: (pin: PinConfig) => void }) {
  const source = post ?? SAMPLE_POST;
  const headline = buildHeadlines(source)[0];
  const subtitle = truncate(source.description, 120);
  const siteLabel = siteLabelFor(source);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          {post
            ? "Previewing each layout with your post. Click one to add it to your pin set."
            : "Ten layouts, each paired with any of ten palettes and five font pairings. Generate pins from a post to preview them with your own content."}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {TEMPLATES.map((t, i) => {
          const config: PinConfig = {
            id: `tpl-${t.id}`,
            template: t.id as TemplateId,
            paletteId: PALETTES[i % PALETTES.length].id,
            fontId: FONTS[i % FONTS.length].id,
            headline,
            subtitle,
            cta: "Read the post",
            siteLabel,
            images: source.images.slice(0, t.imagesUsed),
            showCta: true,
            showSite: true,
            showSubtitle: true,
          };
          return (
            <div key={t.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative">
                <PinFrame>
                  <PinRenderer config={config} />
                </PinFrame>
                {post && (
                  <div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <button
                      onClick={() => onUse({ ...config, id: `${Date.now()}-${t.id}` })}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow"
                    >
                      Add to set <Icon.ArrowRight width={14} height={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="px-3 py-2.5">
                <div className="text-xs font-semibold text-gray-800">{t.name}</div>
                <div className="mt-0.5 text-[11px] leading-snug text-gray-400">{t.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
