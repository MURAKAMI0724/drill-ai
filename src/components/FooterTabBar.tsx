export type TabKey = "home" | "scan" | "results";

interface FooterTabBarProps {
  active: TabKey | null;
  onSelect: (tab: TabKey) => void;
}

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "home", icon: "🏠", label: "ホーム" },
  { key: "scan", icon: "📷", label: "スキャン" },
  { key: "results", icon: "📊", label: "結果" },
];

export default function FooterTabBar({ active, onSelect }: FooterTabBarProps) {
  return (
    <div className="flex border-t border-border bg-gradient-to-b from-surface-1 to-bg px-2.5 pt-2 pb-1">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 active:scale-95"
          >
            <span
              className={[
                "text-lg leading-none transition",
                isActive ? "grayscale-0 opacity-100" : "opacity-60 grayscale",
              ].join(" ")}
            >
              {tab.icon}
            </span>
            <span
              className={[
                "text-[10px] font-semibold transition",
                isActive ? "text-gold-bright" : "text-fg-faint",
              ].join(" ")}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
