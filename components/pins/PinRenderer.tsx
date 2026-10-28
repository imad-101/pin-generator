import type { PinConfig } from "@/lib/types";
import { getPalette } from "@/lib/palettes";
import { getFont } from "@/lib/fonts";
import { ClassicSplit } from "./templates/ClassicSplit";
import { OverlayGradient } from "./templates/OverlayGradient";
import { CardFloat } from "./templates/CardFloat";
import { ColorBlock } from "./templates/ColorBlock";
import { Polaroid } from "./templates/Polaroid";
import { MinimalSerif } from "./templates/MinimalSerif";
import { Magazine } from "./templates/Magazine";
import { CollageBand } from "./templates/CollageBand";
import { Arch } from "./templates/Arch";
import { Ribbon } from "./templates/Ribbon";

const REGISTRY = {
  "classic-split": ClassicSplit,
  "overlay-gradient": OverlayGradient,
  "card-float": CardFloat,
  "color-block": ColorBlock,
  polaroid: Polaroid,
  "minimal-serif": MinimalSerif,
  magazine: Magazine,
  "collage-band": CollageBand,
  arch: Arch,
  ribbon: Ribbon,
} as const;

/** Renders a pin at its native 1000x1500 size. Wrap in <PinFrame> to scale for previews. */
export function PinRenderer({ config }: { config: PinConfig }) {
  const Template = REGISTRY[config.template] ?? ClassicSplit;
  return <Template config={config} palette={getPalette(config.paletteId)} font={getFont(config.fontId)} />;
}
