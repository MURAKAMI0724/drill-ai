"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "@/components/kids/ChoiceButton";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import NextButton from "@/components/kids/NextButton";
import type { ModeScreenProps } from "@/components/kids/modes";
import { NAKAMA_QUESTIONS } from "@/lib/kids/kids-quiz-data";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speakParts } from "@/lib/kids/speech";

type FeedbackKind = "correct" | "incorrect" | null;

export default function NakamaScreen({
  speechEnabled,
  onToggleSpeech,
  onBack,
  stars,
  starBumpToken,
  onCorrect,
}: ModeScreenProps) {
  const usedRef = useRef<Set<number>>(new Set());
  const speechEnabledRef = useRef(speechEnabled);

  const [questionIndex, setQuestionIndex] = useState(() =>
    Math.floor(Math.random() * NAKAMA_QUESTIONS.length),
  );
  const [answered, setAnswered] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>(null);
  const [feedbackText, setFeedbackText] = useState("");
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
      onCorrect?.();
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
    <GameLayout
      title="なかまはずれ"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <div className="text-center text-[17px] font-extrabold text-ink">
        このなかで、なかまはずれは どれ?
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.items.map((item, idx) => (
          <ChoiceButton
            key={idx}
            variant="grid"
            emoji={item.emoji}
            disabled={answered}
            state={answered && idx === question.oddIndex ? "correct" : "neutral"}
            onClick={() => pickChoice(idx)}
          >
            {item.name}
          </ChoiceButton>
        ))}
      </div>

      {feedbackKind && (
        <FeedbackBanner kind={feedbackKind}>
          {feedbackKind === "correct" ? `🎉 ${feedbackText}` : `✕ ${feedbackText}`}
        </FeedbackBanner>
      )}

      <div className="flex-1" />
      {answered && <NextButton onClick={nextQuestion} />}
    </GameLayout>
  );
}
