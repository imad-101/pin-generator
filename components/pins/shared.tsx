"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { proxied } from "@/lib/proxy";
import { PIN_WIDTH, PIN_HEIGHT } from "@/lib/types";

/** The 1000 × 1500 pin surface. Templates position everything absolutely inside it. */
export function Canvas({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "relative", width: PIN_WIDTH, height: PIN_HEIGHT, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

/** Photo that fills its box; falls back to a flat colour when there is no image. */
export function PinImage({ src, fallback = "#D6D3D1", style }: { src?: string; fallback?: string; style?: CSSProperties }) {
  const url = proxied(src);
  if (!url) return <div style={{ width: "100%", height: "100%", background: fallback, ...style }} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      crossOrigin="anonymous"
      draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  );
}

export type TextStroke = { width: number; color: string };

/**
 * Text that keeps the template's exact font size whenever it fits, and only
 * shrinks when a long headline would overflow the box the reference pin gave it.
 * With `stroke`, draws an outlined copy behind the fill so the outline sits
 * outside the letterforms (like a sticker) instead of eating into them.
 */
export function FitText({
  text,
  size,
  minSize = 18,
  stroke,
  style,
  align = "center",
  valign = "middle",
}: {
  text: string;
  size: number;
  minSize?: number;
  stroke?: TextStroke;
  style?: CSSProperties;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
}) {
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = el.current;
    const container = box.current;
    if (!node || !container) return;
    const fit = () => {
      const fits = (s: number) => {
        container.style.setProperty("--fit-size", `${s}px`);
        return node.scrollHeight <= container.clientHeight + 1 && node.scrollWidth <= container.clientWidth + 1;
      };
      if (fits(size)) return;
      let lo = minSize;
      let hi = size;
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        if (fits(mid)) lo = mid;
        else hi = mid;
      }
      container.style.setProperty("--fit-size", `${lo}px`);
    };
    fit();
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && fit());
    return () => {
      cancelled = true;
    };
  }, [text, size, minSize, style?.fontFamily, style?.fontWeight, style?.letterSpacing, style?.textTransform, style?.lineHeight]);

  const textStyle: CSSProperties = { fontSize: "var(--fit-size)", textAlign: align, whiteSpace: "pre-wrap", ...style };
  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  const alignItems = valign === "middle" ? "center" : valign === "bottom" ? "flex-end" : "flex-start";

  return (
    <div
      ref={box}
      style={{ "--fit-size": `${size}px`, width: "100%", height: "100%", overflow: "visible", display: "flex", justifyContent: justify, alignItems } as CSSProperties}
    >
      <div style={{ position: "relative", maxWidth: "100%" }}>
        {stroke && (
          <div
            aria-hidden
            style={{
              ...textStyle,
              position: "absolute",
              inset: 0,
              color: stroke.color,
              WebkitTextStroke: `${stroke.width * 2}px ${stroke.color}`,
            }}
          >
            {text}
          </div>
        )}
        <div ref={el} style={{ ...textStyle, position: "relative" }}>
          {text}
        </div>
      </div>
    </div>
  );
}
