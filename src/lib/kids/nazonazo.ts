/**
 * Common speech-recognition fillers a kid's mic answer often comes back
 * wrapped in ("こたえは いぬ です" / "いぬかな"). Stripped before comparison
 * so only the core word is matched.
 */
const ANSWER_PREFIXES = ["こたえは"];
const ANSWER_SUFFIXES = ["でーす", "です", "だよ", "かな"];

function katakanaToHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
}

/**
 * Normalizes a nazonazo answer (typed or speech-recognized) for comparison.
 * Unlike shiritori's KANA_NORMALIZE, this must NEVER collapse dakuten/
 * handakuten (が→か) — that's only valid for shiritori's "next kana" check,
 * and would break whole-word matches like "たまねぎ" vs "たまねき". Both the
 * child's input and each acceptableAnswers entry must be passed through this
 * same function before comparing.
 */
export function normalizeAnswer(input: string): string {
  let str = input.trim();
  str = str.replace(/[\s　]+/g, "");
  str = str.replace(/[。、!?！？]/g, "");
  str = katakanaToHiragana(str);

  for (const prefix of ANSWER_PREFIXES) {
    if (str.startsWith(prefix) && str.length > prefix.length) {
      str = str.slice(prefix.length);
      break;
    }
  }
  for (const suffix of ANSWER_SUFFIXES) {
    if (str.endsWith(suffix) && str.length > suffix.length) {
      str = str.slice(0, str.length - suffix.length);
      break;
    }
  }
  return str;
}
