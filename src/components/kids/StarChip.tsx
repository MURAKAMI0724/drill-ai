interface StarChipProps {
  count: number;
  bumpToken?: number;
}

export default function StarChip({ count, bumpToken }: StarChipProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-surface px-[13px] py-2 text-[15px] font-extrabold text-ink shadow-[0_2px_0_rgba(35,52,87,0.10)]">
      <span key={bumpToken ?? 0} className="animate-star-bump inline-block">
        ⭐
      </span>
      <span className="tabular-nums">{count}</span>
    </div>
  );
}
