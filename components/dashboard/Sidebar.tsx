"use client";

import { Icon } from "./icons";
import type { RecentEntry } from "@/lib/storage";
import { proxied } from "@/lib/proxy";

export type View = "generate" | "templates";

export function Sidebar({
  view,
  onView,
  recent,
  onOpenRecent,
  onClearRecent,
}: {
  view: View;
  onView: (v: View) => void;
  recent: RecentEntry[];
  onOpenRecent: (entry: RecentEntry) => void;
  onClearRecent: () => void;
}) {
  const nav: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "generate", label: "Generate pins", icon: <Icon.Sparkles /> },
    { id: "templates", label: "Templates", icon: <Icon.Layout /> },
  ];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-sm shadow-brand/30">
          <Icon.Pin width={20} height={20} />
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight">PinForge</div>
          <div className="text-[11px] font-medium text-gray-500">Blog → Pinterest pins</div>
        </div>
      </div>

      <nav className="px-3">
        {nav.map((n) => {
          const active = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onView(n.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand-soft text-brand" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className={active ? "text-brand" : "text-gray-400"}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 flex-1 overflow-y-auto px-3 thin-scroll">
        <div className="mb-2 flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <Icon.Clock width={13} height={13} /> Recent
          </div>
          {recent.length > 0 && (
            <button onClick={onClearRecent} className="text-[11px] font-medium text-gray-400 hover:text-gray-700">
              Clear
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="px-3 text-xs leading-relaxed text-gray-400">Posts you generate pins for will show up here.</p>
        ) : (
          <ul className="space-y-0.5">
            {recent.map((r) => (
              <li key={r.url}>
                <button
                  onClick={() => onOpenRecent(r)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                  title={r.url}
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded bg-gray-100">
                    {r.favicon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={proxied(r.favicon)} alt="" className="h-4 w-4 object-contain" />
                    ) : (
                      <Icon.Link width={12} height={12} className="text-gray-400" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-gray-800">{r.title}</span>
                    <span className="block truncate text-[11px] text-gray-400">{r.domain}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="m-3 rounded-xl bg-gray-50 p-3.5 text-xs leading-relaxed text-gray-500">
        <div className="mb-1 font-semibold text-gray-700">Pin tip</div>
        Pinterest favours a 2:3 ratio. Every pin here exports at 2000 × 3000 px, ready to upload.
      </div>
    </aside>
  );
}
