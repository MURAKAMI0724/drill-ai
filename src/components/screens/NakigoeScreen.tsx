"use client";

import { useEffect, useRef, useState } from "react";
import { NAKIGOE_QUESTIONS } from "@/lib/kids/kids-quiz-data2";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

interface NakigoeScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

type FeedbackKind = "correct" | "incorrect" | null;

export default function NakigoeScreen({
  speechEnabled,
  onToggleSpeech,
}: NakigoeScreenProps) {
  const usedRef = useRef<Set<number>>(new Set());
  const speechEnabledRef = useRef(speechEnabled);

  const [questionIndex, setQuestionIndex] = useState(() =>
    Math.floor(Math.random() * NAKIGOE_QUESTIONS.length),
  );
  const [answered, setAnswered] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>(null);
  const [feedbackText, setFeedbackText] = useState("");
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

  const question = NAKIGOE_QUESTIONS[questionIndex];

  function say(text: string) {
    speak(text, speechEnabledRef.current);
  }

  // Reads the prompt aloud whenever the question changes, including the
  // initial one from useState's lazy initializer above. Always uses the
  // `speech` field, never the raw choice text — TTS mangles onomatopoeia.
  useEffect(() => {
    say(question.speech);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  function pickChoice(idx: number) {
    if (answered) return;
    if (idx === question.correctIndex) {
      const text = `せいかい!${question.answerEmoji} ${question.answerName} だね`;
      setAnswered(true);
      setFeedbackKind("correct");
      setFeedbackText(text);
      setTotalCount((n) => n + 1);
      setCorrectCount((n) => n + 1);
      say(`せいかい!${question.answerName} だね`);
    } else {
      const text = "ざんねん!もういちど";
      setFeedbackKind("incorrect");
      setFeedbackText(text);
      say(text);
    }
  }

  function nextQuestion() {
    setQuestionIndex(pickUnusedIndex(NAKIGOE_QUESTIONS.length, usedRef.current));
    setAnswered(false);
    setFeedbackKind(null);
    setFeedbackText("");
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          なきごえ クイズ
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

      <div className="rounded-2xl border border-border bg-surface-1 px-5 py-6 text-center text-[17px] leading-relaxed font-bold">
        {question.prompt}
      </div>

      <div
        className={[
          "grid gap-3",
          question.type === "sound" ? "grid-cols-3" : "grid-cols-1",
        ].join(" ")}
      >
        {question.choices.map((choice, idx) => {
          const isOdd = answered && idx === question.correctIndex;
          const stateClass = isOdd
            ? "border-good bg-good-bg"
            : "border-border bg-surface-1";
          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => pickChoice(idx)}
              className={[
                "flex flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] px-3 py-5 active:scale-[0.97] disabled:opacity-90",
                stateClass,
              ].join(" ")}
            >
              {choice.emoji && (
                <div className="text-[48px] leading-none">{choice.emoji}</div>
              )}
              <div
                className={[
                  "text-fg font-bold",
                  question.type === "sound" ? "text-[13px]" : "text-[20px]",
                ].join(" ")}
              >
                {choice.label}
              </div>
            </button>
          );
        })}
      </div>

      {feedbackKind && (
        <div
          className={[
            "rounded-2xl px-[17px] py-[15px] text-center text-[15px] font-bold",
            feedbackKind === "correct"
              ? "bg-good-bg text-good"
              : "bg-critical-bg text-critical",
          ].join(" ")}
        >
          {feedbackText}
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
