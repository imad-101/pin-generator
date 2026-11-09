"use client";

import { Canvas, FitText, PinImage } from "../shared";
import type { TemplateProps } from "../PinRenderer";
import { getFontOption } from "@/lib/fonts";
import { getPalette, shade } from "@/lib/palettes";
import { PIN_WIDTH, PIN_HEIGHT } from "@/lib/types";

/**
 * Clone of the "15 Easy Linen Closet Organization Ideas" pin.
 *
 * Measured from the 1000 × 1500 reference:
 * - Two photos on top (y 0–578) and two below (y 985–1500), 12px white gutters.
 * - Tan band y 583–980 with 7px black rules top and bottom.
 * - Line 1: short title phrase, title case, heavy slab serif, white with an
 *   8px black outline (cap height ≈ 85px, centred around y ≈ 668).
 * - Line 2: the rest of the title in black tracked-out caps, rounded sans,
 *   one or two lines (cap ≈ 45px).
 * - Tagline pill 750 × 84, white with a 4px black border, radius 24.
 * - Number circle Ø250 at (35, 345), white with a 7px black border.
 */

const GUTTER = 12;
const COL_W = (PIN_WIDTH - GUTTER) / 2; // 494
const TOP_H = 578;
const BAND_TOP = 583;
const BAND_H = 397;
const RULE = 7;
const BOTTOM_TOP = 985;

const CIRCLE = { left: 35, top: 345, size: 250, border: 7 };
const LINE1 = { top: 602, height: 126 };
const LINE2 = { top: 740, height: 110 };
const PILL = { left: 125, top: 866, width: 750, height: 84, border: 4, radius: 24 };

const LINE1_SIZE = 124;
const LINE2_SIZE = 58;
const PILL_SIZE = 44;
const NUMBER_SIZE = 200;
const OUTLINE = 8;
/** Extra weight painted onto the slab letters so they read as heavy as the reference. */
const FATTEN = 3;

/** Reference colours. */
const REF = { band: "#C9A98A", dark: "#000000", light: "#FFFFFF", gutter: "#FFFFFF" };
const SECONDARY_FONT = { fontFamily: "var(--font-fredoka)", fontWeight: 700 };

const STOP_WORDS = new Set(["a", "an", "the", "that", "for", "with", "to", "and", "of", "in", "on", "at", "by", "or", "your", "you", "is", "are"]);

/**
 * "15 Easy Linen Closet Organization Ideas for a Clutter-Free Space"
 *   → number "15", line1 "Easy Linen Closet", line2 "Organization Ideas", tagline "for a Clutter-Free Space".
 * Line 1 takes up to three words (never ending on a connecting word); the rest goes to line 2.
 */
function splitHeadline(headline: string) {
  const m = /^\s*(\d{1,3})[\s:.\-–—]+([\s\S]+)$/.exec(headline);
  const number = m ? m[1] : null;
  let rest = (m ? m[2] : headline).trim();

  let tagline: string | null = null;
  const sep = /^(.+?)(?:\s*:\s*|\s[-–—|]\s|\s(?=for\s))(.+)$/i.exec(rest);
  if (sep && sep[1].trim().split(/\s+/).length >= 2) {
    rest = sep[1].trim();
    tagline = sep[2].trim() || null;
  }

  const words = rest.split(/\s+/).filter(Boolean);
  let cut = words.length <= 3 ? words.length : 3;
  while (cut > 1 && cut < words.length && STOP_WORDS.has(words[cut - 1].toLowerCase().replace(/[^a-z]/g, ""))) cut--;
  return { number, line1: words.slice(0, cut).join(" "), line2: words.slice(cut).join(" "), tagline };
}

/** Pill copy must be one short line: first clause of the subtitle, at most ~52 characters. */
function shortTagline(text: string): string {
  const firstSentence = text.split(/(?<=[.!?])\s/)[0].trim();
  if (firstSentence.length <= 52) return firstSentence.replace(/[.!?]+$/, "");
  const clause = firstSentence.split(/[,;:–—]|\s-\s/)[0].trim();
  if (clause.length >= 18 && clause.length <= 52) return clause;
  const cut = firstSentence.slice(0, 50);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 30)).replace(/[,;:\-–—\s]+$/, "") + "…";
}

export function LinenBand({ config }: TemplateProps) {
  const { number, line1, line2, tagline } = splitHeadline(config.headline);
  const photos = config.images;
  const palette = getPalette(config.paletteId);
  const font = getFontOption(config.fontId ?? "zilla");

  // Classic keeps the reference colours; other schemes tint the band from the
  // scheme's strong colour and use it for rules, borders and dark text.
  const colors =
    palette.id === "classic"
      ? REF
      : { band: shade(palette.outline, 0.55), dark: palette.outline, light: palette.text, gutter: palette.bg };

  const pillText = tagline ?? (config.showSubtitle && config.subtitle ? shortTagline(config.subtitle) : null);

  const slabStyle = {
    fontFamily: font.family,
    fontWeight: font.weight,
    letterSpacing: font.letterSpacing,
    lineHeight: 1,
  };

  const cells = [
    { left: 0, top: 0, width: COL_W, height: TOP_H },
    { left: COL_W + GUTTER, top: 0, width: COL_W, height: TOP_H },
    { left: 0, top: BOTTOM_TOP, width: COL_W, height: PIN_HEIGHT - BOTTOM_TOP },
    { left: COL_W + GUTTER, top: BOTTOM_TOP, width: COL_W, height: PIN_HEIGHT - BOTTOM_TOP },
  ];

  return (
    <Canvas style={{ background: colors.gutter }}>
      {cells.map((c, i) => (
        <div key={i} style={{ position: "absolute", ...c, overflow: "hidden" }}>
          <PinImage src={photos.length ? photos[i % photos.length] : undefined} fallback={["#E3DACB", "#D6CDBE", "#E0D6C6", "#D2C9BA"][i]} />
        </div>
      ))}

      {/* Band with rules */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: BAND_TOP,
          width: PIN_WIDTH,
          height: BAND_H,
          background: colors.band,
          borderTop: `${RULE}px solid ${colors.dark}`,
          borderBottom: `${RULE}px solid ${colors.dark}`,
          boxSizing: "border-box",
        }}
      />

      {/* Line 1: outlined slab serif, single line */}
      <div style={{ position: "absolute", left: 40, right: 40, top: LINE1.top, height: LINE1.height }}>
        <FitText
          text={line1}
          size={Math.round(LINE1_SIZE * font.scale)}
          minSize={64}
          stroke={{ width: OUTLINE + FATTEN / 2, color: colors.dark }}
          style={{ ...slabStyle, color: colors.light, WebkitTextStroke: `${FATTEN}px ${colors.light}`, whiteSpace: "nowrap" }}
        />
      </div>

      {/* Line 2: tracked caps, wraps to two lines when needed */}
      {line2 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: LINE2.top, height: LINE2.height }}>
          <FitText
            text={line2}
            size={LINE2_SIZE}
            minSize={34}
            style={{ ...SECONDARY_FONT, color: colors.dark, textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1.12, textAlign: "center", textWrap: "balance" }}
          />
        </div>
      )}

      {/* Tagline pill */}
      {pillText && (
        <div
          style={{
            position: "absolute",
            left: PILL.left,
            top: PILL.top,
            width: PILL.width,
            height: PILL.height,
            background: colors.light,
            border: `${PILL.border}px solid ${colors.dark}`,
            borderRadius: PILL.radius,
            boxSizing: "border-box",
            padding: "0 36px",
          }}
        >
          <FitText text={pillText} size={PILL_SIZE} minSize={24} style={{ ...SECONDARY_FONT, color: colors.dark, lineHeight: 1, whiteSpace: "nowrap" }} />
        </div>
      )}

      {/* Number circle */}
      {number && (
        <div
          style={{
            position: "absolute",
            left: CIRCLE.left,
            top: CIRCLE.top,
            width: CIRCLE.size,
            height: CIRCLE.size,
            borderRadius: "50%",
            background: colors.light,
            border: `${CIRCLE.border}px solid ${colors.dark}`,
            boxSizing: "border-box",
          }}
        >
          <FitText
            text={number}
            size={Math.round(NUMBER_SIZE * font.scale)}
            style={{ ...slabStyle, color: colors.dark, WebkitTextStroke: `${FATTEN}px ${colors.dark}` }}
          />
        </div>
      )}
    </Canvas>
  );
}
