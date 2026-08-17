"use client";

import { useEffect, useRef, useState } from "react";
import GameLayout from "@/components/kids/GameLayout";
import type { ModeScreenProps } from "@/components/kids/modes";
import { KANJI_TO_HIRAGANA } from "@/lib/kids/shiritori-data";
import {
  decideAiMove,
  firstKana,
  HIRAGANA_ONLY_RE,
  lastKana,
  normalizeKana,
  pickStarterWord,
} from "@/lib/kids/shiritori";
import { convertToHiraganaViaApi } from "@/lib/kids/kana-convert-client";
import { numberToJapaneseWords } from "@/lib/kids/japanese-numbers";
import { cancelSpeech, speak } from "@/lib/kids/speech";

const KID_TURN_SECONDS = 20;

type BubbleKind = "ai" | "kid" | "system" | "thinking";
interface Bubble {
  id: number;
  kind: BubbleKind;
  text: string;
}

interface EndInfo {
  emoji: string;
  title: string;
  body: string;
}

const BUBBLE_CLASSES: Record<BubbleKind, string> = {
  ai: "self-start bg-surface text-ink rounded-bl-sm shadow-[0_2px_0_rgba(35,52,87,0.08)]",
  kid: "self-end text-ink rounded-br-sm font-bold shadow-[0_2px_0_rgba(35,52,87,0.10)]",
  system:
    "self-center bg-transparent text-ink-sub text-xs text-center px-2 py-1",
  thinking:
    "self-start bg-surface text-ink-sub rounded-bl-sm shadow-[0_2px_0_rgba(35,52,87,0.08)]",
};

export default function ShiritoriScreen({
  speechEnabled,
  onToggleSpeech,
  onBack,
  stars,
  starBumpToken,
}: ModeScreenProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [needKana, setNeedKana] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [endInfo, setEndInfo] = useState<EndInfo | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [micListening, setMicListening] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const [converting, setConverting] = useState(false);
  // Mirrors chainRef.current.length for rendering only — reading a ref
  // during render isn't safe, so the progress bar needs this as real state.
  const [chainLength, setChainLength] = useState(0);
  const [micSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );

  const usedRef = useRef<Set<string>>(new Set());
  const chainRef = useRef<{ word: string; who: "ai" | "kid" }[]>([]);
  const requiredKanaRef = useRef<string | null>(null);
  const gameOverRef = useRef(false);
  const speechEnabledRef = useRef(speechEnabled);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const bubbleIdRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const timerSecondsRef = useRef(KID_TURN_SECONDS);
  const lastSpokenSecondRef = useRef<number | null>(null);

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
    if (!speechEnabled) cancelSpeech();
  }, [speechEnabled]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [bubbles]);

  function say(text: string) {
    speak(text, speechEnabledRef.current);
  }

  function pushChain(entry: { word: string; who: "ai" | "kid" }) {
    chainRef.current.push(entry);
    setChainLength(chainRef.current.length);
  }

  function addTimeout(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }

  function stopKidTimer() {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    lastSpokenSecondRef.current = null;
    setSecondsLeft(null);
  }

  /** Starts (or restarts) the 20s countdown for the child's turn. */
  function startKidTimer() {
    stopKidTimer();
    timerSecondsRef.current = KID_TURN_SECONDS;
    setSecondsLeft(KID_TURN_SECONDS);
    timerIntervalRef.current = window.setInterval(() => {
      timerSecondsRef.current -= 1;
      const next = timerSecondsRef.current;
      setSecondsLeft(next);
      if (next <= 5 && next >= 1 && lastSpokenSecondRef.current !== next) {
        lastSpokenSecondRef.current = next;
        say(numberToJapaneseWords(next));
      }
      if (next <= 0) {
        if (timerIntervalRef.current !== null) {
          window.clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        handleTimeUp();
      }
    }, 1000);
  }

  function handleTimeUp() {
    if (gameOverRef.current) return;
    endShiritori(false, false, true);
  }

  function pushBubble(kind: BubbleKind, text: string) {
    const id = ++bubbleIdRef.current;
    setBubbles((prev) => [...prev, { id, kind, text }]);
  }

  function removeThinking() {
    setBubbles((prev) => prev.filter((b) => b.kind !== "thinking"));
  }

  function aiSay(word: string) {
    usedRef.current.add(word);
    pushChain({ word, who: "ai" });
    pushBubble("ai", `🤖 ${word}`);
    say(word);
    const req = lastKana(word);
    requiredKanaRef.current = req;
    setNeedKana(`「${req}」から はじまる ことばを いれてね`);
    startKidTimer();
  }

  function endShiritori(kidWins: boolean, aiSlipped = false, timeUp = false) {
    gameOverRef.current = true;
    setGameOver(true);
    stopMic();
    stopKidTimer();
    setNeedKana("");
    const title = timeUp
      ? "じかんぎれ!"
      : aiSlipped
        ? "やったね!AIが「ん」を つけちゃった!"
        : kidWins
          ? "やったね!きみの かち!"
          : "また ちょうせんしよう!";
    const body = timeUp
      ? `20びょう いないに こたえられなかったよ。${chainRef.current.length}こ ことばが つながったよ。またチャレンジしてね!`
      : aiSlipped
        ? `AIが「ん」で おわる ことばを いっちゃった!${chainRef.current.length}こ ことばが つながったよ。`
        : kidWins
          ? `AIが つぎの ことばに こまっちゃった!${chainRef.current.length}こ ことばが つながったよ。`
          : `「ん」で おわっちゃった。${chainRef.current.length}こ ことばが つながったよ。またチャレンジしてね!`;
    setEndInfo({ emoji: timeUp ? "⏰" : kidWins ? "🏆" : "😊", title, body });
    say(title);
  }

  function submitWord(raw: string) {
    if (gameOverRef.current) return;
    const word = normalizeKana(raw);
    if (!word) return;
    setInputValue("");
    pushBubble("kid", word);

    if (!HIRAGANA_ONLY_RE.test(word)) {
      const msg = "ひらがなで にゅうりょくしてね";
      pushBubble("system", msg);
      say(msg);
      return;
    }
    if (firstKana(word) !== requiredKanaRef.current) {
      const msg = `おしい!「${requiredKanaRef.current}」から はじまる ことばを かんがえてみて`;
      pushBubble("system", msg);
      say(msg);
      return;
    }
    if (usedRef.current.has(word)) {
      const msg = "それは もう つかったよ!べつの ことばを かんがえてみよう";
      pushBubble("system", msg);
      say(msg);
      return;
    }
    if (lastKana(word) === "ん") {
      stopKidTimer();
      usedRef.current.add(word);
      pushChain({ word, who: "kid" });
      const msg = "「ん」が ついちゃった!";
      pushBubble("system", msg);
      say(msg);
      addTimeout(() => endShiritori(false), 1800);
      return;
    }

    stopKidTimer();
    usedRef.current.add(word);
    pushChain({ word, who: "kid" });
    const requiredKana = lastKana(word);

    pushBubble("thinking", "…");
    addTimeout(() => {
      removeThinking();
      const move = decideAiMove({
        requiredKana,
        chainLength: chainRef.current.length,
        usedWords: usedRef.current,
      });

      if (move.type === "trap") {
        usedRef.current.add(move.word);
        pushChain({ word: move.word, who: "ai" });
        pushBubble("ai", `🤖 ${move.word}`);
        say(move.word);
        addTimeout(() => {
          const msg = `あ!「${move.word}」…「ん」が ついちゃった!`;
          pushBubble("system", msg);
          say(msg);
          addTimeout(() => endShiritori(true, true), 1800);
        }, 900);
        return;
      }

      if (move.type === "giveup") {
        const msg = `AIは「${requiredKana}」から はじまる ことばが おもいつかなかった…`;
        pushBubble("system", msg);
        say(msg);
        addTimeout(() => endShiritori(true), 1800);
        return;
      }

      aiSay(move.word);
    }, 800);
  }

  function startGame() {
    usedRef.current = new Set();
    chainRef.current = [];
    setChainLength(0);
    requiredKanaRef.current = null;
    gameOverRef.current = false;
    setGameOver(false);
    setEndInfo(null);
    setBubbles([]);
    setInputValue("");
    setNeedKana("");
    setMicStatus("");
    stopKidTimer();

    const entry = pickStarterWord();

    pushBubble("thinking", "…");
    addTimeout(() => {
      removeThinking();
      aiSay(entry);
    }, 500);
  }

  useEffect(() => {
    const startId = window.setTimeout(() => startGame(), 0);
    const pendingTimeouts = timeoutsRef.current;
    return () => {
      window.clearTimeout(startId);
      cancelSpeech();
      pendingTimeouts.forEach((id) => window.clearTimeout(id));
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore — recognition may not have started
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /**
   * SpeechRecognition often transcribes common nouns with kanji (e.g. "犬"
   * instead of "いぬ"), which the plain-hiragana dictionary can't match. This
   * sends the raw transcript to /api/kana-convert (server-side kuromoji) to
   * get a hiragana reading first. If that call fails or times out, it falls
   * back to using the transcript as-is when it's already pure hiragana, then
   * to the small local KANJI_TO_HIRAGANA table, and only asks the child to
   * repeat themselves if neither works.
   */
  async function handleMicTranscript(raw: string) {
    setConverting(true);
    const converted = await convertToHiraganaViaApi(raw);
    setConverting(false);
    if (gameOverRef.current) return;

    if (converted) {
      submitWord(converted);
      return;
    }

    const stripped = raw.trim().replace(/\s+/g, "").replace(/[。、!?！?]/g, "");
    if (HIRAGANA_ONLY_RE.test(stripped)) {
      submitWord(stripped);
      return;
    }
    if (KANJI_TO_HIRAGANA[stripped]) {
      submitWord(KANJI_TO_HIRAGANA[stripped]);
      return;
    }

    const msg = "うまく へんかんできなかったよ。もういちど いってみてね";
    pushBubble("system", msg);
    say(msg);
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
    submitWord(inputValue);
  }

  return (
    <GameLayout
      title="しりとり"
      onBack={onBack}
      stars={stars}
      starBumpToken={starBumpToken}
      speechEnabled={speechEnabled}
      onToggleSpeech={onToggleSpeech}
      progress={Math.min(chainLength, 10) / 10}
    >
      <div className="relative flex min-h-0 flex-1 flex-col gap-3">
        {secondsLeft !== null && secondsLeft > 0 && secondsLeft <= 10 && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-[72px] font-black text-bad drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] tabular-nums">
              {secondsLeft}
            </div>
          </div>
        )}

        <div
          ref={logRef}
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-[24px] bg-white/60 p-3"
        >
          {bubbles.map((b) => (
            <div
              key={b.id}
              className={[
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug",
                BUBBLE_CLASSES[b.kind],
              ].join(" ")}
              style={
                b.kind === "kid"
                  ? { background: "linear-gradient(90deg,#ffd166,#ff8fab)" }
                  : undefined
              }
            >
              {b.text}
            </div>
          ))}
        </div>

        {needKana && !gameOver && !converting && (
          <div className="text-center text-[13px] font-bold text-ink-sub">
            {needKana}
          </div>
        )}
        {converting && (
          <div className="text-center text-[13px] font-bold text-ink-sub">
            🔄 へんかんちゅう…
          </div>
        )}
        {micStatus && (
          <div className="text-center text-[13px] font-bold text-bad">
            {micStatus}
          </div>
        )}

        {!gameOver && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              disabled={converting}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="ひらがなで にゅうりょく"
              className="min-h-[60px] w-0 min-w-0 flex-1 rounded-2xl border-[3px] border-white bg-surface px-4 text-[17px] font-bold text-ink shadow-[0_2px_0_rgba(35,52,87,0.08)] outline-none focus:border-[var(--c-siri)] disabled:opacity-50"
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

        {gameOver && endInfo && (
          <div className="flex flex-col items-center gap-2 rounded-[24px] bg-surface px-5 py-6 text-center shadow-[0_4px_0_rgba(35,52,87,0.08),0_12px_28px_rgba(35,52,87,0.12)]">
            <div className="text-4xl">{endInfo.emoji}</div>
            <div className="text-[18px] font-extrabold text-ink">{endInfo.title}</div>
            <div className="text-[14px] font-bold text-ink-sub">{endInfo.body}</div>
            <button
              onClick={startGame}
              className="mt-2 flex min-h-[60px] items-center justify-center gap-2 rounded-2xl px-6 text-[16px] font-extrabold text-ink shadow-[0_3px_0_rgba(35,52,87,0.10)] transition active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg,#ffd166,#ff8fab)" }}
            >
              もういちど あそぶ
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
