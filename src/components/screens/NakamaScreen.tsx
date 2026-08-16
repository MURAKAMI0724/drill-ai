"use client";

import { useEffect, useRef, useState } from "react";
import { NAKAMA_QUESTIONS } from "@/lib/kids/kids-quiz-data";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speakParts } from "@/lib/kids/speech";

interface NakamaScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

type FeedbackKind = "correct" | "incorrect" | null;

export default function NakamaScreen({
  speechEnabled,
  onToggleSpeech,
}: NakamaScreenProps) {
  const usedRef = useRef<Set<number>>(new Set());
  const speechEnabledRef = useRef(speechEnabled);

  const [questionIndex, setQuestionIndex] = useState(() =>
    Math.floor(Math.random() * NAKAMA_QUESTIONS.length),
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

  const question = NAKAMA_QUESTIONS[questionIndex];

  // Reads the prompt aloud whenever the question changes, including the
  // initial one from useState's lazy initializer above: the question first,
  // then each item's name in turn, spaced out so nothing overlaps.
  useEffect(() => {
    speakParts(
      ["このなかで、なかまはずれは どれ?", ...question.items.map((it) => it.name)],
      speechEnabledRef.current,
      350,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  function pickChoice(idx: number) {
    if (answered) return;
    if (idx === question.oddIndex) {
      const odd = question.items[question.oddIndex];
      const text = `せいかい!${odd.name} だけ ${question.oddCategory} だったね`;
      setAnswered(true);
      setFeedbackKind("correct");
      setFeedbackText(text);
      setTotalCount((n) => n + 1);
      setCorrectCount((n) => n + 1);
      speakParts([text], speechEnabledRef.current, 0);
    } else {
      const text = "ざんねん!もういちど";
      setFeedbackKind("incorrect");
      setFeedbackText(text);
      speakParts([text], speechEnabledRef.current, 0);
    }
  }

  function nextQuestion() {
    setQuestionIndex(pickUnusedIndex(NAKAMA_QUESTIONS.length, usedRef.current));
    setAnswered(false);
    setFeedbackKind(null);
    setFeedbackText("");
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          なかまはずれ さがし
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

      <div className="text-center text-[15px] font-bold text-fg">
        このなかで、なかまはずれは どれ?
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.items.map((item, idx) => {
          const isOdd = idx === question.oddIndex;
          let stateClass = "border-border bg-surface-1";
          if (answered && isOdd) {
            stateClass = "border-good bg-good-bg";
          }
          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => pickChoice(idx)}
              className={[
                "flex flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] py-6 active:scale-[0.97] disabled:opacity-90",
                stateClass,
              ].join(" ")}
            >
              <div className="text-[80px] leading-none">{item.emoji}</div>
              <div className="text-[12px] text-fg-faint">{item.name}</div>
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
