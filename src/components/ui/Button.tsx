import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-gold-bright to-[#b8903c] text-[#231803] shadow-[0_8px_24px_rgba(217,180,91,0.28)]",
  secondary:
    "bg-transparent text-gold-bright border-[1.5px] border-gold-wash-2",
  ghost: "bg-transparent text-fg-soft border border-border",
};

export default function Button({
  variant = "primary",
  block = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15.5px] font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35",
        VARIANT_CLASSES[variant],
        block ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
