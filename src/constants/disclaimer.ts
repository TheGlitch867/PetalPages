export const DISCLAIMER_STORAGE_KEY = "rate-my-day-disclaimer-accepted";

export const DISCLAIMER_TITLE = "Test application notice";

export const DISCLAIMER_PARAGRAPHS = [
  "PetalPages is a test application and is not in use for production.",
  "Do not store any personal information in this app.",
];

export const DISCLAIMER_CHECKBOX_LABEL =
  "I have read and understand this disclaimer";

export const DISCLAIMER_ACCEPT_LABEL = "Continue";

export function isDisclaimerAccepted(): boolean {
  try {
    return localStorage.getItem(DISCLAIMER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function acceptDisclaimer(): void {
  localStorage.setItem(DISCLAIMER_STORAGE_KEY, "true");
}
