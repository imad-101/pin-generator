"use client";

import { Canvas, FitText, PinImage } from "../shared";
import type { TemplateProps } from "../PinRenderer";
import { getFontOption } from "@/lib/fonts";
import { getPalette } from "@/lib/palettes";
import { PIN_WIDTH } from "@/lib/types";

/**
 * Clone of the "21 Bedroom Lighting Ideas for a Cozy Room" pin.
 *
 * Measured from the 665 × 1011 reference and scaled to 1000 × 1500:
 * - Cream canvas with 64px side margins; every photo and the text card has a
 *   9px dark-brown frame.
 * - Top row y 67–497: wide photo (538) + 38px gap + narrow photo (296).
 * - Text card y 549–950, full content width, cream fill; the whole title in
 *   three centred lines of heavy high-contrast serif (cap ≈ 57px, tight leading).
 * - Bottom row y 1005–1402: narrow photo (298) + 40px gap + wide photo (534).
 * - Site name in small tracked-out caps centred at y ≈ 1447.
 */

const M = 64;
const CONTENT_W = PIN_WIDTH - 2 * M; // 872
const FRAME = 9;

const TOP = { top: 67, height: 430, leftW: 538, gap: 38 };
const CARD = { top: 549, height: 401 };
const BOTTOM = { top: 1005, height: 397, leftW: 298, gap: 40 };
const SITE = { top: 1428, height: 40 };

const TITLE_SIZE = 84;
const SITE_SIZE = 20;

/** Reference colours. */
const REF = { bg: "#F2ECE3", card: "#F7F2EA", frame: "#2B211D", text: "#2B211D" };

function Frame({ left, top, width, height, color, children }: { left: number; top: number; width: number; height: number; color: string; children?: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", left, top, width, height, border: `${FRAME}px solid ${color}`, boxSizing: "border-box", overflow: "hidden" }}>
      {children}
    </div>
  );
}

export function FramedGallery({ config }: TemplateProps) {
  const photos = config.images;
  const palette = getPalette(config.paletteId);
  const font = getFontOption(config.fontId ?? "playfair-black");

  // Classic keeps the reference colours; other schemes use the scheme's strong
  // colour for frames and text, its light colour for the card and its gutter colour for the canvas.
  const colors = palette.id === "classic" ? REF : { bg: palette.bg, card: palette.text, frame: palette.outline, text: palette.outline };

  const photo = (i: number) => <PinImage src={photos.length ? photos[i % photos.length] : undefined} fallback={["#D8CFC2", "#CDC3B5", "#D3CABD", "#C8BFB1"][i]} />;

  return (
    <Canvas style={{ background: colors.bg }}>
      {/* Top row */}
      <Frame left={M} top={TOP.top} width={TOP.leftW} height={TOP.height} color={colors.frame}>
        {photo(0)}
      </Frame>
      <Frame left={M + TOP.leftW + TOP.gap} top={TOP.top} width={CONTENT_W - TOP.leftW - TOP.gap} height={TOP.height} color={colors.frame}>
        {photo(1)}
      </Frame>

      {/* Title card */}
      <div
        style={{
          position: "absolute",
          left: M,
          top: CARD.top,
          width: CONTENT_W,
          height: CARD.height,
          border: `${FRAME}px solid ${colors.frame}`,
          background: colors.card,
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "absolute", inset: 36 }}>
          <FitText
            text={config.headline}
            size={Math.round(TITLE_SIZE * font.scale)}
            minSize={40}
            style={{
              fontFamily: font.family,
              fontWeight: font.weight,
              color: colors.text,
              lineHeight: 1.0 / font.scale,
              letterSpacing: font.letterSpacing,
              textAlign: "center",
              textWrap: "balance",
            }}
          />
        </div>
      </div>

      {/* Bottom row */}
      <Frame left={M} top={BOTTOM.top} width={BOTTOM.leftW} height={BOTTOM.height} color={colors.frame}>
        {photo(2)}
      </Frame>
      <Frame left={M + BOTTOM.leftW + BOTTOM.gap} top={BOTTOM.top} width={CONTENT_W - BOTTOM.leftW - BOTTOM.gap} height={BOTTOM.height} color={colors.frame}>
        {photo(3)}
      </Frame>

      {/* Site name */}
      {config.showSite && config.siteLabel && (
        <div style={{ position: "absolute", left: M, right: M, top: SITE.top, height: SITE.height }}>
          <FitText
            text={config.siteLabel.replace(/^https?:\/\//, "").replace(/^www\./, "")}
            size={SITE_SIZE}
            minSize={14}
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: colors.text, textTransform: "uppercase", letterSpacing: "0.22em", lineHeight: 1, whiteSpace: "nowrap" }}
          />
        </div>
      )}
    </Canvas>
  );
}
