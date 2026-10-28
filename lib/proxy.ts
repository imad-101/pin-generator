/** Route a remote image through the same-origin proxy so it can be drawn to canvas. */
export function proxied(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
