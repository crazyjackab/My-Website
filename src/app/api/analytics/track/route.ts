import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      path?: string;
      locale?: string;
      referrer?: string;
    };

    const path = body.path?.trim() || "/";
    const locale = body.locale?.trim() || "zh";

    trackPageView({
      path: path.startsWith("/") ? path : `/${path}`,
      locale,
      referrer: body.referrer?.slice(0, 200),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
