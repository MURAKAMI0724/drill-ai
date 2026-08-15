import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { GeneratedQuiz, QuizQuestion } from "@/lib/types";

let fontRegistered = false;

function ensureFontRegistered() {
  if (fontRegistered) return;
  const fontPath = path.join(
    process.cwd(),
    "src/lib/fonts/Kosugi-Regular.ttf",
  );
  const buffer = fs.readFileSync(fontPath);
  Font.register({
    family: "Kosugi",
    src: `data:font/truetype;base64,${buffer.toString("base64")}`,
  });
  // Kosugi has no Latin hyphenation dictionary; disabling avoids mangled
  // line breaks in the mixed Japanese/English worksheet text.
  Font.registerHyphenationCallback((word) => [word]);
  fontRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Kosugi",
    fontSize: 10.5,
    lineHeight: 1.5,
    color: "#1a1a1a",
    padding: 40,
  },
  title: { fontSize: 18, marginBottom: 4 },
  subtitle: { fontSize: 9, color: "#666666", marginBottom: 20 },
  questionBlock: { marginBottom: 16 },
  questionHeaderRow: { flexDirection: "row", marginBottom: 6 },
  questionNumber: { width: 20, fontSize: 10.5 },
  questionBody: { flex: 1 },
  questionCategory: { fontSize: 8, color: "#8a6d1f", marginBottom: 2 },
  questionText: { fontSize: 10.5 },
  optionRow: { flexDirection: "row", marginLeft: 20, marginBottom: 3 },
  optionLabel: { width: 18, fontSize: 10 },
  optionText: { flex: 1, fontSize: 10 },
  answerLine: {
    marginLeft: 20,
    marginTop: 6,
    width: 220,
    borderBottom: "0.75pt solid #999999",
    height: 14,
  },
  answerKeyRow: { marginBottom: 12 },
  answerKeyHeader: { fontSize: 10.5, marginBottom: 2 },
  answerKeyExp: { fontSize: 9, color: "#444444" },
});

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

function answerLabel(question: QuizQuestion): string {
  if (question.type === "fill") return String(question.answer);
  const idx = Number(question.answer);
  return question.options?.[idx] ?? String(question.answer);
}

interface WorksheetDocumentProps {
  quiz: GeneratedQuiz;
  heading: string;
}

function WorksheetDocument({ quiz, heading }: WorksheetDocumentProps) {
  const dateLabel = new Date().toLocaleDateString("ja-JP");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{heading}</Text>
        <Text style={styles.subtitle}>
          作成日: {dateLabel} ・ 全{quiz.questions.length}問 ・ 氏名:
          ________________________
        </Text>

        {quiz.questions.map((q, idx) => (
          <View key={q.id} style={styles.questionBlock} wrap={false}>
            <View style={styles.questionHeaderRow}>
              <Text style={styles.questionNumber}>{idx + 1}.</Text>
              <View style={styles.questionBody}>
                <Text style={styles.questionCategory}>{q.category}</Text>
                <Text style={styles.questionText}>{q.question}</Text>
              </View>
            </View>

            {q.type === "fill" ? (
              <View style={styles.answerLine} />
            ) : (
              q.options?.map((opt, oIdx) => (
                <View key={oIdx} style={styles.optionRow}>
                  <Text style={styles.optionLabel}>
                    {OPTION_LABELS[oIdx] ?? `${oIdx + 1}`}.
                  </Text>
                  <Text style={styles.optionText}>{opt}</Text>
                </View>
              ))
            )}
          </View>
        ))}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>解答・解説</Text>
        <Text style={styles.subtitle}>{heading}</Text>

        {quiz.questions.map((q, idx) => (
          <View key={q.id} style={styles.answerKeyRow} wrap={false}>
            <Text style={styles.answerKeyHeader}>
              {idx + 1}. 正解: {answerLabel(q)}
            </Text>
            <Text style={styles.answerKeyExp}>{q.explanation}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function renderWorksheetPdf(
  quiz: GeneratedQuiz,
  heading: string,
): Promise<Buffer> {
  ensureFontRegistered();
  return renderToBuffer(<WorksheetDocument quiz={quiz} heading={heading} />);
}
