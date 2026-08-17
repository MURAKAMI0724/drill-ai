import type { ReactNode } from "react";

type FeedbackKind = "correct" | "incorrect" | "hint";

interface FeedbackBannerProps {
  kind: FeedbackKind;
  children: ReactNode;
}

const KIND_CLASSES: Record<FeedbackKind, string> = {
  correct: "bg-good-bg text-good",
  incorrect: "bg-bad-bg text-bad",
  hint: "bg-[#fff8dc] text-[#7a5c00]",
};

const CONFETTI = ["🎉", "✨", "⭐", "✨", "🎉"];

export default function FeedbackBanner({ kind, children }: FeedbackBannerProps) {
  return (
    <div
      className={[
        "relative flex items-center justify-center gap-2 rounded-[24px] px-[18px] py-4 text-center text-[18px] font-extrabold",
        kind === "incorrect" ? "animate-shake" : "",
        KIND_CLASSES[kind],
      ].join(" ")}
    >
      {kind === "correct" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center gap-3 overflow-visible"
        >
          {CONFETTI.map((e, i) => (
            <span
              key={i}
              className="animate-confetti text-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {e}
            </span>
          ))}
        </span>
      )}
      {children}
    </div>
  );
}
