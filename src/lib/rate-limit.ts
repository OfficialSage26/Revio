// Minimal in-memory rate limiter for auth endpoints. Per-instance (resets on
// redeploy/restart), which is fine as a brute-force brake for this app's scale.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Returns true if the action is allowed, false if the key is throttled.
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count++;
  return bucket.count <= MAX_ATTEMPTS;
}

// Clears the counter after a successful attempt.
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}
