"use client";

import { useEffect, useRef, useState } from "react";
import { CLOCK_QUESTIONS } from "@/lib/kids/kids-quiz-data2";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

interface ClockScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

type Level = 1 | 2 | 3 | 4;
const LEVELS: Level[] = [1, 2, 3, 4];

/** Global CLOCK_QUESTIONS indices grouped by difficulty level, precomputed once. */
const LEVEL_INDICES: Record<Level, number[]> = { 1: [], 2: [], 3: [], 4: [] };
CLOCK_QUESTIONS.forEach((q, i) => LEVEL_INDICES[q.level].push(i));

/**
 * Picks the next question's global index, working through one level's pool
 * at a time (via pickUnusedIndex) before advancing to the next level. Once
 * level 4 is exhausted, every level's "used" set is cleared and it restarts
 * from level 1.
 */
function nextClockIndex(
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

const CENTER = 120;
const FACE_R = 108;

/** theta: degrees clockwise from 12 o'clock. */
function pointAt(r: number, thetaDeg: number) {
  const rad = (thetaDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
}

function AnalogClock({ hour, minute }: { hour: number; minute: number }) {
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const hourTip = pointAt(46, hourAngle);
  const minuteTip = pointAt(80, minuteAngle);

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    const angle = i * 6;
    const outer = pointAt(100, angle);
    const inner = pointAt(major ? 88 : 94, angle);
    return (
      <line
        key={i}
        x1={outer.x}
        y1={outer.y}
        x2={inner.x}
        y2={inner.y}
        stroke={major ? "var(--gold)" : "var(--fg-faint)"}
        strokeWidth={major ? 3 : 1}
        strokeLinecap="round"
      />
    );
  });

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const pos = pointAt(80, n * 30);
    return (
      <text
        key={n}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={18}
        fontWeight={700}
        fill="var(--text-primary)"
      >
        {n}
      </text>
    );
  });

  return (
    <svg
      viewBox="0 0 240 240"
      width={240}
      height={240}
      role="img"
      aria-label={`${hour}じ${minute === 0 ? "" : `${minute}ふん`}`}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={FACE_R}
        fill="var(--surface-1)"
        stroke="var(--border)"
        strokeWidth={3}
      />
      {ticks}
      {numbers}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourTip.x}
        y2={hourTip.y}
        stroke="var(--text-primary)"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteTip.x}
        y2={minuteTip.y}
        stroke="var(--gold-bright)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={CENTER} cy={CENTER} r={6} fill="var(--gold-bright)" />
    </svg>
  );
}

export default function ClockScreen({
  speechEnabled,
  onToggleSpeech,
}: ClockScreenProps) {
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

  const question = CLOCK_QUESTIONS[questionIndex];

  function say(text: string) {
    speak(text, speechEnabledRef.current);
  }

  // Reads the prompt aloud whenever the question changes, including the
  // initial one from useState's lazy initializer above.
  useEffect(() => {
    say("いま なんじ?");
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
    setQuestionIndex(nextClockIndex(levelRef, usedByLevelRef));
    setSelected(null);
    setAnswered(false);
    setWasCorrect(false);
    setHintUsed(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          とけいの よみかた
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

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-1 py-6">
        <AnalogClock hour={question.hour} minute={question.minute} />
        <div className="text-[13px] font-bold text-fg-soft">いま なんじ?</div>
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
