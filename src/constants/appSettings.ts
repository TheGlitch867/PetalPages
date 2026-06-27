import type { NavThemeColorId } from "./navTheme";
import {
  DEFAULT_NAV_BACKGROUND,
  DEFAULT_NAV_TEXT,
  normalizeNavThemeColorId,
} from "./navTheme";

export interface AppSettings {
  year: number;
  allowFuture: boolean;
  navBackgroundColorId: NavThemeColorId;
  navTextColorId: NavThemeColorId;
}

export function defaultAppSettings(): AppSettings {
  return {
    year: new Date().getFullYear(),
    allowFuture: false,
    navBackgroundColorId: DEFAULT_NAV_BACKGROUND,
    navTextColorId: DEFAULT_NAV_TEXT,
  };
}

export function normalizeAppSettings(raw: unknown): AppSettings {
  const defaults = defaultAppSettings();
  if (!raw || typeof raw !== "object") return defaults;

  const settings = raw as Record<string, unknown>;
  return {
    year: typeof settings.year === "number" ? settings.year : defaults.year,
    allowFuture:
      typeof settings.allowFuture === "boolean"
        ? settings.allowFuture
        : defaults.allowFuture,
    navBackgroundColorId: normalizeNavThemeColorId(
      settings.navBackgroundColorId,
      DEFAULT_NAV_BACKGROUND,
    ),
    navTextColorId: normalizeNavThemeColorId(
      settings.navTextColorId,
      DEFAULT_NAV_TEXT,
    ),
  };
}
