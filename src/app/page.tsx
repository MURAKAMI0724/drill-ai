"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import FooterTabBar, { type TabKey } from "@/components/FooterTabBar";
import Toast from "@/components/Toast";
import PersonaScreen from "@/components/screens/PersonaScreen";
import IntroScreen from "@/components/screens/IntroScreen";
import CaptureScreen from "@/components/screens/CaptureScreen";
import GeneratingScreen from "@/components/screens/GeneratingScreen";
import QuizIntroScreen from "@/components/screens/QuizIntroScreen";
import QuizScreen from "@/components/screens/QuizScreen";
import ResultsScreen from "@/components/screens/ResultsScreen";
import ArithmeticScreen from "@/components/screens/ArithmeticScreen";
import ShiritoriScreen from "@/components/screens/ShiritoriScreen";
import KotowazaScreen from "@/components/screens/KotowazaScreen";
import NazonazoScreen from "@/components/screens/NazonazoScreen";
import { PERSONAS } from "@/lib/personas";
import type {
  AnswerRecord,
  GeneratedQuiz,
  PersonaKey,
  QuizQuestion,
} from "@/lib/types";

type Screen =
  | "persona"
  | "intro"
  | "capture"
  | "generating"
  | "quiz-intro"
  | "quiz"
  | "results"
  | "kids-calc"
  | "kids-shiritori"
  | "kids-kotowaza"
  | "kids-nazonazo";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("persona");
  const [, setScreenStack] = useState<Screen[]>([]);

  const [personaKey, setPersonaKey] = useState<PersonaKey>("individual");
  const [photos, setPhotos] = useState<string[]>([]);

  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [generationRequestId, setGenerationRequestId] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<
    "loading" | "error"
  >("loading");
  const [generationError, setGenerationError] = useState<string | null>(
    null,
  );

  const [quizQueue, setQuizQueue] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  function goTo(next: Screen, opts: { push?: boolean } = {}) {
    const push = opts.push !== false;
    if (push && screen !== next) {
      setScreenStack((prev) => [...prev, screen]);
    }
    setScreen(next);
  }

  function goBack() {
    setScreenStack((prev) => {
      if (prev.length === 0) return prev;
      setScreen(prev[prev.length - 1]);
      return prev.slice(0, -1);
    });
  }

  // Generate the quiz whenever we land on the "generating" screen (initial visit or retry).
  // `generationStatus`/`generationError` are reset by the caller (handleStartGenerating /
  // handleRetryGeneration) before this effect runs, not inside the effect itself.
  useEffect(() => {
    if (screen !== "generating") return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: photos, persona: personaKey }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "問題の生成に失敗しました。");
        }
        if (cancelled) return;
        const generated = data as GeneratedQuiz;
        setQuiz(generated);
        setQuizQueue(generated.questions);
        setCurrentIndex(0);
        setAnswers([]);
        goTo("quiz-intro", { push: false });
      } catch (err) {
        if (cancelled) return;
        setGenerationStatus("error");
        setGenerationError(
          err instanceof Error ? err.message : "問題の生成に失敗しました。",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, generationRequestId]);

  function handleSelectPersona(key: PersonaKey) {
    setPersonaKey(key);
    setPhotos([]);
    goTo("intro");
  }

  function handleDisabledPersona() {
    showToast("近日公開です。まずは「自分の学習」をお試しください");
  }

  function handleAddPhotos(dataUrls: string[]) {
    setPhotos((prev) => [...prev, ...dataUrls].slice(0, 4));
  }

  function handleRemovePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleStartGenerating() {
    setGenerationStatus("loading");
    setGenerationError(null);
    goTo("generating");
  }

  function handleRetryGeneration() {
    setGenerationStatus("loading");
    setGenerationError(null);
    setGenerationRequestId((id) => id + 1);
  }

  function handleStartQuiz() {
    if (!quiz) return;
    setQuizQueue(quiz.questions);
    setCurrentIndex(0);
    setAnswers([]);
    goTo("quiz");
  }

  function handleAnswer(correct: boolean) {
    const q = quizQueue[currentIndex];
    if (!q) return;
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, category: q.category, correct },
    ]);
  }

  function handleNextQuestion() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= quizQueue.length) {
      setHasResults(true);
      goTo("results");
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  function handleReviewWeak() {
    const wrongIds = new Set(
      answers.filter((a) => !a.correct).map((a) => a.questionId),
    );
    const source = quiz?.questions ?? [];
    const filtered = source.filter((q) => wrongIds.has(q.id));
    setQuizQueue(filtered.length > 0 ? filtered : source);
    setCurrentIndex(0);
    setAnswers([]);
    goTo("quiz");
  }

  function handleRestart() {
    setPhotos([]);
    setQuiz(null);
    setQuizQueue([]);
    setCurrentIndex(0);
    setAnswers([]);
    setHasResults(false);
    setScreenStack([]);
    setScreen("persona");
  }

  async function handleExtraCta() {
    const persona = PERSONAS[personaKey];

    if (persona.extraCtaAction === "pdf-worksheet") {
      if (!quiz || exportingPdf) return;
      setExportingPdf(true);
      try {
        const res = await fetch("/api/export-worksheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz,
            heading: `ドリルAI ワークシート ・ ${persona.title}`,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "PDFの生成に失敗しました。");
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "worksheet.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast("PDFを書き出しました 📄");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "PDFの生成に失敗しました。",
        );
      } finally {
        setExportingPdf(false);
      }
      return;
    }

    if (persona.extraCtaAction === "toast" && persona.extraCtaToast) {
      showToast(persona.extraCtaToast);
    }
  }

  function handleTabSelect(tab: TabKey) {
    if (tab === "home") goTo("persona");
    else if (tab === "scan") goTo("capture");
    else if (tab === "results") {
      if (hasResults) goTo("results");
      else showToast("まだ結果がありません。まずは練習してみましょう");
    }
  }

  const activeTab: TabKey | null =
    screen === "persona"
      ? "home"
      : screen === "capture"
        ? "scan"
        : screen === "results"
          ? "results"
          : null;

  const persona = PERSONAS[personaKey];
  const currentQuestion = quizQueue[currentIndex];

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-lg flex-col">
      <TopBar showBack={screen !== "persona"} onBack={goBack} />
      <main className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
        {screen === "persona" && (
          <PersonaScreen
            onSelect={handleSelectPersona}
            onDisabledSelect={handleDisabledPersona}
          />
        )}

        {screen === "intro" && (
          <IntroScreen
            persona={persona}
            onStartCapture={() => goTo("capture")}
            onStartCalc={() => goTo("kids-calc")}
            onStartShiritori={() => goTo("kids-shiritori")}
            onStartKotowaza={() => goTo("kids-kotowaza")}
            onStartNazonazo={() => goTo("kids-nazonazo")}
          />
        )}

        {screen === "kids-calc" && (
          <ArithmeticScreen
            speechEnabled={speechEnabled}
            onToggleSpeech={() => setSpeechEnabled((v) => !v)}
          />
        )}

        {screen === "kids-shiritori" && (
          <ShiritoriScreen
            speechEnabled={speechEnabled}
            onToggleSpeech={() => setSpeechEnabled((v) => !v)}
          />
        )}

        {screen === "kids-kotowaza" && (
          <KotowazaScreen
            speechEnabled={speechEnabled}
            onToggleSpeech={() => setSpeechEnabled((v) => !v)}
          />
        )}

        {screen === "kids-nazonazo" && (
          <NazonazoScreen
            speechEnabled={speechEnabled}
            onToggleSpeech={() => setSpeechEnabled((v) => !v)}
          />
        )}

        {screen === "capture" && (
          <CaptureScreen
            captureHint={persona.captureHint}
            photos={photos}
            onAddPhotos={handleAddPhotos}
            onRemovePhoto={handleRemovePhoto}
            onNext={handleStartGenerating}
          />
        )}

        {screen === "generating" && (
          <GeneratingScreen
            key={generationRequestId}
            status={generationStatus}
            errorMessage={generationError ?? undefined}
            onRetry={handleRetryGeneration}
            onBack={() => goTo("capture", { push: false })}
          />
        )}

        {screen === "quiz-intro" && quiz && (
          <QuizIntroScreen
            quiz={quiz}
            title={persona.quizIntroTitleTemplate(quiz.questions.length)}
            tag={persona.quizIntroTag}
            onStart={handleStartQuiz}
          />
        )}

        {screen === "quiz" && currentQuestion && (
          <QuizScreen
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
            total={quizQueue.length}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
          />
        )}

        {screen === "results" && quiz && (
          <ResultsScreen
            quiz={quiz}
            answers={answers}
            extraCta={persona.extraCta}
            extraCtaPending={exportingPdf}
            onExtraCta={handleExtraCta}
            onReviewWeak={handleReviewWeak}
            onRestart={handleRestart}
          />
        )}
      </main>
      <FooterTabBar active={activeTab} onSelect={handleTabSelect} />
      <Toast message={toast} />
    </div>
  );
}
