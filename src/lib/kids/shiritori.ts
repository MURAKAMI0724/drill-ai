import {
  KANA_NORMALIZE,
  KANJI_TO_HIRAGANA,
  SHIRITORI_TRAP_WORDS,
  SHIRITORI_WORDS,
} from "./shiritori-data";

export const HIRAGANA_ONLY_RE = /^[ぁ-ゖー]+$/;

/** Last kana of a word, normalized to its plain (unvoiced, full-size) form. */
export function lastKana(word: string): string {
  const ch = word[word.length - 1];
  return KANA_NORMALIZE[ch] ?? ch;
}

/** First kana of a word, normalized to its plain (unvoiced, full-size) form. */
export function firstKana(word: string): string {
  const ch = word[0];
  return KANA_NORMALIZE[ch] ?? ch;
}

/**
 * Cleans up raw kid input (typed or speech-recognized) before it's checked
 * against the chain: trims whitespace/punctuation, converts full-width
 * katakana to hiragana, and maps known kanji spellings back to hiragana.
 */
export function normalizeKana(input: string): string {
  let str = input.trim().replace(/\s+/g, "").replace(/[。、!?！?]/g, "");
  str = str.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
  if (KANJI_TO_HIRAGANA[str]) return KANJI_TO_HIRAGANA[str];
  return str;
}

export type AiMove =
  | { type: "trap"; word: string }
  | { type: "word"; word: string }
  | { type: "giveup" };

/**
 * Decides the AI's next shiritori move. `chainLength` is the number of words
 * exchanged so far, including the word the child just played — it drives
 * both the "AI deliberately loses" pacing (no chance below 14 words, ramping
 * to 90% by 36+ words) and the hard cutoffs (guaranteed trap at 36+, AI gives
 * up outright past 42) described in docs/requirements.md §5.4.
 */
export function decideAiMove(params: {
  requiredKana: string;
  chainLength: number;
  usedWords: Set<string>;
}): AiMove {
  const { requiredKana, chainLength, usedWords } = params;

  const progress = chainLength - 20;
  const trapChance =
    chainLength < 14 ? 0 : Math.min(0.9, Math.max(0.05, progress * 0.06));
  const nearHardCap = chainLength >= 36;
  const trapCandidates = SHIRITORI_TRAP_WORDS.filter(
    (w) => w[0] === requiredKana && !usedWords.has(w),
  );

  if (
    trapCandidates.length > 0 &&
    (nearHardCap || Math.random() < trapChance)
  ) {
    const word =
      trapCandidates[Math.floor(Math.random() * trapCandidates.length)];
    return { type: "trap", word };
  }

  const candidates =
    chainLength >= 42
      ? []
      : SHIRITORI_WORDS.filter(
          (w) => w[0] === requiredKana && !usedWords.has(w),
        );
  if (candidates.length === 0) return { type: "giveup" };
  const word = candidates[Math.floor(Math.random() * candidates.length)];
  return { type: "word", word };
}
