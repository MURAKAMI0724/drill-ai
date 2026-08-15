# ドリルAI

教科書・ノート・マニュアルをスマホで撮影するだけで、AIが内容を解析し個人に最適化されたテスト・問題集を自動生成するアプリです。

Next.js (App Router) + TypeScript + Tailwind CSS で構築しています。現在のスコープは **Phase 1(個人学習者ペルソナのMVP)**: 実際の Claude API(Vision入力)を使って、撮影した教材画像から OCR・要点抽出・問題生成までを行います。先生/企業/お子さまペルソナはUI上は選択肢として見えますが、次フェーズまで無効化されています(`src/lib/personas.ts` の `enabled` フラグ)。

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に Anthropic の API キーを設定
```

`.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

APIキーは https://console.anthropic.com/ で発行できます。

## 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。カメラ撮影(`<input capture>`)は多くのブラウザで HTTPS または `localhost` 配信時のみ動作します。

## 主要なファイル

- `src/app/page.tsx` — 画面遷移(ペルソナ選択→撮影→生成中→問題確認→クイズ→結果)を管理するメインの状態machine。
- `src/app/api/generate-quiz/route.ts` — 撮影画像を受け取り、Claude API で問題を生成する Route Handler。
- `src/lib/quiz-generator.ts` — Anthropic SDK 呼び出しと、レスポンス(tool use)の正規化ロジック。
- `src/lib/personas.ts` — ペルソナごとの文言・有効/無効フラグ。
- `src/app/globals.css` — プロトタイプ(`index.html`)から移植したデザイントークン(ダーク×ゴールド)。

## デプロイ(Vercel)

1. このリポジトリを Vercel に接続する。
2. Vercel の Environment Variables に `ANTHROPIC_API_KEY` を設定する。
3. デプロイ(ビルドコマンド・出力先はデフォルトのままでOK)。

## 今後のフェーズ

- Phase 2: 先生・企業ペルソナ(PDF書き出し・配信機能)、認証、DB永続化。
- Phase 3: お子さまペルソナ(さんすう・AIしりとり)、PWA化(manifest / Service Worker)。
- Phase 4: Stripe決済・利用制限。

詳細は開発依頼書を参照してください。
