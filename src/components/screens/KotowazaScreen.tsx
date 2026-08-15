"use client";

import { useEffect, useRef, useState } from "react";
import { KOTOWAZA_QUESTIONS } from "@/lib/kids/kids-quiz-data";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { speak } from "@/lib/kids/speech";

interface KotowazaScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

export default function KotowazaScreen({
  speechEnabled,
  onToggleSpeech,
}: KotowazaScreenProps) {
  const usedRef = useRef<Set<number>>(new Set());
  const speechEnabledRef = useRef(speechEnabled);

  const [questionIndex, setQuestionIndex] = useState(() =>
    Math.floor(Math.random() * KOTOWAZA_QUESTIONS.length),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
  }, [speechEnabled]);

  // Marks the initial (lazy-initializer-picked) question as used exactly once.
  useEffect(() => {
    usedRef.current.add(questionIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = KOTOWAZA_QUESTIONS[questionIndex];

  // Reads the proverb aloud whenever the question changes, including the
  // initial one from useState's lazy initializer above.
  useEffect(() => {
    speak(question.proverb, speechEnabledRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  function pickChoice(idx: number) {
    if (answered) return;
    const correct = idx === question.correctIndex;
    setSelected(idx);
    setAnswered(true);
    setWasCorrect(correct);
    setTotalCount((n) => n + 1);
    if (correct) setCorrectCount((n) => n + 1);
    speak(correct ? "せいかい!" : "おしい!", speechEnabledRef.current);
  }

  function nextQuestion() {
    setQuestionIndex(
      pickUnusedIndex(KOTOWAZA_QUESTIONS.length, usedRef.current),
    );
    setSelected(null);
    setAnswered(false);
    setWasCorrect(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          ことわざクイズ
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

      <div className="rounded-2xl border border-border bg-surface-1 px-5 py-6 text-center text-[19px] leading-relaxed font-bold">
        {question.proverb}
      </div>

      <div className="text-center text-[13px] text-fg-faint">
        どんな いみ かな?
      </div>

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
                "rounded-2xl border-[1.5px] px-4 py-[15px] text-left text-[14px] leading-relaxed text-fg active:scale-[0.99] disabled:opacity-90",
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
