/**
 * Some TTS voices read a bare numeral like "3" in English ("Three") even on
 * a `lang="ja-JP"` utterance. Spelling the number out in hiragana before it
 * ever reaches SpeechSynthesisUtterance sidesteps that instead of relying on
 * the voice's own (unreliable) number-to-word conversion.
 */
const DIGIT_WORDS = [
  "れい",
  "いち",
  "に",
  "さん",
  "よん",
  "ご",
  "ろく",
  "なな",
  "はち",
  "きゅう",
];

/** Converts 0-20 to its hiragana reading. Outside that range, returns the plain numeral. */
export function numberToJapaneseWords(n: number): string {
  if (n >= 0 && n <= 9) return DIGIT_WORDS[n];
  if (n === 10) return "じゅう";
  if (n >= 11 && n <= 19) return `じゅう${DIGIT_WORDS[n - 10]}`;
  if (n === 20) return "にじゅう";
  return String(n);
}
