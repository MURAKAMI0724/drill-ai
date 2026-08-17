import type { Metadata, Viewport } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const mplus = M_PLUS_Rounded_1c({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} ― あそんで まなぼう`,
  description:
    "さんすう・しりとり・なぞなぞ・とけいなど、9つのあそびで たのしく まなべる こども向けアプリ",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#bfe9fb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${mplus.variable} h-full antialiased`}>
      <body className="min-h-full text-ink">{children}</body>
    </html>
  );
}
