import { NAV_THEME_COLORS } from "../../constants/navTheme";
import type { NavThemeColorId } from "../../constants/navTheme";
import {
  PAGE_BACKGROUND_IDS,
  PAGE_BACKGROUND_LABELS,
  type PageBackgroundId,
} from "../../constants/pageBackgrounds";
import {
  getDefaultPageTextColorId,
  getPageTextColorId,
  type PageTextColors,
} from "../../constants/pageTextColors";
import "./PageTextColorSettings.css";

interface PageTextColorSettingsProps {
  pageTextColors: PageTextColors;
  onSetTextColor: (pageId: PageBackgroundId, colorId: NavThemeColorId) => void;
  onClearTextColor: (pageId: PageBackgroundId) => void;
}

export function PageTextColorSettings({
  pageTextColors,
  onSetTextColor,
  onClearTextColor,
}: PageTextColorSettingsProps) {
  return (
    <section className="page-text-settings">
      <h3 className="page-text-settings__title">Page text colours</h3>
      <p className="page-text-settings__hint">
        Choose a text colour for every page. Titles, labels, and body text inherit the colour
        you pick. Accent colours on buttons and cards stay unchanged.
      </p>
      <ul className="page-text-settings__list">
        {PAGE_BACKGROUND_IDS.filter((id) => id !== "dream-reminder").map((pageId) => {
          const value = getPageTextColorId(pageId, pageTextColors);
          const isCustom = pageTextColors[pageId] !== undefined;
          const defaultId = getDefaultPageTextColorId(pageId);

          return (
            <li key={pageId} className="page-text-settings__row">
              <span className="page-text-settings__label">{PAGE_BACKGROUND_LABELS[pageId]}</span>
              <div
                className="page-text-settings__swatches"
                role="listbox"
                aria-label={`Text colour for ${PAGE_BACKGROUND_LABELS[pageId]}`}
              >
                {NAV_THEME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    role="option"
                    className={`page-text-settings__swatch${value === color.id ? " page-text-settings__swatch--selected" : ""}${color.id === "white" ? " page-text-settings__swatch--bordered" : ""}`}
                    style={{ background: color.fill }}
                    onClick={() => onSetTextColor(pageId, color.id)}
                    aria-selected={value === color.id}
                    aria-label={color.label}
                    title={color.label}
                  />
                ))}
              </div>
              {isCustom && (
                <button
                  type="button"
                  className="page-text-settings__reset"
                  onClick={() => onClearTextColor(pageId)}
                  title={`Reset to default (${NAV_THEME_COLORS.find((c) => c.id === defaultId)?.label ?? defaultId})`}
                >
                  Reset
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
