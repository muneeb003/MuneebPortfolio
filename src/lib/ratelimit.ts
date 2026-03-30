import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// ── Lazy singletons — created on first request, not at build time ─────────────

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

let _contact: Ratelimit | null = null;
let _guestbook: Ratelimit | null = null;
let _chat: Ratelimit | null = null;

function getContactLimiter(): Ratelimit {
  if (!_contact) _contact = new Ratelimit({ redis: getRedis(), limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "rl:contact" });
  return _contact;
}
function getGuestbookLimiter(): Ratelimit {
  if (!_guestbook) _guestbook = new Ratelimit({ redis: getRedis(), limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "rl:guestbook" });
  return _guestbook;
}
function getChatLimiter(): Ratelimit {
  if (!_chat) _chat = new Ratelimit({ redis: getRedis(), limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:chat" });
  return _chat;
}

/** Extract the real IP from an incoming request */
export function getIP(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

/** Run a limiter and return a 429 response if over limit, otherwise null */
async function checkLimit(limiter: Ratelimit, key: string): Promise<NextResponse | null> {
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

export function checkRateLimit(type: "contact" | "guestbook" | "chat", key: string): Promise<NextResponse | null> {
  const limiter = type === "contact" ? getContactLimiter() : type === "guestbook" ? getGuestbookLimiter() : getChatLimiter();
  return checkLimit(limiter, key);
}
