"use client";

import { Canvas, FitText, PinImage } from "../shared";
import type { TemplateProps } from "../PinRenderer";
import { getFontOption } from "@/lib/fonts";
import { getPalette } from "@/lib/palettes";
import { PIN_WIDTH, PIN_HEIGHT } from "@/lib/types";

/**
 * Clone of the "21 Small Laundry Room Ideas" pin.
 *
 * Measured from the 400 × 604 reference and scaled to 1000 × 1500:
 * - Photo grid with ~10px white gutters: two cells on top, one full-width
 *   photo in the middle row (behind the headline), two cells at the bottom.
 * - Headline in heavy condensed caps, white fill with a ~9px black outline.
 * - Leading number: cap height ≈ 130px, centred on y ≈ 530.
 * - Two text lines: cap height ≈ 95px, line pitch ≈ 145px, centred on
 *   y ≈ 712 and ≈ 857, about 790px wide.
 *
 * Colour scheme and font default to the reference; the editor can swap them.
 */

const GUTTER = 10;
const COLS = 2;
const ROWS = 3;
const CELL_W = (PIN_WIDTH - GUTTER * (COLS - 1)) / COLS; // 495
const CELL_H = (PIN_HEIGHT - GUTTER * (ROWS - 1)) / ROWS; // 493.3

/** Five photo cells, in photo-slot order. The middle row is a single wide photo. */
const CELLS = [
  { row: 0, left: 0, width: CELL_W },
  { row: 0, left: CELL_W + GUTTER, width: CELL_W },
  { row: 1, left: 0, width: PIN_WIDTH },
  { row: 2, left: 0, width: CELL_W },
  { row: 2, left: CELL_W + GUTTER, width: CELL_W },
];

const NUMBER_SIZE = 205;
const LINE_SIZE = 140;
const OUTLINE = 9;

/** Photos are softened for contrast: lightly on the outer rows, more under the headline. */
const BLUR_OUTER = 1.5;
const BLUR_MIDDLE = 4.5;

/** "21 Small laundry room ideas" → { number: "21", rest: "Small laundry room ideas" } */
function splitLeadingNumber(headline: string): { number: string | null; rest: string } {
  const m = /^\s*(\d{1,3})[\s:.\-–—]+([\s\S]+)$/.exec(headline);
  if (!m) return { number: null, rest: headline.trim() };
  return { number: m[1], rest: m[2].trim() };
}

export function LaundryCollage({ config }: TemplateProps) {
  const { number, rest } = splitLeadingNumber(config.headline);
  const photos = config.images;
  const palette = getPalette(config.paletteId);
  const font = getFontOption(config.fontId ?? "barlow");

  const stroke = { width: OUTLINE, color: palette.outline };
  const textStyle = {
    fontFamily: font.family,
    fontWeight: font.weight,
    color: palette.text,
    textTransform: "uppercase" as const,
    letterSpacing: font.letterSpacing,
  };

  return (
    <Canvas style={{ background: palette.bg }}>
      {/* Photo grid: two cells on top, one full-width photo behind the headline, two cells below */}
      {CELLS.map((cell, i) => {
        const blur = cell.row === 1 ? BLUR_MIDDLE : BLUR_OUTER;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cell.left,
              top: cell.row * (CELL_H + GUTTER),
              width: cell.width,
              height: CELL_H,
              overflow: "hidden",
            }}
          >
            <PinImage
              src={photos.length ? photos[i % photos.length] : undefined}
              fallback={["#D9D4CC", "#C9CFC8", "#E3DED6", "#CFC8BE", "#D5D9D3"][i]}
              // Scale up a touch so the blur never shows a faded edge against the gutter.
              style={{ filter: `blur(${blur}px)`, transform: `scale(${1 + blur / 100})` }}
            />
          </div>
        );
      })}

      {number ? (
        <>
          {/* Big number: box centred on y ≈ 530 */}
          <div style={{ position: "absolute", left: 100, right: 100, top: 425, height: 210 }}>
            <FitText text={number} size={Math.round(NUMBER_SIZE * font.scale)} stroke={stroke} style={{ ...textStyle, lineHeight: 1 }} />
          </div>
          {/* Two headline lines: centres at y ≈ 712 and ≈ 857 */}
          <div style={{ position: "absolute", left: 50, right: 50, top: 640, height: 292 }}>
            <FitText
              text={rest}
              size={Math.round(LINE_SIZE * font.scale)}
              minSize={70}
              stroke={stroke}
              style={{ ...textStyle, lineHeight: 1.04 / font.scale }}
            />
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", left: 50, right: 50, top: 460, height: 580 }}>
          <FitText
            text={rest}
            size={Math.round(LINE_SIZE * font.scale)}
            minSize={70}
            stroke={stroke}
            style={{ ...textStyle, lineHeight: 1.04 / font.scale }}
          />
        </div>
      )}
    </Canvas>
  );
}
