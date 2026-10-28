"use client";

export type RecentEntry = {
  url: string;
  title: string;
  domain: string;
  favicon: string | null;
  at: number;
};

const KEY = "pinforge:recent";
const EMPTY: RecentEntry[] = [];
let cache: RecentEntry[] | null = null;
const listeners = new Set<() => void>();

function read(): RecentEntry[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as RecentEntry[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: RecentEntry[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private mode errors
  }
  listeners.forEach((l) => l());
}

/** useSyncExternalStore bindings */
export function subscribeRecent(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
export const getRecentSnapshot = () => read();
export const getRecentServerSnapshot = () => EMPTY;

export function pushRecent(entry: RecentEntry) {
  write([entry, ...read().filter((e) => e.url !== entry.url)].slice(0, 8));
}

export function clearRecent() {
  write(EMPTY);
}
