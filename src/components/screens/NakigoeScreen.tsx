"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "@/components/kids/ChoiceButton";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import { NAKIGOE_QUESTIONS } from "@/lib/kids/kids-quiz-data2";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

type FeedbackKind = "correct" | "incorrect" | null;

export default function NakigoeScreen({
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
    Math.floor(Math.random() * NAKIGOE_QUESTIONS.length),
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
      onCorrect?.();
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
    <GameLayout
      title="なきごえ"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard>
        <div className="text-[22px] leading-relaxed font-extrabold text-ink">
          {question.prompt}
        </div>
      </QuestionCard>

      <div
        className={[
          "grid gap-3",
          question.type === "sound" ? "grid-cols-3" : "grid-cols-1",
        ].join(" ")}
      >
        {question.choices.map((choice, idx) => (
          <ChoiceButton
            key={idx}
            variant="grid"
            size={question.type === "sound" ? "sm" : "lg"}
            emoji={choice.emoji}
            disabled={answered}
            state={answered && idx === question.correctIndex ? "correct" : "neutral"}
            onClick={() => pickChoice(idx)}
          >
            {choice.label}
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
