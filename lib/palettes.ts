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
  { id: "classic", name: "Classic", bg: "#FFFFFF", text: "#FFFFFF", outline: "#000000" },
  { id: "inverse", name: "Inverse", bg: "#FFFFFF", text: "#111111", outline: "#FFFFFF" },
  { id: "cream", name: "Cream", bg: "#FFFFFF", text: "#FFF4DF", outline: "#2B2420" },
  { id: "terracotta", name: "Terracotta", bg: "#FFFFFF", text: "#FFFFFF", outline: "#B4532A" },
  { id: "forest", name: "Forest", bg: "#FFFFFF", text: "#FFFFFF", outline: "#2F5D3A" },
  { id: "navy", name: "Navy", bg: "#FFFFFF", text: "#FFFFFF", outline: "#1E3A5F" },
  { id: "berry", name: "Berry", bg: "#FFFFFF", text: "#FFFFFF", outline: "#8E1D4C" },
  { id: "sunshine", name: "Sunshine", bg: "#FFFFFF", text: "#FDE047", outline: "#111111" },
  { id: "mint", name: "Mint", bg: "#FFFFFF", text: "#BBF7D0", outline: "#064E3B" },
  { id: "blush", name: "Blush", bg: "#FFFFFF", text: "#FCE7F3", outline: "#9D174D" },
  { id: "sand", name: "Sand", bg: "#F5EFE6", text: "#FFFFFF", outline: "#5C4B3B" },
  { id: "charcoal", name: "Charcoal", bg: "#1C1C1C", text: "#FFFFFF", outline: "#1C1C1C" },
];

export const DEFAULT_PALETTE_ID = PALETTES[0].id;

export function getPalette(id: string | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
