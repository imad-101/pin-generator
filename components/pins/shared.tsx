import type { CSSProperties, ReactNode } from "react";
import type { Palette, FontPairing, PinConfig } from "@/lib/types";
import { headlineSize, SCRIPT_FONT } from "@/lib/fonts";
import { proxied } from "@/lib/proxy";

export type TemplateProps = {
  config: PinConfig;
  palette: Palette;
  font: FontPairing;
};

/** Photo that fills its box; falls back to a soft gradient when there is no image. */
export function PinImage({
  src,
  palette,
  style,
  className,
}: {
  src?: string;
  palette: Palette;
  style?: CSSProperties;
  className?: string;
}) {
  const url = proxied(src);
  if (!url) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${palette.accent}cc 0%, ${palette.accent}55 55%, ${palette.bg} 100%)`,
          ...style,
        }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      crossOrigin="anonymous"
      draggable={false}
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  );
}

export function Headline({
  text,
  font,
  color,
  base = 84,
  align = "left",
  style,
}: {
  text: string;
  font: FontPairing;
  color: string;
  base?: number;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
}) {
  const size = headlineSize(text, base) * font.headingScale;
  return (
    <h1
      style={{
        fontFamily: font.heading,
        fontWeight: font.headingWeight,
        fontSize: size,
        lineHeight: font.uppercase ? 1 : 1.12,
        letterSpacing: font.uppercase ? "0.01em" : "-0.015em",
        textTransform: font.uppercase ? "uppercase" : "none",
        color,
        margin: 0,
        textAlign: align,
        overflowWrap: "anywhere",
        ...style,
      }}
    >
      {text}
    </h1>
  );
}

export function Subtitle({
  text,
  font,
  color,
  size = 30,
  align = "left",
  style,
}: {
  text: string;
  font: FontPairing;
  color: string;
  size?: number;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
}) {
  if (!text) return null;
  return (
    <p
      style={{
        fontFamily: font.body,
        fontSize: size,
        lineHeight: 1.4,
        color,
        margin: 0,
        textAlign: align,
        ...style,
      }}
    >
      {text}
    </p>
  );
}

export function CtaButton({
  text,
  font,
  bg,
  color,
  style,
}: {
  text: string;
  font: FontPairing;
  bg: string;
  color: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: font.body,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "22px 44px",
        borderRadius: 999,
        background: bg,
        color,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

export function SiteLabel({
  text,
  font,
  color,
  size = 26,
  style,
}: {
  text: string;
  font: FontPairing;
  color: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: font.body,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

export function ScriptLabel({
  text,
  color,
  size = 56,
  style,
}: {
  text: string;
  color: string;
  size?: number;
  style?: CSSProperties;
}) {
  return <div style={{ fontFamily: SCRIPT_FONT, fontSize: size, color, lineHeight: 1, ...style }}>{text}</div>;
}

export function Canvas({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        width: 1000,
        height: 1500,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
