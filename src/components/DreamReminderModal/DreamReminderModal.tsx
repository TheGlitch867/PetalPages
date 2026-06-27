import "./DreamReminderModal.css";

interface DreamReminderModalProps {
  dreamText: string;
  backgroundUrl: string;
  onDismiss: () => void;
}

export function DreamReminderModal({
  dreamText,
  backgroundUrl,
  onDismiss,
}: DreamReminderModalProps) {
  return (
    <div
      className="dream-reminder-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Your dream reminder"
    >
      <div className="dream-reminder">
        <div
          className="dream-reminder__backdrop"
          style={{ backgroundImage: `url("${backgroundUrl}")` }}
          aria-hidden="true"
        />
        <div className="dream-reminder__scrim" aria-hidden="true" />
        <p className="dream-reminder__dream">{dreamText}</p>
        <button type="button" className="dream-reminder__confirm" onClick={onDismiss}>
          I will continue to work for this
        </button>
      </div>
    </div>
  );
}
