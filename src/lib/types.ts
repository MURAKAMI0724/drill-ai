export type PersonaKey = "individual" | "teacher" | "corporate" | "kids";

export type QuestionType = "mc" | "tf" | "fill";

export interface QuizQuestion {
  id: number;
  category: string;
  type: QuestionType;
  question: string;
  /** Choices for "mc" (multiple choice) and "tf" (true/false, always ["○", "×"]). Absent for "fill". */
  options?: string[];
  /** Index into `options` for mc/tf; the expected literal string for fill. */
  answer: number | string;
  explanation: string;
}

export interface GeneratedQuiz {
  categories: string[];
  materialSummary: string;
  questions: QuizQuestion[];
}

export interface AnswerRecord {
  questionId: number;
  category: string;
  correct: boolean;
}

export interface CategoryStat {
  category: string;
  correct: number;
  total: number;
  accuracy: number;
}
