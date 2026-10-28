import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function Arch({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 130,
          width: 740,
          height: 860,
          borderRadius: "370px 370px 32px 32px",
          overflow: "hidden",
          boxShadow: `0 0 0 14px ${palette.bg}, 0 0 0 18px ${palette.accent}`,
        }}
      >
        <PinImage src={config.images[0]} palette={palette} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 80,
          right: 80,
          bottom: 72,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        {config.showSite && <SiteLabel text={config.siteLabel} font={font} color={palette.accent} size={22} />}
        <Headline text={config.headline} font={font} color={palette.text} base={70} align="center" />
        {config.showSubtitle && (
          <Subtitle text={config.subtitle} font={font} color={palette.muted} align="center" size={26} />
        )}
        <div style={{ flex: 1 }} />
        {config.showCta && <CtaButton text={config.cta} font={font} bg={palette.accent} color={palette.onAccent} />}
      </div>
    </Canvas>
  );
}
