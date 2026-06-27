import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  submitFeedback,
  type FeedbackKind,
} from "../../services/feedbackService";
import "./FeedbackButton.css";

export function FeedbackButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>("feedback");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const close = () => {
    setOpen(false);
    setError(null);
    setSent(false);
    setMessage("");
    setKind("feedback");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const result = await submitFeedback({
      kind,
      message,
      userEmail: user?.email ?? null,
      userId: user?.uid ?? null,
    });

    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
    setMessage("");
  };

  return (
    <>
      <button
        type="button"
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Send bug report or feedback"
        title="Bug / Feedback"
      >
        🐞
      </button>

      {open && (
        <div
          className="feedback-dialog-backdrop"
          onClick={close}
          role="presentation"
        >
          <div
            className="feedback-dialog"
            role="dialog"
            aria-labelledby="feedback-dialog-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="feedback-dialog__close"
              onClick={close}
              aria-label="Close"
            >
              ×
            </button>

            <h2 id="feedback-dialog-title" className="feedback-dialog__title">
              🐞 Bug / Feedback
            </h2>
            <p className="feedback-dialog__sub">
              Found a bug or have an idea? Send a note to the author.
            </p>

            {sent ? (
              <div className="feedback-dialog__success">
                <p>Thanks — your message was sent!</p>
                <button type="button" className="feedback-dialog__submit" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <form className="feedback-dialog__form" onSubmit={handleSubmit}>
                <fieldset className="feedback-dialog__types">
                  <legend className="feedback-dialog__types-label">Type</legend>
                  <label className="feedback-dialog__type">
                    <input
                      type="radio"
                      name="feedback-kind"
                      value="bug"
                      checked={kind === "bug"}
                      onChange={() => setKind("bug")}
                    />
                    Bug
                  </label>
                  <label className="feedback-dialog__type">
                    <input
                      type="radio"
                      name="feedback-kind"
                      value="feedback"
                      checked={kind === "feedback"}
                      onChange={() => setKind("feedback")}
                    />
                    Feedback
                  </label>
                </fieldset>

                <label className="feedback-dialog__field">
                  <span className="feedback-dialog__label">Message</span>
                  <textarea
                    className="feedback-dialog__textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the bug or share your feedback…"
                    rows={5}
                    required
                    disabled={busy}
                  />
                </label>

                {user?.email && (
                  <p className="feedback-dialog__from">
                    Sending as <strong>{user.email}</strong>
                  </p>
                )}

                {error && <p className="feedback-dialog__error">{error}</p>}

                <button
                  type="submit"
                  className="feedback-dialog__submit"
                  disabled={busy || !message.trim()}
                >
                  {busy ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
