import type { ReactNode } from "react";

interface QuestionCardProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export default function QuestionCard({
  label,
  children,
  className = "",
}: QuestionCardProps) {
  return (
    <div
      className={[
        "rounded-[30px] bg-surface px-5 py-6 text-center shadow-[0_4px_0_rgba(35,52,87,0.08),0_12px_28px_rgba(35,52,87,0.12)]",
        className,
      ].join(" ")}
    >
      {label && (
        <div className="mb-2.5 text-[13px] font-extrabold text-ink-sub">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
