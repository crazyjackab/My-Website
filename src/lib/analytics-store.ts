import fs from "fs";
import path from "path";

export interface PageViewEvent {
  path: string;
  locale: string;
  timestamp: string;
  referrer?: string;
}

export interface AnalyticsData {
  pageviews: PageViewEvent[];
  totals: Record<string, number>;
  byDay: Record<string, number>;
  byPathDay: Record<string, Record<string, number>>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");

let memoryStore: AnalyticsData | null = null;

function emptyData(): AnalyticsData {
  return { pageviews: [], totals: {}, byDay: {}, byPathDay: {} };
}

function load(): AnalyticsData {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as AnalyticsData;
    }
  } catch {
    /* ignore corrupt file */
  }
  return emptyData();
}

function save(data: AnalyticsData) {
  memoryStore = data;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch {
    /* read-only filesystem (e.g. Vercel) — keep in-memory only */
  }
}

export function trackPageView(input: {
  path: string;
  locale: string;
  referrer?: string;
}) {
  const data = load();
  const timestamp = new Date().toISOString();
  const day = timestamp.slice(0, 10);
  const key = input.path || "/";

  data.pageviews.unshift({ ...input, path: key, timestamp });
  if (data.pageviews.length > 500) {
    data.pageviews = data.pageviews.slice(0, 500);
  }

  data.totals[key] = (data.totals[key] ?? 0) + 1;
  data.byDay[day] = (data.byDay[day] ?? 0) + 1;
  if (!data.byPathDay[day]) data.byPathDay[day] = {};
  data.byPathDay[day][key] = (data.byPathDay[day][key] ?? 0) + 1;

  save(data);
  return data;
}

export function getAnalyticsData(): AnalyticsData {
  return load();
}

export function getAnalyticsSummary() {
  const data = load();
  const totalViews = Object.values(data.totals).reduce((sum, n) => sum + n, 0);
  const topPages = Object.entries(data.totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([path, views]) => ({ path, views }));

  const days = Object.keys(data.byDay).sort().slice(-14);
  const dailyViews = days.map((day) => ({ day, views: data.byDay[day] ?? 0 }));

  return {
    totalViews,
    topPages,
    dailyViews,
    recent: data.pageviews.slice(0, 25),
    uniquePages: Object.keys(data.totals).length,
  };
}
