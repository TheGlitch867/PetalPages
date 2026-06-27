import { useRef } from "react";
import {
  PAGE_BACKGROUND_IDS,
  PAGE_BACKGROUND_LABELS,
  getPageBackgroundUrl,
  type PageBackgroundId,
  type PageBackgrounds,
} from "../../constants/pageBackgrounds";
import { fileToBackgroundDataUrl } from "../../utils/imageUtils";
import "./PageBackgroundSettings.css";

interface PageBackgroundSettingsProps {
  pageBackgrounds: PageBackgrounds;
  onSetBackground: (pageId: PageBackgroundId, dataUrl: string) => void;
  onClearBackground: (pageId: PageBackgroundId) => void;
}

export function PageBackgroundSettings({
  pageBackgrounds,
  onSetBackground,
  onClearBackground,
}: PageBackgroundSettingsProps) {
  const inputRefs = useRef<Partial<Record<PageBackgroundId, HTMLInputElement | null>>>({});

  const handleFile = async (pageId: PageBackgroundId, file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToBackgroundDataUrl(file);
      onSetBackground(pageId, dataUrl);
    } catch {
      // ignore invalid uploads
    }
  };

  return (
    <section className="page-bg-settings">
      <h3 className="page-bg-settings__title">Page backgrounds</h3>
      <p className="page-bg-settings__hint">
        Import a custom background for every page in the app. Images are compressed and saved
        on this device, and sync when you are signed in.
      </p>
      <ul className="page-bg-settings__list">
        {PAGE_BACKGROUND_IDS.filter((id) => id !== "dream-reminder").map((pageId) => {
          const hasCustom = Boolean(pageBackgrounds[pageId]);
          const previewUrl = getPageBackgroundUrl(pageId, pageBackgrounds);

          return (
            <li key={pageId} className="page-bg-settings__row">
              <div
                className="page-bg-settings__preview"
                style={{ backgroundImage: `url("${previewUrl}")` }}
                aria-hidden="true"
              />
              <div className="page-bg-settings__info">
                <span className="page-bg-settings__label">{PAGE_BACKGROUND_LABELS[pageId]}</span>
                <span className="page-bg-settings__status">
                  {hasCustom ? "Custom image" : "Default image"}
                </span>
              </div>
              <div className="page-bg-settings__actions">
                <button
                  type="button"
                  className="page-bg-settings__btn"
                  onClick={() => inputRefs.current[pageId]?.click()}
                >
                  Import
                </button>
                {hasCustom && (
                  <button
                    type="button"
                    className="page-bg-settings__btn page-bg-settings__btn--secondary"
                    onClick={() => onClearBackground(pageId)}
                  >
                    Reset
                  </button>
                )}
              </div>
              <input
                ref={(el) => {
                  inputRefs.current[pageId] = el;
                }}
                type="file"
                accept="image/*"
                className="page-bg-settings__file"
                onChange={(e) => {
                  void handleFile(pageId, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
