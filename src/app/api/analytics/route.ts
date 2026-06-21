import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getAnalyticsSummary());
}
