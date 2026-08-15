export interface ArithmeticProblem {
  op: "+" | "-";
  a: number;
  b: number;
  answer: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Addition within 1-9, subtraction within 2-10 — matches the approved prototype's range. */
export function generateArithmeticProblem(): ArithmeticProblem {
  const op: "+" | "-" = Math.random() < 0.5 ? "+" : "-";
  let a: number;
  let b: number;
  let answer: number;
  if (op === "+") {
    a = randInt(1, 9);
    b = randInt(1, Math.max(1, 10 - a));
    answer = a + b;
  } else {
    a = randInt(2, 10);
    b = randInt(1, a);
    answer = a - b;
  }
  return { op, a, b, answer };
}

export function problemToSpeech(p: ArithmeticProblem): string {
  const opWord = p.op === "+" ? "たす" : "ひく";
  return `${p.a} ${opWord} ${p.b} は?`;
}
