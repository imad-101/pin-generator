"use client";

import type { ScrapedPost } from "@/lib/types";
import { proxied } from "@/lib/proxy";
import { Icon } from "./icons";

export function PostSummary({ post }: { post: ScrapedPost }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2 text-xs text-gray-500">
            <span className="grid h-5 w-5 place-items-center overflow-hidden rounded bg-gray-100">
              {post.favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={proxied(post.favicon)} alt="" className="h-4 w-4 object-contain" />
              ) : (
                <Icon.Link width={12} height={12} />
              )}
            </span>
            <span className="font-medium text-gray-700">{post.siteName}</span>
            <span>·</span>
            <a href={post.url} target="_blank" rel="noreferrer" className="truncate hover:text-brand hover:underline">
              {post.domain}
            </a>
          </div>
          <h2 className="text-lg font-bold leading-snug tracking-tight text-gray-900">{post.title}</h2>
          {post.description && <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{post.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
              {post.images.length} image{post.images.length === 1 ? "" : "s"} found
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
              {post.headings.length} heading{post.headings.length === 1 ? "" : "s"}
            </span>
            {post.author && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">by {post.author}</span>}
          </div>
        </div>
        {post.images.length > 0 && (
          <div className="flex shrink-0 gap-2 overflow-x-auto thin-scroll md:max-w-[340px]">
            {post.images.slice(0, 6).map((src) => (
              <div key={src} className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proxied(src)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
      {post.images.length === 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          No usable images were found on that page. Pins will use colour backgrounds; you can upload your own photo in the editor.
        </p>
      )}
    </section>
  );
}
