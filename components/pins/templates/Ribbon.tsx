import { Canvas, PinImage, Headline, SiteLabel, CtaButton, type TemplateProps } from "../shared";

export function Ribbon({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.12)" }} />
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: "50%",
          transform: "translateY(-50%) rotate(-2deg)",
          background: palette.accent,
          padding: "60px 110px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
        }}
      >
        <Headline text={config.headline} font={font} color={palette.onAccent} base={74} align="center" />
      </div>
      {config.showSite && (
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "14px 30px", background: palette.bg, borderRadius: 999 }}>
            <SiteLabel text={config.siteLabel} font={font} color={palette.text} size={22} />
          </span>
        </div>
      )}
      {config.showCta && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 72, textAlign: "center" }}>
          <CtaButton
            text={config.cta}
            font={font}
            bg={palette.bg}
            color={palette.text}
            style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
          />
        </div>
      )}
    </Canvas>
  );
}
