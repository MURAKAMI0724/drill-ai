interface TopBarProps {
  showBack: boolean;
  onBack: () => void;
}

export default function TopBar({ showBack, onBack }: TopBarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 pt-5 pb-4">
      <button
        onClick={onBack}
        aria-label="戻る"
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-border pb-0.5 text-[19px] leading-none text-gold-bright active:scale-95",
          showBack ? "visible" : "invisible",
        ].join(" ")}
      >
        ‹
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-gold-bright to-[#a97f2c] text-base font-bold text-[#241a06] shadow-[0_2px_10px_rgba(217,180,91,0.35)]">
        <span className="font-serif">D</span>
      </div>
      <div>
        <div className="font-serif text-base font-bold tracking-wide">
          ドリルAI
        </div>
        <div className="text-[10.5px] tracking-wider text-gold">
          TAP · SCAN · LEARN
        </div>
      </div>
    </div>
  );
}
