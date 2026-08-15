import type { PersonaKey } from "./types";

export interface PersonaCopy {
  key: PersonaKey;
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  eyebrow: string;
  introTitle: string;
  introTag: string;
  captureHint: string;
  quizIntroTitleTemplate: (count: number) => string;
  quizIntroTag: string;
  extraCta: string | null;
  /** "pdf-worksheet" downloads a printable PDF; "toast" just shows extraCtaToast (not yet implemented). */
  extraCtaAction: "pdf-worksheet" | "toast" | null;
  extraCtaToast: string | null;
  generationPromptHint: string;
}

export const PERSONAS: Record<PersonaKey, PersonaCopy> = {
  individual: {
    key: "individual",
    icon: "📚",
    title: "自分の学習",
    subtitle: "資格試験・受験勉強に",
    enabled: true,
    eyebrow: "FOR 自分の学習",
    introTitle: "資格試験の勉強を、\nAIと一緒に。",
    introTag:
      "参考書やノートを撮るだけで、AIが要点を理解して、練習問題を自動で作ります。",
    captureHint:
      "参考書やノートを開いて、パシャッと撮るだけ。文字が読めれば、写真がブレていても大丈夫です。",
    quizIntroTitleTemplate: (n) => `${n}問のテストができました`,
    quizIntroTag:
      "AIが写真を3つのカテゴリに分けて問題を生成しました。まずは通しで解いてみましょう。",
    extraCta: null,
    extraCtaAction: null,
    extraCtaToast: null,
    generationPromptHint:
      "資格試験・受験対策の学習者向け。実務・試験でよく問われる論点を優先し、選択式・○×・穴埋めをバランスよく出題してください。",
  },
  teacher: {
    key: "teacher",
    icon: "🏫",
    title: "学校の先生",
    subtitle: "定期テスト・小テスト作成に",
    enabled: true,
    eyebrow: "FOR 学校の先生",
    introTitle: "定期テストも、\n数分で。",
    introTag:
      "教科書やプリントを撮るだけで、AIが単元を理解して、テスト問題を自動で作ります。",
    captureHint:
      "教科書やプリント、板書の写真でもOK。複数ページまとめて撮影できます。",
    quizIntroTitleTemplate: (n) => `${n}問のテスト問題ができました`,
    quizIntroTag:
      "AIが教材を単元ごとに分けて出題しました。まずは先生自身で解いて確認してみましょう。",
    extraCta: "生徒用プリントを書き出す",
    extraCtaAction: "pdf-worksheet",
    extraCtaToast: null,
    generationPromptHint:
      "学校教員が定期テスト・小テストを作成する用途。学習指導要領レベルの基礎〜標準的な理解を問う設問を中心にしてください。",
  },
  corporate: {
    key: "corporate",
    icon: "💼",
    title: "企業・研修担当",
    subtitle: "研修・昇格試験に",
    enabled: true,
    eyebrow: "FOR 企業・研修担当",
    introTitle: "研修テストも、\n資料そのままに。",
    introTag:
      "マニュアルや資料を撮るだけで、AIが内容を理解して、研修・昇格テストを自動で作ります。",
    captureHint:
      "社内マニュアルや資料を撮影してください。機密情報の取り扱いにはご注意ください。",
    quizIntroTitleTemplate: (n) => `${n}問の研修テストができました`,
    quizIntroTag:
      "AIが資料をテーマに分けて出題しました。まずは担当者自身で内容を確認してみましょう。",
    extraCta: "受講者用プリントを書き出す",
    extraCtaAction: "pdf-worksheet",
    extraCtaToast: null,
    generationPromptHint:
      "企業研修・昇格試験の用途。実務適用や理解度確認を重視した設問にしてください。",
  },
  kids: {
    key: "kids",
    icon: "🧒",
    title: "お子さま(6歳〜)",
    subtitle: "さんすう・ことばあそびに",
    enabled: false,
    eyebrow: "FOR お子さま",
    introTitle: "プリントも、\nゲームみたいに。",
    introTag:
      "プリントやドリルを撮るだけで、AIがたのしい もんだいを つくってくれます。",
    captureHint:
      "おうちの プリントや ドリルを とってね。がんばれ！",
    quizIntroTitleTemplate: (n) => `${n}問の もんだいができました`,
    quizIntroTag: "がんばって といてみよう！",
    extraCta: null,
    extraCtaAction: null,
    extraCtaToast: null,
    generationPromptHint: "6歳程度の子ども向け。やさしい言葉で出題してください。",
  },
};

export const PERSONA_ORDER: PersonaKey[] = [
  "individual",
  "teacher",
  "corporate",
  "kids",
];
