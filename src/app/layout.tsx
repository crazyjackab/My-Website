import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { profile } from "@/data/profile";
import { PortfolioShell } from "@/components/PortfolioShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.title}`,
  description: `${profile.name} 的个人网站 — ${profile.slogan}`,
  keywords: ["陈鹏", "个人网站", "全栈工程师", "Portfolio", profile.title],
  openGraph: {
    title: `${profile.name} | ${profile.title}`,
    description: profile.slogan,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
