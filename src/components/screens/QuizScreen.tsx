"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { QuizQuestion } from "@/lib/types";

interface QuizScreenProps {
  question: QuizQuestion;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

/**
 * Keyed by `question.id` from the parent so each question mounts fresh —
 * that's what resets the local answer state, no effect needed.
 */
export default function QuizScreen({
  question,
  index,
  total,
  onAnswer,
  onNext,
}: QuizScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  function pickOption(idx: number) {
    if (answered) return;
    const correct = idx === question.answer;
    setSelected(idx);
    setAnswered(true);
    setWasCorrect(correct);
    onAnswer(correct);
  }

  function submitFill() {
    if (answered || fillValue.trim() === "") return;
    const correct = fillValue.trim() === question.answer;
    setAnswered(true);
    setWasCorrect(correct);
    onAnswer(correct);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-gold-wash px-2.5 py-1 text-[11px] font-bold text-gold-bright">
            {question.category}
          </span>
          <span className="text-xs text-fg-faint">
            {index + 1} / {total}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gridline">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright transition-[width] duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-[17px] leading-relaxed font-bold">
        {question.question}
      </div>

      {question.type === "fill" ? (
        <div className="flex flex-col gap-2.5">
          <input
            type="text"
            value={fillValue}
            disabled={answered}
            onChange={(e) => setFillValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitFill()}
            placeholder="答えを入力してください"
            className={[
              "rounded-2xl border-[1.5px] bg-surface-1 px-4 py-4 text-base text-fg outline-none",
              answered
                ? wasCorrect
                  ? "border-good"
                  : "border-critical"
                : "border-border focus:border-gold",
            ].join(" ")}
          />
          {!answered && (
            <Button variant="secondary" onClick={submitFill}>
              回答する
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {question.options?.map((opt, idx) => {
            const isSelected = selected === idx;
            const isAnswerIdx = idx === question.answer;
            let stateClass = "border-border bg-surface-1";
            if (answered && isAnswerIdx) {
              stateClass = "border-good bg-good-bg";
            } else if (answered && isSelected && !isAnswerIdx) {
              stateClass = "border-critical bg-critical-bg";
            } else if (isSelected) {
              stateClass = "border-gold bg-gold-wash";
            }
            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => pickOption(idx)}
                className={[
                  "rounded-2xl border-[1.5px] px-4 py-[15px] text-left text-[14.5px] text-fg active:scale-[0.99]",
                  stateClass,
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {answered && (
        <div
          className={[
            "rounded-2xl px-[17px] py-[15px] text-[13.5px] leading-relaxed",
            wasCorrect ? "bg-good-bg" : "bg-critical-bg",
          ].join(" ")}
        >
          <div
            className={[
              "mb-1 flex items-center gap-1.5 text-sm font-bold",
              wasCorrect ? "text-good" : "text-critical",
            ].join(" ")}
          >
            {wasCorrect
              ? "◯ 正解です"
              : question.type === "fill"
                ? `✕ 不正解 (正解: ${question.answer})`
                : "✕ 不正解"}
          </div>
          <div>{question.explanation}</div>
        </div>
      )}

      <div className="flex-1" />
      <Button block onClick={onNext} disabled={!answered}>
        次へ
      </Button>
    </div>
  );
}
