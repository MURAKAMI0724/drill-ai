"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import type { AnswerRecord, GeneratedQuiz } from "@/lib/types";

interface ResultsScreenProps {
  quiz: GeneratedQuiz;
  answers: AnswerRecord[];
  extraCta: string | null;
  extraCtaPending?: boolean;
  onExtraCta: () => void;
  onReviewWeak: () => void;
  onRestart: () => void;
}

interface ScheduleEntry {
  category: string;
  accuracy: number;
  days: number;
  level: "good" | "warning" | "critical";
  label: string;
}

function formatDueDate(days: number): string {
  const due = new Date();
  due.setDate(due.getDate() + days);
  return `${due.getMonth() + 1}月${due.getDate()}日`;
}

export default function ResultsScreen({
  quiz,
  answers,
  extraCta,
  extraCtaPending = false,
  onExtraCta,
  onReviewWeak,
  onRestart,
}: ResultsScreenProps) {
  const [showTable, setShowTable] = useState(false);

  const total = answers.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const categoryStats = useMemo(() => {
    return quiz.categories
      .map((cat) => {
        const rs = answers.filter((a) => a.category === cat);
        const c = rs.filter((a) => a.correct).length;
        const t = rs.length;
        return { category: cat, correct: c, total: t, accuracy: t > 0 ? Math.round((c / t) * 100) : 0 };
      })
      .filter((s) => s.total > 0);
  }, [quiz.categories, answers]);

  const schedule: ScheduleEntry[] = categoryStats.map((s) => {
    if (s.accuracy >= 80) {
      return { category: s.category, accuracy: s.accuracy, days: 7, level: "good", label: "順調です" };
    }
    if (s.accuracy >= 50) {
      return { category: s.category, accuracy: s.accuracy, days: 3, level: "warning", label: "復習しましょう" };
    }
    return { category: s.category, accuracy: s.accuracy, days: 1, level: "critical", label: "要復習" };
  });

  const badgeClasses: Record<ScheduleEntry["level"], string> = {
    good: "bg-good-bg text-good",
    warning: "bg-warning-bg text-warning",
    critical: "bg-critical-bg text-critical",
  };
  const badgeIcon: Record<ScheduleEntry["level"], string> = {
    good: "✓",
    warning: "!",
    critical: "!!",
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="font-serif bg-gradient-to-br from-gold-bright to-gold bg-clip-text text-[52px] leading-none font-bold text-transparent">
          {correctCount}/{total}
        </div>
        <div className="text-[13px] text-fg-faint">
          正答率 <span>{pct}%</span>
        </div>
      </div>

      <div className="rounded-[18px] border border-border bg-gradient-to-b from-surface-1 to-surface-2 p-[17px]">
        <div className="mb-[15px] flex items-center justify-between">
          <div className="text-[13.5px] font-bold">カテゴリ別正答率</div>
          <button
            onClick={() => setShowTable((v) => !v)}
            className="text-[12.5px] font-bold text-gold-bright"
          >
            {showTable ? "グラフで見る" : "表で見る"}
          </button>
        </div>

        {!showTable ? (
          <div className="flex flex-col gap-[15px]">
            {categoryStats.map((s) => (
              <div
                key={s.category}
                className="grid grid-cols-[96px_1fr_42px] items-center gap-2.5"
              >
                <div className="truncate text-xs text-fg-soft">{s.category}</div>
                <div className="h-3.5 overflow-hidden rounded-full bg-gridline">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright transition-[width] duration-500"
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <div className="text-right text-xs font-bold text-gold-bright tabular-nums">
                  {s.accuracy}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-[12.5px]">
            <thead>
              <tr>
                <th className="border-b border-gridline py-2 text-left font-semibold text-fg-faint">
                  カテゴリ
                </th>
                <th className="border-b border-gridline py-2 text-left font-semibold text-fg-faint">
                  正答率
                </th>
                <th className="border-b border-gridline py-2 text-left font-semibold text-fg-faint">
                  正答数
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((s) => (
                <tr key={s.category}>
                  <td className="border-b border-gridline py-2 text-fg-soft">
                    {s.category}
                  </td>
                  <td className="border-b border-gridline py-2 text-fg-soft">
                    {s.accuracy}%
                  </td>
                  <td className="border-b border-gridline py-2 text-fg-soft">
                    {s.correct}/{s.total}問
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h2 className="mb-1 text-lg font-bold">次の復習スケジュール</h2>
        <p className="mb-2.5 text-fg-soft">
          正答率が低いカテゴリほど、早めに再出題します。
        </p>
        <div className="flex flex-col gap-2.5">
          {schedule.map((s) => (
            <div
              key={s.category}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-1 px-[15px] py-[13px]"
            >
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[15px]",
                  badgeClasses[s.level],
                ].join(" ")}
              >
                {badgeIcon[s.level]}
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold">{s.category}</div>
                <div className="text-[11.5px] text-fg-faint">
                  次の復習: {formatDueDate(s.days)}(
                  {s.days === 1 ? "明日" : `${s.days}日後`}) ・ {s.label}
                </div>
              </div>
              <div className="text-[12.5px] font-bold text-gold-bright tabular-nums">
                {s.accuracy}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {extraCta && (
          <Button
            block
            variant="secondary"
            onClick={onExtraCta}
            disabled={extraCtaPending}
          >
            {extraCtaPending ? "PDFを作成しています…" : extraCta}
          </Button>
        )}
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={onReviewWeak}>
            苦手分野だけ復習
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onRestart}>
            はじめから
          </Button>
        </div>
      </div>
    </div>
  );
}
