"use client";

import type { PinConfig, ScrapedPost } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { SAMPLE_POST } from "@/lib/sample";
import { headlineFor, siteLabelFor, truncate } from "@/lib/generate";
import { PinFrame } from "@/components/pins/PinFrame";
import { PinRenderer } from "@/components/pins/PinRenderer";
import { Icon } from "./icons";

export function sampleConfigFor(post: ScrapedPost | null, templateId: string): PinConfig {
  const source = post ?? SAMPLE_POST;
  return {
    id: `tpl-${templateId}`,
    template: templateId,
    headline: headlineFor(source),
    subtitle: truncate(source.description, 120),
    cta: "Read the post",
    siteLabel: siteLabelFor(source),
    images: source.images.slice(0, 6),
    showCta: true,
    showSite: true,
    showSubtitle: true,
  };
}

export function TemplatesGallery({ post, onUse }: { post: ScrapedPost | null; onUse: (pin: PinConfig) => void }) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Template library</h1>
        <p className="mt-1 text-sm text-gray-500">
          {post
            ? "Every layout previewed with your post. Click one to add it to your pin set."
            : "Each template is an exact clone of a reference pin. Generate pins from a post to preview them with your own content."}
        </p>
      </div>

      {TEMPLATES.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 p-12 text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
            <Icon.Layout width={22} height={22} />
          </span>
          <div className="text-sm font-semibold text-gray-800">The library is empty</div>
          <p className="mt-1 max-w-sm text-xs text-gray-500">Templates are added to the code as reference pins are cloned. The first one will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {TEMPLATES.map((t) => {
            const config = sampleConfigFor(post, t.id);
            return (
              <div key={t.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative">
                  <PinFrame>
                    <PinRenderer config={{ ...config, images: config.images.slice(0, t.imagesUsed) }} />
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
      )}
    </div>
  );
}
