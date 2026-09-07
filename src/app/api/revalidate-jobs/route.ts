import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate-jobs
 * Next.js On-Demand ISR Tag Revalidation (Next.js 16 compatible)
 * Clears and regenerates cached jobs when new jobs are generated today.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const customTag = body.tag as string | undefined;

    // Revalidate specific tag or all jobs tags with immediate expiration
    if (customTag) {
      revalidateTag(customTag, { expire: 0 });
    } else {
      revalidateTag("jobs-today", { expire: 0 });
      revalidateTag("jobs", { expire: 0 });
    }

    revalidatePath("/dashboard", "page");

    return NextResponse.json({
      revalidated: true,
      tags: customTag ? [customTag] : ["jobs", "jobs-today"],
      timestamp: Date.now(),
      message: "Next.js ISR cache tags purged and revalidated successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Revalidation error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
