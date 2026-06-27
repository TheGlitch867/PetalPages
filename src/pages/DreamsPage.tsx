import { useEffect, useState } from "react";
import { PageBackground } from "../components/PageBackground/PageBackground";
import "./DreamsPage.css";

interface DreamsPageProps {
  dreamText: string;
  setDreamText: (text: string) => void;
}

export function DreamsPage({ dreamText, setDreamText }: DreamsPageProps) {
  const [draft, setDraft] = useState(dreamText);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(dreamText);
  }, [dreamText]);

  const handleSave = () => {
    const next = draft.trim();
    setDreamText(next);
    setDraft(next);
    setSavedMessage("Saved");
    window.setTimeout(() => setSavedMessage(null), 2000);
  };

  const handleBlur = () => {
    const next = draft.trim();
    if (next !== dreamText) {
      setDreamText(next);
      setDraft(next);
    }
  };

  return (
    <PageBackground pageId="dreams" className="dreams-page">
      <h1 className="dreams-page__title">Dreams</h1>

      <textarea
        className="dreams-page__dream"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder="My dream is to…"
        aria-label="Your dream"
        rows={4}
      />

      <div className="dreams-page__actions">
        <button type="button" className="dreams-page__save" onClick={handleSave}>
          Save
        </button>
        {savedMessage && (
          <span className="dreams-page__saved" role="status">
            {savedMessage}
          </span>
        )}
      </div>
    </PageBackground>
  );
}
