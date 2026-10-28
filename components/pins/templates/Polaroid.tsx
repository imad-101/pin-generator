import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, ScriptLabel, type TemplateProps } from "../shared";

export function Polaroid({ config, palette, font }: TemplateProps) {
  return (
    <Canvas style={{ background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${palette.accent}22 2px, transparent 2px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div style={{ position: "absolute", top: 72, left: 0, right: 0, textAlign: "center" }}>
        <ScriptLabel text="new on the blog" color={palette.accent} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 120,
          width: 760,
          height: 820,
          background: "#FFFFFF",
          padding: "28px 28px 100px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.22)",
          transform: "rotate(-3deg)",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <PinImage src={config.images[0]} palette={palette} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1060,
          bottom: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <Headline text={config.headline} font={font} color={palette.text} base={66} align="center" />
        {config.showSubtitle && (
          <Subtitle text={config.subtitle} font={font} color={palette.muted} align="center" size={26} />
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          {config.showCta && <CtaButton text={config.cta} font={font} bg={palette.accent} color={palette.onAccent} />}
          {config.showSite && <SiteLabel text={config.siteLabel} font={font} color={palette.muted} size={22} />}
        </div>
      </div>
    </Canvas>
  );
}
