// ドリルAI お子さまペルソナ用 追加クイズデータ その3
// はんたいことば124問 / おかねの かぞえかた60問

// ========== はんたいことば クイズ ==========
// 誤答は同じ品詞グループから選び、かつ「これも反対では?」と迷う語は除外済み。
// speech: 出題時の読み上げ用テキスト。
export interface HantaiQuestion {
  word: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
  prompt: string;
  speech: string;
}

export const HANTAI_QUESTIONS: HantaiQuestion[] = [
  { word: "うれしい", choices: ["かなしい", "ちかい", "たかい"], correctIndex: 0, prompt: "「うれしい」の はんたいは?", speech: "うれしい の はんたいは?" },
  { word: "つよい", choices: ["あんぜん", "まずい", "よわい"], correctIndex: 2, prompt: "「つよい」の はんたいは?", speech: "つよい の はんたいは?" },
  { word: "ふかい", choices: ["ひろい", "あさい", "すき"], correctIndex: 1, prompt: "「ふかい」の はんたいは?", speech: "ふかい の はんたいは?" },
  { word: "たのしい", choices: ["きたない", "やさしい", "つまらない"], correctIndex: 2, prompt: "「たのしい」の はんたいは?", speech: "たのしい の はんたいは?" },
  { word: "ねる", choices: ["けす", "おぼえる", "おきる"], correctIndex: 2, prompt: "「ねる」の はんたいは?", speech: "ねる の はんたいは?" },
  { word: "やさしい", choices: ["びょうき", "きびしい", "さむい"], correctIndex: 1, prompt: "「やさしい」の はんたいは?", speech: "やさしい の はんたいは?" },
  { word: "おきる", choices: ["わらう", "ねる", "おぼえる"], correctIndex: 1, prompt: "「おきる」の はんたいは?", speech: "おきる の はんたいは?" },
  { word: "あがる", choices: ["まける", "さがる", "なく"], correctIndex: 1, prompt: "「あがる」の はんたいは?", speech: "あがる の はんたいは?" },
  { word: "まずい", choices: ["おおい", "おいしい", "ひくい"], correctIndex: 1, prompt: "「まずい」の はんたいは?", speech: "まずい の はんたいは?" },
  { word: "おんな", choices: ["あさ", "まえ", "おとこ"], correctIndex: 2, prompt: "「おんな」の はんたいは?", speech: "おんな の はんたいは?" },
  { word: "かたい", choices: ["やわらかい", "きびしい", "ほそい"], correctIndex: 0, prompt: "「かたい」の はんたいは?", speech: "かたい の はんたいは?" },
  { word: "あたたかい", choices: ["びょうき", "あかるい", "すずしい"], correctIndex: 2, prompt: "「あたたかい」の はんたいは?", speech: "あたたかい の はんたいは?" },
  { word: "あさい", choices: ["きけん", "まずい", "ふかい"], correctIndex: 2, prompt: "「あさい」の はんたいは?", speech: "あさい の はんたいは?" },
  { word: "ひく", choices: ["おす", "いれる", "なく"], correctIndex: 0, prompt: "「ひく」の はんたいは?", speech: "ひく の はんたいは?" },
  { word: "まえ", choices: ["うしろ", "とかい", "ふゆ"], correctIndex: 0, prompt: "「まえ」の はんたいは?", speech: "まえ の はんたいは?" },
  { word: "へた", choices: ["いっぱい", "ほそい", "じょうず"], correctIndex: 2, prompt: "「へた」の はんたいは?", speech: "へた の はんたいは?" },
  { word: "ちがう", choices: ["ちかい", "あたたかい", "おなじ"], correctIndex: 2, prompt: "「ちがう」の はんたいは?", speech: "ちがう の はんたいは?" },
  { word: "つまらない", choices: ["たのしい", "むずかしい", "いっぱい"], correctIndex: 0, prompt: "「つまらない」の はんたいは?", speech: "つまらない の はんたいは?" },
  { word: "でる", choices: ["わらう", "はいる", "おりる"], correctIndex: 1, prompt: "「でる」の はんたいは?", speech: "でる の はんたいは?" },
  { word: "ひま", choices: ["いそがしい", "すずしい", "あたらしい"], correctIndex: 0, prompt: "「ひま」の はんたいは?", speech: "ひま の はんたいは?" },
  { word: "そと", choices: ["こども", "まえ", "なか"], correctIndex: 2, prompt: "「そと」の はんたいは?", speech: "そと の はんたいは?" },
  { word: "おわり", choices: ["こども", "はじめ", "おとな"], correctIndex: 1, prompt: "「おわり」の はんたいは?", speech: "おわり の はんたいは?" },
  { word: "あかるい", choices: ["きけん", "くらい", "ひくい"], correctIndex: 1, prompt: "「あかるい」の はんたいは?", speech: "あかるい の はんたいは?" },
  { word: "うる", choices: ["ねる", "かう", "かわく"], correctIndex: 1, prompt: "「うる」の はんたいは?", speech: "うる の はんたいは?" },
  { word: "かなしい", choices: ["よわい", "うれしい", "ひろい"], correctIndex: 1, prompt: "「かなしい」の はんたいは?", speech: "かなしい の はんたいは?" },
  { word: "うえ", choices: ["まえ", "した", "ひだり"], correctIndex: 1, prompt: "「うえ」の はんたいは?", speech: "うえ の はんたいは?" },
  { word: "おそい", choices: ["あたたかい", "ふるい", "はやい"], correctIndex: 2, prompt: "「おそい」の はんたいは?", speech: "おそい の はんたいは?" },
  { word: "たかい", choices: ["ふとい", "へた", "ひくい"], correctIndex: 2, prompt: "「たかい」の はんたいは?", speech: "たかい の はんたいは?" },
  { word: "へる", choices: ["ひらく", "ふえる", "ねる"], correctIndex: 1, prompt: "「へる」の はんたいは?", speech: "へる の はんたいは?" },
  { word: "みじかい", choices: ["びょうき", "おそい", "ながい"], correctIndex: 2, prompt: "「みじかい」の はんたいは?", speech: "みじかい の はんたいは?" },
  { word: "にぎやか", choices: ["おそい", "やさしい", "しずか"], correctIndex: 2, prompt: "「にぎやか」の はんたいは?", speech: "にぎやか の はんたいは?" },
  { word: "こども", choices: ["おとな", "とかい", "なつ"], correctIndex: 0, prompt: "「こども」の はんたいは?", speech: "こども の はんたいは?" },
  { word: "ひくい", choices: ["たかい", "かたい", "かるい"], correctIndex: 0, prompt: "「ひくい」の はんたいは?", speech: "ひくい の はんたいは?" },
  { word: "ちいさい", choices: ["つまらない", "おおきい", "いそがしい"], correctIndex: 1, prompt: "「ちいさい」の はんたいは?", speech: "ちいさい の はんたいは?" },
  { word: "むずかしい", choices: ["きたない", "しずか", "かんたん"], correctIndex: 2, prompt: "「むずかしい」の はんたいは?", speech: "むずかしい の はんたいは?" },
  { word: "のぼる", choices: ["おきる", "まける", "おりる"], correctIndex: 2, prompt: "「のぼる」の はんたいは?", speech: "のぼる の はんたいは?" },
  { word: "いそがしい", choices: ["あかるい", "すくない", "ひま"], correctIndex: 2, prompt: "「いそがしい」の はんたいは?", speech: "いそがしい の はんたいは?" },
  { word: "いなか", choices: ["とかい", "おんな", "うえ"], correctIndex: 0, prompt: "「いなか」の はんたいは?", speech: "いなか の はんたいは?" },
  { word: "ながい", choices: ["しずか", "みじかい", "びょうき"], correctIndex: 1, prompt: "「ながい」の はんたいは?", speech: "ながい の はんたいは?" },
  { word: "くろい", choices: ["しろい", "ふゆ", "おとな"], correctIndex: 0, prompt: "「くろい」の はんたいは?", speech: "くろい の はんたいは?" },
  { word: "とかい", choices: ["ひだり", "いなか", "うえ"], correctIndex: 1, prompt: "「とかい」の はんたいは?", speech: "とかい の はんたいは?" },
  { word: "さがる", choices: ["とじる", "すわる", "あがる"], correctIndex: 2, prompt: "「さがる」の はんたいは?", speech: "さがる の はんたいは?" },
  { word: "やわらかい", choices: ["にぎやか", "かたい", "よわい"], correctIndex: 1, prompt: "「やわらかい」の はんたいは?", speech: "やわらかい の はんたいは?" },
  { word: "だす", choices: ["へる", "すすむ", "いれる"], correctIndex: 2, prompt: "「だす」の はんたいは?", speech: "だす の はんたいは?" },
  { word: "ふとい", choices: ["ほそい", "ひくい", "むずかしい"], correctIndex: 0, prompt: "「ふとい」の はんたいは?", speech: "ふとい の はんたいは?" },
  { word: "さむい", choices: ["ひろい", "あつい", "からい"], correctIndex: 1, prompt: "「さむい」の はんたいは?", speech: "さむい の はんたいは?" },
  { word: "はやい", choices: ["ちいさい", "おそい", "ひま"], correctIndex: 1, prompt: "「はやい」の はんたいは?", speech: "はやい の はんたいは?" },
  { word: "いく", choices: ["かえる", "へる", "おす"], correctIndex: 0, prompt: "「いく」の はんたいは?", speech: "いく の はんたいは?" },
  { word: "うしろ", choices: ["はじめ", "まえ", "した"], correctIndex: 1, prompt: "「うしろ」の はんたいは?", speech: "うしろ の はんたいは?" },
  { word: "おもい", choices: ["やさしい", "あさい", "かるい"], correctIndex: 2, prompt: "「おもい」の はんたいは?", speech: "おもい の はんたいは?" },
  { word: "じょうず", choices: ["やわらかい", "へた", "からい"], correctIndex: 1, prompt: "「じょうず」の はんたいは?", speech: "じょうず の はんたいは?" },
  { word: "しめる", choices: ["ひく", "あける", "かつ"], correctIndex: 1, prompt: "「しめる」の はんたいは?", speech: "しめる の はんたいは?" },
  { word: "げんき", choices: ["びょうき", "おもい", "あんぜん"], correctIndex: 0, prompt: "「げんき」の はんたいは?", speech: "げんき の はんたいは?" },
  { word: "おわる", choices: ["はじまる", "すわる", "かう"], correctIndex: 0, prompt: "「おわる」の はんたいは?", speech: "おわる の はんたいは?" },
  { word: "おとこ", choices: ["とかい", "おんな", "うしろ"], correctIndex: 1, prompt: "「おとこ」の はんたいは?", speech: "おとこ の はんたいは?" },
  { word: "なげる", choices: ["ねる", "うける", "あがる"], correctIndex: 1, prompt: "「なげる」の はんたいは?", speech: "なげる の はんたいは?" },
  { word: "おおきい", choices: ["ちいさい", "ふかい", "たかい"], correctIndex: 0, prompt: "「おおきい」の はんたいは?", speech: "おおきい の はんたいは?" },
  { word: "おとな", choices: ["そと", "おわり", "こども"], correctIndex: 2, prompt: "「おとな」の はんたいは?", speech: "おとな の はんたいは?" },
  { word: "おおい", choices: ["すくない", "ちがう", "おそい"], correctIndex: 0, prompt: "「おおい」の はんたいは?", speech: "おおい の はんたいは?" },
  { word: "しずか", choices: ["ふとい", "にぎやか", "うれしい"], correctIndex: 1, prompt: "「しずか」の はんたいは?", speech: "しずか の はんたいは?" },
  { word: "あつい", choices: ["さむい", "うれしい", "やさしい"], correctIndex: 0, prompt: "「あつい」の はんたいは?", speech: "あつい の はんたいは?" },
  { word: "からっぽ", choices: ["いっぱい", "むずかしい", "おそい"], correctIndex: 0, prompt: "「からっぽ」の はんたいは?", speech: "からっぽ の はんたいは?" },
  { word: "すくない", choices: ["おそい", "おおい", "みじかい"], correctIndex: 1, prompt: "「すくない」の はんたいは?", speech: "すくない の はんたいは?" },
  { word: "かえる", choices: ["ねる", "いく", "おわる"], correctIndex: 1, prompt: "「かえる」の はんたいは?", speech: "かえる の はんたいは?" },
  { word: "ぬれる", choices: ["さがる", "わらう", "かわく"], correctIndex: 2, prompt: "「ぬれる」の はんたいは?", speech: "ぬれる の はんたいは?" },
  { word: "はじまる", choices: ["ねる", "あがる", "おわる"], correctIndex: 2, prompt: "「はじまる」の はんたいは?", speech: "はじまる の はんたいは?" },
  { word: "けす", choices: ["つける", "おりる", "あがる"], correctIndex: 0, prompt: "「けす」の はんたいは?", speech: "けす の はんたいは?" },
  { word: "いれる", choices: ["ねる", "だす", "おりる"], correctIndex: 1, prompt: "「いれる」の はんたいは?", speech: "いれる の はんたいは?" },
  { word: "わらう", choices: ["けす", "おりる", "なく"], correctIndex: 2, prompt: "「わらう」の はんたいは?", speech: "わらう の はんたいは?" },
  { word: "ふるい", choices: ["まずい", "よわい", "あたらしい"], correctIndex: 2, prompt: "「ふるい」の はんたいは?", speech: "ふるい の はんたいは?" },
  { word: "おなじ", choices: ["あさい", "ちがう", "むずかしい"], correctIndex: 1, prompt: "「おなじ」の はんたいは?", speech: "おなじ の はんたいは?" },
  { word: "あんぜん", choices: ["きけん", "ほそい", "おもい"], correctIndex: 0, prompt: "「あんぜん」の はんたいは?", speech: "あんぜん の はんたいは?" },
  { word: "つける", choices: ["わすれる", "なく", "けす"], correctIndex: 2, prompt: "「つける」の はんたいは?", speech: "つける の はんたいは?" },
  { word: "みぎ", choices: ["うしろ", "うえ", "ひだり"], correctIndex: 2, prompt: "「みぎ」の はんたいは?", speech: "みぎ の はんたいは?" },
  { word: "すき", choices: ["きらい", "かんたん", "きたない"], correctIndex: 0, prompt: "「すき」の はんたいは?", speech: "すき の はんたいは?" },
  { word: "わすれる", choices: ["しめる", "おぼえる", "あける"], correctIndex: 1, prompt: "「わすれる」の はんたいは?", speech: "わすれる の はんたいは?" },
  { word: "うける", choices: ["たつ", "ひく", "なげる"], correctIndex: 2, prompt: "「うける」の はんたいは?", speech: "うける の はんたいは?" },
  { word: "よわい", choices: ["つよい", "さむい", "しずか"], correctIndex: 0, prompt: "「よわい」の はんたいは?", speech: "よわい の はんたいは?" },
  { word: "かるい", choices: ["おもい", "みじかい", "きたない"], correctIndex: 0, prompt: "「かるい」の はんたいは?", speech: "かるい の はんたいは?" },
  { word: "かう", choices: ["うる", "わすれる", "おりる"], correctIndex: 0, prompt: "「かう」の はんたいは?", speech: "かう の はんたいは?" },
  { word: "ふゆ", choices: ["おわり", "そと", "なつ"], correctIndex: 2, prompt: "「ふゆ」の はんたいは?", speech: "ふゆ の はんたいは?" },
  { word: "すすむ", choices: ["はいる", "もどる", "とじる"], correctIndex: 1, prompt: "「すすむ」の はんたいは?", speech: "すすむ の はんたいは?" },
  { word: "おりる", choices: ["のぼる", "だす", "おぼえる"], correctIndex: 0, prompt: "「おりる」の はんたいは?", speech: "おりる の はんたいは?" },
  { word: "いっぱい", choices: ["いそがしい", "あつい", "からっぽ"], correctIndex: 2, prompt: "「いっぱい」の はんたいは?", speech: "いっぱい の はんたいは?" },
  { word: "はいる", choices: ["でる", "かつ", "かう"], correctIndex: 0, prompt: "「はいる」の はんたいは?", speech: "はいる の はんたいは?" },
  { word: "びょうき", choices: ["ひま", "げんき", "きけん"], correctIndex: 1, prompt: "「びょうき」の はんたいは?", speech: "びょうき の はんたいは?" },
  { word: "きれい", choices: ["にぎやか", "かなしい", "きたない"], correctIndex: 2, prompt: "「きれい」の はんたいは?", speech: "きれい の はんたいは?" },
  { word: "おぼえる", choices: ["わすれる", "おきる", "わらう"], correctIndex: 0, prompt: "「おぼえる」の はんたいは?", speech: "おぼえる の はんたいは?" },
  { word: "くらい", choices: ["おもい", "うれしい", "あかるい"], correctIndex: 2, prompt: "「くらい」の はんたいは?", speech: "くらい の はんたいは?" },
  { word: "ちかい", choices: ["とおい", "じょうず", "ふとい"], correctIndex: 0, prompt: "「ちかい」の はんたいは?", speech: "ちかい の はんたいは?" },
  { word: "あたらしい", choices: ["かなしい", "ふるい", "げんき"], correctIndex: 1, prompt: "「あたらしい」の はんたいは?", speech: "あたらしい の はんたいは?" },
  { word: "あさ", choices: ["ふゆ", "おとな", "よる"], correctIndex: 2, prompt: "「あさ」の はんたいは?", speech: "あさ の はんたいは?" },
  { word: "よる", choices: ["あさ", "うしろ", "まえ"], correctIndex: 0, prompt: "「よる」の はんたいは?", speech: "よる の はんたいは?" },
  { word: "した", choices: ["おわり", "しろい", "うえ"], correctIndex: 2, prompt: "「した」の はんたいは?", speech: "した の はんたいは?" },
  { word: "おす", choices: ["ぬれる", "いく", "ひく"], correctIndex: 2, prompt: "「おす」の はんたいは?", speech: "おす の はんたいは?" },
  { word: "きびしい", choices: ["しずか", "ひま", "やさしい"], correctIndex: 2, prompt: "「きびしい」の はんたいは?", speech: "きびしい の はんたいは?" },
  { word: "すわる", choices: ["かえる", "でる", "たつ"], correctIndex: 2, prompt: "「すわる」の はんたいは?", speech: "すわる の はんたいは?" },
  { word: "はじめ", choices: ["おわり", "なつ", "うしろ"], correctIndex: 0, prompt: "「はじめ」の はんたいは?", speech: "はじめ の はんたいは?" },
  { word: "あける", choices: ["しめる", "ひく", "ぬれる"], correctIndex: 0, prompt: "「あける」の はんたいは?", speech: "あける の はんたいは?" },
  { word: "ひらく", choices: ["とじる", "つける", "おわる"], correctIndex: 0, prompt: "「ひらく」の はんたいは?", speech: "ひらく の はんたいは?" },
  { word: "すずしい", choices: ["あたたかい", "かんたん", "あまい"], correctIndex: 0, prompt: "「すずしい」の はんたいは?", speech: "すずしい の はんたいは?" },
  { word: "もどる", choices: ["はじまる", "まける", "すすむ"], correctIndex: 2, prompt: "「もどる」の はんたいは?", speech: "もどる の はんたいは?" },
  { word: "なく", choices: ["わらう", "すすむ", "のぼる"], correctIndex: 0, prompt: "「なく」の はんたいは?", speech: "なく の はんたいは?" },
  { word: "かつ", choices: ["のぼる", "あがる", "まける"], correctIndex: 2, prompt: "「かつ」の はんたいは?", speech: "かつ の はんたいは?" },
  { word: "なか", choices: ["よる", "そと", "まえ"], correctIndex: 1, prompt: "「なか」の はんたいは?", speech: "なか の はんたいは?" },
  { word: "きたない", choices: ["きれい", "へた", "あさい"], correctIndex: 0, prompt: "「きたない」の はんたいは?", speech: "きたない の はんたいは?" },
  { word: "あまい", choices: ["ふとい", "からい", "くらい"], correctIndex: 1, prompt: "「あまい」の はんたいは?", speech: "あまい の はんたいは?" },
  { word: "からい", choices: ["よわい", "あつい", "あまい"], correctIndex: 2, prompt: "「からい」の はんたいは?", speech: "からい の はんたいは?" },
  { word: "なつ", choices: ["なか", "ふゆ", "そと"], correctIndex: 1, prompt: "「なつ」の はんたいは?", speech: "なつ の はんたいは?" },
  { word: "とおい", choices: ["ちいさい", "すき", "ちかい"], correctIndex: 2, prompt: "「とおい」の はんたいは?", speech: "とおい の はんたいは?" },
  { word: "ほそい", choices: ["あかるい", "ふとい", "かたい"], correctIndex: 1, prompt: "「ほそい」の はんたいは?", speech: "ほそい の はんたいは?" },
  { word: "せまい", choices: ["ちいさい", "ひろい", "みじかい"], correctIndex: 1, prompt: "「せまい」の はんたいは?", speech: "せまい の はんたいは?" },
  { word: "かわく", choices: ["ぬれる", "ひく", "かつ"], correctIndex: 0, prompt: "「かわく」の はんたいは?", speech: "かわく の はんたいは?" },
  { word: "きけん", choices: ["きたない", "あんぜん", "きらい"], correctIndex: 1, prompt: "「きけん」の はんたいは?", speech: "きけん の はんたいは?" },
  { word: "たつ", choices: ["はじまる", "すわる", "つける"], correctIndex: 1, prompt: "「たつ」の はんたいは?", speech: "たつ の はんたいは?" },
  { word: "ひろい", choices: ["せまい", "かるい", "きけん"], correctIndex: 0, prompt: "「ひろい」の はんたいは?", speech: "ひろい の はんたいは?" },
  { word: "かんたん", choices: ["むずかしい", "からっぽ", "ふるい"], correctIndex: 0, prompt: "「かんたん」の はんたいは?", speech: "かんたん の はんたいは?" },
  { word: "きらい", choices: ["せまい", "すき", "かんたん"], correctIndex: 1, prompt: "「きらい」の はんたいは?", speech: "きらい の はんたいは?" },
  { word: "しろい", choices: ["みぎ", "はじめ", "くろい"], correctIndex: 2, prompt: "「しろい」の はんたいは?", speech: "しろい の はんたいは?" },
  { word: "まける", choices: ["かつ", "でる", "つける"], correctIndex: 0, prompt: "「まける」の はんたいは?", speech: "まける の はんたいは?" },
  { word: "ひだり", choices: ["みぎ", "おんな", "うしろ"], correctIndex: 0, prompt: "「ひだり」の はんたいは?", speech: "ひだり の はんたいは?" },
  { word: "とじる", choices: ["かう", "ひらく", "つける"], correctIndex: 1, prompt: "「とじる」の はんたいは?", speech: "とじる の はんたいは?" },
  { word: "ふえる", choices: ["へる", "かえる", "かわく"], correctIndex: 0, prompt: "「ふえる」の はんたいは?", speech: "ふえる の はんたいは?" },
  { word: "おいしい", choices: ["まずい", "いっぱい", "へた"], correctIndex: 0, prompt: "「おいしい」の はんたいは?", speech: "おいしい の はんたいは?" },
];

// ========== おかねの かぞえかた クイズ ==========
// coins: 画面に並べる硬貨の額面(大きい順に並べ済み)。この順番のまま描画すること。
// 硬貨はSVG/CSSの円で描画する。COIN_STYLE に額面ごとの色・直径・穴の有無がある。
// hole が true の硬貨(5円・50円)は、まんなかに 背景色の 小さな円を重ねて穴を表現する。
// speech: 正解時の読み上げ用(300=さんびゃく, 600=ろっぴゃく, 800=はっぴゃく の音便対応済み)。
//   ※選択肢のテキスト(例「120えん」)をそのまま speak() に渡すと数字が英語読みに
//     なることがあるため、読み上げには必ず speech を使うこと。
// level: 1=同じ硬貨だけ 2=2種類 3=3種類 4=500円を含む
export interface CoinStyle {
  label: string;
  color: string;
  size: number;
  hole: boolean;
}

export const COIN_STYLE: Record<number, CoinStyle> = {
  1: { label: "1", color: "#d9d9d9", size: 46, hole: false },
  5: { label: "5", color: "#d4b483", size: 52, hole: true },
  10: { label: "10", color: "#c1743e", size: 56, hole: false },
  50: { label: "50", color: "#cfcfcf", size: 50, hole: true },
  100: { label: "100", color: "#c8c8c8", size: 54, hole: false },
  500: { label: "500", color: "#cdae6a", size: 60, hole: false },
};

export interface OkaneQuestion {
  coins: number[];
  total: number;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
  speech: string;
  hint: string;
  level: 1 | 2 | 3 | 4;
}

export const OKANE_QUESTIONS: OkaneQuestion[] = [
  { coins: [1, 1], total: 2, choices: ["2えん", "3えん", "1えん"], correctIndex: 0, speech: "にえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [1, 1, 1], total: 3, choices: ["4えん", "3えん", "2えん"], correctIndex: 1, speech: "さんえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [1, 1, 1, 1], total: 4, choices: ["5えん", "3えん", "4えん"], correctIndex: 2, speech: "よんえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [10, 10], total: 20, choices: ["20えん", "10えん", "30えん"], correctIndex: 0, speech: "にじゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [10, 10, 10], total: 30, choices: ["20えん", "30えん", "40えん"], correctIndex: 1, speech: "さんじゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [10, 10, 10, 10], total: 40, choices: ["30えん", "50えん", "40えん"], correctIndex: 2, speech: "よんじゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [100, 100], total: 200, choices: ["200えん", "300えん", "100えん"], correctIndex: 0, speech: "にひゃくえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [100, 100, 100], total: 300, choices: ["200えん", "300えん", "400えん"], correctIndex: 1, speech: "さんびゃくえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [100, 100, 100, 100], total: 400, choices: ["500えん", "300えん", "400えん"], correctIndex: 2, speech: "よんひゃくえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [5, 5], total: 10, choices: ["10えん", "5えん", "15えん"], correctIndex: 0, speech: "じゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [5, 5, 5], total: 15, choices: ["10えん", "15えん", "20えん"], correctIndex: 1, speech: "じゅうごえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [5, 5, 5, 5], total: 20, choices: ["15えん", "25えん", "20えん"], correctIndex: 2, speech: "にじゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [50, 50], total: 100, choices: ["100えん", "50えん", "150えん"], correctIndex: 0, speech: "ひゃくえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [50, 50, 50], total: 150, choices: ["200えん", "150えん", "100えん"], correctIndex: 1, speech: "ひゃくごじゅうえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [50, 50, 50, 50], total: 200, choices: ["150えん", "250えん", "200えん"], correctIndex: 2, speech: "にひゃくえん", hint: "おなじ おかねが ならんで いるよ。1まいぶんの かずを、まいすうの ぶんだけ たしてみよう", level: 1 },
  { coins: [100, 10, 10], total: 120, choices: ["120えん", "110えん", "130えん"], correctIndex: 0, speech: "ひゃくにじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 100, 10], total: 210, choices: ["220えん", "210えん", "200えん"], correctIndex: 1, speech: "にひゃくじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 100, 10, 10, 10], total: 230, choices: ["240えん", "220えん", "230えん"], correctIndex: 2, speech: "にひゃくさんじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 1, 1], total: 12, choices: ["12えん", "13えん", "11えん"], correctIndex: 0, speech: "じゅうにえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 10, 1], total: 21, choices: ["22えん", "21えん", "20えん"], correctIndex: 1, speech: "にじゅういちえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 10, 1, 1, 1], total: 23, choices: ["24えん", "22えん", "23えん"], correctIndex: 2, speech: "にじゅうさんえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 50, 50], total: 200, choices: ["200えん", "150えん", "250えん"], correctIndex: 0, speech: "にひゃくえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 100, 50], total: 250, choices: ["200えん", "250えん", "300えん"], correctIndex: 1, speech: "にひゃくごじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 100, 50, 50, 50], total: 350, choices: ["400えん", "300えん", "350えん"], correctIndex: 2, speech: "さんびゃくごじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [50, 10, 10], total: 70, choices: ["70えん", "80えん", "60えん"], correctIndex: 0, speech: "ななじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [50, 50, 10], total: 110, choices: ["100えん", "110えん", "120えん"], correctIndex: 1, speech: "ひゃくじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [50, 50, 10, 10, 10], total: 130, choices: ["140えん", "120えん", "130えん"], correctIndex: 2, speech: "ひゃくさんじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 5, 5], total: 20, choices: ["20えん", "25えん", "15えん"], correctIndex: 0, speech: "にじゅうえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 10, 5], total: 25, choices: ["20えん", "25えん", "30えん"], correctIndex: 1, speech: "にじゅうごえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [10, 10, 5, 5, 5], total: 35, choices: ["30えん", "40えん", "35えん"], correctIndex: 2, speech: "さんじゅうごえん", hint: "おおきい おかねから じゅんばんに たして いくと かんたんだよ", level: 2 },
  { coins: [100, 10, 1], total: 111, choices: ["111えん", "110えん", "112えん"], correctIndex: 0, speech: "ひゃくじゅういちえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 10, 10, 1], total: 121, choices: ["120えん", "121えん", "122えん"], correctIndex: 1, speech: "ひゃくにじゅういちえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 100, 10, 1, 1], total: 212, choices: ["213えん", "211えん", "212えん"], correctIndex: 2, speech: "にひゃくじゅうにえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 50, 10], total: 160, choices: ["160えん", "150えん", "170えん"], correctIndex: 0, speech: "ひゃくろくじゅうえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 50, 50, 10], total: 210, choices: ["220えん", "210えん", "200えん"], correctIndex: 1, speech: "にひゃくじゅうえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 100, 50, 10, 10], total: 270, choices: ["280えん", "260えん", "270えん"], correctIndex: 2, speech: "にひゃくななじゅうえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [50, 10, 5], total: 65, choices: ["65えん", "70えん", "60えん"], correctIndex: 0, speech: "ろくじゅうごえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [50, 10, 10, 5], total: 75, choices: ["70えん", "75えん", "80えん"], correctIndex: 1, speech: "ななじゅうごえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [50, 50, 10, 5, 5], total: 120, choices: ["125えん", "115えん", "120えん"], correctIndex: 2, speech: "ひゃくにじゅうえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [10, 5, 1], total: 16, choices: ["16えん", "17えん", "15えん"], correctIndex: 0, speech: "じゅうろくえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [10, 5, 5, 1], total: 21, choices: ["22えん", "21えん", "20えん"], correctIndex: 1, speech: "にじゅういちえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [10, 10, 5, 1, 1], total: 27, choices: ["26えん", "28えん", "27えん"], correctIndex: 2, speech: "にじゅうななえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 10, 5], total: 115, choices: ["115えん", "120えん", "110えん"], correctIndex: 0, speech: "ひゃくじゅうごえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 10, 10, 5], total: 125, choices: ["120えん", "125えん", "130えん"], correctIndex: 1, speech: "ひゃくにじゅうごえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [100, 100, 10, 5, 5], total: 220, choices: ["225えん", "215えん", "220えん"], correctIndex: 2, speech: "にひゃくにじゅうえん", hint: "まず 100えんだま だけを かぞえて、そのあと 10えんだま、さいごに 1えんだま を たそう", level: 3 },
  { coins: [500, 500, 100, 100, 1, 1, 1], total: 1203, choices: ["1203えん", "1202えん", "1204えん"], correctIndex: 0, speech: "せんにひゃくさんえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 50, 1], total: 1051, choices: ["1052えん", "1051えん", "1050えん"], correctIndex: 1, speech: "せんごじゅういちえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 5, 1, 1, 1], total: 508, choices: ["507えん", "509えん", "508えん"], correctIndex: 2, speech: "ごひゃくはちえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 10, 10, 5, 5], total: 530, choices: ["530えん", "535えん", "525えん"], correctIndex: 0, speech: "ごひゃくさんじゅうえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 10, 10, 10, 1], total: 1031, choices: ["1032えん", "1031えん", "1030えん"], correctIndex: 1, speech: "せんさんじゅういちえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 100, 5, 5], total: 610, choices: ["605えん", "615えん", "610えん"], correctIndex: 2, speech: "ろっぴゃくじゅうえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 100, 100, 100, 50, 50, 5], total: 1405, choices: ["1405えん", "1410えん", "1400えん"], correctIndex: 0, speech: "せんよんひゃくごえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 5, 5], total: 510, choices: ["505えん", "510えん", "515えん"], correctIndex: 1, speech: "ごひゃくじゅうえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 1, 1], total: 502, choices: ["503えん", "501えん", "502えん"], correctIndex: 2, speech: "ごひゃくにえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 50, 50, 50, 10, 10, 1], total: 671, choices: ["671えん", "670えん", "672えん"], correctIndex: 0, speech: "ろっぴゃくななじゅういちえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 10, 10, 10], total: 530, choices: ["540えん", "530えん", "520えん"], correctIndex: 1, speech: "ごひゃくさんじゅうえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 50], total: 1050, choices: ["1100えん", "1000えん", "1050えん"], correctIndex: 2, speech: "せんごじゅうえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 1, 1, 1], total: 1003, choices: ["1003えん", "1004えん", "1002えん"], correctIndex: 0, speech: "せんさんえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 10, 10, 5, 5, 1, 1], total: 1032, choices: ["1033えん", "1032えん", "1031えん"], correctIndex: 1, speech: "せんさんじゅうにえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
  { coins: [500, 500, 100, 100, 5, 5, 5], total: 1215, choices: ["1220えん", "1210えん", "1215えん"], correctIndex: 2, speech: "せんにひゃくじゅうごえん", hint: "500えんだまは 100えんだま 5まいと おなじだよ。おおきい じゅんに たして いこう", level: 4 },
];
