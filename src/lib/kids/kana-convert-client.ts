/**
 * Calls /api/kana-convert to turn kanji/katakana-mixed speech-recognition
 * text into hiragana server-side. Returns null on any failure or timeout so
 * the caller can fall back to a local best-effort conversion instead.
 */
export async function convertToHiraganaViaApi(
  text: string,
  timeoutMs = 4000,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("/api/kana-convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const hiragana =
      typeof data === "object" && data !== null && "hiragana" in data
        ? (data as { hiragana: unknown }).hiragana
        : null;
    return typeof hiragana === "string" && hiragana.trim() !== ""
      ? hiragana
      : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
