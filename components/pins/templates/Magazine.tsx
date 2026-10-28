import { Canvas, PinImage, Headline, Subtitle, CtaButton, SiteLabel, type TemplateProps } from "../shared";

export function Magazine({ config, palette, font }: TemplateProps) {
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
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div style={{ position: "absolute", top: 64, left: 64, right: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          {config.showSite ? <SiteLabel text={config.siteLabel} font={font} color="#FFFFFF" size={24} /> : <span />}
          <div
            style={{
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.12em",
              padding: "12px 22px",
              background: palette.accent,
              color: palette.onAccent,
              borderRadius: 6,
            }}
          >
            MUST READ
          </div>
        </div>
        <Headline text={config.headline} font={font} color="#FFFFFF" base={104} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 64px",
          background: palette.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {config.showSubtitle ? (
          <Subtitle text={config.subtitle} font={font} color={palette.text} size={25} style={{ flex: 1 }} />
        ) : (
          <span style={{ flex: 1 }} />
        )}
        {config.showCta && (
          <CtaButton
            text={config.cta}
            font={font}
            bg={palette.accent}
            color={palette.onAccent}
            style={{ flexShrink: 0, padding: "18px 34px", fontSize: 24 }}
          />
        )}
      </div>
    </Canvas>
  );
}
