/**
 * Fixed-window in-memory limiter: 5 submissions per key per 10 minutes.
 * Per-instance, so on serverless it is a courtesy speed bump rather than a hard
 * guarantee — which is the right level for three low-traffic forms.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count += 1;
  return true;
}
