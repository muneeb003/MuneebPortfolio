import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Shared Redis instance (reused across requests)
let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

// Contact form: 3 submissions per hour per IP
export const contactLimiter = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:contact",
});

// Guestbook: 5 entries per hour per IP
export const guestbookLimiter = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "rl:guestbook",
});

// Chat: 30 messages per minute per IP
export const chatLimiter = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "rl:chat",
});

/** Extract the real IP from an incoming request */
export function getIP(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

/** Run a limiter and return a 429 response if over limit, otherwise null */
export async function checkRateLimit(
  limiter: Ratelimit,
  key: string,
): Promise<NextResponse | null> {
  const { success, limit, remaining, reset } = await limiter.limit(key);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }
  return null;
}
