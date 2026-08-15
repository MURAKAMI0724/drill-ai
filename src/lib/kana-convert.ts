import path from "node:path";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

/**
 * Server-only: converts kanji/katakana-mixed text (as returned by the
 * browser's SpeechRecognition for common nouns, e.g. "犬" instead of "いぬ")
 * to hiragana via kuromoji morphological analysis. The dictionary lives in
 * node_modules/kuromoji/dict and is only ever read on the server, so the
 * client never needs the (multi-MB) dictionary data.
 *
 * The kuromoji tokenizer takes real time to build from its dictionary
 * files, so the instance is built once per server process and reused.
 */
let kuroshiroPromise: Promise<Kuroshiro> | null = null;

function buildKuroshiro(): Promise<Kuroshiro> {
  const kuroshiro = new Kuroshiro();
  const dictPath = path.join(process.cwd(), "node_modules/kuromoji/dict/");
  return kuroshiro
    .init(new KuromojiAnalyzer({ dictPath }))
    .then(() => kuroshiro);
}

function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroPromise) {
    kuroshiroPromise = buildKuroshiro().catch((err: unknown) => {
      // Let the next call retry instead of caching a permanently broken instance.
      kuroshiroPromise = null;
      throw err;
    });
  }
  return kuroshiroPromise;
}

export async function convertToHiragana(text: string): Promise<string> {
  const kuroshiro = await getKuroshiro();
  return kuroshiro.convert(text, { to: "hiragana", mode: "normal" });
}
