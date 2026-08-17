"use client";

import { useEffect, useRef, useState } from "react";
import FeedbackBanner from "@/components/kids/FeedbackBanner";
import GameLayout from "@/components/kids/GameLayout";
import HintButton from "@/components/kids/HintButton";
import NextButton from "@/components/kids/NextButton";
import QuestionCard from "@/components/kids/QuestionCard";
import type { ModeScreenProps } from "@/components/kids/modes";
import { KANJI_TO_HIRAGANA } from "@/lib/kids/shiritori-data";
import { NAZONAZO_QUESTIONS } from "@/lib/kids/nazonazo-data";
import { HIRAGANA_ONLY_RE } from "@/lib/kids/shiritori";
import { normalizeAnswer } from "@/lib/kids/nazonazo";
import { convertToHiraganaViaApi } from "@/lib/kids/kana-convert-client";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

type FeedbackKind = "correct" | "incorrect" | "hint" | null;

export default function NazonazoScreen({
  speechEnabled,
  onToggleSpeech,
  onBack,
  stars,
  starBumpToken,
  onCorrect,
}: ModeScreenProps) {
  const usedRef = useRef<Set<number>>(new Set());
  const speechEnabledRef = useRef(speechEnabled);
  const finishedRef = useRef(false);

  const [questionIndex, setQuestionIndex] = useState(() =>
    Math.floor(Math.random() * NAZONAZO_QUESTIONS.length),
  );
  const [inputValue, setInputValue] = useState("");
  const [finished, setFinished] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [converting, setConverting] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const [micSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
    if (!speechEnabled) cancelSpeech();
  }, [speechEnabled]);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  // Marks the initial (lazy-initializer-picked) question as used exactly once.
  useEffect(() => {
    usedRef.current.add(questionIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = NAZONAZO_QUESTIONS[questionIndex];

  function say(text: string) {
    speak(text, speechEnabledRef.current);
  }

  // Reads the riddle aloud whenever the question changes, including the
  // initial one from useState's lazy initializer above.
  useEffect(() => {
    say(question.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    return () => {
      cancelSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore — recognition may not have started
        }
      }
    };
  }, []);

  function submitAnswer(raw: string) {
    if (finishedRef.current) return;
    const word = normalizeAnswer(raw);
    if (!word) return;
    setInputValue("");

    const isCorrect = question.acceptableAnswers.some(
      (a) => normalizeAnswer(a) === word,
    );

    if (isCorrect) {
      finishedRef.current = true;
      setFinished(true);
      setFeedbackKind("correct");
      setFeedbackText("せいかい!");
      setTotalCount((n) => n + 1);
      onCorrect?.();
      say("せいかい!");
    } else {
      setFeedbackKind("incorrect");
      setFeedbackText("ちがうかな?もういちど かんがえてみて");
      say("ちがうかな?もういちど かんがえてみて");
    }
  }

  /** Shows the hint text only — doesn't end the round, so the child can keep guessing. */
  function showHint() {
    if (finishedRef.current || hintUsed) return;
    setHintUsed(true);
    say(question.hint);
  }

  /** Gives up on the round: reveals the answer and moves to "next question". */
  function showAnswer() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    setFeedbackKind("hint");
    setFeedbackText(`こたえは「${question.displayAnswer}」だよ`);
    setTotalCount((n) => n + 1);
    say(`こたえは「${question.displayAnswer}」だよ`);
  }

  function nextQuestion() {
    stopMic();
    setQuestionIndex(pickUnusedIndex(NAZONAZO_QUESTIONS.length, usedRef.current));
    setInputValue("");
    setFinished(false);
    setFeedbackKind(null);
    setFeedbackText("");
    setHintUsed(false);
    setMicStatus("");
    finishedRef.current = false;
  }

  /**
   * SpeechRecognition often transcribes common nouns with kanji (e.g. "犬"
   * instead of "いぬ"). Sends the raw transcript to /api/kana-convert
   * (server-side kuromoji) for a hiragana reading first; on failure/timeout
   * falls back to the transcript as-is when it's already pure hiragana,
   * then to the small local KANJI_TO_HIRAGANA table, and only asks the
   * child to repeat themselves if neither works.
   */
  async function handleMicTranscript(raw: string) {
    setConverting(true);
    const converted = await convertToHiraganaViaApi(raw);
    setConverting(false);
    if (process.env.NODE_ENV === "development") {
      console.debug("[nazonazo mic] raw:", raw, "hiragana:", converted);
    }
    if (finishedRef.current) return;

    if (converted) {
      submitAnswer(converted);
      return;
    }

    const stripped = raw.trim().replace(/\s+/g, "").replace(/[。、!?！?]/g, "");
    if (HIRAGANA_ONLY_RE.test(stripped)) {
      submitAnswer(stripped);
      return;
    }
    if (KANJI_TO_HIRAGANA[stripped]) {
      submitAnswer(KANJI_TO_HIRAGANA[stripped]);
      return;
    }

    const msg = "うまく へんかんできなかったよ。もういちど いってみてね";
    setFeedbackKind("incorrect");
    setFeedbackText(msg);
    say(msg);
  }

  function stopMic() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore — recognition may not have started
      }
    }
    setMicListening(false);
  }

  function startMic() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setMicStatus(
        "このブラウザは音声入力に対応していません。文字で入力してね(Chromeでのご利用をおすすめします)。",
      );
      return;
    }
    const r = new SR();
    r.lang = "ja-JP";
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setMicListening(false);
      handleMicTranscript(transcript);
    };
    r.onerror = (e) => {
      setMicListening(false);
      let msg = "うまく きこえなかったよ。もういちど ためしてね。";
      if (
        e.error === "not-allowed" ||
        e.error === "permission-denied" ||
        e.error === "service-not-allowed"
      ) {
        msg = "マイクの使用が許可されていません。ブラウザの設定で許可してね。";
      } else if (e.error === "no-speech") {
        msg = "こえが きこえなかったよ。もういちど はなしてみて。";
      } else if (e.error === "network") {
        msg = "ネットワークの都合で音声認識が使えませんでした。";
      }
      setMicStatus(msg);
    };
    r.onend = () => setMicListening(false);
    recognitionRef.current = r;
    try {
      r.start();
      setMicListening(true);
      setMicStatus("");
    } catch {
      setMicStatus("マイクを開始できませんでした。もう一度タップしてね。");
    }
  }

  function toggleMic() {
    if (micListening) {
      stopMic();
      return;
    }
    startMic();
  }

  function handleSend() {
    if (!inputValue.trim()) return;
    submitAnswer(inputValue);
  }

  return (
    <GameLayout
      title="なぞなぞ"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(totalCount, 10) / 10}
    >
      <QuestionCard label={question.genre}>
        <div className="text-[20px] leading-relaxed font-extrabold text-ink">
          {question.question}
        </div>
      </QuestionCard>

      {converting && (
        <div className="text-center text-sm font-bold text-ink-sub">
          🔄 へんかんちゅう…
        </div>
      )}
      {hintUsed && !finished && (
        <FeedbackBanner kind="hint">💡 {question.hint}</FeedbackBanner>
      )}
      {feedbackKind && !converting && (
        <FeedbackBanner
          kind={feedbackKind === "hint" ? "hint" : feedbackKind}
        >
          {feedbackKind === "correct"
            ? `🎉 ${feedbackText}`
            : feedbackKind === "hint"
              ? feedbackText
              : `✕ ${feedbackText}`}
        </FeedbackBanner>
      )}
      {finished &&
        (feedbackKind === "correct" || feedbackKind === "hint") &&
        question.note && (
          <div className="-mt-2 text-center text-[12px] font-bold text-ink-sub">
            {question.note}
          </div>
        )}
      {micStatus && (
        <div className="text-center text-sm font-bold text-bad">{micStatus}</div>
      )}

      {!finished && !question.openEnded && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            disabled={converting}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="こたえを にゅうりょく"
            className="min-h-[60px] w-0 min-w-0 flex-1 rounded-2xl border-[3px] border-white bg-surface px-4 text-[17px] font-bold text-ink shadow-[0_2px_0_rgba(35,52,87,0.08)] outline-none focus:border-[var(--c-nazo)] disabled:opacity-50"
          />
          {micSupported && (
            <button
              onClick={toggleMic}
              disabled={converting}
              aria-label={micListening ? "きいています" : "タップして はなす"}
              className={[
                "flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-surface text-2xl shadow-[0_2px_0_rgba(35,52,87,0.08)] transition active:scale-95 disabled:opacity-50",
                micListening ? "animate-mic-pulse" : "",
              ].join(" ")}
            >
              {micListening ? "🔴" : "🎤"}
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || converting}
            className="flex h-[60px] shrink-0 items-center justify-center rounded-2xl px-5 text-base font-extrabold text-ink shadow-[0_3px_0_rgba(35,52,87,0.10)] transition active:scale-95 disabled:opacity-35"
            style={{ background: "linear-gradient(90deg,#ffd166,#ff8fab)" }}
          >
            おくる
          </button>
        </div>
      )}

      {!finished && question.openEnded && (
        <button
          onClick={showAnswer}
          className="min-h-[60px] rounded-2xl bg-surface px-5 text-[15px] font-extrabold text-ink-sub shadow-[0_2px_0_rgba(35,52,87,0.08)] transition active:scale-[0.98]"
        >
          🙈 こたえを みる
        </button>
      )}

      {!finished && !question.openEnded && (
        <div className="flex gap-2.5">
          {!hintUsed && (
            <HintButton onClick={showHint} className="flex-1" />
          )}
          <button
            onClick={showAnswer}
            className="min-h-[60px] flex-1 rounded-2xl bg-surface px-5 text-[15px] font-extrabold text-ink-sub shadow-[0_2px_0_rgba(35,52,87,0.08)] transition active:scale-[0.98]"
          >
            🙈 こたえを みる
          </button>
        </div>
      )}

      <div className="flex-1" />
      {finished && <NextButton onClick={nextQuestion} />}
    </GameLayout>
  );
}
