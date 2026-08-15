// Neither `kuroshiro` nor `kuroshiro-analyzer-kuromoji` ship TypeScript
// types (and no @types/* package exists), so these declare only the surface
// this project actually calls.

declare module "kuroshiro" {
  interface KuroshiroAnalyzer {
    init(): Promise<void>;
    parse(text: string): Promise<unknown>;
  }

  interface KuroshiroConvertOptions {
    to?: "hiragana" | "katakana" | "romaji";
    mode?: "normal" | "spaced" | "okurigana" | "furigana";
    romajiSystem?: "nippon" | "passport" | "hepburn";
    delimiter_start?: string;
    delimiter_end?: string;
  }

  export default class Kuroshiro {
    constructor();
    init(analyzer: KuroshiroAnalyzer): Promise<void>;
    convert(text: string, options?: KuroshiroConvertOptions): Promise<string>;
  }
}

declare module "kuroshiro-analyzer-kuromoji" {
  interface KuromojiAnalyzerOptions {
    dictPath?: string;
  }

  export default class KuromojiAnalyzer {
    constructor(options?: KuromojiAnalyzerOptions);
    init(): Promise<void>;
    parse(text: string): Promise<unknown>;
  }
}
