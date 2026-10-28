"use client";

import { useEffect, useRef, useState } from "react";
import type { PinConfig, ScrapedPost, TemplateId } from "@/lib/types";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { PALETTES } from "@/lib/palettes";
import { FONTS } from "@/lib/fonts";
import { CTA_OPTIONS, buildHeadlines } from "@/lib/generate";
import { proxied } from "@/lib/proxy";
import { PinFrame } from "@/components/pins/PinFrame";
import { PinRenderer } from "@/components/pins/PinRenderer";
import { Icon } from "./icons";

export function PinEditor({
  pin,
  post,
  onChange,
  onClose,
  onDownload,
}: {
  pin: PinConfig;
  post: ScrapedPost | null;
  onChange: (next: PinConfig) => void;
  onClose: () => void;
  onDownload: (pin: PinConfig) => Promise<void>;
}) {
  const [uploads, setUploads] = useState<string[]>([]);
  const [slotState, setSlot] = useState(0);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const template = getTemplate(pin.template);
  const slot = slotState < template.imagesUsed ? slotState : 0;
  const imagePool = [...uploads, ...(post?.images ?? []), ...pin.images.filter((i) => !post?.images.includes(i) && !uploads.includes(i))];
  const headlineIdeas = post ? buildHeadlines(post) : [];

  const set = <K extends keyof PinConfig>(key: K, value: PinConfig[K]) => onChange({ ...pin, [key]: value });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const pickImage = (src: string) => {
    const next = pin.images.slice(0, template.imagesUsed);
    while (next.length < template.imagesUsed) next.push(next[0] ?? src);
    next[slot] = src;
    set("images", next);
  };

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setUploads((u) => [...urls, ...u]);
    pickImage(urls[0]);
  };

  const download = async () => {
    setBusy(true);
    try {
      await onDownload(pin);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[88vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <div>
            <div className="text-sm font-semibold">Edit pin</div>
            <div className="text-xs text-gray-400">{template.name} · 1000 × 1500 (exports at 2×)</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={download}
              disabled={busy}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
            >
              {busy ? <Icon.Spinner width={14} height={14} /> : <Icon.Download width={14} height={14} />}
              {busy ? "Rendering…" : "Download PNG"}
            </button>
            <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100">
              <Icon.X />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Preview */}
          <div className="flex items-center justify-center overflow-hidden bg-gray-100 p-4 md:p-8">
            <div className="h-full" style={{ aspectRatio: "2 / 3", maxWidth: "100%" }}>
              <div className="mx-auto h-full w-full overflow-hidden rounded-xl shadow-xl" style={{ maxHeight: "100%", aspectRatio: "2 / 3" }}>
                <PinFrame>
                  <PinRenderer config={pin} />
                </PinFrame>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="overflow-y-auto p-5 thin-scroll">
            <Section title="Copy">
              <Field label="Headline">
                <textarea
                  value={pin.headline}
                  onChange={(e) => set("headline", e.target.value)}
                  rows={2}
                  className={inputCls}
                />
                {headlineIdeas.length > 1 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {headlineIdeas.map((h) => (
                      <button
                        key={h}
                        onClick={() => set("headline", h)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          h === pin.headline ? "border-brand bg-brand-soft text-brand" : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </Field>
              <Field label="Subtitle" toggle={{ on: pin.showSubtitle, set: (v) => set("showSubtitle", v) }}>
                <textarea value={pin.subtitle} onChange={(e) => set("subtitle", e.target.value)} rows={2} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Call to action" toggle={{ on: pin.showCta, set: (v) => set("showCta", v) }}>
                  <input value={pin.cta} onChange={(e) => set("cta", e.target.value)} className={inputCls} list="cta-options" />
                  <datalist id="cta-options">
                    {CTA_OPTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Site label" toggle={{ on: pin.showSite, set: (v) => set("showSite", v) }}>
                  <input value={pin.siteLabel} onChange={(e) => set("siteLabel", e.target.value)} className={inputCls} />
                </Field>
              </div>
            </Section>

            <Section title="Layout">
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES.map((t) => {
                  const active = t.id === pin.template;
                  const previewImages = pin.images.length ? pin.images : [];
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        const images = pin.images.slice(0, t.imagesUsed);
                        while (images.length < t.imagesUsed && imagePool.length) images.push(imagePool[images.length % imagePool.length]);
                        onChange({ ...pin, template: t.id as TemplateId, images });
                      }}
                      title={t.description}
                      className={`overflow-hidden rounded-lg border-2 transition ${active ? "border-brand" : "border-transparent hover:border-gray-300"}`}
                    >
                      <PinFrame>
                        <PinRenderer config={{ ...pin, template: t.id as TemplateId, images: previewImages }} />
                      </PinFrame>
                      <div className={`py-1 text-center text-[10px] font-medium ${active ? "text-brand" : "text-gray-500"}`}>{t.name}</div>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Colours">
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((p) => {
                  const active = p.id === pin.paletteId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => set("paletteId", p.id)}
                      title={p.name}
                      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                        active ? "border-brand bg-brand-soft text-brand" : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <span className="flex -space-x-1">
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: p.bg }} />
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: p.accent }} />
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: p.text }} />
                      </span>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Typography">
              <div className="flex flex-wrap gap-2">
                {FONTS.map((f) => {
                  const active = f.id === pin.fontId;
                  return (
                    <button
                      key={f.id}
                      onClick={() => set("fontId", f.id)}
                      className={`rounded-xl border px-3 py-2 text-left transition ${
                        active ? "border-brand bg-brand-soft" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div
                        style={{ fontFamily: f.heading, fontWeight: f.headingWeight, textTransform: f.uppercase ? "uppercase" : "none" }}
                        className="text-lg leading-none text-gray-900"
                      >
                        Aa
                      </div>
                      <div className={`mt-1 text-[11px] font-medium ${active ? "text-brand" : "text-gray-500"}`}>{f.name}</div>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section
              title="Photo"
              action={
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  <Icon.Upload width={14} height={14} /> Upload
                </button>
              }
            >
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
              {template.imagesUsed > 1 && (
                <div className="mb-2 flex gap-1.5">
                  {Array.from({ length: template.imagesUsed }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlot(i)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        slot === i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Photo {i + 1}
                    </button>
                  ))}
                </div>
              )}
              {imagePool.length === 0 ? (
                <p className="text-xs text-gray-400">No photos available. Upload one to use it in this pin.</p>
              ) : (
                <div className="grid grid-cols-6 gap-2">
                  {imagePool.map((src) => {
                    const active = pin.images[slot] === src;
                    return (
                      <button
                        key={src}
                        onClick={() => pickImage(src)}
                        className={`aspect-[4/5] overflow-hidden rounded-lg border-2 bg-gray-100 ${active ? "border-brand" : "border-transparent hover:border-gray-300"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={proxied(src)} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10";

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  toggle,
  children,
}: {
  label: string;
  toggle?: { on: boolean; set: (v: boolean) => void };
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        {toggle && (
          <button
            onClick={() => toggle.set(!toggle.on)}
            className={`relative h-5 w-9 rounded-full transition ${toggle.on ? "bg-brand" : "bg-gray-300"}`}
            aria-label={`Toggle ${label}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${toggle.on ? "left-[18px]" : "left-0.5"}`} />
          </button>
        )}
      </div>
      <div className={toggle && !toggle.on ? "opacity-50" : ""}>{children}</div>
    </div>
  );
}
