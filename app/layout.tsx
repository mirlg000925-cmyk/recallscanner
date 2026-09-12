import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://recallscanner.example.com"
  ),
  title: {
    default: "리콜스캐너 - 내 차 리콜 조회",
    template: "%s | 리콜스캐너",
  },
  description:
    "차종 또는 차종과 연식을 입력하면 공개된 자동차 리콜 정보를 쉽고 빠르게 확인할 수 있는 무료 서비스입니다.",
  verification: {
    google: "Zr7PVvthiLjNDLjBqBJbJxhYo-aPZwzymkHLfr968ow",
    other: {
      "naver-site-verification": "ac2fab49e49f48d9012f2bc34cdf40444eac0b89",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
