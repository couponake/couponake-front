import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * On-demand ISR revalidation, called by the Laravel backend
 * (App\Services\FrontendRevalidator) right after a store / coupon / blog is
 * saved or deleted in the dashboard.
 *
 * Why: every content page is ISR (revalidate 300, effectively 60 through the
 * root layout). Without this hook an edit stays invisible until the window
 * expires AND someone visits the page — and that first visit is still served
 * the stale copy (x-vercel-cache: STALE) while the fresh one renders in the
 * background. Googlebot is often that first visitor.
 *
 * What it does, per request:
 *   - revalidateTag(tag, { expire: 0 }) for the Data Cache entries the page
 *     reads (tags are the API endpoint, e.g. "blogs/<slug>") so the re-render
 *     fetches fresh JSON instead of a stale cached response;
 *   - revalidatePath(path) so the next visit re-renders the page (blocking,
 *     fresh) instead of serving the old copy.
 *
 * Auth: shared secret in the X-Revalidate-Secret header (REVALIDATE_SECRET on
 * Vercel = FRONTEND_REVALIDATE_SECRET on the Laravel server). The route is
 * POST-only and /api/ is disallowed in robots.txt.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// The backend batches 20 pages per call; stores carry 2 tags each, blogs 1.
const MAX_ITEMS = 60;

function secretMatches(given: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is string =>
        typeof v === "string" && v.length > 0 && v.length <= 1024,
    )
    .slice(0, MAX_ITEMS);
}

// A slug may reach the cache key raw ("/كوبونك/") or percent-encoded
// ("/%D9%83.../"); invalidate both spellings so the call never misses.
function variants(value: string): string[] {
  const out = new Set<string>([value]);
  try {
    out.add(decodeURIComponent(value));
  } catch {
    /* not encoded */
  }
  try {
    out.add(encodeURI(decodeURIComponent(value)));
  } catch {
    /* not encoded */
  }
  return [...out];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!secretMatches(req.headers.get("x-revalidate-secret"))) {
    return NextResponse.json(
      { revalidated: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { paths?: unknown; tags?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Invalid JSON" },
      { status: 400 },
    );
  }

  const paths = cleanList(body.paths).filter(
    (p) =>
      p.startsWith("/") &&
      !p.includes("..") &&
      !p.includes("?") &&
      !p.includes("#"),
  );
  const tags = cleanList(body.tags);

  if (paths.length === 0 && tags.length === 0) {
    return NextResponse.json(
      { revalidated: false, message: "Nothing to revalidate" },
      { status: 400 },
    );
  }

  const revalidatedTags: string[] = [];
  const revalidatedPaths: string[] = [];

  // Data first, then pages: the page re-render must not read the stale entry.
  for (const tag of tags) {
    for (const t of variants(tag)) {
      if (t.length > 256) continue; // Next never assigns tags longer than 256 chars
      revalidateTag(t, { expire: 0 });
      revalidatedTags.push(t);
    }
  }
  for (const path of paths) {
    for (const p of variants(path)) {
      revalidatePath(p.replace(/\/+$/, "") || "/");
      revalidatedPaths.push(p);
    }
  }

  return NextResponse.json({
    revalidated: true,
    paths: revalidatedPaths,
    tags: revalidatedTags,
    now: Date.now(),
  });
}
