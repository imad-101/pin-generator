import { Canvas, PinImage, Headline, Subtitle, SiteLabel, type TemplateProps } from "../shared";

export function MinimalSerif({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div style={{ position: "absolute", top: 72, left: 72, right: 72, height: 880, borderRadius: 24, overflow: "hidden" }}>
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 72,
          right: 72,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {config.showSite && (
          <SiteLabel text={config.siteLabel} font={font} color={palette.accent} size={22} style={{ marginBottom: 28 }} />
        )}
        <Headline text={config.headline} font={font} color={palette.text} base={74} />
        <div style={{ flex: 1 }} />
        {config.showSubtitle && (
          <div style={{ borderTop: `2px solid ${palette.text}22`, paddingTop: 26 }}>
            <Subtitle text={config.subtitle} font={font} color={palette.muted} size={26} />
          </div>
        )}
        {config.showCta && (
          <div
            style={{
              marginTop: 28,
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: palette.accent,
            }}
          >
            {config.cta} &rarr;
          </div>
        )}
      </div>
    </Canvas>
  );
}
