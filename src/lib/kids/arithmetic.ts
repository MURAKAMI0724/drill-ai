import { numberToJapaneseWords } from "./japanese-numbers";

export interface ArithmeticProblem {
  op: "+" | "-";
  a: number;
  b: number;
  answer: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Addition within 1-9, subtraction within 2-10 — matches the approved prototype's range. */
export function generateArithmeticProblem(): ArithmeticProblem {
  const op: "+" | "-" = Math.random() < 0.5 ? "+" : "-";
  let a: number;
  let b: number;
  let answer: number;
  if (op === "+") {
    a = randInt(1, 9);
    b = randInt(1, Math.max(1, 10 - a));
    answer = a + b;
  } else {
    a = randInt(2, 10);
    b = randInt(1, a);
    answer = a - b;
  }
  return { op, a, b, answer };
}

/**
 * Split into [expression, "は?"] rather than one string so the caller can
 * read them as two utterances with a pause in between — "さん たす よん" then
 * a beat, then "は?" — instead of running the question mark straight into
 * the numbers. Numbers are spelled out in hiragana (numberToJapaneseWords)
 * rather than left as bare digits, since some TTS voices read a bare
 * numeral in English even on a ja-JP utterance.
 */
export function problemToSpeechParts(p: ArithmeticProblem): [string, string] {
  const opWord = p.op === "+" ? "たす" : "ひく";
  const a = numberToJapaneseWords(p.a);
  const b = numberToJapaneseWords(p.b);
  return [`${a} ${opWord} ${b}`, "は?"];
}
