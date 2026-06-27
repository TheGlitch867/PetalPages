import type { PageBackgroundId } from "./pageBackgrounds";
import { PAGE_BACKGROUND_IDS } from "./pageBackgrounds";
import {
  DEFAULT_NAV_TEXT,
  getNavThemeColor,
  isNavThemeColorId,
  type NavThemeColorId,
} from "./navTheme";

export type PageTextColors = Partial<Record<PageBackgroundId, NavThemeColorId>>;

const DEFAULT_PAGE_TEXT_COLOR: NavThemeColorId = "black";

/** Pages whose default text colour differs from black. */
export const PAGE_DEFAULT_TEXT_COLORS: Partial<Record<PageBackgroundId, NavThemeColorId>> = {
  reading: "white",
  trends: "red",
};

export function getDefaultPageTextColorId(pageId: PageBackgroundId): NavThemeColorId {
  return PAGE_DEFAULT_TEXT_COLORS[pageId] ?? DEFAULT_PAGE_TEXT_COLOR;
}

export function normalizePageTextColors(raw: unknown): PageTextColors {
  if (!raw || typeof raw !== "object") return {};

  const result: PageTextColors = {};
  for (const id of PAGE_BACKGROUND_IDS) {
    const value = (raw as Record<string, unknown>)[id];
    if (isNavThemeColorId(value)) result[id] = value;
  }
  return result;
}

export function mergePageTextColors(local: PageTextColors, cloud: PageTextColors): PageTextColors {
  return normalizePageTextColors({ ...cloud, ...local });
}

export function getPageTextColorId(
  pageId: PageBackgroundId,
  pageTextColors: PageTextColors,
): NavThemeColorId {
  return pageTextColors[pageId] ?? getDefaultPageTextColorId(pageId);
}

export function getPageTextColorFill(
  pageId: PageBackgroundId,
  pageTextColors: PageTextColors,
): string {
  const colorId = getPageTextColorId(pageId, pageTextColors);
  return getNavThemeColor(colorId, DEFAULT_NAV_TEXT).fill;
}

export function getPageTextColorStyle(
  pageId: PageBackgroundId,
  pageTextColors: PageTextColors,
): { "--page-text-color": string; color: string } {
  const fill = getPageTextColorFill(pageId, pageTextColors);
  return { "--page-text-color": fill, color: fill };
}
