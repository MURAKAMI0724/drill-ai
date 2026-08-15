import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ドリルAI — 撮るだけで、テストができる。",
  description:
    "教科書・ノート・マニュアルを撮影するだけで、AIが内容を解析し個人に最適化されたテスト・問題集を自動生成します。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0b08",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSerifJP.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text-primary">{children}</body>
    </html>
  );
}
