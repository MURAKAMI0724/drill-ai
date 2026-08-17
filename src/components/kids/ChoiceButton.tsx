import type { ReactNode } from "react";

export type ChoiceState = "neutral" | "correct" | "wrong";

interface ChoiceButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  state?: ChoiceState;
  variant?: "list" | "grid";
  /** 0-based index; shown as a numbered badge in "list" variant. */
  index?: number;
  emoji?: string;
  /** "sm" shrinks emoji/text for dense grids (e.g. 3-column sound choices). */
  size?: "sm" | "lg";
}

const STATE_CLASSES: Record<ChoiceState, string> = {
  neutral: "border-white bg-surface",
  correct: "border-good bg-good-bg",
  wrong: "border-bad bg-bad-bg",
};

export default function ChoiceButton({
  children,
  onClick,
  disabled = false,
  state = "neutral",
  variant = "list",
  index,
  emoji,
  size = "lg",
}: ChoiceButtonProps) {
  const mark =
    state === "correct" ? (
      <span aria-hidden className="text-[20px] leading-none">
        ⭕
      </span>
    ) : state === "wrong" ? (
      <span aria-hidden className="text-[20px] leading-none">
        ✕
      </span>
    ) : null;

  if (variant === "grid") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          "flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-[22px] border-[3px] px-3 py-5 shadow-[0_4px_0_rgba(35,52,87,0.10),0_8px_18px_rgba(35,52,87,0.08)] transition active:translate-y-[3px] active:scale-[0.98] disabled:active:translate-y-0 disabled:active:scale-100",
          STATE_CLASSES[state],
        ].join(" ")}
      >
        {emoji && (
          <div
            className={size === "sm" ? "text-[48px] leading-none" : "text-[64px] leading-none"}
          >
            {emoji}
          </div>
        )}
        <div
          className={[
            "font-extrabold text-ink",
            size === "sm" ? "text-[13px]" : "text-[20px]",
          ].join(" ")}
        >
          {children}
        </div>
        {mark}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex min-h-[64px] w-full items-center gap-3 rounded-[22px] border-[3px] px-[18px] py-[14px] text-left shadow-[0_4px_0_rgba(35,52,87,0.10),0_8px_18px_rgba(35,52,87,0.08)] transition active:translate-y-[3px] active:scale-[0.99] disabled:active:translate-y-0 disabled:active:scale-100",
        STATE_CLASSES[state],
      ].join(" ")}
    >
      {index !== undefined && (
        <span
          className={[
            "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl text-[16px] font-extrabold",
            state === "correct" ? "bg-good text-white" : "bg-[#eef3fb] text-ink-sub",
          ].join(" ")}
        >
          {index + 1}
        </span>
      )}
      <span className="flex-1 text-[20px] font-extrabold text-ink">
        {children}
      </span>
      {mark}
    </button>
  );
}
