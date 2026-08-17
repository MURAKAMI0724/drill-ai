"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "@/components/kids/ChoiceButton";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import HintButton from "@/components/kids/HintButton";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import { CLOCK_QUESTIONS } from "@/lib/kids/kids-quiz-data2";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

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
        stroke={major ? "var(--c-toke)" : "var(--ink-sub)"}
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
        fontWeight={800}
        fill="var(--ink)"
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
        fill="var(--surface)"
        stroke="#dbe6f5"
        strokeWidth={3}
      />
      {ticks}
      {numbers}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourTip.x}
        y2={hourTip.y}
        stroke="var(--ink)"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteTip.x}
        y2={minuteTip.y}
        stroke="var(--c-toke)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={CENTER} cy={CENTER} r={6} fill="var(--c-toke)" />
    </svg>
  );
}

export default function ClockScreen({
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
    setQuestionIndex(nextClockIndex(levelRef, usedByLevelRef));
    setSelected(null);
    setAnswered(false);
    setWasCorrect(false);
    setHintUsed(false);
  }

  return (
    <GameLayout
      title="とけい"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard label="いま なんじ?">
        <div className="flex justify-center">
          <AnalogClock hour={question.hour} minute={question.minute} />
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
