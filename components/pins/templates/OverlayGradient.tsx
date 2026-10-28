import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function OverlayGradient({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: "#111" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {config.showSite && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            padding: "16px 28px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 999,
          }}
        >
          <SiteLabel text={config.siteLabel} font={font} color="#111" size={22} />
        </div>
      )}
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 72 }}>
        <Headline text={config.headline} font={font} color="#FFFFFF" base={92} />
        {config.showSubtitle && (
          <Subtitle text={config.subtitle} font={font} color="rgba(255,255,255,0.85)" style={{ marginTop: 26 }} />
        )}
        {config.showCta && (
          <CtaButton text={config.cta} font={font} bg={palette.accent} color={palette.onAccent} style={{ marginTop: 44 }} />
        )}
      </div>
    </Canvas>
  );
}
