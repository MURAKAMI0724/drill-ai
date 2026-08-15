"use client";

import { useEffect, useRef, useState } from "react";
import {
  generateArithmeticProblem,
  problemToSpeechParts,
  type ArithmeticProblem,
} from "@/lib/kids/arithmetic";
import { numberToJapaneseWords } from "@/lib/kids/japanese-numbers";
import { speak, speakParts } from "@/lib/kids/speech";

interface ArithmeticScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "✓"],
];

export default function ArithmeticScreen({
  speechEnabled,
  onToggleSpeech,
}: ArithmeticScreenProps) {
  const [problem, setProblem] = useState<ArithmeticProblem>(() =>
    generateArithmeticProblem(),
  );
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
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
    if (correct) setCorrectCount((n) => n + 1);
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
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          さんすう れんしゅう
        </div>
        <button
          onClick={onToggleSpeech}
          aria-label={speechEnabled ? "音声オン(タップでオフ)" : "音声オフ(タップでオン)"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-lg active:scale-95"
        >
          {speechEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="text-center text-xs text-fg-faint">
        せいかい {correctCount}もん / {totalCount}もん
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-1 py-8">
        <div className="text-[34px] font-bold tabular-nums">
          {problem.a} {problem.op} {problem.b} = ?
        </div>
        <div className="h-9 min-w-16 rounded-xl bg-gold-wash px-4 text-center text-[26px] font-bold tabular-nums text-gold-bright">
          {answer || " "}
        </div>
      </div>

      {answered && (
        <div
          className={[
            "rounded-2xl px-[17px] py-[15px] text-center text-[15px] font-bold",
            wasCorrect ? "bg-good-bg text-good" : "bg-critical-bg text-critical",
          ].join(" ")}
        >
          {wasCorrect ? "◯ せいかい!" : `✕ おしい!こたえは ${problem.answer}`}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {KEYPAD_ROWS.flat().map((key, idx) => (
          <button
            key={idx}
            disabled={answered && key !== "✓"}
            onClick={() => pressKey(key)}
            className={[
              "rounded-2xl border-[1.5px] py-4 text-xl font-bold active:scale-95 disabled:opacity-35",
              key === "✓"
                ? "border-transparent bg-gradient-to-br from-gold-bright to-[#b8903c] text-[#231803]"
                : "border-border bg-surface-1 text-fg",
            ].join(" ")}
          >
            {key}
          </button>
        ))}
      </div>

      {answered && (
        <button
          onClick={nextProblem}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-bright to-[#b8903c] px-5 py-4 text-[15.5px] font-bold text-[#231803] transition active:scale-[0.98]"
        >
          つぎのもんだいへ
        </button>
      )}
    </div>
  );
}
