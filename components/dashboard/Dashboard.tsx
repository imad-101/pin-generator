"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PinConfig, ScrapedPost } from "@/lib/types";
import { generatePins, reshufflePin } from "@/lib/generate";
import { downloadPin, downloadPinsZip, slugify } from "@/lib/export";
import { SAMPLE_POST } from "@/lib/sample";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { pushRecent, clearRecent, subscribeRecent, getRecentSnapshot, getRecentServerSnapshot } from "@/lib/storage";
import { Sidebar, type View } from "./Sidebar";
import { UrlForm } from "./UrlForm";
import { PostSummary } from "./PostSummary";
import { PinCard } from "./PinCard";
import { PinEditor } from "./PinEditor";
import { TemplatesGallery } from "./TemplatesGallery";
import { Icon } from "./icons";

type Status = "idle" | "loading" | "ready";

export function Dashboard() {
  const [view, setView] = useState<View>("generate");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<ScrapedPost | null>(null);
  const [pins, setPins] = useState<PinConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [zip, setZip] = useState<{ done: number; total: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const recent = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const applyPost = useCallback(
    (p: ScrapedPost, remember: boolean) => {
      setPost(p);
      setPins(generatePins(p));
      setStatus("ready");
      setFilter("all");
      setView("generate");
      if (remember) pushRecent({ url: p.url, title: p.title, domain: p.domain, favicon: p.favicon });
    },
    [],
  );

  const generate = useCallback(
    async (target: string) => {
      setUrl(target);
      setStatus("loading");
      setError(null);
      setView("generate");
      try {
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: target }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Something went wrong");
        applyPost(data as ScrapedPost, true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setStatus(post ? "ready" : "idle");
      }
    },
    [applyPost, post],
  );

  // Deep links: /?url=https://blog.example.com/post and /?view=templates
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const params = new URLSearchParams(window.location.search);
    const param = params.get("url");
    const v = params.get("view");
    // Deferred to a microtask so the effect body itself stays free of state updates.
    void Promise.resolve().then(() => {
      if (param) generate(param);
      else if (v === "templates") setView(v);
    });
  }, [generate]);

  const visiblePins = filter === "all" ? pins : pins.filter((p) => p.template === filter);
  const shuffleAll = () => post && setPins(generatePins(post));
  const updatePin = (next: PinConfig) => setPins((ps) => ps.map((p) => (p.id === next.id ? next : p)));
  const shuffleOne = (id: string) => post && setPins((ps) => ps.map((p) => (p.id === id ? reshufflePin(p, post) : p)));

  const safeDownload = async (pin: PinConfig) => {
    try {
      await downloadPin(pin);
    } catch (e) {
      notify(e instanceof Error ? `Download failed: ${e.message}` : "Download failed");
    }
  };

  const downloadAll = async () => {
    if (!post || zip) return;
    const list = visiblePins;
    setZip({ done: 0, total: list.length });
    try {
      await downloadPinsZip(list, `${slugify(post.title)}-pins`, (done, total) => setZip({ done, total }));
    } catch (e) {
      notify(e instanceof Error ? `Zip failed: ${e.message}` : "Zip failed");
    } finally {
      setZip(null);
    }
  };

  const editing = pins.find((p) => p.id === editingId) ?? null;
  const usedTemplateIds = Array.from(new Set(pins.map((p) => p.template)));

  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} onView={setView} recent={recent} onOpenRecent={(r) => generate(r.url)} onClearRecent={clearRecent} templateCount={TEMPLATES.length} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile brand + nav */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
                <Icon.Pin width={16} height={16} />
              </span>
              PinForge
            </div>
            <div className="flex rounded-lg bg-white p-1 text-xs font-medium shadow-sm">
              {(
                [
                  ["generate", "Generate"],
                  ["templates", "Templates"],
                ] as [View, string][]
              ).map(([v, label]) => (
                <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 ${view === v ? "bg-brand-soft text-brand" : "text-gray-600"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {view === "templates" && (
            <TemplatesGallery
              post={post}
              onUse={(pin) => {
                setPins((ps) => [pin, ...ps]);
                setView("generate");
                notify(`${getTemplate(pin.template)?.name ?? "Template"} added to your set`);
              }}
            />
          )}

          {view === "generate" && (
            <>
              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight">Generate pins</h1>
                <p className="mt-1 text-sm text-gray-500">Paste a blog post URL and get every template in the library filled with that post.</p>
              </div>

              <UrlForm
                key={url}
                initialUrl={url}
                loading={status === "loading"}
                onSubmit={generate}
                onSample={() => applyPost(SAMPLE_POST, false)}
              />

              <div className="mt-3 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-medium shadow-sm">
                  <Icon.Layout width={13} height={13} className="text-brand" />
                  {TEMPLATES.length === 0
                    ? "The template library is empty, so no pins can be generated yet."
                    : `Using ${TEMPLATES.length} template${TEMPLATES.length === 1 ? "" : "s"} from the library`}
                </span>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {status === "loading" && <LoadingState count={TEMPLATES.length} />}

              {status === "ready" && post && (
                <div className="mt-5 space-y-5">
                  <PostSummary post={post} />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold">
                        Your pins <span className="ml-1 text-sm font-normal text-gray-400">{visiblePins.length}</span>
                      </h2>
                      {usedTemplateIds.length > 1 && (
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="h-9 max-w-[200px] rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 outline-none"
                        >
                          <option value="all">All templates</option>
                          {usedTemplateIds.map((id) => (
                            <option key={id} value={id}>
                              {getTemplate(id)?.name ?? id}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={shuffleAll}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 hover:border-gray-400"
                      >
                        <Icon.Shuffle width={14} height={14} /> Shuffle photos
                      </button>
                      <button
                        onClick={downloadAll}
                        disabled={!!zip || visiblePins.length === 0}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gray-900 px-3.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
                      >
                        {zip ? <Icon.Spinner width={14} height={14} /> : <Icon.Archive width={14} height={14} />}
                        {zip ? `Rendering ${zip.done}/${zip.total}` : "Download all (.zip)"}
                      </button>
                    </div>
                  </div>

                  {pins.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 p-10 text-center text-sm text-gray-500">
                      No templates in the library yet, so there is nothing to fill. Once the first template is added, this post will render into it.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {visiblePins.map((pin) => (
                        <PinCard key={pin.id} pin={pin} onEdit={() => setEditingId(pin.id)} onShuffle={() => shuffleOne(pin.id)} onDownload={() => safeDownload(pin)} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {status === "idle" && !error && <EmptyState />}
            </>
          )}
        </div>
      </main>

      {editing && <PinEditor pin={editing} post={post} onChange={updatePin} onClose={() => setEditingId(null)} onDownload={safeDownload} />}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function LoadingState({ count }: { count: number }) {
  return (
    <div className="mt-5 space-y-5">
      <div className="h-28 rounded-2xl shimmer" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: Math.max(1, Math.min(count, 10)) }).map((_, i) => (
          <div key={i} className="rounded-2xl shimmer" style={{ aspectRatio: "2 / 3.3" }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  const steps = [
    { n: "1", title: "Paste a post URL", body: "We pull the title, description and images from any public blog post." },
    { n: "2", title: "Every template is filled", body: "Each layout in the library is an exact clone of a reference pin, rendered with your photos and copy." },
    { n: "3", title: "Download the set", body: "Tweak copy or photos, then export 2000 × 3000 PNGs or a zip of the whole set." },
  ];
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {steps.map((s) => (
        <div key={s.n} className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-5">
          <div className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{s.n}</div>
          <div className="text-sm font-semibold text-gray-900">{s.title}</div>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
