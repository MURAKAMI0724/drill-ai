"use client";

import { useEffect, useRef, useState } from "react";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import {
  generateArithmeticProblem,
  problemToSpeechParts,
  type ArithmeticProblem,
} from "@/lib/kids/arithmetic";
import { numberToJapaneseWords } from "@/lib/kids/japanese-numbers";
import { speak, speakParts } from "@/lib/kids/speech";

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "✓"],
];

export default function ArithmeticScreen({
  speechEnabled,
  onToggleSpeech,
  onBack,
  stars,
  starBumpToken,
  onCorrect,
}: ModeScreenProps) {
  const [problem, setProblem] = useState<ArithmeticProblem>(() =>
    generateArithmeticProblem(),
  );
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const speechEnabledRef = useRef(speechEnabled);
  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
  }, [speechEnabled]);

  function nextProblem() {
    setProblem(generateArithmeticProblem());
    setAnswer("");
    setAnswered(false);
    setWasCorrect(false);
  }

  // Speaks the problem out loud whenever it changes, including the initial
  // one from useState's lazy initializer above. Split into two utterances
  // ("3 たす 4" then "は?") with a ~300ms beat so the question mark doesn't
  // run straight into the numbers.
  useEffect(() => {
    speakParts(problemToSpeechParts(problem), speechEnabledRef.current, 300);
  }, [problem]);

  function pressDigit(d: string) {
    if (answered || answer.length >= 2) return;
    setAnswer((prev) => prev + d);
  }

  function pressBackspace() {
    if (answered) return;
    setAnswer((prev) => prev.slice(0, -1));
  }

  function check() {
    if (answered || answer === "") return;
    const correct = parseInt(answer, 10) === problem.answer;
    setAnswered(true);
    setWasCorrect(correct);
    setTotalCount((n) => n + 1);
    if (correct) {
      onCorrect?.();
    }
    speak(
      correct
        ? "せいかい!"
        : `おしい!こたえは ${numberToJapaneseWords(problem.answer)}`,
      speechEnabledRef.current,
    );
  }

  function pressKey(key: string) {
    if (key === "⌫") pressBackspace();
    else if (key === "✓") check();
    else pressDigit(key);
  }

  return (
    <GameLayout
      title="さんすう"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard>
        <div className="text-[36px] font-extrabold text-ink tabular-nums">
          {problem.a} {problem.op} {problem.b} = ?
        </div>
        <div
          className="mt-3 inline-flex h-12 min-w-16 items-center justify-center rounded-2xl px-4 text-[28px] font-extrabold text-ink tabular-nums"
          style={{ background: "var(--t-calc)" }}
        >
          {answer || " "}
        </div>
      </QuestionCard>

      {answered && (
        <FeedbackBanner kind={wasCorrect ? "correct" : "incorrect"}>
          {wasCorrect ? "🎉 せいかい!" : `✕ ざんねん!こたえは ${problem.answer}`}
        </FeedbackBanner>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {KEYPAD_ROWS.flat().map((key, idx) => (
          <button
            key={idx}
            disabled={answered && key !== "✓"}
            onClick={() => pressKey(key)}
            className={[
              "min-h-[60px] rounded-2xl text-2xl font-extrabold transition active:translate-y-[2px] active:scale-95 disabled:opacity-35",
              key === "✓" ? "text-ink" : "bg-surface text-ink shadow-[0_3px_0_rgba(35,52,87,0.08)]",
            ].join(" ")}
            style={
              key === "✓"
                ? { background: "linear-gradient(90deg,#ffd166,#ff8fab)" }
                : undefined
            }
          >
            {key}
          </button>
        ))}
      </div>

      {answered && <NextButton onClick={nextProblem} />}
    </GameLayout>
  );
}
