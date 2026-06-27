import { useRef } from "react";
import {
  getPageBackgroundUrl,
  type PageBackgroundId,
  type PageBackgrounds,
} from "../../constants/pageBackgrounds";
import { fileToBackgroundDataUrl } from "../../utils/imageUtils";
import "./PopupBackgroundSettings.css";

const POPUP_BACKGROUND_ID = "dream-reminder" as const satisfies PageBackgroundId;

interface PopupBackgroundSettingsProps {
  pageBackgrounds: PageBackgrounds;
  onSetBackground: (pageId: PageBackgroundId, dataUrl: string) => void;
  onClearBackground: (pageId: PageBackgroundId) => void;
}

export function PopupBackgroundSettings({
  pageBackgrounds,
  onSetBackground,
  onClearBackground,
}: PopupBackgroundSettingsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCustom = Boolean(pageBackgrounds[POPUP_BACKGROUND_ID]);
  const previewUrl = getPageBackgroundUrl(POPUP_BACKGROUND_ID, pageBackgrounds);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToBackgroundDataUrl(file);
      onSetBackground(POPUP_BACKGROUND_ID, dataUrl);
    } catch {
      // ignore invalid uploads
    }
  };

  return (
    <section className="popup-bg-settings">
      <h3 className="popup-bg-settings__title">Startup popup background</h3>
      <p className="popup-bg-settings__hint">
        Shown when you open the app and have a dream saved. Separate from the Dreams page
        background.
      </p>
      <div className="popup-bg-settings__row">
        <div
          className="popup-bg-settings__preview"
          style={{ backgroundImage: `url("${previewUrl}")` }}
          aria-hidden="true"
        />
        <div className="popup-bg-settings__info">
          <span className="popup-bg-settings__label">Dream reminder popup</span>
          <span className="popup-bg-settings__status">
            {hasCustom ? "Custom image" : "Default desert sunset"}
          </span>
        </div>
        <div className="popup-bg-settings__actions">
          <button
            type="button"
            className="popup-bg-settings__btn"
            onClick={() => inputRef.current?.click()}
          >
            Import
          </button>
          {hasCustom && (
            <button
              type="button"
              className="popup-bg-settings__btn popup-bg-settings__btn--secondary"
              onClick={() => onClearBackground(POPUP_BACKGROUND_ID)}
            >
              Reset
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="popup-bg-settings__file"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </section>
  );
}
