# こどもアプリ

さんすう・しりとり・なぞなぞ・とけいなど、9つのあそびで たのしく まなべる、未就学児〜小学校低学年向けの学習あそびアプリです。

Next.js (App Router) + TypeScript + Tailwind CSS で構築した PWA です。外部APIキーは不要で、`npm install` だけで全機能(音声読み上げ・音声入力ふくむ)がすぐに動きます。

## あそべる9つのモード

| モード | 内容 |
|---|---|
| さんすう | たしざん・ひきざん |
| しりとり | AIと しりとり たいけつ(音声入力対応) |
| なぞなぞ | こえで こたえよう(音声入力対応) |
| なかまはずれ | なかまはずれ さがし |
| とけい | とけいの よみかた |
| なきごえ | どうぶつの なきごえクイズ |
| はんたい | はんたいことば クイズ |
| おかね | おかねの かぞえかた |
| ことわざ | ことわざの いみあて クイズ |

## セットアップ

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。しりとり・なぞなぞの音声入力(Web Speech API)は HTTPS または `localhost` 配信時のみ動作します。

## 主要なファイル

- `src/app/page.tsx` — ホーム画面(9モードのメニュー)と各モード画面の切り替えを管理する状態machine。⭐スターの獲得・`localStorage` 永続化もここ。
- `src/components/kids/` — ホームのタイルやゲーム画面共通の見た目部品(`GameLayout`/`QuestionCard`/`ChoiceButton`/`FeedbackBanner` など)。
- `src/components/screens/*Screen.tsx` — 9モードそれぞれのゲーム本体(出題・判定・音声読み上げ)。
- `src/lib/kids/` — 出題データ・しりとり判定・かな変換クライアントなど、各モードのロジック。
- `src/app/api/kana-convert/route.ts` — 音声認識の書き起こし(漢字混じり)をひらがなに変換するサーバー側API(kuromoji使用)。
- `src/app/globals.css` — デザイントークン(そら色×パステルのこども向け配色)。

## PWA

`public/manifest.json` を同梱しているので、モバイルブラウザの「ホーム画面に追加」でアプリのように使えます。
