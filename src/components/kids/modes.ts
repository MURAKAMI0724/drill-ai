export type ModeKey =
  | "calc"
  | "shiritori"
  | "nazonazo"
  | "nakama"
  | "clock"
  | "nakigoe"
  | "hantai"
  | "okane"
  | "kotowaza";

export interface ModeMeta {
  key: ModeKey;
  label: string;
  desc: string;
  emoji: string;
  accent: string;
  tint: string;
}

/** Shared prop contract every one of the 9 game screens implements. */
export interface ModeScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onBack: () => void;
  stars: number;
  starBumpToken: number;
  onCorrect?: () => void;
}

export const MODES: ModeMeta[] = [
  {
    key: "calc",
    label: "さんすう",
    desc: "たしざん・ひきざん",
    emoji: "🔢",
    accent: "var(--c-calc)",
    tint: "var(--t-calc)",
  },
  {
    key: "shiritori",
    label: "しりとり",
    desc: "AIと たいけつ",
    emoji: "🎤",
    accent: "var(--c-siri)",
    tint: "var(--t-siri)",
  },
  {
    key: "nazonazo",
    label: "なぞなぞ",
    desc: "こえで こたえよう",
    emoji: "❓",
    accent: "var(--c-nazo)",
    tint: "var(--t-nazo)",
  },
  {
    key: "nakama",
    label: "なかまはずれ",
    desc: "ちがうのは どれ?",
    emoji: "🔍",
    accent: "var(--c-naka)",
    tint: "var(--t-naka)",
  },
  {
    key: "clock",
    label: "とけい",
    desc: "いま なんじ?",
    emoji: "🕐",
    accent: "var(--c-toke)",
    tint: "var(--t-toke)",
  },
  {
    key: "nakigoe",
    label: "なきごえ",
    desc: "だれの こえ?",
    emoji: "🐾",
    accent: "var(--c-naki)",
    tint: "var(--t-naki)",
  },
  {
    key: "hantai",
    label: "はんたい",
    desc: "はんたいの ことば",
    emoji: "🔁",
    accent: "var(--c-hant)",
    tint: "var(--t-hant)",
  },
  {
    key: "okane",
    label: "おかね",
    desc: "ぜんぶで いくら?",
    emoji: "💰",
    accent: "var(--c-okan)",
    tint: "var(--t-okan)",
  },
  {
    key: "kotowaza",
    label: "ことわざ",
    desc: "いみを あてよう",
    emoji: "📖",
    accent: "var(--c-koto)",
    tint: "var(--t-koto)",
  },
];
