/**
 * Colour schemes selectable in the pin editor. The first entry is the exact
 * look of the reference pin; the others recolour the same layout.
 */
export type Palette = {
  id: string;
  name: string;
  /** Canvas / gutter colour */
  bg: string;
  /** Headline fill */
  text: string;
  /** Headline outline */
  outline: string;
};

export const PALETTES: Palette[] = [
  // Reference look
  { id: "classic", name: "Classic", bg: "#FFFFFF", text: "#FFFFFF", outline: "#000000" },
  { id: "inverse", name: "Inverse", bg: "#FFFFFF", text: "#111111", outline: "#FFFFFF" },
  // White text, coloured outline
  { id: "terracotta", name: "Terracotta", bg: "#FFFFFF", text: "#FFFFFF", outline: "#B4532A" },
  { id: "coral", name: "Coral", bg: "#FFFFFF", text: "#FFFFFF", outline: "#E0523A" },
  { id: "rose", name: "Rose", bg: "#FFFFFF", text: "#FFFFFF", outline: "#BE123C" },
  { id: "berry", name: "Berry", bg: "#FFFFFF", text: "#FFFFFF", outline: "#8E1D4C" },
  { id: "plum", name: "Plum", bg: "#FFFFFF", text: "#FFFFFF", outline: "#5B2A86" },
  { id: "navy", name: "Navy", bg: "#FFFFFF", text: "#FFFFFF", outline: "#1E3A5F" },
  { id: "ocean", name: "Ocean", bg: "#FFFFFF", text: "#FFFFFF", outline: "#0E7490" },
  { id: "forest", name: "Forest", bg: "#FFFFFF", text: "#FFFFFF", outline: "#2F5D3A" },
  { id: "olive", name: "Olive", bg: "#FFFFFF", text: "#FFFFFF", outline: "#5E6B2F" },
  { id: "chocolate", name: "Chocolate", bg: "#FFFFFF", text: "#FFFFFF", outline: "#4A2C1A" },
  { id: "slate", name: "Slate", bg: "#FFFFFF", text: "#FFFFFF", outline: "#334155" },
  // Tinted text, dark outline
  { id: "cream", name: "Cream", bg: "#FFFFFF", text: "#FFF4DF", outline: "#2B2420" },
  { id: "sunshine", name: "Sunshine", bg: "#FFFFFF", text: "#FDE047", outline: "#111111" },
  { id: "lemon", name: "Lemon", bg: "#FFFFFF", text: "#FEF9C3", outline: "#713F12" },
  { id: "peach", name: "Peach", bg: "#FFFFFF", text: "#FFE4D6", outline: "#7C2D12" },
  { id: "blush", name: "Blush", bg: "#FFFFFF", text: "#FCE7F3", outline: "#9D174D" },
  { id: "lavender", name: "Lavender", bg: "#FFFFFF", text: "#EDE9FE", outline: "#4C1D95" },
  { id: "sky", name: "Sky", bg: "#FFFFFF", text: "#DBEAFE", outline: "#1E3A8A" },
  { id: "mint", name: "Mint", bg: "#FFFFFF", text: "#BBF7D0", outline: "#064E3B" },
  { id: "teal", name: "Teal", bg: "#FFFFFF", text: "#CCFBF1", outline: "#134E4A" },
  { id: "gold", name: "Gold", bg: "#FFFFFF", text: "#F5D142", outline: "#3B2A06" },
  // Tinted gutters
  { id: "linen", name: "Linen", bg: "#F7F2EA", text: "#FFFFFF", outline: "#3F3A33" },
  { id: "sand", name: "Sand", bg: "#F5EFE6", text: "#FFFFFF", outline: "#5C4B3B" },
  { id: "sage", name: "Sage", bg: "#E8EFE6", text: "#FFFFFF", outline: "#2F4A36" },
  { id: "charcoal", name: "Charcoal", bg: "#1C1C1C", text: "#FFFFFF", outline: "#1C1C1C" },
  { id: "noir", name: "Noir", bg: "#111111", text: "#F5D142", outline: "#111111" },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;

/** Lighten (amount > 0) or darken (amount < 0) a #RRGGBB colour by a fraction. */
export function shade(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return hex;
  const ch = (h: string) => {
    const v = parseInt(h, 16);
    const out = amount < 0 ? v * (1 + amount) : v + (255 - v) * amount;
    return Math.round(Math.max(0, Math.min(255, out))).toString(16).padStart(2, "0");
  };
  return `#${ch(m[1])}${ch(m[2])}${ch(m[3])}`.toUpperCase();
}

export function getPalette(id: string | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
