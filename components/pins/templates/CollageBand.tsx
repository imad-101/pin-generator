import { Canvas, PinImage, Headline, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function CollageBand({ config, palette, font }: TemplateProps) {
  const [a, b] = config.images;
  return (
    <Canvas style={{ background: palette.bg }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 620 }}>
        <PinImage src={a} palette={palette} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 620 }}>
        <PinImage src={b ?? a} palette={palette} style={b ? undefined : { transform: "scaleX(-1)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          bottom: 560,
          background: palette.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 64px",
          gap: 20,
        }}
      >
        {config.showSite && <SiteLabel text={config.siteLabel} font={font} color={palette.accent} size={20} />}
        <Headline text={config.headline} font={font} color={palette.text} base={62} align="center" />
      </div>
      {config.showCta && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center" }}>
          <CtaButton
            text={config.cta}
            font={font}
            bg={palette.accent}
            color={palette.onAccent}
            style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
          />
        </div>
      )}
    </Canvas>
  );
}
