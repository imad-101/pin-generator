import type { Palette } from "./types";

export const PALETTES: Palette[] = [
  { id: "blush", name: "Blush", bg: "#FFF1F2", accent: "#E11D48", text: "#1F1F1F", onAccent: "#FFFFFF", muted: "#9F1239" },
  { id: "sage", name: "Sage", bg: "#F1F5EE", accent: "#3F6B4A", text: "#1B2A1F", onAccent: "#FFFFFF", muted: "#4F6B57" },
  { id: "midnight", name: "Midnight", bg: "#0F172A", accent: "#F59E0B", text: "#F8FAFC", onAccent: "#0F172A", muted: "#CBD5E1" },
  { id: "ocean", name: "Ocean", bg: "#EFF6FF", accent: "#1D4ED8", text: "#0F172A", onAccent: "#FFFFFF", muted: "#3B5BA9" },
  { id: "sand", name: "Sand", bg: "#FAF5EC", accent: "#B45309", text: "#2A2118", onAccent: "#FFFFFF", muted: "#8A6A4A" },
  { id: "lavender", name: "Lavender", bg: "#F5F3FF", accent: "#6D28D9", text: "#1E1B4B", onAccent: "#FFFFFF", muted: "#6B5FA6" },
  { id: "charcoal", name: "Charcoal", bg: "#1C1C1C", accent: "#F4F4F5", text: "#FAFAFA", onAccent: "#111111", muted: "#A1A1AA" },
  { id: "coral", name: "Coral", bg: "#FFF7ED", accent: "#F97316", text: "#1C1917", onAccent: "#FFFFFF", muted: "#9A5B2E" },
  { id: "mint", name: "Mint", bg: "#ECFDF5", accent: "#059669", text: "#022C22", onAccent: "#FFFFFF", muted: "#3F7A66" },
  { id: "mono", name: "Mono", bg: "#FFFFFF", accent: "#111111", text: "#111111", onAccent: "#FFFFFF", muted: "#6B7280" },
];

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
