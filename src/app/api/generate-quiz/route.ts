import { NextResponse } from "next/server";
import {
  generateQuizFromImages,
  parseDataUrl,
  QuizGenerationError,
} from "@/lib/quiz-generator";
import { PERSONAS } from "@/lib/personas";
import type { PersonaKey } from "@/lib/types";

export const maxDuration = 60;

const MAX_IMAGES = 4;

interface RequestBody {
  images?: unknown;
  persona?: unknown;
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

  const { images, persona } = body;

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "画像を1枚以上指定してください。" },
      { status: 400 },
    );
  }
  if (images.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `画像は最大${MAX_IMAGES}枚までです。` },
      { status: 400 },
    );
  }
  if (!images.every((img): img is string => typeof img === "string")) {
    return NextResponse.json(
      { error: "画像データの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const personaKey: PersonaKey =
    typeof persona === "string" && persona in PERSONAS
      ? (persona as PersonaKey)
      : "individual";

  try {
    const encodedImages = images.map(parseDataUrl);
    const quiz = await generateQuizFromImages(
      encodedImages,
      PERSONAS[personaKey].generationPromptHint,
    );
    return NextResponse.json(quiz);
  } catch (err) {
    if (err instanceof QuizGenerationError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("generate-quiz failed", err);
    return NextResponse.json(
      { error: "問題の生成に失敗しました。しばらくしてからもう一度お試しください。" },
      { status: 500 },
    );
  }
}
