import { NextResponse } from "next/server";
import { convertToHiragana } from "@/lib/kana-convert";

export const runtime = "nodejs";
export const maxDuration = 15;

// A shiritori turn is a single spoken word, never a sentence.
const MAX_TEXT_LENGTH = 100;

interface RequestBody {
  text?: unknown;
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

  const { text } = body;
  if (typeof text !== "string" || text.trim() === "") {
    return NextResponse.json(
      { error: "textを指定してください。" },
      { status: 400 },
    );
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `textは${MAX_TEXT_LENGTH}文字以内にしてください。` },
      { status: 400 },
    );
  }

  try {
    const hiragana = await convertToHiragana(text);
    return NextResponse.json({ hiragana });
  } catch (err) {
    console.error("kana-convert failed", err);
    return NextResponse.json(
      { error: "変換に失敗しました。" },
      { status: 500 },
    );
  }
}
