// ドリルAI お子さまペルソナ用 追加クイズデータ
// とけいクイズ60問 / どうぶつの なきごえクイズ72問

// ========== とけいの よみかた クイズ ==========
// hour: 1〜12、minute: 0/5/10/.../55
// アナログ時計はSVGで描画すること。針の角度は必ず以下の式で計算する:
//   ちょうしん(長針) = minute * 6
//   たんしん(短針)   = (hour % 12) * 30 + minute * 0.5   ← minute項を忘れると
//   3じ45ふん のとき短針が3ちょうどを指してしまい、実際の時計とズレるので注意。
// speech: 音声読み上げ用(4じ=よじ, 7じ=しちじ, 9じ=くじ など正しい読みに変換済み)
// level: 1=ちょうど 2=30分 3=15分/45分 4=5分きざみ
export interface ClockQuestion {
  hour: number;
  minute: number;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
  speech: string;
  hint: string;
  level: 1 | 2 | 3 | 4;
}

export const CLOCK_QUESTIONS: ClockQuestion[] = [
  { hour: 1, minute: 0, choices: ["1じ30ぷん", "2じ", "1じ"], correctIndex: 2, speech: "いちじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 2, minute: 0, choices: ["3じ", "2じ55ふん", "2じ"], correctIndex: 2, speech: "にじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 3, minute: 0, choices: ["3じ45ふん", "4じ", "3じ"], correctIndex: 2, speech: "さんじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 4, minute: 0, choices: ["5じ", "4じ50ぷん", "4じ"], correctIndex: 2, speech: "よじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 5, minute: 0, choices: ["5じ5ふん", "6じ", "5じ"], correctIndex: 2, speech: "ごじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 6, minute: 0, choices: ["7じ", "6じ35ふん", "6じ"], correctIndex: 2, speech: "ろくじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 7, minute: 0, choices: ["7じ", "8じ", "7じ10ぷん"], correctIndex: 0, speech: "しちじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 8, minute: 0, choices: ["9じ", "8じ", "8じ5ふん"], correctIndex: 1, speech: "はちじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 9, minute: 0, choices: ["10じ", "9じ", "9じ20ぷん"], correctIndex: 1, speech: "くじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 10, minute: 0, choices: ["10じ", "11じ", "10じ50ぷん"], correctIndex: 0, speech: "じゅうじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 11, minute: 0, choices: ["12じ", "11じ5ふん", "11じ"], correctIndex: 2, speech: "じゅういちじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 12, minute: 0, choices: ["12じ45ふん", "1じ", "12じ"], correctIndex: 2, speech: "じゅうにじ", hint: "ながい はりが 12を さして いるときは 「ちょうど」だよ。みじかい はりが さして いる かずが 「じ」だよ", level: 1 },
  { hour: 1, minute: 30, choices: ["2じ30ぷん", "1じ35ふん", "1じ30ぷん"], correctIndex: 2, speech: "いちじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 2, minute: 30, choices: ["2じ50ぷん", "2じ30ぷん", "3じ30ぷん"], correctIndex: 1, speech: "にじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 3, minute: 30, choices: ["4じ30ぷん", "3じ30ぷん", "3じ5ふん"], correctIndex: 1, speech: "さんじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 4, minute: 30, choices: ["5じ30ぷん", "4じ25ふん", "4じ30ぷん"], correctIndex: 2, speech: "よじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 5, minute: 30, choices: ["6じ30ぷん", "5じ50ぷん", "5じ30ぷん"], correctIndex: 2, speech: "ごじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 6, minute: 30, choices: ["6じ30ぷん", "7じ30ぷん", "6じ40ぷん"], correctIndex: 0, speech: "ろくじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 7, minute: 30, choices: ["7じ30ぷん", "7じ25ふん", "8じ30ぷん"], correctIndex: 0, speech: "しちじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 8, minute: 30, choices: ["8じ25ふん", "8じ30ぷん", "9じ30ぷん"], correctIndex: 1, speech: "はちじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 9, minute: 30, choices: ["10じ30ぷん", "9じ30ぷん", "9じ10ぷん"], correctIndex: 1, speech: "くじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 10, minute: 30, choices: ["10じ30ぷん", "11じ30ぷん", "10じ5ふん"], correctIndex: 0, speech: "じゅうじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 11, minute: 30, choices: ["11じ30ぷん", "11じ45ふん", "12じ30ぷん"], correctIndex: 0, speech: "じゅういちじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 12, minute: 30, choices: ["12じ40ぷん", "12じ30ぷん", "1じ30ぷん"], correctIndex: 1, speech: "じゅうにじ さんじゅっぷん", hint: "ながい はりが 6を さして いるときは 30ぷんだよ。みじかい はりは かずと かずの あいだに あるよ", level: 2 },
  { hour: 1, minute: 15, choices: ["1じ15ふん", "2じ15ふん", "1じ5ふん"], correctIndex: 0, speech: "いちじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 2, minute: 45, choices: ["2じ10ぷん", "2じ45ふん", "3じ45ふん"], correctIndex: 1, speech: "にじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 3, minute: 15, choices: ["3じ40ぷん", "3じ15ふん", "4じ15ふん"], correctIndex: 1, speech: "さんじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 4, minute: 45, choices: ["4じ55ふん", "5じ45ふん", "4じ45ふん"], correctIndex: 2, speech: "よじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 5, minute: 15, choices: ["5じ15ふん", "6じ15ふん", "5じ30ぷん"], correctIndex: 0, speech: "ごじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 6, minute: 45, choices: ["6じ45ふん", "6じ50ぷん", "7じ45ふん"], correctIndex: 0, speech: "ろくじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 7, minute: 15, choices: ["7じ5ふん", "8じ15ふん", "7じ15ふん"], correctIndex: 2, speech: "しちじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 8, minute: 45, choices: ["9じ45ふん", "8じ45ふん", "8じ35ふん"], correctIndex: 1, speech: "はちじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 9, minute: 15, choices: ["9じ15ふん", "10じ15ふん", "9じ"], correctIndex: 0, speech: "くじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 10, minute: 45, choices: ["10じ45ふん", "11じ45ふん", "10じ55ふん"], correctIndex: 0, speech: "じゅうじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 11, minute: 15, choices: ["11じ15ふん", "12じ15ふん", "11じ25ふん"], correctIndex: 0, speech: "じゅういちじ じゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 12, minute: 45, choices: ["12じ55ふん", "12じ45ふん", "1じ45ふん"], correctIndex: 1, speech: "じゅうにじ よんじゅうごふん", hint: "ながい はりが 3を さすと 15ふん、9を さすと 45ふんだよ。みじかい はりが 3と4の あいだなら、まだ 3じだよ", level: 3 },
  { hour: 8, minute: 40, choices: ["9じ40ぷん", "8じ40ぷん", "8じ10ぷん"], correctIndex: 1, speech: "はちじ よんじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 8, minute: 5, choices: ["8じ20ぷん", "8じ5ふん", "9じ5ふん"], correctIndex: 1, speech: "はちじ ごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 12, minute: 25, choices: ["12じ25ふん", "12じ35ふん", "1じ25ふん"], correctIndex: 0, speech: "じゅうにじ にじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 2, minute: 20, choices: ["2じ20ぷん", "2じ40ぷん", "3じ20ぷん"], correctIndex: 0, speech: "にじ にじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 3, minute: 50, choices: ["3じ50ぷん", "3じ40ぷん", "4じ50ぷん"], correctIndex: 0, speech: "さんじ ごじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 6, minute: 50, choices: ["7じ50ぷん", "6じ15ふん", "6じ50ぷん"], correctIndex: 2, speech: "ろくじ ごじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 3, minute: 20, choices: ["4じ20ぷん", "3じ20ぷん", "3じ15ふん"], correctIndex: 1, speech: "さんじ にじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 1, minute: 55, choices: ["1じ45ふん", "2じ55ふん", "1じ55ふん"], correctIndex: 2, speech: "いちじ ごじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 5, minute: 5, choices: ["5じ5ふん", "5じ15ふん", "6じ5ふん"], correctIndex: 0, speech: "ごじ ごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 10, minute: 40, choices: ["11じ40ぷん", "10じ40ぷん", "10じ10ぷん"], correctIndex: 1, speech: "じゅうじ よんじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 8, minute: 50, choices: ["8じ50ぷん", "8じ30ぷん", "9じ50ぷん"], correctIndex: 0, speech: "はちじ ごじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 2, minute: 55, choices: ["2じ50ぷん", "2じ55ふん", "3じ55ふん"], correctIndex: 1, speech: "にじ ごじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 4, minute: 10, choices: ["4じ20ぷん", "4じ10ぷん", "5じ10ぷん"], correctIndex: 1, speech: "よじ じゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 2, minute: 40, choices: ["3じ40ぷん", "2じ50ぷん", "2じ40ぷん"], correctIndex: 2, speech: "にじ よんじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 1, minute: 20, choices: ["1じ45ふん", "2じ20ぷん", "1じ20ぷん"], correctIndex: 2, speech: "いちじ にじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 10, minute: 5, choices: ["10じ10ぷん", "11じ5ふん", "10じ5ふん"], correctIndex: 2, speech: "じゅうじ ごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 3, minute: 35, choices: ["3じ35ふん", "4じ35ふん", "3じ25ふん"], correctIndex: 0, speech: "さんじ さんじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 8, minute: 10, choices: ["8じ10ぷん", "8じ5ふん", "9じ10ぷん"], correctIndex: 0, speech: "はちじ じゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 8, minute: 55, choices: ["9じ55ふん", "8じ20ぷん", "8じ55ふん"], correctIndex: 2, speech: "はちじ ごじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 12, minute: 35, choices: ["1じ35ふん", "12じ35ふん", "12じ40ぷん"], correctIndex: 1, speech: "じゅうにじ さんじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 9, minute: 5, choices: ["9じ5ふん", "10じ5ふん", "9じ20ぷん"], correctIndex: 0, speech: "くじ ごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 3, minute: 5, choices: ["3じ45ふん", "3じ5ふん", "4じ5ふん"], correctIndex: 1, speech: "さんじ ごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 9, minute: 40, choices: ["9じ10ぷん", "9じ40ぷん", "10じ40ぷん"], correctIndex: 1, speech: "くじ よんじゅっぷん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
  { hour: 11, minute: 25, choices: ["12じ25ふん", "11じ50ぷん", "11じ25ふん"], correctIndex: 2, speech: "じゅういちじ にじゅうごふん", hint: "ながい はりが さして いる かずを 5ばい すると なんぷんか わかるよ。みじかい はりは、つぎの かずに いくまでは まえの かずの 「じ」だよ", level: 4 },
];

// ========== どうぶつの なきごえ クイズ ==========
// type "sound"  : 鳴き声を読み上げ → どの動物か3択(選択肢は絵文字+名前)
// type "animal" : 動物名を読み上げ → 鳴き声を3択(選択肢は文字のみ、emojiは空文字)
// speech: 出題時に読み上げるテキスト。
export interface NakigoeChoice {
  label: string;
  emoji: string;
}

export interface NakigoeQuestion {
  type: "sound" | "animal";
  sound: string;
  prompt: string;
  speech: string;
  choices: [NakigoeChoice, NakigoeChoice, NakigoeChoice];
  correctIndex: 0 | 1 | 2;
  answerName: string;
  answerEmoji: string;
}

export const NAKIGOE_QUESTIONS: NakigoeQuestion[] = [
  { type: "sound", sound: "ピヨピヨ", prompt: "「ピヨピヨ」と なくのは どれ?", speech: "ピヨピヨ。これは なんの なきごえ?", choices: [{ label: "いぬ", emoji: "🐶" }, { label: "とんび", emoji: "🦅" }, { label: "ひよこ", emoji: "🐤" }], correctIndex: 2, answerName: "ひよこ", answerEmoji: "🐤" },
  { type: "animal", sound: "ツクツクボーシ", prompt: "つくつくぼうしは なんて なく?", speech: "つくつくぼうしは なんて なく?", choices: [{ label: "ツクツクボーシ", emoji: "" }, { label: "キーキー", emoji: "" }, { label: "ガルルル", emoji: "" }], correctIndex: 0, answerName: "つくつくぼうし", answerEmoji: "🦗" },
  { type: "sound", sound: "ホーホケキョ", prompt: "「ホーホケキョ」と なくのは どれ?", speech: "ホーホケキョ。これは なんの なきごえ?", choices: [{ label: "こおろぎ", emoji: "🦗" }, { label: "あひる", emoji: "🦆" }, { label: "うぐいす", emoji: "🐦" }], correctIndex: 2, answerName: "うぐいす", answerEmoji: "🐦" },
  { type: "animal", sound: "キューキュー", prompt: "いるかは なんて なく?", speech: "いるかは なんて なく?", choices: [{ label: "ピヨピヨ", emoji: "" }, { label: "ツクツクボーシ", emoji: "" }, { label: "キューキュー", emoji: "" }], correctIndex: 2, answerName: "いるか", answerEmoji: "🐬" },
  { type: "animal", sound: "リーンリーン", prompt: "すずむしは なんて なく?", speech: "すずむしは なんて なく?", choices: [{ label: "リーンリーン", emoji: "" }, { label: "ツクツクボーシ", emoji: "" }, { label: "コケコッコー", emoji: "" }], correctIndex: 0, answerName: "すずむし", answerEmoji: "🦗" },
  { type: "sound", sound: "ポンポコ", prompt: "「ポンポコ」と なくのは どれ?", speech: "ポンポコ。これは なんの なきごえ?", choices: [{ label: "たぬき", emoji: "🦝" }, { label: "かえる", emoji: "🐸" }, { label: "かっこう", emoji: "🐦" }], correctIndex: 0, answerName: "たぬき", answerEmoji: "🦝" },
  { type: "sound", sound: "チュンチュン", prompt: "「チュンチュン」と なくのは どれ?", speech: "チュンチュン。これは なんの なきごえ?", choices: [{ label: "すずめ", emoji: "🐦" }, { label: "たぬき", emoji: "🦝" }, { label: "ねずみ", emoji: "🐭" }], correctIndex: 0, answerName: "すずめ", answerEmoji: "🐦" },
  { type: "sound", sound: "カナカナ", prompt: "「カナカナ」と なくのは どれ?", speech: "カナカナ。これは なんの なきごえ?", choices: [{ label: "ふくろう", emoji: "🦉" }, { label: "うし", emoji: "🐮" }, { label: "ひぐらし", emoji: "🦗" }], correctIndex: 2, answerName: "ひぐらし", answerEmoji: "🦗" },
  { type: "sound", sound: "キューキュー", prompt: "「キューキュー」と なくのは どれ?", speech: "キューキュー。これは なんの なきごえ?", choices: [{ label: "うぐいす", emoji: "🐦" }, { label: "ねこ", emoji: "🐱" }, { label: "いるか", emoji: "🐬" }], correctIndex: 2, answerName: "いるか", answerEmoji: "🐬" },
  { type: "animal", sound: "カナカナ", prompt: "ひぐらしは なんて なく?", speech: "ひぐらしは なんて なく?", choices: [{ label: "ケーンケーン", emoji: "" }, { label: "カナカナ", emoji: "" }, { label: "ガーガー", emoji: "" }], correctIndex: 1, answerName: "ひぐらし", answerEmoji: "🦗" },
  { type: "sound", sound: "ブーン", prompt: "「ブーン」と なくのは どれ?", speech: "ブーン。これは なんの なきごえ?", choices: [{ label: "はち", emoji: "🐝" }, { label: "ぶた", emoji: "🐷" }, { label: "うぐいす", emoji: "🐦" }], correctIndex: 0, answerName: "はち", answerEmoji: "🐝" },
  { type: "sound", sound: "ヒヒーン", prompt: "「ヒヒーン」と なくのは どれ?", speech: "ヒヒーン。これは なんの なきごえ?", choices: [{ label: "あひる", emoji: "🦆" }, { label: "うま", emoji: "🐴" }, { label: "ひぐらし", emoji: "🦗" }], correctIndex: 1, answerName: "うま", answerEmoji: "🐴" },
  { type: "sound", sound: "ワンワン", prompt: "「ワンワン」と なくのは どれ?", speech: "ワンワン。これは なんの なきごえ?", choices: [{ label: "こおろぎ", emoji: "🦗" }, { label: "いぬ", emoji: "🐶" }, { label: "きつつき", emoji: "🐦" }], correctIndex: 1, answerName: "いぬ", answerEmoji: "🐶" },
  { type: "animal", sound: "ピーヒョロロ", prompt: "とんびは なんて なく?", speech: "とんびは なんて なく?", choices: [{ label: "ゲロゲロ", emoji: "" }, { label: "ホーホケキョ", emoji: "" }, { label: "ピーヒョロロ", emoji: "" }], correctIndex: 2, answerName: "とんび", answerEmoji: "🦅" },
  { type: "animal", sound: "ピヨピヨ", prompt: "ひよこは なんて なく?", speech: "ひよこは なんて なく?", choices: [{ label: "パオーン", emoji: "" }, { label: "ピーヒョロロ", emoji: "" }, { label: "ピヨピヨ", emoji: "" }], correctIndex: 2, answerName: "ひよこ", answerEmoji: "🐤" },
  { type: "animal", sound: "カッコー", prompt: "かっこうは なんて なく?", speech: "かっこうは なんて なく?", choices: [{ label: "カッコー", emoji: "" }, { label: "ヒヒーン", emoji: "" }, { label: "コツコツ", emoji: "" }], correctIndex: 0, answerName: "かっこう", answerEmoji: "🐦" },
  { type: "sound", sound: "ヒーホー", prompt: "「ヒーホー」と なくのは どれ?", speech: "ヒーホー。これは なんの なきごえ?", choices: [{ label: "ろば", emoji: "🫏" }, { label: "たぬき", emoji: "🦝" }, { label: "いぬ", emoji: "🐶" }], correctIndex: 0, answerName: "ろば", answerEmoji: "🫏" },
  { type: "sound", sound: "ガオー", prompt: "「ガオー」と なくのは どれ?", speech: "ガオー。これは なんの なきごえ?", choices: [{ label: "きつね", emoji: "🦊" }, { label: "ねずみ", emoji: "🐭" }, { label: "らいおん", emoji: "🦁" }], correctIndex: 2, answerName: "らいおん", answerEmoji: "🦁" },
  { type: "sound", sound: "メーメー", prompt: "「メーメー」と なくのは どれ?", speech: "メーメー。これは なんの なきごえ?", choices: [{ label: "うし", emoji: "🐮" }, { label: "うぐいす", emoji: "🐦" }, { label: "ひつじ", emoji: "🐑" }], correctIndex: 2, answerName: "ひつじ", answerEmoji: "🐑" },
  { type: "animal", sound: "ポッポー", prompt: "はとは なんて なく?", speech: "はとは なんて なく?", choices: [{ label: "ウォーン", emoji: "" }, { label: "ピヨピヨ", emoji: "" }, { label: "ポッポー", emoji: "" }], correctIndex: 2, answerName: "はと", answerEmoji: "🕊️" },
  { type: "sound", sound: "ポッポー", prompt: "「ポッポー」と なくのは どれ?", speech: "ポッポー。これは なんの なきごえ?", choices: [{ label: "ねずみ", emoji: "🐭" }, { label: "はと", emoji: "🕊️" }, { label: "ひよこ", emoji: "🐤" }], correctIndex: 1, answerName: "はと", answerEmoji: "🕊️" },
  { type: "animal", sound: "メーメー", prompt: "ひつじは なんて なく?", speech: "ひつじは なんて なく?", choices: [{ label: "リーンリーン", emoji: "" }, { label: "メーメー", emoji: "" }, { label: "カーカー", emoji: "" }], correctIndex: 1, answerName: "ひつじ", answerEmoji: "🐑" },
  { type: "sound", sound: "ウォーン", prompt: "「ウォーン」と なくのは どれ?", speech: "ウォーン。これは なんの なきごえ?", choices: [{ label: "いるか", emoji: "🐬" }, { label: "おおかみ", emoji: "🐺" }, { label: "うま", emoji: "🐴" }], correctIndex: 1, answerName: "おおかみ", answerEmoji: "🐺" },
  { type: "animal", sound: "ガルルル", prompt: "とらは なんて なく?", speech: "とらは なんて なく?", choices: [{ label: "コツコツ", emoji: "" }, { label: "ピーヒョロロ", emoji: "" }, { label: "ガルルル", emoji: "" }], correctIndex: 2, answerName: "とら", answerEmoji: "🐯" },
  { type: "animal", sound: "パオーン", prompt: "ぞうは なんて なく?", speech: "ぞうは なんて なく?", choices: [{ label: "コケコッコー", emoji: "" }, { label: "パオーン", emoji: "" }, { label: "ツクツクボーシ", emoji: "" }], correctIndex: 1, answerName: "ぞう", answerEmoji: "🐘" },
  { type: "animal", sound: "コロコロ", prompt: "こおろぎは なんて なく?", speech: "こおろぎは なんて なく?", choices: [{ label: "カーカー", emoji: "" }, { label: "コロコロ", emoji: "" }, { label: "ホーホー", emoji: "" }], correctIndex: 1, answerName: "こおろぎ", answerEmoji: "🦗" },
  { type: "animal", sound: "コツコツ", prompt: "きつつきは なんて なく?", speech: "きつつきは なんて なく?", choices: [{ label: "コツコツ", emoji: "" }, { label: "ガルルル", emoji: "" }, { label: "ミーンミーン", emoji: "" }], correctIndex: 0, answerName: "きつつき", answerEmoji: "🐦" },
  { type: "sound", sound: "ブーブー", prompt: "「ブーブー」と なくのは どれ?", speech: "ブーブー。これは なんの なきごえ?", choices: [{ label: "ひつじ", emoji: "🐑" }, { label: "ぶた", emoji: "🐷" }, { label: "やぎ", emoji: "🐐" }], correctIndex: 1, answerName: "ぶた", answerEmoji: "🐷" },
  { type: "animal", sound: "ケーンケーン", prompt: "きじは なんて なく?", speech: "きじは なんて なく?", choices: [{ label: "ケーンケーン", emoji: "" }, { label: "ワンワン", emoji: "" }, { label: "ブーン", emoji: "" }], correctIndex: 0, answerName: "きじ", answerEmoji: "🐦" },
  { type: "sound", sound: "ピーヒョロロ", prompt: "「ピーヒョロロ」と なくのは どれ?", speech: "ピーヒョロロ。これは なんの なきごえ?", choices: [{ label: "おおかみ", emoji: "🐺" }, { label: "とんび", emoji: "🦅" }, { label: "はと", emoji: "🕊️" }], correctIndex: 1, answerName: "とんび", answerEmoji: "🦅" },
  { type: "animal", sound: "ニャーニャー", prompt: "ねこは なんて なく?", speech: "ねこは なんて なく?", choices: [{ label: "ガルルル", emoji: "" }, { label: "ニャーニャー", emoji: "" }, { label: "ツクツクボーシ", emoji: "" }], correctIndex: 1, answerName: "ねこ", answerEmoji: "🐱" },
  { type: "sound", sound: "カーカー", prompt: "「カーカー」と なくのは どれ?", speech: "カーカー。これは なんの なきごえ?", choices: [{ label: "らいおん", emoji: "🦁" }, { label: "からす", emoji: "🐦" }, { label: "いぬ", emoji: "🐶" }], correctIndex: 1, answerName: "からす", answerEmoji: "🐦" },
  { type: "sound", sound: "リーンリーン", prompt: "「リーンリーン」と なくのは どれ?", speech: "リーンリーン。これは なんの なきごえ?", choices: [{ label: "うし", emoji: "🐮" }, { label: "やぎ", emoji: "🐐" }, { label: "すずむし", emoji: "🦗" }], correctIndex: 2, answerName: "すずむし", answerEmoji: "🦗" },
  { type: "animal", sound: "ゲロゲロ", prompt: "かえるは なんて なく?", speech: "かえるは なんて なく?", choices: [{ label: "ゲロゲロ", emoji: "" }, { label: "ガオー", emoji: "" }, { label: "コケコッコー", emoji: "" }], correctIndex: 0, answerName: "かえる", answerEmoji: "🐸" },
  { type: "animal", sound: "ガオー", prompt: "らいおんは なんて なく?", speech: "らいおんは なんて なく?", choices: [{ label: "コンコン", emoji: "" }, { label: "ガオー", emoji: "" }, { label: "ゲロゲロ", emoji: "" }], correctIndex: 1, answerName: "らいおん", answerEmoji: "🦁" },
  { type: "sound", sound: "ホーホー", prompt: "「ホーホー」と なくのは どれ?", speech: "ホーホー。これは なんの なきごえ?", choices: [{ label: "きつつき", emoji: "🐦" }, { label: "ぞう", emoji: "🐘" }, { label: "ふくろう", emoji: "🦉" }], correctIndex: 2, answerName: "ふくろう", answerEmoji: "🦉" },
  { type: "sound", sound: "コロコロ", prompt: "「コロコロ」と なくのは どれ?", speech: "コロコロ。これは なんの なきごえ?", choices: [{ label: "こおろぎ", emoji: "🦗" }, { label: "かえる", emoji: "🐸" }, { label: "いぬ", emoji: "🐶" }], correctIndex: 0, answerName: "こおろぎ", answerEmoji: "🦗" },
  { type: "sound", sound: "ガルルル", prompt: "「ガルルル」と なくのは どれ?", speech: "ガルルル。これは なんの なきごえ?", choices: [{ label: "とら", emoji: "🐯" }, { label: "いぬ", emoji: "🐶" }, { label: "ねずみ", emoji: "🐭" }], correctIndex: 0, answerName: "とら", answerEmoji: "🐯" },
  { type: "sound", sound: "ゲロゲロ", prompt: "「ゲロゲロ」と なくのは どれ?", speech: "ゲロゲロ。これは なんの なきごえ?", choices: [{ label: "かえる", emoji: "🐸" }, { label: "とんび", emoji: "🦅" }, { label: "すずむし", emoji: "🦗" }], correctIndex: 0, answerName: "かえる", answerEmoji: "🐸" },
  { type: "sound", sound: "ニャーニャー", prompt: "「ニャーニャー」と なくのは どれ?", speech: "ニャーニャー。これは なんの なきごえ?", choices: [{ label: "きつつき", emoji: "🐦" }, { label: "ねこ", emoji: "🐱" }, { label: "ふくろう", emoji: "🦉" }], correctIndex: 1, answerName: "ねこ", answerEmoji: "🐱" },
  { type: "animal", sound: "チュンチュン", prompt: "すずめは なんて なく?", speech: "すずめは なんて なく?", choices: [{ label: "パオーン", emoji: "" }, { label: "チュンチュン", emoji: "" }, { label: "ウォーン", emoji: "" }], correctIndex: 1, answerName: "すずめ", answerEmoji: "🐦" },
  { type: "sound", sound: "パオーン", prompt: "「パオーン」と なくのは どれ?", speech: "パオーン。これは なんの なきごえ?", choices: [{ label: "いぬ", emoji: "🐶" }, { label: "ぞう", emoji: "🐘" }, { label: "きつね", emoji: "🦊" }], correctIndex: 1, answerName: "ぞう", answerEmoji: "🐘" },
  { type: "sound", sound: "コンコン", prompt: "「コンコン」と なくのは どれ?", speech: "コンコン。これは なんの なきごえ?", choices: [{ label: "ふくろう", emoji: "🦉" }, { label: "きつね", emoji: "🦊" }, { label: "はと", emoji: "🕊️" }], correctIndex: 1, answerName: "きつね", answerEmoji: "🦊" },
  { type: "animal", sound: "ワンワン", prompt: "いぬは なんて なく?", speech: "いぬは なんて なく?", choices: [{ label: "ホーホケキョ", emoji: "" }, { label: "ワンワン", emoji: "" }, { label: "ポッポー", emoji: "" }], correctIndex: 1, answerName: "いぬ", answerEmoji: "🐶" },
  { type: "animal", sound: "ホーホケキョ", prompt: "うぐいすは なんて なく?", speech: "うぐいすは なんて なく?", choices: [{ label: "ホーホケキョ", emoji: "" }, { label: "ニャーニャー", emoji: "" }, { label: "モーモー", emoji: "" }], correctIndex: 0, answerName: "うぐいす", answerEmoji: "🐦" },
  { type: "animal", sound: "ヒーホー", prompt: "ろばは なんて なく?", speech: "ろばは なんて なく?", choices: [{ label: "ホーホー", emoji: "" }, { label: "カッコー", emoji: "" }, { label: "ヒーホー", emoji: "" }], correctIndex: 2, answerName: "ろば", answerEmoji: "🫏" },
  { type: "animal", sound: "ポンポコ", prompt: "たぬきは なんて なく?", speech: "たぬきは なんて なく?", choices: [{ label: "ポンポコ", emoji: "" }, { label: "ガーガー", emoji: "" }, { label: "ガルルル", emoji: "" }], correctIndex: 0, answerName: "たぬき", answerEmoji: "🦝" },
  { type: "animal", sound: "ミーンミーン", prompt: "せみは なんて なく?", speech: "せみは なんて なく?", choices: [{ label: "キーキー", emoji: "" }, { label: "モーモー", emoji: "" }, { label: "ミーンミーン", emoji: "" }], correctIndex: 2, answerName: "せみ", answerEmoji: "🦗" },
  { type: "animal", sound: "モーモー", prompt: "うしは なんて なく?", speech: "うしは なんて なく?", choices: [{ label: "カッコー", emoji: "" }, { label: "コケコッコー", emoji: "" }, { label: "モーモー", emoji: "" }], correctIndex: 2, answerName: "うし", answerEmoji: "🐮" },
  { type: "sound", sound: "チューチュー", prompt: "「チューチュー」と なくのは どれ?", speech: "チューチュー。これは なんの なきごえ?", choices: [{ label: "いるか", emoji: "🐬" }, { label: "かっこう", emoji: "🐦" }, { label: "ねずみ", emoji: "🐭" }], correctIndex: 2, answerName: "ねずみ", answerEmoji: "🐭" },
  { type: "sound", sound: "モーモー", prompt: "「モーモー」と なくのは どれ?", speech: "モーモー。これは なんの なきごえ?", choices: [{ label: "こおろぎ", emoji: "🦗" }, { label: "うし", emoji: "🐮" }, { label: "うま", emoji: "🐴" }], correctIndex: 1, answerName: "うし", answerEmoji: "🐮" },
  { type: "sound", sound: "コケコッコー", prompt: "「コケコッコー」と なくのは どれ?", speech: "コケコッコー。これは なんの なきごえ?", choices: [{ label: "いるか", emoji: "🐬" }, { label: "にわとり", emoji: "🐔" }, { label: "こおろぎ", emoji: "🦗" }], correctIndex: 1, answerName: "にわとり", answerEmoji: "🐔" },
  { type: "animal", sound: "コンコン", prompt: "きつねは なんて なく?", speech: "きつねは なんて なく?", choices: [{ label: "コンコン", emoji: "" }, { label: "ヒヒーン", emoji: "" }, { label: "ピヨピヨ", emoji: "" }], correctIndex: 0, answerName: "きつね", answerEmoji: "🦊" },
  { type: "sound", sound: "ケーンケーン", prompt: "「ケーンケーン」と なくのは どれ?", speech: "ケーンケーン。これは なんの なきごえ?", choices: [{ label: "にわとり", emoji: "🐔" }, { label: "ねこ", emoji: "🐱" }, { label: "きじ", emoji: "🐦" }], correctIndex: 2, answerName: "きじ", answerEmoji: "🐦" },
  { type: "animal", sound: "ブーブー", prompt: "ぶたは なんて なく?", speech: "ぶたは なんて なく?", choices: [{ label: "コツコツ", emoji: "" }, { label: "ブーブー", emoji: "" }, { label: "モーモー", emoji: "" }], correctIndex: 1, answerName: "ぶた", answerEmoji: "🐷" },
  { type: "animal", sound: "キーキー", prompt: "さるは なんて なく?", speech: "さるは なんて なく?", choices: [{ label: "キーキー", emoji: "" }, { label: "ヒーホー", emoji: "" }, { label: "ワンワン", emoji: "" }], correctIndex: 0, answerName: "さる", answerEmoji: "🐵" },
  { type: "animal", sound: "チューチュー", prompt: "ねずみは なんて なく?", speech: "ねずみは なんて なく?", choices: [{ label: "メェー", emoji: "" }, { label: "チューチュー", emoji: "" }, { label: "コロコロ", emoji: "" }], correctIndex: 1, answerName: "ねずみ", answerEmoji: "🐭" },
  { type: "animal", sound: "カーカー", prompt: "からすは なんて なく?", speech: "からすは なんて なく?", choices: [{ label: "ブーン", emoji: "" }, { label: "ブーブー", emoji: "" }, { label: "カーカー", emoji: "" }], correctIndex: 2, answerName: "からす", answerEmoji: "🐦" },
  { type: "sound", sound: "キーキー", prompt: "「キーキー」と なくのは どれ?", speech: "キーキー。これは なんの なきごえ?", choices: [{ label: "かえる", emoji: "🐸" }, { label: "さる", emoji: "🐵" }, { label: "すずむし", emoji: "🦗" }], correctIndex: 1, answerName: "さる", answerEmoji: "🐵" },
  { type: "animal", sound: "ヒヒーン", prompt: "うまは なんて なく?", speech: "うまは なんて なく?", choices: [{ label: "ガオー", emoji: "" }, { label: "ミーンミーン", emoji: "" }, { label: "ヒヒーン", emoji: "" }], correctIndex: 2, answerName: "うま", answerEmoji: "🐴" },
  { type: "sound", sound: "ツクツクボーシ", prompt: "「ツクツクボーシ」と なくのは どれ?", speech: "ツクツクボーシ。これは なんの なきごえ?", choices: [{ label: "ひつじ", emoji: "🐑" }, { label: "つくつくぼうし", emoji: "🦗" }, { label: "さる", emoji: "🐵" }], correctIndex: 1, answerName: "つくつくぼうし", answerEmoji: "🦗" },
  { type: "sound", sound: "コツコツ", prompt: "「コツコツ」と なくのは どれ?", speech: "コツコツ。これは なんの なきごえ?", choices: [{ label: "あひる", emoji: "🦆" }, { label: "きつつき", emoji: "🐦" }, { label: "にわとり", emoji: "🐔" }], correctIndex: 1, answerName: "きつつき", answerEmoji: "🐦" },
  { type: "animal", sound: "コケコッコー", prompt: "にわとりは なんて なく?", speech: "にわとりは なんて なく?", choices: [{ label: "コケコッコー", emoji: "" }, { label: "チューチュー", emoji: "" }, { label: "キューキュー", emoji: "" }], correctIndex: 0, answerName: "にわとり", answerEmoji: "🐔" },
  { type: "animal", sound: "ホーホー", prompt: "ふくろうは なんて なく?", speech: "ふくろうは なんて なく?", choices: [{ label: "コンコン", emoji: "" }, { label: "ホーホー", emoji: "" }, { label: "ピーヒョロロ", emoji: "" }], correctIndex: 1, answerName: "ふくろう", answerEmoji: "🦉" },
  { type: "animal", sound: "ブーン", prompt: "はちは なんて なく?", speech: "はちは なんて なく?", choices: [{ label: "ガーガー", emoji: "" }, { label: "ゲロゲロ", emoji: "" }, { label: "ブーン", emoji: "" }], correctIndex: 2, answerName: "はち", answerEmoji: "🐝" },
  { type: "sound", sound: "カッコー", prompt: "「カッコー」と なくのは どれ?", speech: "カッコー。これは なんの なきごえ?", choices: [{ label: "ろば", emoji: "🫏" }, { label: "かっこう", emoji: "🐦" }, { label: "きつね", emoji: "🦊" }], correctIndex: 1, answerName: "かっこう", answerEmoji: "🐦" },
  { type: "animal", sound: "メェー", prompt: "やぎは なんて なく?", speech: "やぎは なんて なく?", choices: [{ label: "ポンポコ", emoji: "" }, { label: "メェー", emoji: "" }, { label: "モーモー", emoji: "" }], correctIndex: 1, answerName: "やぎ", answerEmoji: "🐐" },
  { type: "animal", sound: "ウォーン", prompt: "おおかみは なんて なく?", speech: "おおかみは なんて なく?", choices: [{ label: "コロコロ", emoji: "" }, { label: "ウォーン", emoji: "" }, { label: "カナカナ", emoji: "" }], correctIndex: 1, answerName: "おおかみ", answerEmoji: "🐺" },
  { type: "animal", sound: "ガーガー", prompt: "あひるは なんて なく?", speech: "あひるは なんて なく?", choices: [{ label: "ガルルル", emoji: "" }, { label: "ガーガー", emoji: "" }, { label: "ワンワン", emoji: "" }], correctIndex: 1, answerName: "あひる", answerEmoji: "🦆" },
  { type: "sound", sound: "ミーンミーン", prompt: "「ミーンミーン」と なくのは どれ?", speech: "ミーンミーン。これは なんの なきごえ?", choices: [{ label: "せみ", emoji: "🦗" }, { label: "ろば", emoji: "🫏" }, { label: "ぶた", emoji: "🐷" }], correctIndex: 0, answerName: "せみ", answerEmoji: "🦗" },
  { type: "sound", sound: "ガーガー", prompt: "「ガーガー」と なくのは どれ?", speech: "ガーガー。これは なんの なきごえ?", choices: [{ label: "あひる", emoji: "🦆" }, { label: "ぶた", emoji: "🐷" }, { label: "いぬ", emoji: "🐶" }], correctIndex: 0, answerName: "あひる", answerEmoji: "🦆" },
  { type: "sound", sound: "メェー", prompt: "「メェー」と なくのは どれ?", speech: "メェー。これは なんの なきごえ?", choices: [{ label: "さる", emoji: "🐵" }, { label: "やぎ", emoji: "🐐" }, { label: "すずむし", emoji: "🦗" }], correctIndex: 1, answerName: "やぎ", answerEmoji: "🐐" },
];
