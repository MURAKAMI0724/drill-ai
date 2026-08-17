import type { ModeMeta } from "./modes";

interface MenuTileProps {
  mode: ModeMeta;
  onClick: () => void;
}

export default function MenuTile({ mode, onClick }: MenuTileProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`${mode.label}。${mode.desc}`}
      className="flex min-h-[132px] flex-col gap-2.5 rounded-[28px] px-[14px] pt-4 pb-3.5 text-left shadow-[0_4px_0_rgba(35,52,87,0.10),0_10px_24px_rgba(35,52,87,0.10)] transition active:translate-y-[3px] active:scale-[0.985]"
      style={{ background: mode.tint }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-[20px] text-[30px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.10)]"
        style={{ background: mode.accent }}
      >
        {mode.emoji}
      </div>
      <div className="text-[18px] font-extrabold text-ink">{mode.label}</div>
      <div className="text-[12px] leading-snug font-bold text-ink-sub">
        {mode.desc}
      </div>
    </button>
  );
}
