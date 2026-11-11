import type { ComponentType } from "react";
import type { PinConfig } from "@/lib/types";
import { LaundryCollage } from "./templates/LaundryCollage";
import { BandBadge } from "./templates/BandBadge";
import { MoodboardCard } from "./templates/MoodboardCard";
import { LinenBand } from "./templates/LinenBand";
import { FramedGallery } from "./templates/FramedGallery";

export type TemplateProps = { config: PinConfig };

/**
 * Template id → component. Register each cloned template here and describe it
 * in lib/templates.ts.
 */
const REGISTRY: Record<string, ComponentType<TemplateProps>> = {
  "laundry-collage": LaundryCollage,
  "band-badge": BandBadge,
  "moodboard-card": MoodboardCard,
  "linen-band": LinenBand,
  "framed-gallery": FramedGallery,
};

/** Renders a pin at its native 1000x1500 size. Wrap in <PinFrame> to scale for previews. */
export function PinRenderer({ config }: { config: PinConfig }) {
  const Template = REGISTRY[config.template];
  if (!Template) {
    return (
      <div
        style={{
          width: 1000,
          height: 1500,
          display: "grid",
          placeItems: "center",
          background: "#F3F4F6",
          color: "#9CA3AF",
          fontFamily: "var(--font-inter)",
          fontSize: 36,
        }}
      >
        Unknown template “{config.template}”
      </div>
    );
  }
  return <Template config={config} />;
}
