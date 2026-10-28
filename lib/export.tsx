"use client";

import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import type { PinConfig } from "./types";
import { PIN_WIDTH, PIN_HEIGHT } from "./types";
import { PinRenderer } from "@/components/pins/PinRenderer";

const waitForImages = async (root: HTMLElement) => {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
};

/** Renders a pin off-screen at native size and rasterises it to PNG. */
export async function renderPinToBlob(config: PinConfig, pixelRatio = 2): Promise<Blob> {
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-${PIN_WIDTH * 2}px;top:0;width:${PIN_WIDTH}px;height:${PIN_HEIGHT}px;pointer-events:none;`;
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(<PinRenderer config={config} />));
    await waitForImages(host);
    await document.fonts.ready;
    const node = host.firstElementChild as HTMLElement;
    const blob = await toBlob(node, {
      pixelRatio,
      width: PIN_WIDTH,
      height: PIN_HEIGHT,
      cacheBust: false,
      skipAutoScale: true,
    });
    if (!blob) throw new Error("Could not render pin");
    return blob;
  } finally {
    root.unmount();
    host.remove();
  }
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "pin"
  );
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadPin(config: PinConfig) {
  const blob = await renderPinToBlob(config);
  saveBlob(blob, `${slugify(config.headline)}-${config.template}.png`);
}

export async function downloadPinsZip(
  pins: PinConfig[],
  zipName: string,
  onProgress?: (done: number, total: number) => void,
) {
  const zip = new JSZip();
  for (let i = 0; i < pins.length; i++) {
    const blob = await renderPinToBlob(pins[i]);
    zip.file(`${String(i + 1).padStart(2, "0")}-${slugify(pins[i].headline)}-${pins[i].template}.png`, blob);
    onProgress?.(i + 1, pins.length);
  }
  const out = await zip.generateAsync({ type: "blob" });
  saveBlob(out, `${zipName}.zip`);
}
