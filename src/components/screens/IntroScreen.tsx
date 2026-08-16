import Button from "@/components/ui/Button";
import type { PersonaCopy } from "@/lib/personas";

interface IntroScreenProps {
  persona: PersonaCopy;
  onStartCapture: () => void;
  onStartCalc?: () => void;
  onStartShiritori?: () => void;
  onStartKotowaza?: () => void;
  onStartNazonazo?: () => void;
  onStartNakama?: () => void;
  onStartClock?: () => void;
  onStartNakigoe?: () => void;
  onStartHantai?: () => void;
  onStartOkane?: () => void;
}

const FEATURES = [
  "本・ノート・プリント――スマホで撮るだけで読み込み完了",
  "選択式・穴埋め・○×問題をAIが自動生成、解説つきで出題",
  "正答率にあわせて、次に復習する日をAIが自動で決めます",
];

export default function IntroScreen({
  persona,
  onStartCapture,
  onStartCalc,
  onStartShiritori,
  onStartKotowaza,
  onStartNazonazo,
  onStartNakama,
  onStartClock,
  onStartNakigoe,
  onStartHantai,
  onStartOkane,
}: IntroScreenProps) {
  const isKids = persona.key === "kids";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
        {persona.eyebrow}
      </div>
      <h1 className="font-serif text-[25px] leading-[1.35] font-bold whitespace-pre-line">
        {persona.introTitle}
      </h1>
      <p className="text-fg-soft">{persona.introTag}</p>

      <div className="mt-1 flex flex-col gap-3.5">
        {FEATURES.map((text, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gold-wash text-xs font-extrabold text-gold-bright">
              {idx + 1}
            </div>
            <div className="text-[13.5px] leading-relaxed text-fg-soft">
              {text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {isKids && onStartCalc && onStartShiritori && (
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={onStartCalc}>
            🔢 さんすう
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onStartShiritori}
          >
            🔤 AIしりとり
          </Button>
        </div>
      )}

      {isKids && onStartKotowaza && onStartNazonazo && (
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onStartKotowaza}
          >
            📖 ことわざクイズ
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onStartNazonazo}
          >
            ❓ なぞなぞ
          </Button>
        </div>
      )}

      {isKids && onStartClock && onStartNakigoe && (
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={onStartClock}>
            🕐 とけいの よみかた
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onStartNakigoe}
          >
            🐾 なきごえ クイズ
          </Button>
        </div>
      )}

      {isKids && onStartHantai && onStartOkane && (
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onStartHantai}
          >
            🔁 はんたいことば
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onStartOkane}>
            💰 おかねの かぞえかた
          </Button>
        </div>
      )}

      {isKids && onStartNakama && (
        <Button block variant="secondary" onClick={onStartNakama}>
          🔍 なかまはずれ さがし
        </Button>
      )}

      <Button block onClick={onStartCapture}>
        📷 教材を撮影してはじめる
      </Button>
    </div>
  );
}
