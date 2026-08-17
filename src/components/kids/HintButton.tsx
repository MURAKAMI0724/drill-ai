import type { ReactNode } from "react";

interface HintButtonProps {
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}

export default function HintButton({
  onClick,
  children = "💡 ヒントを みる",
  className = "",
}: HintButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "min-h-[60px] rounded-[22px] bg-[#fff8dc] px-5 py-4 text-[16px] font-extrabold text-[#7a5c00] shadow-[0_4px_0_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.98]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
