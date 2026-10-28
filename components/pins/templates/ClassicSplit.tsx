import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function ClassicSplit({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900 }}>
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          bottom: 0,
          padding: "64px 72px 72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ width: 120, height: 10, background: palette.accent, borderRadius: 999, marginBottom: 36 }} />
          <Headline text={config.headline} font={font} color={palette.text} base={78} />
          {config.showSubtitle && (
            <Subtitle text={config.subtitle} font={font} color={palette.muted} style={{ marginTop: 26 }} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {config.showSite ? <SiteLabel text={config.siteLabel} font={font} color={palette.muted} /> : <span />}
          {config.showCta && <CtaButton text={config.cta} font={font} bg={palette.accent} color={palette.onAccent} />}
        </div>
      </div>
    </Canvas>
  );
}
