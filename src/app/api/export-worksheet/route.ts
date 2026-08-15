import { NextResponse } from "next/server";
import { renderWorksheetPdf } from "@/lib/pdf/worksheet-pdf";
import type { GeneratedQuiz } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface RequestBody {
  quiz?: GeneratedQuiz;
  heading?: unknown;
}

function isValidQuiz(quiz: unknown): quiz is GeneratedQuiz {
  return (
    typeof quiz === "object" &&
    quiz !== null &&
    Array.isArray((quiz as GeneratedQuiz).questions) &&
    (quiz as GeneratedQuiz).questions.length > 0
  );
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  if (!isValidQuiz(body.quiz)) {
    return NextResponse.json(
      { error: "問題データが指定されていません。" },
      { status: 400 },
    );
  }

  const heading =
    typeof body.heading === "string" && body.heading.trim() !== ""
      ? body.heading
      : "ドリルAI ワークシート";

  try {
    const pdfBuffer = await renderWorksheetPdf(body.quiz, heading);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="worksheet.pdf"',
      },
    });
  } catch (err) {
    console.error("export-worksheet failed", err);
    return NextResponse.json(
      { error: "PDFの生成に失敗しました。" },
      { status: 500 },
    );
  }
}
