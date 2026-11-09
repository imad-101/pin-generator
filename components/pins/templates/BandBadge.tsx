"use client";

import { Canvas, FitText, PinImage } from "../shared";
import type { TemplateProps } from "../PinRenderer";
import { getFontOption } from "@/lib/fonts";
import { getPalette, shade } from "@/lib/palettes";
import { PIN_WIDTH } from "@/lib/types";

/**
 * Clone of the "15 Gorgeous Bathroom Flooring Ideas" pin.
 *
 * Measured from the 736 × 1104 reference and scaled to 1000 × 1500:
 * - Two photos on top (y 0–618), an 8px white gutter between them.
 * - Solid brown band y 618–856 carrying the headline in two centred lines of
 *   rounded bold caps (cap height ≈ 68px, line pitch ≈ 95px, tracked out).
 * - Green number badge 265 × 186 with a 4px white border, centred, its bottom
 *   edge sitting on the band's top edge (y 432–618).
 * - Two photos below (y 856–1500) with the same gutter.
 * - Site URL in small white bold text centred near the bottom (y ≈ 1460).
 */

const GUTTER = 8;
const COL_W = (PIN_WIDTH - GUTTER) / 2; // 496
const TOP_H = 618;
const BAND_TOP = 618;
const BAND_H = 238;
const BOTTOM_TOP = BAND_TOP + BAND_H; // 856

const BADGE_W = 265;
const BADGE_H = 186;
const BADGE_TOP = BAND_TOP - BADGE_H; // 432

const NUMBER_SIZE = 185;
const LINE_SIZE = 95;
const SITE_SIZE = 30;

/** Reference colours. */
const REF = { band: "#8A4A1C", badge: "#3E6B2D", text: "#FFFFFF", border: "#FFFFFF", gutter: "#FFFFFF" };

/** "15 Gorgeous bathroom flooring ideas" → { number: "15", rest: "Gorgeous bathroom flooring ideas" } */
function splitLeadingNumber(headline: string): { number: string | null; rest: string } {
  const m = /^\s*(\d{1,3})[\s:.\-–—]+([\s\S]+)$/.exec(headline);
  if (!m) return { number: null, rest: headline.trim() };
  return { number: m[1], rest: m[2].trim() };
}

export function BandBadge({ config }: TemplateProps) {
  const { number, rest } = splitLeadingNumber(config.headline);
  const photos = config.images;
  const palette = getPalette(config.paletteId);
  const font = getFontOption(config.fontId ?? "fredoka");

  // Classic keeps the reference colours; other schemes recolour band, badge and text.
  const colors =
    palette.id === "classic"
      ? REF
      : { band: palette.outline, badge: shade(palette.outline, -0.3), text: palette.text, border: palette.text, gutter: palette.bg };

  const textStyle = {
    fontFamily: font.family,
    fontWeight: font.weight,
    color: colors.text,
    textTransform: "uppercase" as const,
  };

  const cells = [
    { left: 0, top: 0, width: COL_W, height: TOP_H },
    { left: COL_W + GUTTER, top: 0, width: COL_W, height: TOP_H },
    { left: 0, top: BOTTOM_TOP, width: COL_W, height: 1500 - BOTTOM_TOP },
    { left: COL_W + GUTTER, top: BOTTOM_TOP, width: COL_W, height: 1500 - BOTTOM_TOP },
  ];

  return (
    <Canvas style={{ background: colors.gutter }}>
      {cells.map((c, i) => (
        <div key={i} style={{ position: "absolute", ...c, overflow: "hidden" }}>
          <PinImage src={photos.length ? photos[i % photos.length] : undefined} fallback={["#D9D4CC", "#C9CFC8", "#CFC8BE", "#D5D9D3"][i]} />
        </div>
      ))}

      {/* Headline band */}
      <div style={{ position: "absolute", left: 0, top: BAND_TOP, width: PIN_WIDTH, height: BAND_H, background: colors.band }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: BAND_TOP + 24, height: BAND_H - 48 }}>
        <FitText
          text={rest}
          size={Math.round(LINE_SIZE * font.scale)}
          minSize={48}
          style={{ ...textStyle, letterSpacing: "0.06em", lineHeight: 1.0 / font.scale }}
        />
      </div>

      {/* Number badge straddling the photo / band edge */}
      {number && (
        <div
          style={{
            position: "absolute",
            left: (PIN_WIDTH - BADGE_W) / 2,
            top: BADGE_TOP,
            width: BADGE_W,
            height: BADGE_H,
            background: colors.badge,
            border: `4px solid ${colors.border}`,
            borderRadius: 6,
            boxSizing: "border-box",
          }}
        >
          <FitText text={number} size={Math.round(NUMBER_SIZE * font.scale)} style={{ ...textStyle, lineHeight: 1, letterSpacing: "0em" }} />
        </div>
      )}

      {/* Site URL */}
      {config.showSite && config.siteLabel && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 1436, height: 48 }}>
          <FitText
            text={config.siteLabel}
            size={Math.round(SITE_SIZE * font.scale)}
            minSize={18}
            style={{ ...textStyle, textTransform: "lowercase", letterSpacing: "0.01em", lineHeight: 1, textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}
          />
        </div>
      )}
    </Canvas>
  );
}
