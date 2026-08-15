"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { GeneratedQuiz } from "@/lib/types";

interface QuizIntroScreenProps {
  quiz: GeneratedQuiz;
  title: string;
  tag: string;
  onStart: () => void;
}

export default function QuizIntroScreen({
  quiz,
  title,
  tag,
  onStart,
}: QuizIntroScreenProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const counts = quiz.categories.map((cat) => ({
    cat,
    count: quiz.questions.filter((q) => q.category === cat).length,
  }));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-serif text-2xl font-bold">{title}</h1>
      <p className="text-fg-soft">{tag}</p>

      <div className="flex flex-wrap gap-2">
        {counts.map(({ cat, count }) => (
          <span
            key={cat}
            className="rounded-full bg-gold-wash px-3 py-1.5 text-xs font-bold text-gold-bright"
          >
            {cat} ・ {count}問
          </span>
        ))}
      </div>

      <button
        onClick={() => setPreviewOpen((v) => !v)}
        className="text-left text-[12.5px] font-bold text-gold-bright"
      >
        {previewOpen
          ? "📖 テキストを閉じる"
          : "📖 AIが読み取ったテキストを見る"}
      </button>
      {previewOpen && (
        <div className="max-h-[220px] overflow-y-auto rounded-2xl border border-border bg-surface-1 p-4 text-[12.5px] leading-relaxed whitespace-pre-wrap text-fg-soft">
          {quiz.materialSummary}
        </div>
      )}

      <div className="flex-1" />
      <Button block onClick={onStart}>
        はじめる
      </Button>
    </div>
  );
}
