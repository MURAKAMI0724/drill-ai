import { PERSONA_ORDER, PERSONAS } from "@/lib/personas";
import type { PersonaKey } from "@/lib/types";

interface PersonaScreenProps {
  onSelect: (persona: PersonaKey) => void;
  onDisabledSelect: () => void;
}

export default function PersonaScreen({
  onSelect,
  onDisabledSelect,
}: PersonaScreenProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-1 py-1.5 text-center">
        <div className="text-[22px]">✨</div>
        <h1 className="font-serif text-[28px] leading-[1.35] font-bold">
          誰のために
          <br />
          つかいますか？
        </h1>
        <p className="mt-1.5 text-fg-soft">
          選ぶだけで、ぴったりのテストがつくれます
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PERSONA_ORDER.map((key) => {
          const p = PERSONAS[key];
          return (
            <button
              key={key}
              onClick={() => (p.enabled ? onSelect(key) : onDisabledSelect())}
              className={[
                "flex items-center gap-3.5 rounded-2xl border border-border bg-gradient-to-b from-surface-1 to-surface-2 p-4 text-left transition active:scale-[0.985]",
                p.enabled
                  ? "hover:border-gold-wash-2"
                  : "opacity-55",
              ].join(" ")}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-wash text-[22px]">
                {p.icon}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">{p.title}</div>
                <div className="mt-0.5 text-xs text-fg-faint">
                  {p.enabled ? p.subtitle : `${p.subtitle}(近日公開)`}
                </div>
              </div>
              <div className="ml-auto text-lg text-gold">
                {p.enabled ? "›" : "🔒"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <div className="text-center text-xs text-fg-faint">
        あとから何度でも、切り替えられます
      </div>
    </div>
  );
}
