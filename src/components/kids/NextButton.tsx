import type { ReactNode } from "react";

interface NextButtonProps {
  onClick: () => void;
  children?: ReactNode;
}

export default function NextButton({
  onClick,
  children = "つぎのもんだいへ",
}: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[64px] items-center justify-center gap-2 rounded-[22px] px-5 py-4 text-[17px] font-extrabold text-ink shadow-[0_4px_0_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.98]"
      style={{ background: "linear-gradient(90deg,#ffd166,#ff8fab)" }}
    >
      {children}
    </button>
  );
}
