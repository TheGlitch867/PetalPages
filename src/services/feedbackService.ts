import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isCloudConfigured } from "../lib/firebase";

export type FeedbackKind = "bug" | "feedback";

export interface FeedbackPayload {
  kind: FeedbackKind;
  message: string;
  userEmail?: string | null;
  userId?: string | null;
}

const feedbackEmail = import.meta.env.VITE_FEEDBACK_EMAIL?.trim();

function mailtoFallback(payload: FeedbackPayload): { error: string | null } {
  if (!feedbackEmail) {
    return {
      error: "Feedback is not configured yet. Ask the author to set up cloud sync or a feedback email.",
    };
  }

  const label = payload.kind === "bug" ? "Bug report" : "Feedback";
  const subject = encodeURIComponent(`PetalPages — ${label}`);
  const lines = [
    payload.message,
    "",
    "---",
    payload.userEmail ? `From: ${payload.userEmail}` : "From: (not signed in)",
    `Type: ${label}`,
  ];
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
  return { error: null };
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<{ error: string | null }> {
  const message = payload.message.trim();
  if (!message) {
    return { error: "Please write a message before sending." };
  }

  if (!isCloudConfigured || !db) {
    return mailtoFallback({ ...payload, message });
  }

  try {
    await addDoc(collection(db, "feedback"), {
      kind: payload.kind,
      message,
      userEmail: payload.userEmail ?? null,
      userId: payload.userId ?? null,
      createdAt: serverTimestamp(),
      appVersion: import.meta.env.VITE_APP_VERSION ?? "0.1.0",
    });
    return { error: null };
  } catch (err) {
    if (feedbackEmail) {
      return mailtoFallback({ ...payload, message });
    }
    return {
      error:
        err instanceof Error
          ? err.message
          : "Could not send feedback. Please try again later.",
    };
  }
}
