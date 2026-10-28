import { isSafeHttpUrl, BROWSER_UA } from "@/lib/url-safety";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = isSafeHttpUrl(searchParams.get("url") ?? "");
  if (!target) return new Response("Bad url", { status: 400 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const upstream = await fetch(target, {
      headers: {
        "user-agent": BROWSER_UA,
        accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        referer: target.origin + "/",
      },
      signal: controller.signal,
    });
    if (!upstream.ok || !upstream.body) return new Response("Upstream error", { status: 502 });
    const type = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!type.startsWith("image/")) return new Response("Not an image", { status: 415 });
    return new Response(upstream.body, {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=86400, immutable",
        "access-control-allow-origin": "*",
      },
    });
  } catch {
    return new Response("Fetch failed", { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
