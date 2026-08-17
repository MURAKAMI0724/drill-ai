"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import Toast from "@/components/Toast";
import MenuTile from "@/components/kids/MenuTile";
import StarChip from "@/components/kids/StarChip";
import { MODES, type ModeKey, type ModeScreenProps } from "@/components/kids/modes";
import ArithmeticScreen from "@/components/screens/ArithmeticScreen";
import ShiritoriScreen from "@/components/screens/ShiritoriScreen";
import NazonazoScreen from "@/components/screens/NazonazoScreen";
import NakamaScreen from "@/components/screens/NakamaScreen";
import ClockScreen from "@/components/screens/ClockScreen";
import NakigoeScreen from "@/components/screens/NakigoeScreen";
import HantaiScreen from "@/components/screens/HantaiScreen";
import OkaneScreen from "@/components/screens/OkaneScreen";
import KotowazaScreen from "@/components/screens/KotowazaScreen";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { speak } from "@/lib/kids/speech";

type Screen = "home" | ModeKey;

const STARS_STORAGE_KEY = "kodomo-app-stars";

let starsListeners: Array<() => void> = [];

function subscribeStars(callback: () => void) {
  starsListeners.push(callback);
  window.addEventListener("storage", callback);
  return () => {
    starsListeners = starsListeners.filter((l) => l !== callback);
    window.removeEventListener("storage", callback);
  };
}

function getStarsSnapshot(): number {
  const raw = window.localStorage.getItem(STARS_STORAGE_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function getStarsServerSnapshot(): number {
  return 0;
}

/** Writes the new star count and notifies this tab's own useSyncExternalStore subscribers (the native "storage" event only fires in *other* tabs). */
function writeStars(next: number) {
  window.localStorage.setItem(STARS_STORAGE_KEY, String(next));
  starsListeners.forEach((l) => l());
}

const SCREEN_COMPONENTS: Record<ModeKey, ComponentType<ModeScreenProps>> = {
  calc: ArithmeticScreen,
  shiritori: ShiritoriScreen,
  nazonazo: NazonazoScreen,
  nakama: NakamaScreen,
  clock: ClockScreen,
  nakigoe: NakigoeScreen,
  hantai: HantaiScreen,
  okane: OkaneScreen,
  kotowaza: KotowazaScreen,
};

const BG_DECORATIONS =
  "radial-gradient(circle at 12% 8%, #ffffff88 0 36px, transparent 40px)," +
  "radial-gradient(circle at 86% 14%, #ffffff70 0 48px, transparent 52px)," +
  "radial-gradient(circle at 22% 34%, #ffffff55 0 28px, transparent 32px)," +
  "radial-gradient(circle at 92% 46%, #ffffff66 0 40px, transparent 44px)," +
  "radial-gradient(circle at 8% 62%, #ffffff55 0 32px, transparent 36px)," +
  "radial-gradient(circle at 74% 78%, #ffffff55 0 44px, transparent 48px)";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [speechEnabled, setSpeechEnabled] = useState(true);
  // useSyncExternalStore (not useState+useEffect) keeps this both
  // hydration-safe — server & first client render both see 0 via
  // getStarsServerSnapshot — and reactive to same-tab writes via writeStars.
  const stars = useSyncExternalStore(
    subscribeStars,
    getStarsSnapshot,
    getStarsServerSnapshot,
  );
  const [starBumpToken, setStarBumpToken] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const speechEnabledRef = useRef(speechEnabled);
  const greetedRef = useRef(false);

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;
  }, [speechEnabled]);

  useEffect(() => {
    if (screen !== "home" || greetedRef.current) return;
    greetedRef.current = true;
    speak("きょうは なにで あそぶ?", speechEnabledRef.current);
  }, [screen]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  function addStar() {
    const prev = getStarsSnapshot();
    const next = prev + 1;
    writeStars(next);
    if (Math.floor(next / 10) > Math.floor(prev / 10)) {
      const msg = `⭐が ${next}こ たまったよ! すごい!`;
      showToast(msg);
      speak(msg, speechEnabledRef.current);
    }
    setStarBumpToken((t) => t + 1);
  }

  const ActiveScreen = screen === "home" ? null : SCREEN_COMPONENTS[screen];

  return (
    <div className="relative flex h-dvh w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{ backgroundImage: BG_DECORATIONS }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col overflow-y-auto px-5 py-6">
        {screen === "home" ? (
          <>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[0_3px_0_rgba(35,52,87,0.12)]"
                style={{
                  background: "linear-gradient(150deg,#ffd166,#ff8fab 55%,#8ecae6)",
                }}
              >
                🌸
              </div>
              <div>
                <div className="text-[21px] leading-tight font-extrabold">
                  {APP_NAME}
                </div>
                <div className="mt-0.5 text-[12px] font-extrabold text-ink-sub">
                  {APP_TAGLINE}
                </div>
              </div>
              <div className="flex-1" />
              <StarChip count={stars} bumpToken={starBumpToken} />
              <button
                onClick={() => setSpeechEnabled((v) => !v)}
                aria-label={
                  speechEnabled
                    ? "音声オン(タップでオフ)"
                    : "音声オフ(タップでオン)"
                }
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-surface text-[21px] shadow-[0_3px_0_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.985]"
              >
                {speechEnabled ? "🔊" : "🔇"}
              </button>
            </div>

            <div className="mt-3.5 mb-1 text-[15px] font-bold text-ink-sub">
              きょうは なにで あそぶ?
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3.5">
              {MODES.map((mode) => (
                <MenuTile
                  key={mode.key}
                  mode={mode}
                  onClick={() => setScreen(mode.key)}
                />
              ))}
            </div>
          </>
        ) : (
          ActiveScreen && (
            <ActiveScreen
              speechEnabled={speechEnabled}
              onToggleSpeech={() => setSpeechEnabled((v) => !v)}
              onBack={() => setScreen("home")}
              stars={stars}
              starBumpToken={starBumpToken}
              onCorrect={addStar}
            />
          )
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}
