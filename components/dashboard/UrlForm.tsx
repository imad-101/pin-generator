"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./icons";

export function UrlForm({
  initialUrl,
  loading,
  count,
  onCount,
  onSubmit,
  onSample,
}: {
  initialUrl: string;
  loading: boolean;
  count: number;
  onCount: (n: number) => void;
  onSubmit: (url: string) => void;
  onSample: () => void;
}) {
  const [url, setUrl] = useState(initialUrl);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon.Link />
          </span>
          <input
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourblog.com/your-latest-post"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            required
          />
        </label>
        <div className="flex items-center gap-2">
          <select
            value={count}
            onChange={(e) => onCount(Number(e.target.value))}
            className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none focus:border-brand"
            title="How many pins to generate"
          >
            {[6, 12, 18, 24].map((n) => (
              <option key={n} value={n}>
                {n} pins
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Icon.Spinner width={18} height={18} /> : <Icon.Sparkles width={18} height={18} />}
            {loading ? "Reading post…" : "Generate pins"}
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>We read the post title, description, headings and images. Nothing is stored on a server.</span>
        <button type="button" onClick={onSample} className="font-semibold text-brand hover:underline">
          Try a sample post
        </button>
      </div>
    </form>
  );
}
