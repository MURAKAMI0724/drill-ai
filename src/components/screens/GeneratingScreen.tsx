"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const STEPS = [
  "写真から文字を認識中(OCR)",
  "内容を解析し、重要ポイントを抽出中",
  "問題をAIが自動生成中",
  "復習スケジュールを作成中",
];

const STEP_INTERVAL_MS = 1600;

interface GeneratingScreenProps {
  status: "loading" | "error";
  errorMessage?: string;
  onRetry: () => void;
  onBack: () => void;
}

/** Parent must key this by the generation request id so a retry remounts it and resets `stepIndex`. */
export default function GeneratingScreen({
  status,
  errorMessage,
  onRetry,
  onBack,
}: GeneratingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [status]);

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="text-4xl">😥</div>
        <h2 className="font-serif text-xl font-bold">読み込みに失敗しました</h2>
        <p className="text-fg-soft">
          {errorMessage ?? "問題の生成中にエラーが発生しました。"}
        </p>
        <div className="mt-2 flex w-full flex-col gap-2.5">
          <Button block onClick={onRetry}>
            もう一度試す
          </Button>
          <Button block variant="ghost" onClick={onBack}>
            撮影しなおす
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-5">
      <div
        className="h-16 w-16 shrink-0 animate-spin rounded-full"
        style={{
          background:
            "conic-gradient(var(--gold-bright), transparent 70%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))",
        }}
      />
      <h2 className="text-center font-serif text-xl font-bold">
        AIが写真を読み解いています…
      </h2>
      <div className="flex w-full flex-col gap-3">
        {STEPS.map((label, idx) => {
          const isDone = idx < stepIndex;
          const isActive = idx === stepIndex;
          return (
            <div
              key={label}
              className={[
                "flex items-center gap-2.5 text-[13.5px] transition-opacity",
                isDone
                  ? "text-fg-soft opacity-100"
                  : isActive
                    ? "text-fg opacity-100"
                    : "opacity-45 text-fg-faint",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[11px]",
                  isDone
                    ? "border-gold bg-gold text-[#241a06]"
                    : isActive
                      ? "border-gold"
                      : "border-baseline",
                ].join(" ")}
              >
                {isDone ? "✓" : ""}
              </div>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
