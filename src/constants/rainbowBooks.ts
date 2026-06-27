import type { RainbowBookSlot, RainbowBookSlots } from "../types/rainbowBooks";

export const RAINBOW_BOOK_COLORS = [
  { id: "red", label: "RED", border: "#e53935", spine: "#c62828", labelColor: "#e53935" },
  { id: "orange", label: "ORANGE", border: "#ff9800", spine: "#ef6c00", labelColor: "#ff9800" },
  { id: "yellow", label: "YELLOW", border: "#fbc02d", spine: "#f9a825", labelColor: "#f9a825" },
  { id: "green", label: "GREEN", border: "#43a047", spine: "#2e7d32", labelColor: "#43a047" },
  { id: "blue", label: "BLUE", border: "#1565c0", spine: "#0d47a1", labelColor: "#1565c0" },
  { id: "purple", label: "PURPLE", border: "#ab47bc", spine: "#7b1fa2", labelColor: "#ab47bc" },
  { id: "pink", label: "PINK", border: "#f06292", spine: "#d81b60", labelColor: "#f06292" },
  { id: "brown", label: "BROWN", border: "#795548", spine: "#5d4037", labelColor: "#795548" },
  { id: "white", label: "WHITE", border: "#bdbdbd", spine: "#e0e0e0", labelColor: "#9e9e9e" },
  { id: "grey", label: "GREY", border: "#9e9e9e", spine: "#757575", labelColor: "#757575" },
  { id: "black", label: "BLACK", border: "#212121", spine: "#000000", labelColor: "#212121" },
] as const;

export type RainbowColorId = (typeof RAINBOW_BOOK_COLORS)[number]["id"];

export const RAINBOW_BOOK_COUNT = RAINBOW_BOOK_COLORS.length;

export function createEmptyRainbowBookSlots(): RainbowBookSlots {
  return Array.from({ length: RAINBOW_BOOK_COUNT }, () => ({}));
}

function normalizeSlot(raw: unknown): RainbowBookSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as RainbowBookSlot;
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    return { imageDataUrl: slot.imageDataUrl };
  }
  return {};
}

export function normalizeRainbowBookSlots(raw: unknown): RainbowBookSlots {
  const empty = createEmptyRainbowBookSlots();
  if (!Array.isArray(raw)) return empty;
  return empty.map((_, index) => normalizeSlot(raw[index]));
}

export function mergeRainbowBookSlots(
  local: RainbowBookSlots,
  cloud: RainbowBookSlots,
): RainbowBookSlots {
  return local.map((localSlot, index) => {
    const cloudSlot = cloud[index] ?? {};
    return {
      imageDataUrl: localSlot.imageDataUrl ?? cloudSlot.imageDataUrl,
    };
  });
}
