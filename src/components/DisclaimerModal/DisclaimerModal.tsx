import { useState } from "react";
import {
  DISCLAIMER_ACCEPT_LABEL,
  DISCLAIMER_CHECKBOX_LABEL,
  DISCLAIMER_PARAGRAPHS,
  DISCLAIMER_TITLE,
  acceptDisclaimer,
} from "../../constants/disclaimer";
import "./DisclaimerModal.css";

interface DisclaimerModalProps {
  onAccept: () => void;
}

export function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (!checked) return;
    acceptDisclaimer();
    onAccept();
  };

  return (
    <div
      className="disclaimer-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
    >
      <div className="disclaimer-modal">
        <h2 id="disclaimer-modal-title" className="disclaimer-modal__title">
          {DISCLAIMER_TITLE}
        </h2>

        <div className="disclaimer-modal__body">
          {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="disclaimer-modal__paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <label className="disclaimer-modal__check">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>{DISCLAIMER_CHECKBOX_LABEL}</span>
        </label>

        <button
          type="button"
          className="disclaimer-modal__accept"
          onClick={handleAccept}
          disabled={!checked}
          aria-label={`${DISCLAIMER_ACCEPT_LABEL} — confirm disclaimer`}
        >
          ✓
        </button>
      </div>
    </div>
  );
}
