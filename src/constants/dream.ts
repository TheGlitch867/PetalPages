export function normalizeDreamText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function mergeDreamText(local: string, cloud: string | undefined): string {
  const cloudTrimmed = (cloud ?? "").trim();
  if (cloudTrimmed) return cloudTrimmed;
  return local;
}
