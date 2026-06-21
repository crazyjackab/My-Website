import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-bg-primary px-4 py-12">
      <div className="aurora-bg pointer-events-none fixed inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs text-neon-cyan/70 hover:text-neon-cyan"
        >
          ← 返回首页
        </Link>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
