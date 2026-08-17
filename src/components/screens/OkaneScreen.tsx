"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "@/components/kids/ChoiceButton";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import HintButton from "@/components/kids/HintButton";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import { COIN_STYLE, OKANE_QUESTIONS } from "@/lib/kids/kids-quiz-data3";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

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
        <circle cx={r} cy={r + vOffset} r={holeR} fill="var(--surface)" />
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
  onBack,
  stars,
  starBumpToken,
  onCorrect,
}: ModeScreenProps) {
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
    if (correct) {
      onCorrect?.();
    }
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
    <GameLayout
      title="おかね"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard label="ぜんぶで いくら?">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {question.coins.map((value, idx) => (
            <Coin key={idx} value={value} />
          ))}
        </div>
      </QuestionCard>

      {hintUsed && !answered && (
        <FeedbackBanner kind="hint">💡 {question.hint}</FeedbackBanner>
      )}

      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, idx) => {
          const isSelected = selected === idx;
          const isAnswerIdx = idx === question.correctIndex;
          let state: "neutral" | "correct" | "wrong" = "neutral";
          if (answered && isAnswerIdx) state = "correct";
          else if (answered && isSelected && !isAnswerIdx) state = "wrong";
          return (
            <ChoiceButton
              key={idx}
              index={idx}
              disabled={answered}
              state={state}
              onClick={() => pickChoice(idx)}
            >
              {choice}
            </ChoiceButton>
          );
        })}
      </div>

      {answered && (
        <FeedbackBanner kind={wasCorrect ? "correct" : "incorrect"}>
          {wasCorrect ? "🎉 せいかい!" : "✕ ざんねん! もういちど"}
        </FeedbackBanner>
      )}

      {!answered && !hintUsed && <HintButton onClick={showHint} />}

      <div className="flex-1" />
      {answered && <NextButton onClick={nextQuestion} />}
    </GameLayout>
  );
}
