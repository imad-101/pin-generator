"use client";

import { Canvas, FitText, PinImage } from "../shared";
import type { TemplateProps } from "../PinRenderer";
import { getFontOption } from "@/lib/fonts";
import { getPalette } from "@/lib/palettes";
import { PIN_WIDTH, PIN_HEIGHT } from "@/lib/types";

/**
 * Clone of the "Self-care Moodboard" pin.
 *
 * Measured from the 480 × 720 reference and scaled to 1000 × 1500:
 * - 2 × 2 photo grid with a 12px white gutter.
 * - Cream card 604 × 296 centred on the canvas (x 198–802, y 604–900).
 * - Headline in bold serif, title case as written, dark brown, two centred
 *   lines (cap height ≈ 67px, line pitch ≈ 135px).
 */

const GUTTER = 12;
const COL_W = (PIN_WIDTH - GUTTER) / 2; // 494
const ROW_H = (PIN_HEIGHT - GUTTER) / 2; // 744

const CARD = { left: 198, top: 604, width: 604, height: 296 };
const CARD_PAD = 24;
const LINE_SIZE = 98;

/** Reference colours. */
const REF = { card: "#F2E4D1", text: "#5B3A1E", gutter: "#FFFFFF" };

export function MoodboardCard({ config }: TemplateProps) {
  const photos = config.images;
  const palette = getPalette(config.paletteId);
  const font = getFontOption(config.fontId ?? "lora");

  // Classic keeps the reference colours; other schemes use the scheme's light colour
  // for the card and its strong colour for the text.
  const colors = palette.id === "classic" ? REF : { card: palette.text, text: palette.outline, gutter: palette.bg };

  const cells = [
    { left: 0, top: 0 },
    { left: COL_W + GUTTER, top: 0 },
    { left: 0, top: ROW_H + GUTTER },
    { left: COL_W + GUTTER, top: ROW_H + GUTTER },
  ];

  return (
    <Canvas style={{ background: colors.gutter }}>
      {cells.map((c, i) => (
        <div key={i} style={{ position: "absolute", ...c, width: COL_W, height: ROW_H, overflow: "hidden" }}>
          <PinImage src={photos.length ? photos[i % photos.length] : undefined} fallback={["#E6DED2", "#D9CFC0", "#E2D7C6", "#D5CBBC"][i]} />
        </div>
      ))}

      {/* Centre card with the headline */}
      <div style={{ position: "absolute", ...CARD, background: colors.card }}>
        <div style={{ position: "absolute", inset: CARD_PAD }}>
          <FitText
            text={config.headline}
            size={Math.round(LINE_SIZE * font.scale)}
            minSize={44}
            style={{
              fontFamily: font.family,
              fontWeight: font.weight,
              color: colors.text,
              lineHeight: 1.38 / font.scale,
              letterSpacing: font.letterSpacing,
            }}
          />
        </div>
      </div>
    </Canvas>
  );
}
