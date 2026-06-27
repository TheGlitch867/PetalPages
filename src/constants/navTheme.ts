import { getShowTvColor } from "./shows";

export const NAV_THEME_COLOR_IDS = [
  "red",
  "orange",
  "sunny-yellow",
  "light-green",
  "vibrant-green",
  "light-blue",
  "ocean-blue",
  "light-purple",
  "lilac-purple",
  "light-pink",
  "rose",
  "white",
  "grey",
  "brown",
  "black",
] as const;

export type NavThemeColorId = (typeof NAV_THEME_COLOR_IDS)[number];

export const NAV_THEME_COLORS = NAV_THEME_COLOR_IDS.map((id) => {
  const color = getShowTvColor(id);
  const label = id === "sunny-yellow" ? "Yellow" : color.label;
  return { id, label, fill: color.fill };
});

export const DEFAULT_NAV_BACKGROUND: NavThemeColorId = "white";
export const DEFAULT_NAV_TEXT: NavThemeColorId = "black";

export function isNavThemeColorId(value: unknown): value is NavThemeColorId {
  return typeof value === "string" && (NAV_THEME_COLOR_IDS as readonly string[]).includes(value);
}

export function normalizeNavThemeColorId(
  value: unknown,
  fallback: NavThemeColorId,
): NavThemeColorId {
  return isNavThemeColorId(value) ? value : fallback;
}

export function getNavThemeColor(
  id: NavThemeColorId | undefined,
  fallback: NavThemeColorId = DEFAULT_NAV_TEXT,
) {
  const resolved = normalizeNavThemeColorId(id, fallback);
  return NAV_THEME_COLORS.find((c) => c.id === resolved) ?? NAV_THEME_COLORS[NAV_THEME_COLORS.length - 1];
}
