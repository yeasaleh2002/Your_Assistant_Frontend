import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * GET /api/cached-jobs?date=YYYY-MM-DD
 * Next.js ISR Data Cache Route Handler with Cache Tags
 * Caches job listings using Next.js tags: ['jobs', 'jobs-${date}', 'jobs-today']
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetDate = searchParams.get("date") || getTodayString();
  const skip = searchParams.get("skip") || "0";
  const limit = searchParams.get("limit") || "100";

  const isToday = targetDate === getTodayString();
  const cacheTags = ["jobs", `jobs-${targetDate}`];
  if (isToday) {
    cacheTags.push("jobs-today");
  }

  const backendUrl = `${BACKEND_API_BASE_URL}/api/jobs?date=${encodeURIComponent(targetDate)}&skip=${skip}&limit=${limit}`;

  try {
    // Next.js ISR fetch with Cache Tags & 1-hour background revalidation
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 3600, // ISR cache duration in seconds
        tags: cacheTags,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "x-cache-tags": cacheTags.join(", "),
        "x-isr-date": targetDate,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch cached jobs";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
