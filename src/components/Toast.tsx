interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      className={[
        "pointer-events-none absolute bottom-[88px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-[18px] py-[11px] text-[14px] font-extrabold text-ink shadow-[0_10px_30px_rgba(35,52,87,0.25)] transition-all duration-250",
        message
          ? "translate-y-0 opacity-100"
          : "translate-y-5 opacity-0",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
