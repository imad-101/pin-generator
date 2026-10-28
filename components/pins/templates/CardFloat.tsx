import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function CardFloat({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          background: "#FFFFFF",
          borderRadius: 28,
          padding: "72px 64px 64px",
          textAlign: "center",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
          borderTop: `16px solid ${palette.accent}`,
        }}
      >
        {config.showSite && (
          <SiteLabel text={config.siteLabel} font={font} color={palette.accent} size={22} style={{ marginBottom: 30 }} />
        )}
        <Headline text={config.headline} font={font} color="#161616" base={72} align="center" />
        {config.showSubtitle && (
          <Subtitle text={config.subtitle} font={font} color="#555555" align="center" size={27} style={{ marginTop: 26 }} />
        )}
        {config.showCta && (
          <CtaButton text={config.cta} font={font} bg={palette.accent} color={palette.onAccent} style={{ marginTop: 44 }} />
        )}
      </div>
    </Canvas>
  );
}
