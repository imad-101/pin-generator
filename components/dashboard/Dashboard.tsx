"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PinConfig, ScrapedPost } from "@/lib/types";
import { generatePins, reshufflePin } from "@/lib/generate";
import { downloadPin, downloadPinsZip, slugify } from "@/lib/export";
import { SAMPLE_POST } from "@/lib/sample";
import { TEMPLATES } from "@/lib/templates";
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
  const [count, setCount] = useState(12);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<ScrapedPost | null>(null);
  const [pins, setPins] = useState<PinConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const recent = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);
  const [filter, setFilter] = useState<string>("all");
  const [zip, setZip] = useState<{ done: number; total: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const applyPost = useCallback(
    (p: ScrapedPost, remember: boolean) => {
      setPost(p);
      setPins(generatePins(p, { count, seed: Date.now() }));
      setStatus("ready");
      setFilter("all");
      setView("generate");
      if (remember) pushRecent({ url: p.url, title: p.title, domain: p.domain, favicon: p.favicon, at: Date.now() });
    },
    [count],
  );

  const generate = useCallback(
    async (target: string) => {
      setUrl(target);
      setStatus("loading");
      setError(null);
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

  const visiblePins = filter === "all" ? pins : pins.filter((p) => p.template === filter);
  // Support deep links such as /?url=https://blog.example.com/post
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const param = new URLSearchParams(window.location.search).get("url");
    // Deferred to a microtask so the effect body itself stays free of state updates.
    if (param) void Promise.resolve().then(() => generate(param));
  }, [generate]);

  const shuffleAll = () => post && setPins(generatePins(post, { count, seed: Date.now() }));
  const updatePin = (next: PinConfig) => setPins((ps) => ps.map((p) => (p.id === next.id ? next : p)));
  const shuffleOne = (id: string) =>
    post && setPins((ps) => ps.map((p) => (p.id === id ? reshufflePin(p, post, Date.now() + ps.indexOf(p)) : p)));

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

  return (
    <div className="flex min-h-screen">
      <Sidebar
        view={view}
        onView={setView}
        recent={recent}
        onOpenRecent={(r) => generate(r.url)}
        onClearRecent={clearRecent}
      />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile brand */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
                <Icon.Pin width={16} height={16} />
              </span>
              PinForge
            </div>
            <div className="flex rounded-lg bg-white p-1 text-xs font-medium shadow-sm">
              {(["generate", "templates"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-md px-3 py-1.5 capitalize ${view === v ? "bg-brand-soft text-brand" : "text-gray-600"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "templates" ? (
            <TemplatesGallery
              post={post}
              onUse={(pin) => {
                setPins((ps) => [pin, ...ps]);
                setView("generate");
                notify(`${TEMPLATES.find((t) => t.id === pin.template)?.name} added to your set`);
              }}
            />
          ) : (
            <>
              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight">Generate pins</h1>
                <p className="mt-1 text-sm text-gray-500">Paste a blog post URL and get a full set of Pinterest-ready pins in seconds.</p>
              </div>

              <UrlForm
                key={url}
                initialUrl={url}
                loading={status === "loading"}
                count={count}
                onCount={setCount}
                onSubmit={generate}
                onSample={() => applyPost(SAMPLE_POST, false)}
              />

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {status === "loading" && <LoadingState count={count} />}

              {status === "ready" && post && (
                <div className="mt-5 space-y-5">
                  <PostSummary post={post} />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold">
                        Your pins <span className="ml-1 text-sm font-normal text-gray-400">{visiblePins.length}</span>
                      </h2>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 outline-none"
                      >
                        <option value="all">All layouts</option>
                        {TEMPLATES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={shuffleAll}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 hover:border-gray-400"
                      >
                        <Icon.Shuffle width={14} height={14} /> Shuffle all
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

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {visiblePins.map((pin) => (
                      <PinCard
                        key={pin.id}
                        pin={pin}
                        onEdit={() => setEditingId(pin.id)}
                        onShuffle={() => shuffleOne(pin.id)}
                        onDownload={() => safeDownload(pin)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {status === "idle" && !error && <EmptyState />}
            </>
          )}
        </div>
      </main>

      {editing && (
        <PinEditor pin={editing} post={post} onChange={updatePin} onClose={() => setEditingId(null)} onDownload={safeDownload} />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function LoadingState({ count }: { count: number }) {
  return (
    <div className="mt-5 space-y-5">
      <div className="h-28 rounded-2xl shimmer" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
          <div key={i} className="rounded-2xl shimmer" style={{ aspectRatio: "2 / 3.3" }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  const steps = [
    { n: "1", title: "Paste a URL", body: "Any public blog post works. We pull the title, description, headings and images." },
    { n: "2", title: "Pick your favourites", body: "Ten layouts × ten palettes × five font pairings. Shuffle until something clicks." },
    { n: "3", title: "Tweak and download", body: "Edit copy, swap photos, change colours, then export 2000 × 3000 PNGs or a zip." },
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
