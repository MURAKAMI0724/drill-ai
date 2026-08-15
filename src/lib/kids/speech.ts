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
 * Splits text on 、/。/!/? so each phrase becomes its own utterance —
 * reading a full sentence as one utterance sounds flat/monotone, whereas a
 * short gap between phrases reads more like a natural breath pause.
 */
function splitIntoPhrases(text: string): string[] {
  const parts = text
    .split(/(?<=[、。!?])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text];
}

let speechQueueToken = 0;

/**
 * Speaks `text` via Web Speech API when `enabled`, phrase by phrase with a
 * ~120ms gap between them. Starting a new call cancels any in-flight
 * utterance/queue immediately (via speechQueueToken) so overlapping calls
 * from ArithmeticScreen/ShiritoriScreen don't talk over each other.
 */
export function speak(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis)
    return;
  if (!text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const myToken = ++speechQueueToken;
  const phrases = splitIntoPhrases(text);

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
      setTimeout(() => speakPhrase(i + 1), phrases.length > 1 ? 120 : 0);
    };
    utter.onerror = () => {
      if (myToken === speechQueueToken) speakPhrase(i + 1);
    };
    synth.speak(utter);
  }
  speakPhrase(0);
}

export function cancelSpeech() {
  speechQueueToken++;
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
