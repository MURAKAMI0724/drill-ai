"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "@/components/kids/ChoiceButton";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import { KOTOWAZA_QUESTIONS } from "@/lib/kids/kids-quiz-data";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { speak } from "@/lib/kids/speech";

export default function KotowazaScreen({
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
    Math.floor(Math.random() * KOTOWAZA_QUESTIONS.length),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
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
    if (correct) {
      onCorrect?.();
    }
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
    <GameLayout
      title="ことわざ"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard label="どんな いみ かな?">
        <div className="text-[22px] leading-relaxed font-extrabold text-ink">
          {question.proverb}
        </div>
      </QuestionCard>

      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, idx) => {
          const isAnswerIdx = idx === question.correctIndex;
          const isSelected = selected === idx;
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

      <div className="flex-1" />
      {answered && <NextButton onClick={nextQuestion} />}
    </GameLayout>
  );
}
