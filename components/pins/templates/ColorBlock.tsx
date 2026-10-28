import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function ColorBlock({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.accent }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 680,
          padding: "80px 72px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {config.showSite && (
            <SiteLabel text={config.siteLabel} font={font} color={palette.onAccent} style={{ opacity: 0.8, marginBottom: 30 }} />
          )}
          <Headline text={config.headline} font={font} color={palette.onAccent} base={88} />
        </div>
        {config.showSubtitle && (
          <Subtitle text={config.subtitle} font={font} color={palette.onAccent} style={{ opacity: 0.85 }} />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 680,
          bottom: 0,
          borderRadius: "48px 48px 0 0",
          overflow: "hidden",
          background: palette.bg,
        }}
      >
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      {config.showCta && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center" }}>
          <CtaButton
            text={config.cta}
            font={font}
            bg={palette.bg}
            color={palette.text}
            style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
          />
        </div>
      )}
    </Canvas>
  );
}
