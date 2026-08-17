import type { ReactNode } from "react";
import StarChip from "./StarChip";

interface GameLayoutProps {
  title: string;
  onBack: () => void;
  stars: number;
  starBumpToken?: number;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  /** 0..1. Omit to hide the progress bar. */
  progress?: number;
  children: ReactNode;
}

export default function GameLayout({
  title,
  onBack,
  stars,
  starBumpToken,
  speechEnabled,
  onToggleSpeech,
  progress,
  children,
}: GameLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBack}
          aria-label="もどる"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-surface text-[22px] shadow-[0_3px_0_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.985]"
        >
          ←
        </button>
        <div className="text-[18px] font-extrabold text-ink">{title}</div>
        <div className="flex-1" />
        <StarChip count={stars} bumpToken={starBumpToken} />
        <button
          onClick={onToggleSpeech}
          aria-label={
            speechEnabled ? "音声オン(タップでオフ)" : "音声オフ(タップでオン)"
          }
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-surface text-[21px] shadow-[0_3px_0_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.985]"
        >
          {speechEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      {progress !== undefined && (
        <div className="h-[14px] overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_4px_rgba(35,52,87,0.10)]">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
              background: "linear-gradient(90deg,#ffd166,#ff8fab)",
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}
