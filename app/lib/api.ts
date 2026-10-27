export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(`API request failed (${status})`);
  }
}

type Options = Omit<RequestInit, "next"> & {
  /** Seconds to cache GETs in Next's data cache. Omit for the Next default. */
  revalidate?: number | false;
};

export async function api<T>(path: string, { revalidate, ...init }: Options = {}): Promise<T> {
  const hasBody = init.body !== undefined;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    // Only send Content-Type when there is a body: avoids needless CORS preflights on GETs.
    headers: { ...(hasBody ? { "Content-Type": "application/json" } : {}), ...init.headers },
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

function flatten(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(flatten);
  if (v && typeof v === "object") return Object.values(v).flatMap(flatten);
  return [];
}

/** Turn any API/network failure into human-readable messages for the UI. */
export function errorMessages(e: unknown): string[] {
  if (!(e instanceof ApiError)) return ["We couldn't reach the store. Please check your connection and try again."];
  const d = e.data as Record<string, unknown> | null;
  if (!d) return ["Something went wrong. Please try again."];
  if (e.status === 429) return ["Too many attempts. Please wait a bit and try again."];
  if (Array.isArray(d.errors)) {
    return (d.errors as { message?: string }[]).map((x) => x.message ?? "").filter(Boolean);
  }
  const { detail, ...fields } = d;
  const out = [...flatten(detail), ...flatten(fields)];
  return out.length ? out : ["Something went wrong. Please try again."];
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='640'><rect width='100%' height='100%' fill='#e5e5e5'/></svg>",
  );

/** API image URLs are absolute (http://…/media/…); products without photos get a neutral placeholder. */
export const imgSrc = (url: string | null | undefined) => url || FALLBACK_IMAGE;
