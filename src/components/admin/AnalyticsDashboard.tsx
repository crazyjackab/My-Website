"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Eye, FileText, RefreshCw, Shield } from "lucide-react";

interface AnalyticsSummary {
  totalViews: number;
  uniquePages: number;
  topPages: { path: string; views: number }[];
  dailyViews: { day: string; views: number }[];
  recent: { path: string; locale: string; timestamp: string; referrer?: string }[];
}

const STORAGE_KEY = "portfolio-admin-secret";

export function AnalyticsDashboard() {
  const [secret, setSecret] = useState("");
  const [input, setInput] = useState("");
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setData(null);
        setError(res.status === 401 ? "密钥无效或未配置 ADMIN_SECRET" : "加载失败");
        return;
      }
      setData((await res.json()) as AnalyticsSummary);
      sessionStorage.setItem(STORAGE_KEY, token);
      setSecret(token);
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSecret(saved);
      setInput(saved);
      void fetchStats(saved);
    }
  }, [fetchStats]);

  const maxDaily = Math.max(1, ...(data?.dailyViews.map((d) => d.views) ?? [1]));
  const maxTop = Math.max(1, ...(data?.topPages.map((p) => p.views) ?? [1]));

  if (!secret || !data) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-bg-elevated/80 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="text-neon-cyan" size={24} />
          <div>
            <h1 className="font-display text-xl tracking-wide text-white">Analytics Dashboard</h1>
            <p className="font-mono text-xs text-text-muted">访问统计 · 需要管理员密钥</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void fetchStats(input.trim());
          }}
          className="space-y-4"
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ADMIN_SECRET"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white outline-none focus:border-neon-cyan/50"
          />
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full rounded-lg bg-neon-cyan/15 py-3 font-mono text-sm text-neon-cyan transition hover:bg-neon-cyan/25 disabled:opacity-50"
          >
            {loading ? "验证中…" : "进入 Dashboard"}
          </button>
        </form>
        <p className="mt-6 font-mono text-[10px] leading-relaxed text-text-muted">
          在 .env.local 设置 ADMIN_SECRET。生产环境（Vercel）数据为进程内存，重启后清零；自托管可持久化到 .data/analytics.json。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide gradient-text">访问统计 Dashboard</h1>
          <p className="mt-1 font-mono text-xs text-text-muted">portfolio-os · realtime pageviews</p>
        </div>
        <button
          type="button"
          onClick={() => void fetchStats(secret)}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-neon-cyan hover:bg-white/5"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          刷新
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "总访问量", value: data.totalViews, icon: Eye },
          { label: "独立路径", value: data.uniquePages, icon: FileText },
          { label: "近 14 日峰值", value: maxDaily, icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</span>
              <Icon size={16} className="text-neon-cyan/60" />
            </div>
            <p className="mt-3 font-display text-3xl text-white">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-card rounded-xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">近 14 日趋势</h2>
          <div className="mt-6 flex h-40 items-end gap-1">
            {data.dailyViews.map(({ day, views }) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-neon-cyan/20 to-neon-purple/60"
                  style={{ height: `${Math.max(8, (views / maxDaily) * 100)}%` }}
                  title={`${day}: ${views}`}
                />
                <span className="font-mono text-[8px] text-text-muted">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">热门页面</h2>
          <ul className="mt-4 space-y-3">
            {data.topPages.map(({ path, views }) => (
              <li key={path}>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="truncate text-white/90">{path}</span>
                  <span className="text-neon-cyan">{views}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                    style={{ width: `${(views / maxTop) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass-card rounded-xl p-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">最近访问</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-text-muted">
                <th className="pb-2 pr-4">时间</th>
                <th className="pb-2 pr-4">路径</th>
                <th className="pb-2 pr-4">语言</th>
                <th className="pb-2">来源</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((row) => (
                <tr key={`${row.timestamp}-${row.path}`} className="border-b border-white/5 text-white/80">
                  <td className="py-2 pr-4 text-text-muted">{row.timestamp.replace("T", " ").slice(0, 19)}</td>
                  <td className="py-2 pr-4">{row.path}</td>
                  <td className="py-2 pr-4">{row.locale}</td>
                  <td className="py-2 max-w-[200px] truncate text-text-muted">{row.referrer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
