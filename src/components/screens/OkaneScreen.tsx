"use client";

import { useEffect, useRef, useState } from "react";
import { COIN_STYLE, OKANE_QUESTIONS } from "@/lib/kids/kids-quiz-data3";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

interface OkaneScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

type Level = 1 | 2 | 3 | 4;
const LEVELS: Level[] = [1, 2, 3, 4];

/** Global OKANE_QUESTIONS indices grouped by difficulty level, precomputed once. */
const LEVEL_INDICES: Record<Level, number[]> = { 1: [], 2: [], 3: [], 4: [] };
OKANE_QUESTIONS.forEach((q, i) => LEVEL_INDICES[q.level].push(i));

/**
 * Picks the next question's global index, working through one level's pool
 * at a time (via pickUnusedIndex) before advancing to the next level. Once
 * level 4 is exhausted, every level's "used" set is cleared and it restarts
 * from level 1.
 */
function nextOkaneIndex(
  levelRef: { current: Level },
  usedByLevelRef: { current: Record<Level, Set<number>> },
): number {
  let level = levelRef.current;
  let pool = LEVEL_INDICES[level];
  let used = usedByLevelRef.current[level];

  if (used.size >= pool.length) {
    const pos = LEVELS.indexOf(level) + 1;
    if (pos >= LEVELS.length) {
      LEVELS.forEach((l) => usedByLevelRef.current[l].clear());
      level = LEVELS[0];
    } else {
      level = LEVELS[pos];
    }
    levelRef.current = level;
    pool = LEVEL_INDICES[level];
    used = usedByLevelRef.current[level];
  }

  const localIdx = pickUnusedIndex(pool.length, used);
  return pool[localIdx];
}

/**
 * A coin has no kanji unit to put under the hole (label is a bare number),
 * so instead of splitting the digits themselves, the number sits in the
 * upper half and the hole in the lower half — both stay clear of each other.
 */
function Coin({ value }: { value: number }) {
  const style = COIN_STYLE[value];
  if (!style) return null;
  const r = style.size / 2;
  const holeR = style.size * 0.125;
  const vOffset = style.hole ? r * 0.24 : 0;

  return (
    <svg
      width={style.size}
      height={style.size}
      viewBox={`0 0 ${style.size} ${style.size}`}
      style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
    >
      <circle
        cx={r}
        cy={r}
        r={r - 1.5}
        fill={style.color}
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={1.5}
      />
      {style.hole && (
        <circle cx={r} cy={r + vOffset} r={holeR} fill="var(--surface-1)" />
      )}
      <text
        x={r}
        y={r - vOffset}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={style.size * 0.32}
        fontWeight={800}
        fill="rgba(0,0,0,0.65)"
      >
        {style.label}
      </text>
    </svg>
  );
}

export default function OkaneScreen({
  speechEnabled,
  onToggleSpeech,
}: OkaneScreenProps) {
  const levelRef = useRef<Level>(1);
  const usedByLevelRef = useRef<Record<Level, Set<number>>>({
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  });
  const speechEnabledRef = useRef(speechEnabled);

  // Level starts at 1, so the very first question is a plain random pick
  // from level 1's pool — no ref access here, since useState initializers
  // run during render and refs must only be touched in effects/handlers.
  const [questionIndex, setQuestionIndex] = useState(() => {
    const pool = LEVEL_INDICES[1];
    return pool[Math.floor(Math.random() * pool.length)];
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
  }, [speechEnabled]);

  // Marks the initial (lazy-initializer-picked) question as used exactly once.
  useEffect(() => {
    usedByLevelRef.current[1].add(LEVEL_INDICES[1].indexOf(questionIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = OKANE_QUESTIONS[questionIndex];

  function say(text: string) {
    speak(text, speechEnabledRef.current);
  }

  useEffect(() => {
    say("ぜんぶで いくら?");
  }, [questionIndex]);

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  function pickChoice(idx: number) {
    if (answered) return;
    const correct = idx === question.correctIndex;
    setSelected(idx);
    setAnswered(true);
    setWasCorrect(correct);
    setTotalCount((n) => n + 1);
    if (correct) setCorrectCount((n) => n + 1);
    say(
      correct
        ? `せいかい!${question.speech}`
        : `おしい!せいかいは ${question.speech} だよ`,
    );
  }

  function showHint() {
    if (answered || hintUsed) return;
    setHintUsed(true);
    say(question.hint);
  }

  function nextQuestion() {
    setQuestionIndex(nextOkaneIndex(levelRef, usedByLevelRef));
    setSelected(null);
    setAnswered(false);
    setWasCorrect(false);
    setHintUsed(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          おかねの かぞえかた
        </div>
        <button
          onClick={onToggleSpeech}
          aria-label={
            speechEnabled ? "音声オン(タップでオフ)" : "音声オフ(タップでオン)"
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-lg active:scale-95"
        >
          {speechEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="text-center text-xs text-fg-faint">
        せいかい {correctCount}もん / {totalCount}もん
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-1 px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {question.coins.map((value, idx) => (
            <Coin key={idx} value={value} />
          ))}
        </div>
        <div className="text-[13px] font-bold text-fg-soft">ぜんぶで いくら?</div>
      </div>

      {hintUsed && !answered && (
        <div className="rounded-2xl border-[1.5px] border-gold-wash-2 bg-gold-wash px-[17px] py-[15px] text-center text-[14px] font-bold text-gold-bright">
          💡 {question.hint}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, idx) => {
          const isSelected = selected === idx;
          const isAnswerIdx = idx === question.correctIndex;
          let stateClass = "border-border bg-surface-1";
          if (answered && isAnswerIdx) {
            stateClass = "border-good bg-good-bg";
          } else if (answered && isSelected && !isAnswerIdx) {
            stateClass = "border-critical bg-critical-bg";
          }
          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => pickChoice(idx)}
              className={[
                "rounded-2xl border-[1.5px] px-4 py-[15px] text-center text-[16px] font-bold text-fg tabular-nums active:scale-[0.99] disabled:opacity-90",
                stateClass,
              ].join(" ")}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={[
            "rounded-2xl px-[17px] py-[15px] text-center text-[15px] font-bold",
            wasCorrect ? "bg-good-bg text-good" : "bg-critical-bg text-critical",
          ].join(" ")}
        >
          {wasCorrect ? "◯ せいかい!" : "✕ おしい!"}
        </div>
      )}

      {!answered && !hintUsed && (
        <button
          onClick={showHint}
          className="rounded-2xl border-[1.5px] border-gold-wash-2 px-5 py-3.5 text-[14px] font-bold text-gold-bright active:scale-[0.98]"
        >
          💡 ヒントを見る
        </button>
      )}

      <div className="flex-1" />
      {answered && (
        <button
          onClick={nextQuestion}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-bright to-[#b8903c] px-5 py-4 text-[15.5px] font-bold text-[#231803] transition active:scale-[0.98]"
        >
          つぎのもんだいへ
        </button>
      )}
    </div>
  );
}
