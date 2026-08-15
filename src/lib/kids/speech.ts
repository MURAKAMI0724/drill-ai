let jaVoice: SpeechSynthesisVoice | null = null;

/**
 * Priority list for picking a natural-sounding Japanese voice out of
 * whatever the device/browser ships. Lower index = higher priority: neural/
 * cloud-quality voices first, generic/legacy TTS voices fall through to the
 * unranked bucket below.
 */
const VOICE_NAME_PRIORITY: RegExp[] = [
  /nanami/i, // Microsoft Edge neural voice (female)
  /keita/i, // Microsoft Edge neural voice (male)
  /google 日本語/i, // Chrome/Android Google voice
  /kyoko/i, // Apple (iOS/macOS) default Japanese voice
  /o-ren|otoya/i, // other high-quality Apple Japanese voices
];

function scoreVoice(v: SpeechSynthesisVoice): number {
  if (!v.lang || !v.lang.toLowerCase().startsWith("ja")) return -1;
  for (let i = 0; i < VOICE_NAME_PRIORITY.length; i++) {
    if (VOICE_NAME_PRIORITY[i].test(v.name)) return 100 - i;
  }
  return 0; // Japanese voice of unrecognized origin
}

function loadJaVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  jaVoice = best;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadJaVoice();
  window.speechSynthesis.onvoiceschanged = loadJaVoice;
}

/**
 * A phrase longer than this still reads as one flat run-on even after the
 * punctuation split below, so splitLongPhrase() breaks it further at
 * whitespace (the app's own text already uses spaces between phrase-like
 * chunks, e.g. "から はじまる ことばを かんがえてみて").
 */
const MAX_PHRASE_LENGTH = 14;

/** Breaks a long, space-containing phrase into breath-sized chunks at word boundaries. */
function splitLongPhrase(phrase: string): string[] {
  if (phrase.length <= MAX_PHRASE_LENGTH || !phrase.includes(" ")) {
    return [phrase];
  }
  const words = phrase.split(" ").filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > MAX_PHRASE_LENGTH) {
      chunks.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/**
 * Splits text on 、/。/!/?/… so each phrase becomes its own utterance —
 * reading a full sentence as one utterance sounds flat/monotone, whereas a
 * short gap between phrases reads more like a natural breath pause. Any
 * resulting phrase that's still long gets a further split via
 * splitLongPhrase() so a run-on clause also gets a mid-sentence pause.
 */
function splitIntoPhrases(text: string): string[] {
  const parts = text
    .split(/(?<=[、。!?…])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap(splitLongPhrase);
  return parts.length ? parts : [text];
}

/**
 * The gap after a phrase scales with how long that phrase was — a short
 * beat (~80ms) reads like a natural breath after a short phrase, while a
 * longer phrase gets a slightly longer pause (~180ms) before the next one.
 */
function gapForPhrase(phrase: string): number {
  const MIN_GAP = 80;
  const MAX_GAP = 180;
  const SHORT_LEN = 5;
  const LONG_LEN = 15;
  const len = phrase.length;
  if (len <= SHORT_LEN) return MIN_GAP;
  if (len >= LONG_LEN) return MAX_GAP;
  const t = (len - SHORT_LEN) / (LONG_LEN - SHORT_LEN);
  return Math.round(MIN_GAP + t * (MAX_GAP - MIN_GAP));
}

let speechQueueToken = 0;

/**
 * Speaks a pre-split list of phrases back to back, pausing `gapFor(phrase)`
 * after each one finishes. Starting a new call cancels any in-flight
 * utterance/queue immediately (via speechQueueToken) so overlapping calls
 * from ArithmeticScreen/ShiritoriScreen don't talk over each other.
 */
function speakQueue(
  phrases: string[],
  enabled: boolean,
  gapFor: (phrase: string) => number,
) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis)
    return;
  if (phrases.length === 0) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const myToken = ++speechQueueToken;

  function speakPhrase(i: number) {
    if (myToken !== speechQueueToken) return; // superseded by a newer speak() call
    if (i >= phrases.length) return;
    const utter = new SpeechSynthesisUtterance(phrases[i]);
    utter.lang = "ja-JP";
    if (jaVoice) utter.voice = jaVoice;
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.onend = () => {
      if (myToken !== speechQueueToken) return;
      const gap = phrases.length > 1 ? gapFor(phrases[i]) : 0;
      setTimeout(() => speakPhrase(i + 1), gap);
    };
    utter.onerror = () => {
      if (myToken === speechQueueToken) speakPhrase(i + 1);
    };
    synth.speak(utter);
  }
  speakPhrase(0);
}

/** Speaks `text` via Web Speech API when `enabled`, phrase by phrase (see splitIntoPhrases). */
export function speak(text: string, enabled: boolean) {
  if (!text) return;
  speakQueue(splitIntoPhrases(text), enabled, gapForPhrase);
}

/**
 * Speaks a caller-supplied sequence of utterances back to back with a fixed
 * gap between them — e.g. the arithmetic problem's "3 たす 4" / "は?" split,
 * which wants a deliberate ~300ms beat rather than the length-based gap
 * splitIntoPhrases()/gapForPhrase() would pick.
 */
export function speakParts(parts: string[], enabled: boolean, gapMs: number) {
  const phrases = parts.map((p) => p.trim()).filter(Boolean);
  speakQueue(phrases, enabled, () => gapMs);
}

export function cancelSpeech() {
  speechQueueToken++;
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
