import Anthropic from "@anthropic-ai/sdk";
import type { GeneratedQuiz, QuestionType } from "./types";

const MODEL = "claude-sonnet-5";

const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

export interface EncodedImage {
  mediaType: AllowedMediaType;
  base64: string;
}

export class QuizGenerationError extends Error {}

/** Splits a `data:image/jpeg;base64,....` URL into its media type and payload. */
export function parseDataUrl(dataUrl: string): EncodedImage {
  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) {
    throw new QuizGenerationError("画像データの形式が正しくありません。");
  }
  const [, mediaType, base64] = match;
  if (!ALLOWED_MEDIA_TYPES.includes(mediaType as AllowedMediaType)) {
    throw new QuizGenerationError(`対応していない画像形式です: ${mediaType}`);
  }
  return { mediaType: mediaType as AllowedMediaType, base64 };
}

const QUIZ_TOOL: Anthropic.Tool = {
  name: "submit_quiz",
  description:
    "撮影された教材画像から抽出した要約と、生成した問題一式を送信する。",
  input_schema: {
    type: "object",
    properties: {
      categories: {
        type: "array",
        items: { type: "string" },
        description: "教材から見つけた学習カテゴリ(2〜4個、短い名詞句)。",
      },
      material_summary: {
        type: "string",
        description:
          "画像から読み取った教材の要点まとめ(400字程度)。学習者が復習用に読み返せる説明文にする。",
      },
      questions: {
        type: "array",
        minItems: 8,
        maxItems: 12,
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "categoriesのいずれかと一致させる。",
            },
            type: {
              type: "string",
              enum: ["mc", "tf", "fill"],
              description:
                "mc=4択、tf=○×の2択、fill=穴埋め(短答)。バランスよく混在させる。",
            },
            question: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              description:
                "mcは4件、tfは必ず[\"○\",\"×\"]。fillの場合は省略。",
            },
            answer: {
              type: "string",
              description:
                "mc/tfはoptions内の正解のインデックス(0始まりの数字を文字列で)。fillは正解の文字列そのもの。",
            },
            explanation: {
              type: "string",
              description: "なぜその答えが正解か、簡潔な解説。",
            },
          },
          required: ["category", "type", "question", "answer", "explanation"],
        },
      },
    },
    required: ["categories", "material_summary", "questions"],
  },
};

function buildSystemPrompt(personaHint: string): string {
  return `あなたは「ドリルAI」という学習アプリの問題作成アシスタントです。ユーザーが撮影した教材の画像(1〜4枚)から、以下の手順で学習コンテンツを作成してください。

1. 画像内の文字をOCRで読み取る。
2. 内容を解析し、重要なポイント・論点を抽出する。
3. 内容を2〜4個のカテゴリに分類する。
4. 各カテゴリからバランスよく、合計8〜12問の問題を作成する。設問形式は選択式(mc/4択)・○×(tf)・穴埋め(fill)を混在させる。
5. 各設問に、正解の根拠がわかる簡潔な解説をつける。

対象ユーザー: ${personaHint}

必ず submit_quiz ツールを1回呼び出して結果を返してください。それ以外のテキスト出力は不要です。画像に十分な文字情報がない場合も、読み取れる範囲でベストを尽くして問題を作成してください。`;
}

export async function generateQuizFromImages(
  images: EncodedImage[],
  personaHint: string,
): Promise<GeneratedQuiz> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new QuizGenerationError(
      "サーバーに ANTHROPIC_API_KEY が設定されていません。",
    );
  }
  if (images.length === 0) {
    throw new QuizGenerationError("画像が指定されていません。");
  }

  const anthropic = new Anthropic({ apiKey });

  const imageBlocks: Anthropic.ImageBlockParam[] = images.map((img) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: img.mediaType,
      data: img.base64,
    },
  }));

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(personaHint),
    tools: [QUIZ_TOOL],
    tool_choice: { type: "tool", name: "submit_quiz" },
    messages: [
      {
        role: "user",
        content: [
          ...imageBlocks,
          {
            type: "text",
            text: "この教材の画像からテストを作成してください。",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) {
    throw new QuizGenerationError(
      "AIから問題データを取得できませんでした。もう一度お試しください。",
    );
  }

  return normalizeQuiz(toolUse.input);
}

interface RawQuestion {
  category?: unknown;
  type?: unknown;
  question?: unknown;
  options?: unknown;
  answer?: unknown;
  explanation?: unknown;
}

function normalizeQuiz(raw: unknown): GeneratedQuiz {
  if (typeof raw !== "object" || raw === null) {
    throw new QuizGenerationError("AIの応答形式が不正です。");
  }
  const data = raw as {
    categories?: unknown;
    material_summary?: unknown;
    questions?: unknown;
  };

  const categories = Array.isArray(data.categories)
    ? data.categories.filter((c): c is string => typeof c === "string")
    : [];
  const materialSummary =
    typeof data.material_summary === "string" ? data.material_summary : "";
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  const questions = rawQuestions.map((q: RawQuestion, idx: number) => {
    const type = (
      ["mc", "tf", "fill"].includes(q.type as string) ? q.type : "mc"
    ) as QuestionType;
    const category =
      typeof q.category === "string" && q.category
        ? q.category
        : (categories[0] ?? "総合");
    const question = typeof q.question === "string" ? q.question : "";
    const explanation =
      typeof q.explanation === "string" ? q.explanation : "";

    let options: string[] | undefined;
    if (type === "tf") {
      options = ["○", "×"];
    } else if (type === "mc") {
      options = Array.isArray(q.options)
        ? q.options.filter((o): o is string => typeof o === "string")
        : [];
    }

    let answer: number | string;
    if (type === "fill") {
      answer = typeof q.answer === "string" ? q.answer : "";
    } else {
      const parsed = Number.parseInt(String(q.answer), 10);
      answer = Number.isFinite(parsed) ? parsed : 0;
    }

    return {
      id: idx + 1,
      category,
      type,
      question,
      options,
      answer,
      explanation,
    };
  });

  if (questions.length === 0) {
    throw new QuizGenerationError("AIが問題を生成できませんでした。");
  }

  return {
    categories: categories.length > 0 ? categories : ["総合"],
    materialSummary,
    questions,
  };
}
