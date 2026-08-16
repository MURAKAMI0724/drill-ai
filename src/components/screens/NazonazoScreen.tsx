"use client";

import { useEffect, useRef, useState } from "react";
import { KANJI_TO_HIRAGANA } from "@/lib/kids/shiritori-data";
import { NAZONAZO_QUESTIONS } from "@/lib/kids/kids-quiz-data";
import { HIRAGANA_ONLY_RE } from "@/lib/kids/shiritori";
import { normalizeAnswer } from "@/lib/kids/nazonazo";
import { convertToHiraganaViaApi } from "@/lib/kids/kana-convert-client";
import { pickUnusedIndex } from "@/lib/kids/question-pool";
import { cancelSpeech, speak } from "@/lib/kids/speech";

interface NazonazoScreenProps {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

type FeedbackKind = "correct" | "incorrect" | "hint" | null;

export default function NazonazoScreen({
  speechEnabled,
  onToggleSpeech,
}: NazonazoScreenProps) {
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
  const [correctCount, setCorrectCount] = useState(0);
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
      setFeedbackText("◯ せいかい!");
      setTotalCount((n) => n + 1);
      setCorrectCount((n) => n + 1);
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
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
          なぞなぞ
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
        {question.question}
      </div>

      {converting && (
        <div className="text-center text-xs text-gold">
          🔄 へんかんちゅう…
        </div>
      )}
      {hintUsed && !finished && (
        <div className="rounded-2xl border-[1.5px] border-gold-wash-2 bg-gold-wash px-[17px] py-[15px] text-center text-[14px] font-bold text-gold-bright">
          💡 {question.hint}
        </div>
      )}
      {feedbackKind && !converting && (
        <div
          className={[
            "rounded-2xl px-[17px] py-[15px] text-center text-[15px] font-bold",
            feedbackKind === "correct"
              ? "bg-good-bg text-good"
              : feedbackKind === "hint"
                ? "bg-gold-wash text-gold-bright"
                : "bg-critical-bg text-critical",
          ].join(" ")}
        >
          {feedbackText}
        </div>
      )}
      {micStatus && (
        <div className="text-center text-xs text-critical">{micStatus}</div>
      )}

      {!finished && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            disabled={converting}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="こたえを にゅうりょく"
            className="flex-1 rounded-2xl border-[1.5px] border-border bg-surface-1 px-4 py-3.5 text-base text-fg outline-none focus:border-gold disabled:opacity-50"
          />
          {micSupported && (
            <button
              onClick={toggleMic}
              disabled={converting}
              aria-label={micListening ? "きいています" : "タップして はなす"}
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-lg active:scale-95 disabled:opacity-50",
                micListening ? "animate-mic-pulse border-critical" : "",
              ].join(" ")}
            >
              {micListening ? "🔴" : "🎤"}
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || converting}
            className="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-bright to-[#b8903c] px-4 text-sm font-bold text-[#231803] active:scale-95 disabled:opacity-35"
          >
            おくる
          </button>
        </div>
      )}

      {!finished && (
        <div className="flex gap-2.5">
          {!hintUsed && (
            <button
              onClick={showHint}
              className="flex-1 rounded-2xl border-[1.5px] border-gold-wash-2 px-5 py-3.5 text-[14px] font-bold text-gold-bright active:scale-[0.98]"
            >
              💡 ヒントを見る
            </button>
          )}
          <button
            onClick={showAnswer}
            className="flex-1 rounded-2xl border-[1.5px] border-border px-5 py-3.5 text-[14px] font-bold text-fg-soft active:scale-[0.98]"
          >
            🙈 こたえを みる
          </button>
        </div>
      )}

      <div className="flex-1" />
      {finished && (
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
