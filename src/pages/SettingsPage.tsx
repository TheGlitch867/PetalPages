import type { AppSettings } from "../constants/appSettings";
import { NavThemeColorPicker } from "../components/NavThemeColorPicker/NavThemeColorPicker";
import { PopupBackgroundSettings } from "../components/PopupBackgroundSettings/PopupBackgroundSettings";
import { PageBackgroundSettings } from "../components/PageBackgroundSettings/PageBackgroundSettings";
import { PageTextColorSettings } from "../components/PageTextColorSettings/PageTextColorSettings";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { PageBackgroundId, PageBackgrounds } from "../constants/pageBackgrounds";
import type { PageTextColors } from "../constants/pageTextColors";
import type { NavThemeColorId } from "../constants/navTheme";
import "./SettingsPage.css";

interface SettingsPageProps {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  pageBackgrounds: PageBackgrounds;
  onSetPageBackground: (pageId: PageBackgroundId, dataUrl: string) => void;
  onClearPageBackground: (pageId: PageBackgroundId) => void;
  pageTextColors: PageTextColors;
  onSetPageTextColor: (pageId: PageBackgroundId, colorId: NavThemeColorId) => void;
  onClearPageTextColor: (pageId: PageBackgroundId) => void;
}

export function SettingsPage({
  settings,
  onUpdate,
  pageBackgrounds,
  onSetPageBackground,
  onClearPageBackground,
  pageTextColors,
  onSetPageTextColor,
  onClearPageTextColor,
}: SettingsPageProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <PageBackground pageId="settings" className="settings-page">
      <div className="settings settings-page__panel">
        <h2 className="settings__title">Settings</h2>

        <PopupBackgroundSettings
          pageBackgrounds={pageBackgrounds}
          onSetBackground={onSetPageBackground}
          onClearBackground={onClearPageBackground}
        />

        <PageBackgroundSettings
          pageBackgrounds={pageBackgrounds}
          onSetBackground={onSetPageBackground}
          onClearBackground={onClearPageBackground}
        />

        <PageTextColorSettings
          pageTextColors={pageTextColors}
          onSetTextColor={onSetPageTextColor}
          onClearTextColor={onClearPageTextColor}
        />

        <h3 className="settings__section-title">General</h3>

        <label className="settings__field">
          <span className="settings__label">Year</span>
          <select
            className="settings__select"
            value={settings.year}
            onChange={(e) => onUpdate({ year: Number(e.target.value) })}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="settings__field settings__field--checkbox">
          <input
            type="checkbox"
            checked={settings.allowFuture}
            onChange={(e) => onUpdate({ allowFuture: e.target.checked })}
          />
          <span>Allow rating future dates</span>
        </label>

        <h3 className="settings__section-title">Sidebar</h3>

        <div className="settings__field">
          <NavThemeColorPicker
            label="Sidebar background colour"
            value={settings.navBackgroundColorId}
            onChange={(navBackgroundColorId) => onUpdate({ navBackgroundColorId })}
          />
        </div>

        <div className="settings__field">
          <NavThemeColorPicker
            label="Sidebar text colour"
            value={settings.navTextColorId}
            onChange={(navTextColorId) => onUpdate({ navTextColorId })}
          />
        </div>

        <p className="settings__note">
          When signed in (Account tab), settings and tracker data sync to the
          cloud. Otherwise everything is saved locally on this device.
        </p>
      </div>
    </PageBackground>
  );
}
