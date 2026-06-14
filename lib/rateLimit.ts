type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function pruneExpiredEntries(now: number) {
  for (const [key, entry] of Array.from(store.entries())) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  pruneExpiredEntries(now);

  const existing = store.get(identifier);

  if (!existing) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function getRequestIdentifier(req: Request) {
  const forwardedFor = req.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "unknown";
}

export function createRateLimitResponse(
  message = "Too many requests. Please try again shortly.",
) {
  return Response.json(
    {
      success: false,
      message,
    },
    {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    },
  );
}
